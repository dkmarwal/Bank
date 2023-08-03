import React, { useEffect } from "react";
import CompanyInfo from "./CompanyInfo";
import ContactInformation from "./ContactInformation";
import BankAccountInfo from "./BankAccountInfo";
import { makeStyles, Paper, Grid } from "@material-ui/core";
import VirtualCardInfo from "./VirtualCardInfo";
import EFTAccountInfo from "./EFTAccountInfo";
import {
  getLocationType,
  getCardTypes,
  getCurrencyList,
  getContactTypeList,
  getPurchaseTypeList,
  getAccountClassifications,
} from "~/redux/actions/common";
import { connect } from "react-redux";

const useStyles = makeStyles({
  paper: {
    padding: "40px",
    margin: "20px",
  },
}
);

function ClientInformation({dispatch}) {

  const classes = useStyles();
  useEffect(()=>{
    dispatch(getLocationType());
    dispatch(getCardTypes());
    dispatch(getCurrencyList());
    dispatch(getContactTypeList());
    dispatch(getPurchaseTypeList());
    dispatch(getAccountClassifications());
  },[])

  return (
    <Paper elevation={3} className={classes.paper} spacing={3}>
      <Grid container direction="row" spacing={3}>
        <Grid item container xs={12} sm={6} lg={4}>
          <Grid container item direction="column">
            <CompanyInfo />
          </Grid>
        </Grid>
        <Grid item container xs={12} sm={6} lg={4}>
          <Grid container item direction="column">
            <ContactInformation />
          </Grid>
        </Grid>
        <Grid item container xs={12} sm={6} lg={4}>
          <Grid container item direction="column">
            <BankAccountInfo />
            <EFTAccountInfo />
            <VirtualCardInfo />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default connect()(ClientInformation);
