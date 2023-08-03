import React, { useState,  useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Grid,  Button } from "@material-ui/core";
import InfoCardHeader from "./InfoCardHeader";
import CustomDivider from "./CustomDivider";
import CustomInputTextField from "../../components/form/CustomInputTextField";
import { connect } from "react-redux";
import {
  getContactInfo,
  updateContactInfo,
  saveContactInfo,
  createContactInfo,
  addContactInfo,
} from "../../redux/actions/companyDetails";

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
    height: "fit-content"
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

const title = "Contact Information";

function ContactInformation({
  dispatch,
  contactInformation,
  contactTypeList = [],
  locationTypeList = [],
  error,
}) {
  useEffect(() => {
    dispatch(getContactInfo(2));
  }, []);

  const classes = useStyles();

  const handleChange = (id, data) => {
    dispatch(updateContactInfo(2, id, data));
  };

  const onAdd = (event) => {    
    dispatch(addContactInfo(2));
  };

  const onSave = (id) => {
    if (id === "new") {
      dispatch(createContactInfo(2));
    } else {
      dispatch(saveContactInfo(2, parseInt(id)));
    }
  };

  const contactTypeListArr = contactTypeList.map(
    ({ ContactTypeID, Description }, i) => ({
      key: ContactTypeID,
      value: ContactTypeID,
      label: Description,
    })
  );

  const locationTypeListArr = locationTypeList.map(
    ({ LocationTypeID, Description }, i) => ({
      key: LocationTypeID,
      value: LocationTypeID,
      label: Description,
    })
  );

  return (
    <div className={classes.container}>
      <Paper elevation={3} classes={{ root: classes.paperStyles }}>
        <form noValidate autoComplete="off">
          <Grid container direction="column" spacing={2}>
            <InfoCardHeader title={title} onclickAdd={onAdd} />
            {Object.keys(contactInformation).map((info, i) => {
              return (
                <>
                  <InfoCardContent
                    id={info}
                    key={i}
                    contactDetail={contactInformation[info]}
                    onhandleChange={handleChange}
                    onSave={onSave}
                    contactTypeListOptions={contactTypeListArr}
                    locationTypeListOptions={locationTypeListArr}
                  />
                </>
              );
            })}
          </Grid>
        </form>
      </Paper>
    </div>
  );
}

const InfoCardContent = ({
  contactTypeListOptions,
  locationTypeListOptions,
  id,
  contactDetail,
  onhandleChange,
  onSave,
}) => {  
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (id === "new") {
      setEditMode(true);
    }
  }, []);
  
  const onEditHandler = () => {
    setEditMode(!editMode);   
    onSave(id);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    onhandleChange(id, { [name]: value });
  };

  const classes = useStyles();
  const {
    ContactTypeID,    
    Title,
    FirstName,
    LastName,
    Phone,
    Fax,
    Email,
    Country,
    City,
    State,
    ZipCode,
    LocationTypeID,
  } = contactDetail;

  return (
    <>
      <CustomDivider />
      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={9}>
          <CustomInputTextField
            id={id}
            name={"ContactTypeID"}
            label={"Contact Type"}
            value={ContactTypeID}
            onChangeHandler={handleChange}
            editMode={editMode}
            select={true}
            options={contactTypeListOptions}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            id={id}
            size="small"
            onClick={onEditHandler}
            className={`${classes.button} ${editMode ? "edit" : ""}`}
          >
            {editMode ? "SAVE" : "EDIT"}{" "}
          </Button>
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={2}>
          <CustomInputTextField
            id={id}
            name={"Title"}
            label={"Prefix"}
            value={Title}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={5}>
          <CustomInputTextField
            id={id}
            name={"FirstName"}
            label={"First Name"}
            value={FirstName}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={5}>
          <CustomInputTextField
            id={id}
            name={"LastName"}
            label={"Last Name"}
            value={LastName}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            id={id}
            name={"Phone"}
            label={"Phone"}
            value={Phone}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            id={id}
            name={"Fax"}
            label={"Fax"}
            value={Fax}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            id={id}
            name={"Email"}
            label={"Email"}
            value={Email}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            id={id}
            name={"Country"}
            label={"Country"}
            value={Country}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            id={id}
            name={"City"}
            label={"City"}
            value={City}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            id={id}
            name={"State"}
            label={"State"}
            value={State}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            id={id}
            name={"ZipCode"}
            label={"Zip code"}
            value={ZipCode}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            id={id}
            name={"LocationTypeID"}
            label={"Location type"}
            value={LocationTypeID}
            onChangeHandler={handleChange}
            editMode={editMode}
            select={true}
            options={locationTypeListOptions}
          />
        </Grid>
      </Grid>
    </>
  );
};

const mapStateToProps = ({ companyDetails, common }) => {
  const { contactInformation, error } = companyDetails;
  const { contactTypeList, locationTypeList } = common;
  return { contactInformation, error, contactTypeList, locationTypeList };
};

export default connect(mapStateToProps)(ContactInformation);
