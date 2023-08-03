import React, { useState,  useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Grid, Typography, Box, Button } from "@material-ui/core";
import InfoCardHeader from "./InfoCardHeader";
import CustomDivider from "./CustomDivider";
import CustomInputTextField from "../../components/form/CustomInputTextField";
import {
  getVirtualCardInfo,
  updateVirtualCardInfo,
  addVirtualCardInfo,
  saveVirtualCardInfo,
  createVirtualCardInfo,
} from "../../redux/actions/companyDetails";
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

const title = "Virtual Card";

function VirtualCardInfo({
  virtualCardInfo,
  error,
  dispatch,
  cardTypeList,
  currrencyList,
  purchaseTypeList,
}) {
  useEffect(() => {
    dispatch(getVirtualCardInfo(2));
  }, []);

  const classes = useStyles();

  const handleChange = (id, data) => {
    dispatch(updateVirtualCardInfo(2, id, data));
  };

  const onAdd = (event) => {    
    dispatch(addVirtualCardInfo(2));
  };

  const onSave = (id) => {
    if (id === "new") {
      dispatch(createVirtualCardInfo(2));
    } else {
      dispatch(saveVirtualCardInfo(2, parseInt(id)));
    }
  };

  return (
    <div className={classes.container}>
      <Paper elevation={3} classes={{ root: classes.paperStyles }}>
        <form noValidate autoComplete="off">
          <Grid container direction="column" spacing={2}>
            <InfoCardHeader title={title} onclickAdd={onAdd} />
            {Object.keys(virtualCardInfo).map((info, i) => {
              return (
                <>
                  <InfoCardContent
                    id={info}
                    key={i}
                    virtualCardDetail={virtualCardInfo[info]}
                    onSave={onSave}
                    onhandleChange={handleChange}
                    cardTypeListOptions={cardTypeList.map(
                      ({ CreditCardTypeID, Name }, i) => ({
                        key: CreditCardTypeID,
                        value: CreditCardTypeID,
                        label: Name,
                      })
                    )}
                    purchaseTypeListOptions={purchaseTypeList.map(
                      ({ PurchaseTypeID, Name }, i) => ({
                        key: PurchaseTypeID,
                        value: PurchaseTypeID,
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

const InfoCardContent = ({
  id,
  virtualCardDetail,
  onhandleChange,
  onSave,
  cardTypeListOptions,
  currrencyListOptions,
  purchaseTypeListOptions,
}) => {
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (id === "new") {
      setEditMode(true);
    }
  }, []);

  const {   
    CardAlias,
    AccountNumber,
    cardType,
    ValidFor,
    Currency,
    IssuerId,
    purchaseType,
  } = virtualCardDetail;
  
  const onEditHandler = () => {
    setEditMode(!editMode);    
    onSave(id);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    onhandleChange(id, { [name]: value });
  };
  const classes = useStyles();

  const currencyCode = (Currency) => {
    return Currency === "USD" ? "820" : "124";
  };

  return (
    <>
      <CustomDivider />
      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={9}>
          <Typography variant="subtitle1">
            <Box fontWeight={400} fontSize={20} my={1}>
              {CardAlias}
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
            label={"Bank Account Number"}
            value={AccountNumber}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"cardType"}
            label={"Card Type"}
            value={cardType}
            onChangeHandler={handleChange}
            editMode={editMode}
            select={true}
            options={cardTypeListOptions}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"CardAlias"}
            label={"Virtual Card Alias"}
            value={CardAlias}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"ValidFor"}
            label={"Expiry Days"}
            value={ValidFor}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"Currency"}
            label={"Currency"}
            value={Currency}
            onChangeHandler={handleChange}
            editMode={editMode}
            select={true}
            options={currrencyListOptions}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"CurrencyCode"}
            label={"Currency Code"}
            value={currencyCode(Currency)}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"IssuerId"}
            label={"Issuer ID"}
            value={IssuerId}
            onChangeHandler={handleChange}
            editMode={editMode}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInputTextField
            name={"purchaseType"}
            label={"Purchase Type"}
            value={purchaseType}
            onChangeHandler={handleChange}
            editMode={editMode}
            select={true}
            options={purchaseTypeListOptions}
          />
        </Grid>
      </Grid>
    </>
  );
};

const mapStateToProps = ({ companyDetails, common }) => {
  const { virtualCardInfo = {}, error = {} } = companyDetails;
  const { cardTypeList, currrencyList, purchaseTypeList } = common;
  return {
    virtualCardInfo,
    error,
    cardTypeList,
    currrencyList,
    purchaseTypeList,
  };
};

export default connect(mapStateToProps)(VirtualCardInfo);
