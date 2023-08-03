import React, { useState,  useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Grid, Typography, Box, Button } from "@material-ui/core";
import InfoCardHeader from "./InfoCardHeader";
import CustomDivider from "./CustomDivider";
import CustomInputTextField from "../../components/form/CustomInputTextField";
import { getEFTAccountInfo, updateEFTAccountInfo, saveEFTAccountInfo, createEFTAccountInfo, addEFTAccountInfo } from "../../redux/actions/companyDetails";

import { connect } from "react-redux";

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

const title = "EFT Account";

function EFTAccountInfo({ EFTAccountInfo, error, dispatch,  accountClassificationList, currrencyList }) {
  
  useEffect(() => {
    dispatch(getEFTAccountInfo(2));
  }, []);

  const classes = useStyles();

  const handleChange = (id, data) => {
    dispatch(updateEFTAccountInfo(2, id, data));
  };

  const onSave = (id) => {
    if (id === "new") {
      dispatch(createEFTAccountInfo(2));
    } else {
      dispatch(saveEFTAccountInfo(2, parseInt(id)));
    }
  };

  const onAdd = (event) => {    
    dispatch(addEFTAccountInfo(2));
  };

  return (
    <div className={classes.container}>
      <Paper elevation={3} classes={{ root: classes.paperStyles }}>
        <form noValidate autoComplete="off">
          <Grid container direction="column" spacing={2}>
            <InfoCardHeader title={title} onclickAdd={onAdd} />
            {Object.keys(EFTAccountInfo).map((info, i) => {
              return (
                <>
                  <InfoCardContent
                    id={info}
                    key={i}
                    EFTAccountDetail={EFTAccountInfo[info]}
                    onSave={onSave}
                    onhandleChange={handleChange}
                    accountClassListOptions={accountClassificationList.map(
                      ({ AccountClassificationTypeID, Name }, i) => ({
                        key: AccountClassificationTypeID,
                        value: AccountClassificationTypeID,
                        label: Name,
                      })
                    )}
                    currrencyListOptions={currrencyList.map(
                      ({ CurrencyISOCode, Name }, i) => ({
                        key: CurrencyISOCode,
                        value: CurrencyISOCode,
                        label: Name,
                      })
                    )}
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

const InfoCardContent = ({ id, EFTAccountDetail, onhandleChange, onSave, accountClassListOptions, currrencyListOptions }) => {  
  const [editMode, setEditMode] = useState(false); 

  useEffect(() => {
    if (id === "new") {
      setEditMode(true);
    }
  }, []);
  
  const onEditHandler = () => {
    if (editMode) {
      onSave(id);
    }
    setEditMode(!editMode);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    onhandleChange(id, { [name]: value });
  };

  const classes = useStyles();
  const {    
    BankName,
    AccountNumber,
    RoutingCode,
    BankCity,
    BankStateRegion,
    BankCountryISO,
    AcctTypeID,
    CurrencyCode,
  } = EFTAccountDetail;
  
  return (
    <>
      <CustomDivider />
      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={9}>
          <Typography variant="subtitle1">
            <Box fontWeight={400} fontSize={20} my={1}>
              {BankName}
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Button
            size="small"
            onClick={onEditHandler}
            className={`${classes.button} ${editMode ? "edit" : ""}`}
          >
            {editMode ? "SAVE" : "EDIT"}{" "}
          </Button>
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"AccountNumber"}
            label={"Account Number"}
            value={AccountNumber}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"RoutingCode"}
            label={"Routing Number"}
            value={RoutingCode}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"BankName"}
            label={"Bank Name"}
            value={BankName}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"BankCity"}
            label={"Bank City"}
            value={BankCity}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"BankStateRegion"}
            label={"Bank State"}
            value={BankStateRegion}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"BankCountryISO"}
            label={"Bank Country"}
            value={BankCountryISO}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={9}>
          <CustomInputTextField
            name={"AcctTypeID"}
            label={"Account Classification"}
            value={parseInt(AcctTypeID)}
            onChangeHandler={handleChange}
            editMode={editMode}
            select={true}
            options={accountClassListOptions}
          />
        </Grid>
        <Grid item xs={9}>
          <CustomInputTextField
            name={"CurrencyCode"}
            label={"Payment Currency"}
            value={CurrencyCode}
            onChangeHandler={handleChange}
            editMode={editMode}
            select={true}
            options={currrencyListOptions}
          />
        </Grid>
      </Grid>
    </>
  );
};

const mapStateToProps = ({ companyDetails, common }) => {
  const { EFTAccountInfo = {}, error = {} } = companyDetails;
  const { accountClassificationList, currrencyList } = common;
  return { EFTAccountInfo, error, accountClassificationList, currrencyList };
};

export default connect(mapStateToProps)(EFTAccountInfo);
