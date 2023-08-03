import React, { useState,  useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Grid, Typography, Box, Button } from "@material-ui/core";
import InfoCardHeader from "./InfoCardHeader";
import CustomDivider from "./CustomDivider";
import CustomInputTextField from "../../components/form/CustomInputTextField";
import { getBankAccountInfo, updateBankAccountInfo, saveBankAccountInfo, createBankAccountInfo, addBankAccountInfo } from "../../redux/actions/companyDetails";
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

const title = "Bank Account";

function BankAccountInfo({ bankAccountInfo, error, dispatch, accountClassificationList, currrencyList }) {

  useEffect(() => {
    dispatch(getBankAccountInfo(2));
  }, []);

  const handleChange = (id, data) => {
    dispatch(updateBankAccountInfo(2, id, data));
  };

  const onSave = (id) => {
    if (id === "new") {
      dispatch(createBankAccountInfo(2));
    } else {
      dispatch(saveBankAccountInfo(2, parseInt(id)));
    }
  };

  const onAdd = (event) => {    
    dispatch(addBankAccountInfo(2));
  };

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Paper elevation={3} classes={{ root: classes.paperStyles }}>
        <form noValidate autoComplete="off">
          <Grid container direction="column" spacing={2}>
            <InfoCardHeader title={title} onclickAdd={onAdd} />
            {Object.keys(bankAccountInfo).map((info, i) => {
              return (
                <>
                  <InfoCardContent
                    id={info}
                    key={i}
                    bankAccountDetail={bankAccountInfo[info]}
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

const InfoCardContent = ({ id, bankAccountDetail, onhandleChange, onSave, accountClassListOptions, currrencyListOptions }) => {  
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
  } = bankAccountDetail;

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
  const { bankAccountInfo = {}, error = {} } = companyDetails;
  const { accountClassificationList, currrencyList } = common;
  return { bankAccountInfo, error, accountClassificationList, currrencyList };
};

export default connect(mapStateToProps)(BankAccountInfo);
