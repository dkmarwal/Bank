import React, { useEffect } from "react";
import { connect } from 'react-redux';
import {
    Box,
    makeStyles,
    Paper,
} from "@material-ui/core";

const useStyles = makeStyles({
    formLabel: {
        textAlign: "left",
        marginLeft: "20px",
        marginTop: "10px",
        fontSize: "0.9rem",
    },
    paper: {
        padding: "40px",
        marginTop: "20px",
        Backgroundcolor: "#ffffff"
    },
    title: {
        padding: '15px 0',
        marginBottom: '15px',
        borderBottom: '1px solid #d8d8d8',
        fontWeight: '600',
        textAlign: 'left',
    },
    button: {
        padding: '0.25rem 2rem',
        margin: '1rem',
    }
});

const Success = ({ updateOnboardTitle }) => {
    useEffect(()=>{
        updateOnboardTitle('Client Registration Completed ')
    }, [])

    const classes = useStyles();
    return (
        <Box ml={6} mt={2} mr={6}>
            <Paper elevation={3} className={classes.paper}>
                  Activation Code Sent Successfully to the Client. 
            </Paper >
        </Box >
    );
};

export default connect()(Success);
