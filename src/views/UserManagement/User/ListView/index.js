import React, { Component, Fragment } from "react";

import {
  TextField,
  InputAdornment,
  OutlinedInput,
  Grid,
  Paper,
  Box,
  Button,
  CircularProgress,
  Table,
  TableRow,
  TableBody,
  TablePagination,
  TableCell,
  TableSortLabel,
  Select,
  Checkbox,
  MenuItem,
  ListItemText,
  Avatar,
  Typography,
} from "@material-ui/core";
import {
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
  StyledTableFooter,
} from "~/components/StyledTable";
import { withStyles } from "@material-ui/styles";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

import LockIcon from "@material-ui/icons/Lock";
import SearchIcon from "@material-ui/icons/Search";
import trim from 'deep-trim-node';

import { connect } from "react-redux";

import {
  createUser,
  fetchUserList,
  updateUserDetails,
  lockUser,
  removeUser,
  updateUserClients,
  fetchFilterList,
} from "~/redux/actions/user";
import { fetchRoles } from "~/redux/actions/role";
import {
  getClientsList,
  updateClientsAccessList,
} from "~/redux/actions/bankClients";

import Notification from "~/components/Notification";
import DetailView from "~/components/DetailView";

import UserView from "../View/";
import UserEdit from "../EditView/";

import { ConfirmDialog, AlertDialog } from "~/components/Dialogs";
import ChipFilter from "~/components/Filter";
import "./styles.scss";
import styles from "./styles";
import moment from "moment";
import accessRights from "~/config/accessRights";

moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    ss: "%d seconds",
    m: "One minute",
    mm: "%d minutes",
    h: "One hour",
    hh: "%d hours",
    d: "One day",
    dd: "%d days",
    w: "One week",
    ww: "%d weeks",
    M: "One month",
    MM: "%d months",
    y: "One year",
    yy: "%d years",
  },
});

class UserListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      fetchingList: true,
      page: 0,
      rowsPerPage: 10,
      sortColumn: "",
      sortOrder: "",
      name: "",
      phone: "",
      email: "",
      role: "",
      roleList: [], //System Role list
      filterOpen: false,
      alertType: "success",
      alertMessage: "",
      alertMessageCallbackType: null,
      showConfirmRemoveDialog: false,
      removeUserId: null,
      showDetail: false,
      editDetail: false,
      userList: [],
      selectedUsers: [],
      userInfo: {},
      newUserInfo: {},
      selectedFilterItem: {},
      filterList: [],
      validation: {},
      clientList: [],
      checkedAll: false,
      canEditAction: false,
      detailTitle: "",
    };
  }

  componentDidMount = async () => {
    //const { accessToken } = this.props.user.info;

    this.fetchRoleList();
    await this.getUserList();
    this.fetchClientsList();
    this.fetchChipsFilterList();
  };

  fetchClientsList = () => {
    const { info } = this.props.user;
    this.props
      .dispatch(getClientsList(info.portalProfileId))
      .then((response) => {
        if (!response) {
          /*this.setState({
            alertType: "error",
            alertMessage: this.props.bankClients.error,
          });*/
          return false;
        }
        this.setState({
          clientList: this.props.bankClients.clientsList.onBoardedClients,
        });
      });
  };

  fetchChipsFilterList = () => {
    const { info } = this.props.user;
    this.props
      .dispatch(
        fetchFilterList({
          portalProfileId: info.portalProfileId,
          portalTypeId: info.portalTypeId,
        })
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertType: "error",
            alertMessage: this.props.user.error,
          });
          return false;
        }
        this.setState({
          filterList: this.props.user.chipFilterList,
        });
      });
  };

  filterCliCkFun = () => {
    this.setState({
      filterOpen: !this.state.filterOpen,
    });
  };

  clearFilter = () => {
    this.setState(
      {
        name: "",
        phone: "",
        email: "",
        role: "",
      },
      () => {
        this.getUserList();
      }
    );
  };

  handlePageChange = (event, page) => {
    const { sortColumn, sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
    this.setState(
      {
        page,
        sortColumn: sortColumn,
        sortOrder: newSortOrder,
      },
      () => this.getUserList()
    );
  };

  handleRowsPerPageChange = (event) => {
    const { sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
    this.setState(
      {
        page: 0,
        rowsPerPage: parseInt(event.target.value, 10),
        sortOrder: newSortOrder,
      },
      () => this.getUserList()
    );
  };

  handleSorting(sortColumn) {
    const { sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    this.setState({ sortColumn: sortColumn, sortOrder: newSortOrder }, () => {
      this.getUserList(sortColumn, newSortOrder === "asc" ? "ASC" : "DESC");
    });
  }

  getUserList = () => {
    const {
      name,
      phone,
      email,
      selectedFilterItem,
      page,
      rowsPerPage,
      sortColumn,
      sortOrder,
    } = this.state;

    this.setState(
      {
        fetchingList: true,
      },
      () => {
        const { info } = this.props.user;
        this.props
          .dispatch(
            fetchUserList({
              portalProfileId: info.portalProfileId,
              portalTypeId: info.portalTypeId,
              name,
              phone,
              email,
              role: selectedFilterItem,
              pageNo: page + 1,
              pageSize: rowsPerPage,
              sortColumn,
              sortOrder,
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessage: this.props.user.error,
                alertMessageCallbackType: null,
                fetchingList: false,
              });
              return false;
            }

            this.setState({
              isLoading: false,
              fetchingList: false,
              userList: this.props.user.list,
            });
          });
      }
    );
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  goBack = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
  };

  fetchRoleList = () => {
    const { info } = this.props.user;
    this.props
      .dispatch(
        fetchRoles({
          portalProfileId: info.portalProfileId,
          portalTypeId: info.portalTypeId,
          userId: info.userId,
        })
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertType: "error",
            alertMessageCallbackType: null,
            alertMessage: this.props.role.error,
          });
          return false;
        }
        this.setState({
          roleList: this.props.role.list,
        });
      });
  };

  handleFormPageChange = (pageNo) => {
    this.setState({ formPageNo: pageNo });
  };

  handleClientChange = (user, event, position) => {
    const { value: options } = event.target;
    const { clientList } = this.state;

    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      //if (options[i].selected) {
      const newClient = clientList.filter(
        (item) => item.clientId === options[i]
      );
      if (newClient.length) {
        value.push({
          clientId: newClient[0].clientId,
          clientName: newClient[0].clientName,
          appType: newClient[0].appType,
        });
      }
      //}
    }

    const newClientIds = value.map((item) => item.clientId);
    const newUserDetail = { ...user, clientId: newClientIds, clients: value };

    if (newUserDetail.isFirstUser) {
      return false;
    }
    this.setState(
      {
        updateProgress: true,
      },
      () => {
        const { info } = this.props.user;
        this.props
          .dispatch(
            updateUserClients({
              portalProfileId: info.portalProfileId,
              userId: user.userId,
              user: trim(newUserDetail),
              clientIds: value,
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertMessage: this.props.user.error,
                alertMessageCallbackType: null,
                alertType: "error",
                updateProgress: false,
              });

              return false;
            }
            this.setState({
              updateProgress: false,
              newUserInfo: trim({
                ...newUserDetail,
                password: newUserDetail.pWDHash || null,
                newPassword: newUserDetail.pWDHash || null,
              }),
              userInfo: trim(newUserDetail),
            });
          });
      }
    );

  };

  handleRoleChange = (user, event, position) => {
    const { value: options } = event.target;
    const { roleList } = this.state;
    const { info } = this.props.user;
    const canEditAction =
      (!user.isFirstUser && user.userId !== info.userId) || false;
    if (!canEditAction) {
      this.setState({
        alertType: "error",
        alertMessage: "You are not authorize to do this action.",
      });
      return false;
    }

    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      //if (options[i].selected) {
      const newRole = roleList.filter((item) => item.roleId === options[i]);
      if (newRole.length) {
        value.push({
          roleId: newRole[0].roleId,
          roleName: newRole[0].roleName,
        });
      }
      //}
    }

    const newRoleIds = value.map((item) => item.roleId);
    const newUserDetail = { ...user, roleId: newRoleIds, roles: value };

    if (value.length === 0) {
      this.setState({
        alertType: "error",
        alertMessage: "Please select at least one role",
      });
      return false;
    }

    //restrict the role change for first user from list page
    if (newUserDetail.isFirstUser) {
      return false;
    }
    this.setState(
      {
        updateProgress: true,
      },
      () => {
        const { info } = this.props.user;
        this.props
          .dispatch(
            updateUserDetails({
              portalProfileId: info.portalProfileId,
              portalTypeId: info.portalTypeId,
              user: trim(newUserDetail),
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertMessage: this.props.user.error,
                alertType: "error",
                updateProgress: false,
              });

              return false;
            }
            this.setState({
              updateProgress: false,
              //newUserInfo: {...newUserDetail, password: newUserDetail.pWDHash || null,  newPassword: newUserDetail.pWDHash || null},
              newUserInfo: trim({ ...newUserDetail }),
              userInfo: trim(newUserDetail),
            });
            this.fetchChipsFilterList();
          });
      }
    );

  };

  handleLock = (e, item) => {
    const { selectedUsers, userList } = this.state;
    const selectedConfirmUser = item ? [item.userId] : [...selectedUsers];

    //if locked from the list
    if (!item) {
      const selectedLockedUsers =
        userList.filter(
          (user) =>
            selectedConfirmUser.indexOf(user.userId) !== -1 && user.isLocked
        ) || [];
      if (selectedLockedUsers && selectedLockedUsers.length > 0) {
        this.setState({
          alertMessage:
            "Some user from selected list have locked accounts, please unselect those user(s) from selection then try to continue.",
          alertType: "error",
          alertMessageCallbackType: null,
          progressLock: false,
        });

        return false;
      }
    }

    if (selectedConfirmUser.length > 0) {
      this.setState(
        {
          progressLock: true,
        },
        () => {
          const isLocked = item ? (item.isLocked ? false : true) : true;
          this.props
            .dispatch(
              lockUser({ userIds: selectedConfirmUser, isLocked: isLocked })
            )
            .then((response) => {
              //set state here on success
              if (!response) {
                this.setState({
                  alertMessage: this.props.user.error,
                  alertType: "error",
                  alertMessageCallbackType: null,
                  progressLock: false,
                });

                return false;
              }

              this.setState({
                progressLock: false,
                userInfo: { ...item, isLocked },
                newUserInfo: { ...item, isLocked },
                //selectedUsers:[],
                userList: this.props.user.list,
                alertType: "success",
                alertMessageCallbackType: "REDIRECT",
                alertMessage: isLocked
                  ? "User account locked successfully"
                  : "User account unlocked successfully",
              });
              this.fetchChipsFilterList();
            });
        }
      );
    } else {
      this.setState({
        alertType: "info",
        alertMessage: "Please select at least one user",
      });
    }
  };

  handleDelete = (e, id) => {
    e.stopPropagation();
    const { selectedUsers } = this.state;
    const selectedConfirmUser = id ? [id] : [...selectedUsers];
    if (selectedConfirmUser.length > 0) {
      this.setState({
        showConfirmRemoveDialog: true,
        removeUserId: id ? id : null,
      });
    } else {
      this.setState({
        alertType: "info",
        alertMessage: "Please select at least one user",
      });
    }
  };

  onConfirmDelete = () => {
    const { removeUserId, selectedUsers } = this.state;
    const selectedConfirmUser = removeUserId
      ? [removeUserId]
      : [...selectedUsers];
    this.setState(
      {
        showConfirmRemoveDialog: false,
        removeUserId: null,
      },
      () => {
        const { info } = this.props.user;

        this.props
          .dispatch(
            removeUser({
              userIds: selectedConfirmUser,
              username: info.userName,
            })
          )
          .then((response) => {
            //set state here on success
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.user.error,
              });
              return false;
            }

            this.setState({
              selectedUsers: [],
              removeUserId: null,
              alertType: "success",
              alertMessageCallbackType: "REDIRECT",
              alertMessage: "User deleted successfully",
            });

            this.hideDetailView();
            this.fetchChipsFilterList();
          });
      }
    );
  };

  isSuperAdmin = (item) => {
    const { roleList } = this.state;
    const currentRoles = item.roles.map((user) => user.roleId);
    const selectedRoles = roleList
      ? roleList.filter((role) => {
          const flag =
            currentRoles.length > 0 &&
            currentRoles.indexOf(role.roleId) !== -1 &&
            role.roleName === "System Admin";
          if (flag) {
            return true;
          }
        })
      : [];

    return selectedRoles.length > 0 ? true : false;
  };

  onCancelDelete = () => {
    this.setState({
      showConfirmRemoveDialog: false,
      removeUserId: null,
    });
  };

  showDetailView = (item) => {
    const { editDetail } = this.state;
    const { info } = this.props.user;
    //In case of Edit mode open don't change the info
    const canEditAction =
      (!item.isFirstUser && item.userId !== info.userId) || false;
    if (!editDetail) {
      this.setState({
        showDetail: true,
        detailTitle: "Details",
        userInfo: item,
        canEditAction: canEditAction,
      });
    }
  };

  handleEdit = (event, item) => {
    //First user can not be edited
    const { info } = this.props.user;
    const roles = item.roles.map((user) => user.roleId);
    const canEditAction =
      (!item.isFirstUser && item.userId !== info.userId) || false;
    if (item.isFirstUser) {
      this.setState({
        editDetail: false,
        detailTitle: "Details",
        showDetail: true,
        newUserInfo: {
          ...item,
          roleId: roles,
          newPassword: null,
          confirmPassword: null,
        },
      });
    } else {
      //this.setState({validation:{}, editDetail:true, newUserInfo: {...item, roleId: roles, password: (item.pWDHash || null),  newPassword: (item.pWDHash || null) }});
      this.setState({
        validation: {},
        editDetail: true,
        detailTitle: "Edit User Details",
        showDetail: true,
        canEditAction: canEditAction,
        newUserInfo: {
          ...item,
          roleId: roles,
          newPassword: null,
          confirmPassword: null,
        },
      });
    }
  };

  //On edit cancel close only edit mode
  handleCancelEdit = (event) => {
    this.setState({ editDetail: false, detailTitle: "Details" });
  };

  hideDetailView = () => {
    this.setState({
      showDetail: false,
      detailTitle: "Details",
      editDetail: false,
      userInfo: {},
      newUserInfo: {},
    });
  };

  handleSelectAllClick = (event) => {
    const { userList } = this.state;
    if (event.target.checked) {
      const { info } = this.props.user;
      const newSelecteds = userList
        .filter((user) => !user.isFirstUser && user.userId !== info.userId)
        .map((n) => n.userId);
      this.setState({ selectedUsers: newSelecteds, checkedAll: true });

      return;
    }
    this.setState({ selectedUsers: [], checkedAll: false });
  };

  handleClick = (event, item) => {
    const { selectedUsers, checkedAll } = this.state;
    const { info } = this.props.user;
    const canEditAction =
      (!item.isFirstUser && item.userId !== info.userId) || false;
    if (!canEditAction) return false;

    const selectedIndex = selectedUsers.indexOf(item.userId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUsers, item.userId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelected = newSelected.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    this.setState({ selectedUsers: newSelected, checkedAll: newSelected && newSelected.length === 0 ? false : checkedAll });
  };

  handleClickFilter = (event, item, index) => {
    const { sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
    this.setState(
      {
        selectedFilterItem: item,
        page: 0,
        rowsPerPage: 10,
        sortOrder: newSortOrder,
      },
      () => {
        this.getUserList();
      }
    );
  };

  validateForm = () => {
    const { newUserInfo } = this.state;

    let valid = true;
    let validation = {};
    if (!newUserInfo || !newUserInfo.title || newUserInfo.title.trim() === "") {
      validation["title"] = "Prefix is required.";
      valid = false;
    }
    if (
      !newUserInfo ||
      !newUserInfo.firstName ||
      newUserInfo.firstName.trim() === ""
    ) {
      validation["firstName"] = "First name is required.";
      valid = false;
    }
    if (
      !newUserInfo ||
      !newUserInfo.lastName ||
      newUserInfo.lastName.trim() === ""
    ) {
      validation["lastName"] = "Last name is required.";
      valid = false;
    }
    if (
      !newUserInfo ||
      !newUserInfo.phone ||
      newUserInfo.phone.toString().trim() === "" ||
      newUserInfo.phone.toString().trim().length !== 10
    ) {
      validation["phone"] = "Phone number should be 10 digits.";
      valid = false;
    }
    if (!newUserInfo || !newUserInfo.email || newUserInfo.email.trim() === "") {
      validation["email"] = "Email is required.";
      valid = false;
    }
    if (
      newUserInfo &&
      newUserInfo.email &&
      newUserInfo.email.trim().length > 0
    ) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(newUserInfo.email.trim().toLowerCase())) {
        validation["email"] = "Invalid email address.";
        valid = false;
      }
    }

    if (!newUserInfo || !newUserInfo.roleId || newUserInfo.roleId.length === 0) {
      validation["roleId"] = "Please select at least one role.";
      valid = false;
    }

    /*
        if(!newUserInfo || !newUserInfo.securityQuestionId || newUserInfo.securityQuestionId === 0){
            validation["securityQuestionId"] = true;
            valid=false;
        }
        if(!newUserInfo || !newUserInfo.securityAnswer || newUserInfo.securityAnswer.trim()=== ''){
            validation["securityAnswer"] = true;
            valid=false;
        }
*/
    if (!newUserInfo || !newUserInfo.isSSO || newUserInfo.isSSO === false) {
      if (
        !newUserInfo ||
        !newUserInfo.userName ||
        newUserInfo.userName.trim() === ""
      ) {
        validation["userName"] = "User name is required.";
        valid = false;
      }
      if (
        newUserInfo &&
        newUserInfo.newPassword &&
        newUserInfo.newPassword.trim().length > 0
      ) {
        if (
          !newUserInfo ||
          !newUserInfo.newPassword ||
          (newUserInfo.newPassword && newUserInfo.newPassword.trim() === "")
        ) {
          validation["password"] = "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.";
          valid = false;
        }

        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
        if (!re.test(newUserInfo.newPassword.trim())) {
          validation["password"] = "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.";
          valid = false;
        }

        if (
          !newUserInfo ||
          !newUserInfo.confirmPassword ||
          newUserInfo.confirmPassword.trim() === ""
        ) {
          validation["confirmPassword"] = "Password and confirm password must be same.";
          valid = false;
        }
        if (
          newUserInfo &&
          newUserInfo.newPassword !== newUserInfo.confirmPassword
        ) {
          validation["confirmPassword"] = "Password and confirm password must be same.";
          valid = false;
        }
      }

      if (
        newUserInfo &&
        newUserInfo.confirmPassword &&
        newUserInfo.confirmPassword.trim().length > 0
      ) {
        if (
          !newUserInfo ||
          !newUserInfo.confirmPassword ||
          newUserInfo.confirmPassword.trim() === ""
        ) {
          validation["confirmPassword"] = "Password and confirm password must be same.";
          valid = false;
        }
        if (
          newUserInfo &&
          newUserInfo.newPassword !== newUserInfo.confirmPassword
        ) {
          validation["confirmPassword"] = "Password and confirm password must be same.";
          valid = false;
        }
      }
    } else {
      if (!newUserInfo || !newUserInfo.SSOUserId || newUserInfo.SSOUserId.trim() === "") {
        validation["SSOUserId"] = "Please enter a valid SSO ID.";
        valid = false;
      }
      if (newUserInfo && newUserInfo.SSOUserId && newUserInfo.SSOUserId.trim().length > 0) {
        const re = /^[0-9a-zA-Z]+$/; //Alphanumeric check expression
        if (!re.test(newUserInfo.SSOUserId.trim())) {
          validation["SSOUserId"] = "Please enter a valid SSO ID.";
          valid = false;
        }
      }
    }
    this.setState({ validation: { ...validation } });

    return valid;
  };

  handleChange = (field, event, value, position) => {
    const { newUserInfo } = this.state;
    const newUserDetail = { ...newUserInfo };
    const fieldName = event.target.name;

    switch (field) {
      case "roleId":
        const searchValue = newUserDetail.roles.filter(
          (item) => item.roleId === value.roleId
        );
        const newValues =
          searchValue.length === 0
            ? [...newUserDetail.roles, value]
            : [...newUserDetail.roles];

        /*const dataArr = newRoles.map(item=>{
                    return [JSON.stringify(item), item]
                });
                const maparr = new Map(dataArr);
               
                const newValues = [...maparr.values()];*/

        newUserDetail["roleId"] = newValues.map((item) => item.roleId);
        newUserDetail["roles"] = newValues;
        //this.setState({roles: value});

        break;
      case "clientId":
        const searchClientValue = newUserDetail.clients.filter(
          (item) => item.clientId === value.clientId
        );
        const newClientValues =
          searchClientValue.length === 0
            ? [...newUserDetail.clients, value]
            : [...newUserDetail.clients];
        newUserDetail["clientId"] = newClientValues.map(
          (item) => item.clientId
        );
        newUserDetail["clients"] = newClientValues;
        break;
      case "removeClientId":
        const updatedClients = [...newUserDetail.clients];
        const newUpdatedClientValues = updatedClients.filter(
          (item, index) => item.clientId !== value.clientId
        );

        newUserDetail["clientId"] = newUpdatedClientValues.map(
          (item) => item.clientId
        );
        newUserDetail["clients"] = newUpdatedClientValues;

        break;
      case "removeRoleId":
        const updatedRoles = [...newUserDetail.roles];
        const newUpdatedValues = updatedRoles.filter(
          (item, index) => item.roleId !== value.roleId
        );

        //newUserDetail[fieldName] = value.join();
        newUserDetail["roleId"] = newUpdatedValues.map((item) => item.roleId);
        newUserDetail["roles"] = newUpdatedValues;
        //this.setState({roles: value});

        break;
      case "SSOUserId":
        const SSOUserId = event.target.value;
        newUserDetail["SSOUserId"] = SSOUserId.replace(/[^a-zA-Z0-9]/g, "");
        break;
      case "phone":
        const phoneValue = event.target.value;
        newUserDetail["phoneCountryCode"] = phoneValue.ccode;
        newUserDetail["phone"] = phoneValue.phone;
        newUserDetail["phoneExt"] = phoneValue.ext;
        break;
      default:
        newUserDetail[fieldName] = event.target.value.trim();
        break;
    }

    this.setState({ newUserInfo: { ...newUserDetail } });

  };

  handleSubmit = () => {
    const { newUserInfo } = this.state;
    const valid = this.validateForm();
    if (!valid) {
      return false;
    }

    this.setState(
      {
        updateProgress: true,
      },
      () => {
        const { info } = this.props.user;
        if (newUserInfo && newUserInfo.userId) {
          this.props
            .dispatch(
              updateClientsAccessList({
                portalProfileId: info.portalProfileId,
                userId: newUserInfo.userId,
                clientIds: newUserInfo.clients,
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  alertMessage: this.props.bankClients.error,
                  alertMessageCallbackType: null,
                  alertType: "error",
                  updateProgress: false,
                });
                return false;
              }
            });

          this.props
            .dispatch(
              updateUserDetails({
                portalProfileId: info.portalProfileId,
                portalTypeId: info.portalTypeId,
                user: trim(newUserInfo),
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  alertMessage: this.props.user.error,
                  alertType: "error",
                  alertMessageCallbackType: null,
                  updateProgress: false,
                });
                return false;
              }
              this.setState({
                editDetail: false,
                showDetail: true,
                userInfo: trim(newUserInfo),
                updateProgress: false,
                alertMessageCallbackType: null,
                alertMessage: "User information updated successfully",
                alertType: "success",
              });
              this.fetchChipsFilterList();
              this.hideDetailView();
            });
        } else {
          this.props
            .dispatch(
              createUser({
                portalProfileId: info.portalProfileId,
                portalTypeId: info.portalTypeId,
                user: trim(newUserInfo),
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  alertMessage: this.props.user.error,
                  alertType: "error",
                  alertMessageCallbackType: null,
                  updateProgress: false,
                });
                return false;
              }
              this.setState({
                updateProgress: false,
                alertMessageCallbackType: "REDIRECT",
                alertMessage: "User added successfully",
                alertType: "success",
              });
              this.fetchChipsFilterList();
              this.hideDetailView();
            });
        }
      }
    );
  };

  handleClients = (e, item) => {
    const { user } = this.props;

    //Restricted acces: only bank portal allow this action
    if (user.info.portalTypeId === 1) {
      this.props.history.push({
        pathname: `/manage/user/clients/${item.userId}`,
        state: {
          userId: item.userId,
          user: item,
        },
      });
    }
  };

  handleSearch = (event) => {
    if (event.keyCode === 13) {
        this.setState({
            page: 0,
            rowsPerPage: 10,
          },
          () => {
            this.getUserList();
          }
        );
     }
  };

  handleSearchClick = () => {
        this.setState({
            page: 0,
            rowsPerPage: 10,
          },
          () => {
            this.getUserList();
          }
        );
  };

  handleNameChange = (event) => {
    this.setState({ 
            page: 0,
            rowsPerPage: 10,
            name: event.target.value 
        }, () => {
          this.getUserList();
        });
  };

  render() {
    const {
      clientList,
      alertMessage,
      updateProgress,
      validation,
      canEditAction,
      editDetail,
      filterList,
      selectedFilterItem,
      newUserInfo,
      userInfo,
      selectedUsers,
      checkedAll,
      showDetail,
      userList,
      showConfirmRemoveDialog,
      alertMessageCallbackType,
      isLoading,
      fetchingList,
      roleList,
      page,
      rowsPerPage,
      sortColumn,
      sortOrder,
      detailTitle,
    } = this.state;
    const { classes } = this.props;
    const { user, permissions } = this.props;
    const claims = permissions.minified;
    const isUserAddAllowed =
      claims && claims.includes(accessRights["USERS_LIST_ADD"]);
    const isUserEditAllowed =
      (claims && claims.includes(accessRights["USERS_LIST_UPDATE"])) || false;
    const isLockUserAllowed =
      claims && claims.includes(accessRights["USERS_LIST_LOCK"]);
    const isUserDeleteAllowed =
      claims && claims.includes(accessRights["USERS_LIST_DELETE"]);
    if (isLoading) {
      return (
        <Box display="flex" p={10} justifyContent="center" alignItems="center">
          <CircularProgress color="primary" />
        </Box>
      );
    }

    return (
      <Fragment>
        <Grid container item xs={12} className={classes.root}>
          <Grid container item xs={12} md={12} justify="flex-end">
            {isUserAddAllowed && (
              <Box mt={-3} mr={5}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.mediumBtn}
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => this.props.history.push("/manage/user/add")}
                >
                  ADD USER
                </Button>
              </Box>
            )}
          </Grid>

          <Paper className={classes.paper}>
            <Grid container item xs={12} md={12} className={classes.gtidItem}>
              <Box
                px={4}
                pt={2}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div>
                  <TextField
                    className={classes.searchBox}
                    placeholder="Search Users by name/email"
                    inputProps={{
                      "aria-label": "Search Users by name / email",
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            aria-label="search"
                            onClick={() => this.handleSearchClick()}
                            onMouseDown={null}
                            edge="end"
                            style={{ paddingLeft: "69%" }}
                          >
                            <SearchIcon />
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    onChange={(event) => this.handleNameChange(event)}
                    onKeyDown={(event) => this.handleSearch(event)}
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div>
                  {isLockUserAllowed && (
                    <Button
                      color="primary"
                      aria-label="Lock User account"
                      title="Lock User account"
                      component="span"
                      onClick={(event) => this.handleLock(event)}
                      startIcon={<LockIcon />}
                    >
                      <span style={{ paddingTop: "1%", fontWeight: 600 }}>
                        {" "}
                        Lock
                      </span>
                    </Button>
                  )}
                  {isUserDeleteAllowed && (
                    <Button
                      color="primary"
                      aria-label="Delete User"
                      title="Delete User"
                      component="span"
                      onClick={(event) => this.handleDelete(event)}
                      startIcon={<DeleteIcon />}
                    >
                      <b> Delete</b>
                    </Button>
                  )}
                </div>
              </Box>
            </Grid>
            <Grid
              container
              item
              xs={12}
              md={12}
              justify="flex-start"
              className={classes.gtidItem}
            >
              <Box
                mt={3}
                display="flex"
                width="100%"
                justifyContent="flex-start"
              >
                <ChipFilter
                  list={filterList}
                  handleClickFilter={this.handleClickFilter}
                  selectedFilterItem={
                    !selectedFilterItem.roleName
                      ? { roleId: null, roleName: "All Users" }
                      : selectedFilterItem
                  }
                />
              </Box>
            </Grid>
            <Grid container item xs={12} md={12} justify="center">
              <Table>
                <StyledTableHead style={{ background: "#D9EBFF" }}>
                  <TableRow>
                    <StyledTableCell className="tableHeaderPadding">
                      <Checkbox
                        checked={checkedAll}
                        color="primary"
                        indeterminate={
                          selectedUsers.length > 0 &&
                          selectedUsers.length < userList.length
                        }
                        onChange={(event) => this.handleSelectAllClick(event)}
                        icon={<CheckBoxOutlineBlankIcon />}
                        checkedIcon={<CheckBoxIcon />}
                      />
                    </StyledTableCell>
                    <StyledTableCell className="tableHeaderPadding"></StyledTableCell>
                    <StyledTableCell
                      className="tableHeaderPadding"
                      sortDirection={
                        sortColumn === "displayName" ? sortOrder : false
                      }
                    >
                      <TableSortLabel
                        active={sortColumn === "displayName"}
                        direction={
                          sortColumn === "displayName" ? sortOrder : "asc"
                        }
                        onClick={() => this.handleSorting("displayName")}
                      >
                        Name
                        {sortColumn === "displayName" ? (
                          <span
                            style={{
                              border: 0,
                              clip: "rect(0 0 0 0)",
                              height: 1,
                              margin: -1,
                              overflow: "hidden",
                              padding: 0,
                              position: "absolute",
                              top: 20,
                              width: 1,
                            }}
                          >
                            {sortOrder === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </span>
                        ) : null}
                      </TableSortLabel>
                    </StyledTableCell>
                    <StyledTableCell className="tableHeaderPadding">
                      Status
                    </StyledTableCell>
                    <StyledTableCell className="tableHeaderPadding">
                      Last Visited
                    </StyledTableCell>
                    <StyledTableCell className="tableHeaderPadding">
                      Client Access
                    </StyledTableCell>
                    <StyledTableCell className="tableHeaderPadding">
                      Role Assigned
                    </StyledTableCell>
                    <StyledTableCell className="tableHeadPadding"></StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {fetchingList ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Box
                          display="flex"
                          p={5}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <CircularProgress color="primary" />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    user.list &&
                    user.list.map((item, index) => {
                      // const roleIds = item.RoleID.split(',').map(Number);
                      const roleIds = item.roles.map(
                        (userItem) => userItem.roleId
                      );
                      const clientIds =
                        (item.clients &&
                          item.clients.map((userItem) => userItem.clientId)) ||
                        [];

                      const isSelected =
                        selectedUsers.indexOf(item.userId) !== -1;
                      const currentDate = moment();
                      const lastActiveDate = item.successfullLoginAt
                        ? moment(item.successfullLoginAt)
                        : null;
                      const activeDays = currentDate.diff(
                        lastActiveDate,
                        "days"
                      );

                      return (
                        <Fragment key={index}>
                          <StyledTableRow>
                            <StyledTableCell
                              style={{ width: "5" }}
                              className="tableCellPadding"
                            >
                              <Checkbox
                                onChange={(event) =>
                                  this.handleClick(event, item)
                                }
                                checked={isSelected}
                                color="primary"
                                inputProps={{ "aria-labelledby": item.userId }}
                              />
                            </StyledTableCell>
                            <StyledTableCell
                              onClick={() => this.showDetailView(item)}
                              className="tableCellPadding"
                            >
                              <Avatar
                                alt={item.displayName}
                                src="/static/images/avatar/1.jpg"
                              />
                            </StyledTableCell>
                            <StyledTableCell
                              onClick={() => this.showDetailView(item)}
                              style={{ width: "25%", wordBreak: "break-all" }}
                              className="tableCellPadding"
                            >
                              <Typography
                                variant="body1"
                                component="h2"
                                className="nameTxt"
                              >
                                {`${item.firstName}  ${item.lastName}`}
                              </Typography>
                              <Typography
                                variant="caption"
                                component="h2"
                                className="emailTxt"
                              >
                                {item.email}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell
                              style={{ width: "10%" }}
                              className="tableCellPadding"
                              onClick={() => this.showDetailView(item)}
                            >
                              {isNaN(activeDays) || activeDays > 7
                                ? "Inactive"
                                : "Active"}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{ width: "15%" }}
                              className="tableCellPadding"
                              onClick={() => this.showDetailView(item)}
                            >
                              {item.successfullLoginAt
                                ? moment(lastActiveDate).fromNow()
                                : "NA"}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{ width: "15%" }}
                              className="tableCellPadding"
                            >
                              {!this.isSuperAdmin(item) && (
                                <Button
                                  color="primary"
                                  aria-label="Assign Client"
                                  title="Assign Client"
                                  component="span"
                                  onClick={(event) =>
                                    this.handleClients(event, item)
                                  }
                                >
                                  <SettingsIcon
                                    variant="contained"
                                    color="primary"
                                  />
                                </Button>
                              )}
                            </StyledTableCell>
                            {1 == 0 && (
                              <StyledTableCell>
                                <Select
                                  style={{ width: "20%" }}
                                  fullWidth={true}
                                  className="dropDownStyle"
                                  input={<OutlinedInput />}
                                  multiple
                                  value={clientIds}
                                  autoComplete="off"
                                  name="clientId"
                                  onChange={(event) =>
                                    this.handleClientChange(item, event)
                                  }
                                  renderValue={(selected) => {
                                    if (selected.length === 1) {
                                      const selectedClient =
                                        clientList &&
                                        clientList.filter(
                                          (client) =>
                                            client.clientId === selected[0]
                                        );
                                      return (
                                        <em>
                                          {(clientList.length &&
                                            selectedClient.length &&
                                            selectedClient[0].clientName) ||
                                            ""}
                                        </em>
                                      );
                                    }

                                    return `Multiple (${selected.length} Clients)`;
                                  }}
                                >
                                  {clientList ? (
                                    clientList.map((client) => (
                                      <MenuItem
                                        key={client.clientId}
                                        value={client.clientId}
                                      >
                                        <Checkbox
                                          checked={
                                            clientIds.length > 0 &&
                                            clientIds.indexOf(client.clientId) >
                                              -1
                                          }
                                        />
                                        <ListItemText
                                          primary={client.clientName}
                                        />
                                      </MenuItem>
                                    ))
                                  ) : (
                                    <Box
                                      width="100px"
                                      display="flex"
                                      mt={1.875}
                                      justifyContent="center"
                                      alignItems="center"
                                    >
                                      <CircularProgress color="primary" />
                                    </Box>
                                  )}
                                </Select>
                              </StyledTableCell>
                            )}
                            <StyledTableCell
                              style={{ width: "20%" }}
                              className="tableCellPadding"
                            >
                              <Select
                                className="dropDownStyle"
                                input={<OutlinedInput />}
                                multiple
                                value={roleIds}
                                autoComplete="off"
                                name="roleId"
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left"
                                    },
                                    getContentAnchorEl: null
                                }}
                                variant="selectedMenu"
                                onChange={(event) =>
                                  this.handleRoleChange(item, event)
                                }
                                renderValue={(selected) => {
                                  if (selected.length === 1) {
                                    const selectedRole =
                                      roleList &&
                                      roleList.filter(
                                        (role) => role.roleId === selected[0]
                                      );
                                    return (
                                      <em className={classes.roleList}>
                                        {(roleList.length &&
                                          selectedRole.length &&
                                          selectedRole[0].roleName) ||
                                          ""}
                                      </em>
                                    );
                                  }

                                  return `Multiple (${selected.length} roles)`;
                                }}
                              >
                                {roleList ? (
                                  roleList.map((role) => (
                                    <MenuItem
                                      key={role.roleId}
                                      value={role.roleId}
                                      className={classes.menuItemLongText}
                                    >
                                      <Checkbox
                                        checked={
                                          roleIds.length > 0 &&
                                          roleIds.indexOf(role.roleId) > -1
                                        }
                                      />
                                      <ListItemText primary={role.roleName} />
                                    </MenuItem>
                                  ))
                                ) : (
                                  <Box
                                    width="100px"
                                    display="flex"
                                    mt={1.875}
                                    justifyContent="center"
                                    alignItems="center"
                                  >
                                    <CircularProgress color="primary" />
                                  </Box>
                                )}
                              </Select>
                            </StyledTableCell>
                            <StyledTableCell
                              style={{ width: "2%", padding: "10px" }}
                              className="tablePadding"                               
                            >
                              {isUserEditAllowed &&
                                !item.isFirstUser &&
                                item.userId !== user.info.userId && (
                                  <span 
                                    aria-label={"Edit User"}
                                    title={"Edit User"}
                                  >                                  
                                    <EditIcon
                                      size="small"
                                      className={classes.smallIcon}                                                                      
                                      onClick={(event) =>
                                        this.handleEdit(event, item)
                                      }
                                    />
                                  </span>
                                )}
                            </StyledTableCell>
                          </StyledTableRow>
                        </Fragment>
                      );
                    })
                  )}
                  {user.list.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Box
                          display="flex"
                          p={1}
                          justifyContent="center"
                          alignItems="center"
                        >
                          No result found.
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <StyledTableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        10,
                        25,
                        50,
                        { label: "All", value: user.totalCount || 10 },
                      ]}
                      colSpan={8}
                      count={user.totalCount || 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                        native: true,
                      }}
                      onChangePage={this.handlePageChange}
                      onChangeRowsPerPage={this.handleRowsPerPageChange}
                      className="TablePagination"
                    />
                  </TableRow>
                </StyledTableFooter>
              </Table>
            </Grid>
          </Paper>

          {alertMessage &&
            this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
          {showConfirmRemoveDialog &&
            this.renderDeleteDialog(
              "Are you sure you want to delete user?",
              ""
            )}
        </Grid>

        <DetailView
          open={showDetail}
          title={detailTitle}
          handleClose={() => this.hideDetailView()}
        >
          {editDetail ? (
            <UserEdit
              validation={validation}
              userInfo={newUserInfo}
              roleList={roleList}
              claims={claims}
              clientList={clientList}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
              //handleCancel={this.handleCancelEdit}
              handleCancel={this.hideDetailView}
              handleDelete={this.handleDelete}
              handleLock={this.handleLock}
              updateProgress={updateProgress}
              canEditAction={canEditAction}
            />
          ) : (
            <UserView
              claims={claims}
              userInfo={userInfo}
              roleList={roleList}
              handleEdit={this.handleEdit}
              handleDelete={this.handleDelete}
              handleLock={this.handleLock}
              canEditAction={canEditAction}
            />
          )}
        </DetailView>
      </Fragment>
    );
  }

  renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={this.hideAlertMessage}
      />
    );
  };

  renderDeleteDialog = (title, message) => {
    return (
      <ConfirmDialog
        title={title}
        message={message}
        onCancel={() => this.onCancelDelete()}
        onConfirm={() => this.onConfirmDelete()}
      />
    );
  };

  renderAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => {
          callbackType === "REDIRECT" ? this.goBack() : this.hideAlertMessage();
        }}
      />
    );
  };
}

export default connect((state) => ({
  ...state.user,
  ...state.role,
  ...state.bankClients,
  ...state.permissions,
}))(withStyles(styles)(UserListView));
