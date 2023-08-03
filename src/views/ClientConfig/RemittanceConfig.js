import React, { useEffect } from 'react';
import RemittanceSetting from '../../modules/Config/RemittanceSetting';
import { Grid, Button, makeStyles, Paper } from '@material-ui/core';
import { connect } from 'react-redux';
import { saveRemittanceConfigInfo } from '../../redux/actions/clientConfig';
import { getRemittanceFormatList, getRemittanceDeliveryMode } from '../../redux/actions/common';


const useStyles = makeStyles({
    paper: {
        padding: "40px",
        margin: "20px",
    },
});

const RemittanceConfig = ({ dispatch }) => {

    const classes = useStyles();

    const onSave = (event) => {
        dispatch(saveRemittanceConfigInfo(2));
    }

    useEffect(()=>{
        dispatch(getRemittanceFormatList());
        dispatch(getRemittanceDeliveryMode());
    },[])

    return (
        <Paper elevation={3} className={classes.paper}>
            <Grid container xs={12} direction='column' spacing={3}>
                <Grid container xs={12}>
                    <RemittanceSetting />
                </Grid>
                <Grid container xs={12} lg={10} justify='space-around'>
                    <Button variant="contained" color="primary"
                        onClick={onSave}>
                        Save
            </Button>
                </Grid>
            </Grid>
        </Paper>

    )
}

export default connect()(RemittanceConfig);
