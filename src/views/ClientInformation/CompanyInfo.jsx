import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Grid, Checkbox } from "@material-ui/core";
import InfoCardHeader from "./InfoCardHeader";
import CustomDivider from "./CustomDivider";
import { Typography, Box, Button } from "@material-ui/core";
import CustomInputTextField from "../../components/form/CustomInputTextField";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import {
  getCompanyInformation,
  updateCompanyInformation,
  saveCompanyInformation,
  getClientLegalEntityInfo,
  addClientLegalEntityInfo,
  updateClientLegalEntityInfo,
  saveClientLegalEntityInfo,
  createClientLegalEntityInfo,
} from "~/redux/actions/companyDetails";
import StyledFormControlLabel from "../../components/form/StyledFormControlLabel";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    padding: 10,
    width: "100%",
    height: "auto",
  },
  paperStyles: {
    padding: 35,
    width: "100%",
    height: "fit-content",
  },
  button: {
    color: "#4bb8b0",
    backgroundColor: "white",
    "&:hover": {
      color: "#FFFFFF",
      border: "1px solid #4bb8b0",
      backgroundColor: "#4bb8b0",
    },
  },
}));

const title = "Company Information";

function CompanyInfo({
  companyInformation,
  clientLegalEntityInfo,
  locationTypeList,
  error,
  dispatch,
}) {
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    dispatch(getCompanyInformation(2));
    dispatch(getClientLegalEntityInfo(2));
  }, []);

  const {handleSubmit, errors } = useForm();

  const classes = useStyles();

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateCompanyInformation(2, { [name]: value }));
  };

  const handleEntityChange = (event) => {
    const { name, value, id, type, checked } = event.target;
    var newValue = value;
    if (type === "checkbox") {
      newValue = checked ? 1 : 0;
    }
    dispatch(updateClientLegalEntityInfo(2, id, { [name]: newValue }));
  };

  const onSave = () => {
    dispatch(saveCompanyInformation(2));
  };

  const onEdit = (data) => {
    if (editMode) {
      onSave();
      setEditMode(!editMode);
    } else {
      setEditMode(!editMode);
    }
  };
  const onSaveEntity = (id) => {
    if (id === "new") {
      dispatch(createClientLegalEntityInfo(2));
    } else {
      dispatch(saveClientLegalEntityInfo(2, parseInt(id)));
    }
  };

  const onAdd = () => {
    dispatch(addClientLegalEntityInfo());
  };

  const {
    ClientName = "",
    TaxID,
    DUNS,
    PhoneNumber,
    Fax,
    Website,
    Address1,
    City,
    StateRegion,
    CountryISO,
    ZipPostal,
    LocationTypeID,
  } = companyInformation;

  const locationTypeListOptions = locationTypeList.map(
    ({ LocationTypeID, Description }, i) => ({
      key: LocationTypeID,
      value: LocationTypeID,
      label: Description,
    })
  );

  return (
    <div className={classes.container}>
      <Paper elevation={3} classes={{ root: classes.paperStyles }}>
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onEdit)}>
          <Grid container direction="column" spacing={2}>
            <InfoCardHeader title={title} onclickAdd={onAdd} />
            <CustomDivider />
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item xs={9}>
                <Typography variant="subtitle1">
                  <Box fontWeight={400} fontSize={20} my={1}>
                    {ClientName}
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Button
                  size="small"
                  onClick={handleSubmit(onEdit)}
                  className={`${classes.button} ${editMode ? "edit" : ""}`}
                >
                  {editMode ? "SAVE" : "EDIT"}{" "}
                </Button>
              </Grid>
            </Grid>
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item xs={6}>
                <CustomInputTextField
                  name="ClientName"
                  label="Company Name"
                  value={ClientName}
                  onChangeHandler={handleChange}
                  editMode={editMode}
                  error={errors["ClientName"]}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputTextField
                  name="TaxID"
                  label="Federal Tax Id"
                  value={TaxID}
                  onChangeHandler={handleChange}
                  editMode={editMode}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputTextField
                  name="DUNS"
                  label="DUNS Number"
                  value={DUNS}
                  onChangeHandler={handleChange}
                  editMode={editMode}                  
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputTextField
                  name="PhoneNumber"
                  label="Phone number"
                  value={PhoneNumber}
                  onChangeHandler={handleChange}
                  editMode={editMode}                  
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputTextField
                  name="Fax"
                  label="Fax"
                  value={Fax}
                  onChangeHandler={handleChange}
                  editMode={editMode}                  
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputTextField
                  name="Website"
                  label="Website"
                  value={Website}
                  onChangeHandler={handleChange}
                  editMode={editMode}                  
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputTextField
                  name="Address1"
                  label="Address"
                  value={Address1}
                  onChangeHandler={handleChange}
                  editMode={editMode}                  
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputTextField
                  name="City"
                  label="City"
                  value={City}
                  onChangeHandler={handleChange}
                  editMode={editMode}                  
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputTextField
                  name="StateRegion"
                  label="State"
                  value={StateRegion}
                  onChangeHandler={handleChange}
                  editMode={editMode}                  
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputTextField
                  name="CountryISO"
                  label="Country"
                  value={CountryISO}
                  onChangeHandler={handleChange}
                  editMode={editMode}                  
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputTextField
                  name="ZipPostal"
                  label="Zip code"
                  value={ZipPostal}
                  onChangeHandler={handleChange}
                  editMode={editMode}                  
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputTextField
                  name={"LocationTypeID"}
                  label={"Location type"}
                  value={parseInt(LocationTypeID)}
                  onChangeHandler={handleChange}
                  editMode={editMode}
                  select={true}
                  options={locationTypeListOptions}
                />
              </Grid>
            </Grid>
            {Object.keys(clientLegalEntityInfo).map((info) => (
              <ClientLegalEntity
                LegalEntityIDInfo={info}
                key={info}
                handleChange={handleEntityChange}
                onSave={onSaveEntity}
                info={clientLegalEntityInfo[info]}
              />
            ))}
          </Grid>
        </form>
      </Paper>
    </div>
  );
}

const ClientLegalEntity = ({
  LegalEntityIDInfo,
  info,
  handleChange,
  onSave,
}) => {
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (LegalEntityIDInfo === "new") {
      setEditMode(true);
    }
  }, []);
  
  const onEdit = (event) => {  
    if (editMode) {
      onSave(LegalEntityIDInfo);
    }
    setEditMode(!editMode);
  };

  const classes = useStyles();

  const {    
    Name,
    TaxID,
    Subsidiary,
    OperatingUnit,
    MemberOfGUCO,
    Other    
  } = info;

  return (
    <React.Fragment>
      <CustomDivider />
      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={9}>
          <Typography variant="subtitle1">
            <Box fontWeight={400} fontSize={20} my={1}>
              {Name}{" "}
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Button
            id={LegalEntityIDInfo}
            size="small"
            onClick={onEdit}
            className={`${classes.button} ${editMode ? "edit" : ""}`}
          >
            {editMode ? "SAVE" : "EDIT"}{" "}
          </Button>
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={12}>
          <CustomInputTextField
            id={LegalEntityIDInfo}
            name="Name"
            label="Legal Entity Name"
            fullwidth
            value={Name}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomInputTextField
            fullwidth
            id={LegalEntityIDInfo}
            name="TaxID"
            label="Federal Tax ID"
            value={TaxID}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={12} container direction="column">
          <StyledFormControlLabel
            id={LegalEntityIDInfo}
            control={
              <Checkbox
                id={LegalEntityIDInfo}
                name={"Subsidiary"}
                value={Subsidiary}
                checked={Boolean(Subsidiary)}
                onChange={handleChange}
                color="primary"
                disabled={!editMode}
              />
            }
            label={"Subsidiary"}
          />
          <StyledFormControlLabel
            id={LegalEntityIDInfo}
            control={
              <Checkbox
                id={LegalEntityIDInfo}
                name={"OperatingUnit"}
                value={OperatingUnit}
                checked={Boolean(OperatingUnit)}
                onChange={handleChange}
                color="primary"
                disabled={!editMode}
              />
            }
            label={"Division/Operating Unit"}
          />

          <StyledFormControlLabel
            id={LegalEntityIDInfo}
            control={
              <Checkbox
                id={LegalEntityIDInfo}
                name={"MemberOfGUCO"}
                value={MemberOfGUCO}
                checked={Boolean(MemberOfGUCO)}
                onChange={handleChange}
                color="primary"
                disabled={!editMode}
              />
            }
            label={"Member of Group Under Common Ownership/Control"}
          />
          <StyledFormControlLabel
            id={LegalEntityIDInfo}
            control={
              <Checkbox
                id={LegalEntityIDInfo}
                name={"Other"}
                value={Other}
                checked={Boolean(Other)}
                onChange={handleChange}
                color="primary"
                disabled={!editMode}
              />
            }
            label={"Other"}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ companyDetails, common }) => {
  const {
    companyInformation = {},
    error = {},
    clientLegalEntityInfo = {},
  } = companyDetails;
  const { locationTypeList } = common;
  return { clientLegalEntityInfo, companyInformation, error, locationTypeList };
};

export default connect(mapStateToProps)(CompanyInfo);
