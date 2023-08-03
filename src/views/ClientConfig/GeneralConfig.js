import React from 'react';
import GeneralSetting from '../../modules/Config/GeneralSetting';
import { Grid, Button, makeStyles, Paper } from '@material-ui/core';
import { connect } from 'react-redux';
import { saveGeneralConfigInfo } from '../../redux/actions/clientConfig';

    
const useStyles = makeStyles({
    paper: {
        padding: "40px",
        margin: "20px",
    },
});

const GeneralConfig = ({dispatch}) => {

    const classes = useStyles();

    const onSave = (event) => {
        dispatch(saveGeneralConfigInfo(2));
    }

    return (
        <Paper elevation={3} className={classes.paper}>
            <Grid container xs={12} direction='column' spacing={3}>
                <Grid container xs={12}>
                    <GeneralSetting />
                </Grid>
                <Grid container xs={12} lg ={10} justify='space-around'>
                    <Button variant="contained" color="primary"
                        onClick={onSave}>
                        Save
				</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default connect()(GeneralConfig);
