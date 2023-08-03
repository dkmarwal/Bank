import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Button from "~/components/Forms/Button";
import {
  Grid,
  Box,
  makeStyles,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import ExpansionBar from "~/components/ExpansionBar";
import MultiCheckBoxGroup from "../../components/Forms/MultiCheckBoxGroup";
import {
  getClientPermissions,
  getPermissionOptions,
  updateClientPermissions,
  sendActivationCode,
} from "../../redux/helpers/ConfigureClientPortal";
import SimpleDialog from "../../components/Model/SimpleDialog";
import "react-notifications/lib/notifications.css";
import "./styles.css";
import Notification from "~/components/Notification";
const useStyles = makeStyles({
  formLabel: {
    textAlign: "left",
    marginLeft: "20px",
    marginTop: "10px",
    fontSize: "0.9rem",
  },
  paper: {
    padding: "40px",
    marginTop: "20px",
    Backgroundcolor: "#ffffff",
  },
  title: {
    padding: "15px 0",
    marginBottom: "15px",
    borderBottom: "1px solid #d8d8d8",
    fontWeight: "500",
    textAlign: "left",
  },
  button: {
    padding: "0.25rem 2rem",
    margin: "1rem",
    height: 40,
    fontSize: '14px',
    textTransform: 'capitalize'
  },
  label: {
    minWidth: "92px",
    paddingRight: "18px",
  },
});

const ConfigureClientPortal = ({
  history,
  updateOnboardingStep,
  updateOnboardTitle,
  match,
}) => {
  const [process, setProcess] = useState(true);
  const [isNextLoading, setNextLoading] = useState(false);

  const [clientId] = useState(
    match.params.clientId || sessionStorage.getItem("clientId")
  );
  const [updatePermission, setUpdatePermission] = useState(false);
  const [selectedOnboardType] = useState(
    sessionStorage.getItem("selectedOnboardType")
  );
  const [openModal, setOpenModal] = useState(false);
  const [btn, setBtn] = useState(false);
  const [userPermissionOptions, setPermissionOption] = useState([]);
  const [groupPermissions, setGroupPermissions] = useState({});
  const [groupChecked, setGroupChecked] = useState({});
  const [permissionGranted, setPermissionGranted] = useState({
    clientId: clientId,
    permissionIds: [],
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const update = params.get("update") || false;
    setUpdatePermission(update);
    if (!update) {
      if (selectedOnboardType === "self") {
        updateOnboardingStep(2);
      } else {
        updateOnboardTitle("CONFIGURE CLIENT PORTAL");
      }
    }
    fetchPermissionOptions();
  }, []);

  const fetchClientPermissions = async () => {
    const response = await getClientPermissions(clientId);
    if (response && Array.isArray(response) && response.length) {
      const permissionIds = new Set(
        response.map(({ accessRightMappingID }) => accessRightMappingID)
      );

      setPermissionGranted({
        ...permissionGranted,
        permissionIds: [...permissionGranted.permissionIds, ...permissionIds],
      });
    }
  };
  const checkGroupPermission = (groupId) => {
    if (
      Array.isArray(groupPermissions[groupId]) &&
      groupPermissions[groupId].every((permissionId) =>
        permissionGranted.permissionIds.includes(permissionId)
      )
    ) {
      return true;
    }
    return false;
  };

  const checkIndeterminateStage = (groupId) => {
    if (Array.isArray(groupPermissions[groupId])) {
      const groupPermissionIds = groupPermissions[groupId];
      const nonSelectedData = groupPermissionIds.filter(
        (id) => permissionGranted.permissionIds.indexOf(id) < 0
      );
      if (
        nonSelectedData.length &&
        nonSelectedData.length !== groupPermissionIds.length
      ) {
        return true;
      }
      return false;
    }
    return false;
  };

  const fetchPermissionOptions = async () => {
    const data = await getPermissionOptions();
    createPermissionGroups(data);
    setPermissionOption(data);
    const permissionIds = getPermissionIdArray(data);
    setPermissionGranted({
      ...permissionGranted,
      permissionIds,
    });
    onSaveGroupPermissions(data);
    setProcess(false);
    if (clientId) fetchClientPermissions();
  };

  const validateGroupChecked = (name, checked, value) => {
    if (checked) {
      const permissionIds = [
        ...permissionGranted.permissionIds,
        parseInt(value),
      ];
      const groupPermissionIds = groupPermissions[name];
      if (isSubsetArray(groupPermissionIds, permissionIds)) {
        setGroupChecked({ ...groupChecked, [name]: true });
      }
    } else {
      setGroupChecked({ ...groupChecked, [name]: false });
    }
  };

  const isSubsetArray = (arr1, arr2) => {
    return arr1.every((val) => arr2.includes(val));
  };

  const onChangePermission = (event) => {
    const { name, value, checked } = event.target;
    const currentPermissionIDs = permissionGranted.permissionIds;
    validateGroupChecked(name, checked, value);
    let permissionIds;
    if (checked) {
      permissionIds = [...currentPermissionIDs, parseInt(value)];
    } else {
      let index = currentPermissionIDs.indexOf(parseInt(value));
      if (index > -1) {
        permissionIds = currentPermissionIDs.splice(index, 1);
      }
      permissionIds = currentPermissionIDs;
    }
    setPermissionGranted({ ...permissionGranted, permissionIds });
  };

  function createPermissionGroups(data) {
    const GroupPermissions = data && data.reduce(
      (result, { AccessGroup, RightsGroup }) => {
        result[AccessGroup] = false;
        return result;
      },
      {}
    );
    setGroupChecked(GroupPermissions);
  }

  const getPermissionIdArray = (userPermissionData) => {
    const userPermissionOptionData =
      userPermissionData ?? userPermissionOptions;
    return flatten(
      userPermissionOptionData.map(({ RightsGroup }) =>
        RightsGroup.map(({ Rights }) =>
          Rights.map(({ AccessRightMappingId }) => {
            return AccessRightMappingId;
          })
        )
      )
    );
  };

  const onSaveAllPermissions = () => {
    const AllPermissionsArray = getPermissionIdArray();
    setPermissionGranted({
      ...permissionGranted,
      permissionIds: AllPermissionsArray,
    });
    allGroupChecked(true);
  };

  const onSaveGroupPermissions = (data) => {
    const AllGroupPermissionsArray = data.reduce(
      (result, { AccessGroup, RightsGroup }) => {
        const groupPermissions = RightsGroup.map(({ Rights }) => {
          const rightArray = Rights.map(({ AccessRightMappingId }) => {
            return AccessRightMappingId;
          });
          return rightArray;
        });
        return { ...result, [AccessGroup]: flatten(groupPermissions) };
      },
      {}
    );
    setGroupPermissions({ ...AllGroupPermissionsArray });
  };

  const onClearAllPermissions = () => {
    setPermissionGranted({ ...permissionGranted, permissionIds: [] });
    allGroupChecked(false);
  };

  const allGroupChecked = (checked) => {
    const newGroupChecked = groupChecked;
    Object.keys(newGroupChecked).forEach(
      (key) => (newGroupChecked[key] = checked)
    );
    setGroupChecked(newGroupChecked);
  };

  const onNext = async () => {
    setNextLoading(true);
    if (
      Array.isArray(permissionGranted.permissionIds) &&
      permissionGranted.permissionIds.length > 0
    ) {
      const response = await updateClientPermissions(permissionGranted);
      const { error, message } = response;

      if (updatePermission) {
        setNextLoading(false);
        history.push({
          pathname: "/clients",
          _state: {
            message: !error
              ? "Permissions updated successfully"
              : message || "Permissions update failed",
            type: !error ? "success" : "error",
          },
        });
      } else {
        if (selectedOnboardType !== "self" && !error) {
          setOpenModal(!openModal);
          setNextLoading(false);
        } else if (!error) {
          setNextLoading(false);
          history.push("/clientOnboard/clientProfile");
        } else {
          setNextLoading(false);
          setAlertMessage(message || "Server Error");
          setAlertType("error");
        }
      }
    } else {
      setNextLoading(false);
      setAlertMessage("Permissions are required to save the User Information.");
      setAlertType("error");
    }
  };

  const renderSnackbar = (type, message) => {
    return <Notification variant={type} message={message} handleClose={hideAlertMessage} />
  }

  const hideAlertMessage = () => {
    setAlertMessage(null);
    setAlertType(null);
  }
  const onCheckGroupHandler = (name, checked) => {
    setGroupChecked({ ...groupChecked, [name]: checked });
    let newPermissionsIds;
    if (checked) {
      newPermissionsIds = [
        ...new Set([
          ...permissionGranted.permissionIds,
          ...groupPermissions[name],
        ]),
      ];
    } else {
      newPermissionsIds = permissionGranted.permissionIds.filter(
        (ele) => !groupPermissions[name].includes(ele)
      );
    }
    setPermissionGranted({
      ...permissionGranted,
      permissionIds: newPermissionsIds,
    });
  };

  const flatten = (arr) => {
    return arr.reduce(
      (flat, next) => flat.concat(Array.isArray(next) ? flatten(next) : next),
      []
    );
  };
  const PermissionsOptionList = userPermissionOptions.map(
    ({ AccessGroup, RightsGroup }) => {
      const isChecked =
        groupChecked[AccessGroup] || checkGroupPermission(AccessGroup);
      return (
        <ExpansionBar
          style={{ borderBottom: "none" }}
          className="checkboxGroupContainer"
          label={AccessGroup}
          key={AccessGroup}
          name={AccessGroup}
          checkBoxLabel
          checked={isChecked}
          indeterminate={!isChecked && checkIndeterminateStage(AccessGroup)}
          oncheckedHandler={onCheckGroupHandler}
        >
          <Grid container direction="row">
            {RightsGroup.map(({ AccessName, Rights }) => (
              <MultiCheckBoxGroup
                name={AccessGroup}
                key={AccessName}
                label={AccessName}
                options={Rights.map(
                  ({ AccessRightMappingId, Description }) => ({
                    name: Description,
                    value: AccessRightMappingId,
                    label: Description,
                  })
                )}
                onChangeCheckBox={onChangePermission}
                selectedCheckbox={permissionGranted.permissionIds}
              />
            ))}
          </Grid>
        </ExpansionBar>
      );
    }
  );

  const onSendActivationCode = async () => {
    await callSendActivationCodeAPI(clientId, 0);
    setOpenModal(!openModal);
    history.push("/clientOnboard/ClientRegistrationCompleted");
  };

  const callSendActivationCodeAPI = async (clientId, isVerified) => {
    const data = {
      clientId,
      isVerified,
      isOnboarding: 1,
    };
    setBtn(true);
    if (!btn) {
      const resp = await sendActivationCode(data);
      const { error, data: respData } = resp;
      if (error) {
        // MessageError();
      }
    }
  };

  const cancelMOdalOperation = () => {
    setOpenModal(!openModal);    
  };

  const onCloseModal = () => {
    setOpenModal(!openModal);
  };

  const modalActions = [
    {
      label: "Cancel",
      onClickHandler: cancelMOdalOperation,
      variant: "ouPermissionsOptionListtlined",
      disabled: false,
    },
    {
      label: "Send Activation Code",
      onClickHandler: onSendActivationCode,
      variant: "contained",
      disabled: false,
    },
  ];

  const title = "Client Registration is successfully done!";
  const subtitle = "Do you want to send activation code to the client ?";
  const classes = useStyles();

  return (
    <>
      <Box ml={6} mt={2} mr={6}>
        <Grid container justify="flex-end" spacing={2}>
          <Button
            className={classes.button}
            color="primary"
            onClick={onSaveAllPermissions}
          >
            GRANT ALL PERMISSIONS
          </Button>
          <Button
            className={classes.button}
            variant="text"
            color="primary"
            onClick={onClearAllPermissions}
          >
            CLEAR ALL PERMISSIONS
          </Button>
        </Grid>
        <Box my={4} width={1} pb={4}>
          <Paper elevation={3}>
            <Grid container spacing={4}>
              <Grid
                item
                container
                style={{ display: "block", overflowX: "hidden" }}
              >
                {process ? (
                  <Box align="center">
                    <CircularProgress color="secondary" />
                  </Box>
                ) : (
                  <Box mx={3} p={2}>
                    {" "}
                    {PermissionsOptionList}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>
          <Grid item container xs={12} justify="center">
            <Box pt={3}>
              {isNextLoading ? (
                <CircularProgress
                  color="secondary"
                />
              ) : (
                <Button
                  color="primary"
                  onClick={onNext}
                  className={classes.button}
                >
                  SAVE
                </Button>
              )}
            </Box>
          </Grid>
        </Box>{" "}
      </Box>
      {alertMessage && renderSnackbar(alertType, alertMessage)}
      <SimpleDialog
        open={openModal}
        onCloseModal={onCloseModal}
        modalActions={modalActions}
        title={title}
        subtitle={subtitle}
      />
    </>
  );
};

const mapStateToProps = ({ clients = {} }) => {
  const {
    onBoarding: { clientId, isHippa, parentId },
  } = clients;
  return { clientId, isHippa, parentId };
};

export default connect(mapStateToProps)(ConfigureClientPortal);
