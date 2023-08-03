import React, {Component} from 'react';
import {
    withStyles,
    Box,
} from '@material-ui/core';
import styles from './style';
import SpendAnalysis from './SpendAnalysis.js';
import PayerRiskChart from './PayerRiskChart';
import PayeesEnrollment from './PayeesEnrollment';

class Cards extends Component{
    render(){
        const {classes} = this.props;
        return(
            <>
                <Box className={classes.fullWidth}>
                    <SpendAnalysis {...this.props} />
                </Box>
                <Box className={classes.fullWidth} mt={4}>
                    <PayerRiskChart {...this.props} />
                </Box>
                <Box className={classes.fullWidth} mt={4}>
                    <PayeesEnrollment {...this.props} />
                </Box>
            </>
        )
    }
}

export default withStyles(styles)(Cards);
