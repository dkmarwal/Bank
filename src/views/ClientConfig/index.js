import React, { useEffect } from "react";
import { makeStyles, Paper, Switch } from "@material-ui/core";
import { connect } from "react-redux";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import GeneralConfig from '~/views/ClientConfig/GeneralConfig'
import PaymentConfig from '~/views/ClientConfig/PaymentConfig'
import RemittanceConfig from '~/views/ClientConfig/RemittanceConfig'

const useStyles = makeStyles({
    paper: {
        padding: "40px",
        margin: "20px",
    },
});

function ClientConfig({ dispatch }) {

    useEffect(() => {
        sessionStorage.setItem('clientId', 2);
    }, [])
    const classes = useStyles();

    return (
        <Paper elevation={3} className={classes.paper} spacing={3}>
            <Redirect to='/client/config/general' />
            <BrowserRouter>
                <Switch>
                    <Route exact path='/client/config/general' component={GeneralConfig} />
                    <Route exact path='/client/config/payment' component={PaymentConfig} />
                    <Route exact path='/client/config/remittance' component={RemittanceConfig} />
                </Switch>
            </ BrowserRouter>
        </Paper>
    );
}

export default connect()(ClientConfig);
