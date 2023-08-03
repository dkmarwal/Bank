import React from 'react';
import {
    Box,
    Typography, IconButton,
    CircularProgress, MenuItem
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import TextField from '~/components/Forms/TextField';
import { withStyles } from '@material-ui/styles';
import styles from '../styles';

const ReportOptions = (props) => {
    const { isSubscriber = false, emailSubscriptionFrequency, subscriptionFrequencyList, classes,
        handleChange, handleDownload, isReportDownloadEnabled, isReportSubscribeEnabled, downloadProgress } = props;

    return (
        <Box display="flex" className={classes.root} width="100%" flexDirection="column">
            {isReportDownloadEnabled && <Box p={1} display="flex" justifyContent="flex-start">
                {downloadProgress ? (
                    <CircularProgress color="primary" />
                ) : (
                    <IconButton color="primary" aria-label="Download" title="Download"
                        component="span" className={classes.smallBtn} onClick={(e) => handleDownload(e)}
                    >
                        <GetAppIcon size="small" className={classes.smallIcon} />
                        <Typography variant='h6' className={classes.iconText}>
                            DOWNLOAD
                        </Typography>
                    </IconButton>
                )
                }
            </Box>}
            {isReportSubscribeEnabled && <Box p={1} display="flex" justifyContent="flex-start">
                <IconButton color="primary" aria-label={isSubscriber == true ? "SUBSCRIBE" : "UNSUBSCRIBE"} title={isSubscriber == true ? "SUBSCRIBE" : "UNSUBSCRIBE"}
                    component="span" className={classes.smallBtn}
                    onClick={(event) => handleChange("isSubscriber", event)}
                >
                    {isSubscriber == true ? <RemoveCircleOutlineIcon size="small" className={classes.smallIcon} /> : <AddCircleOutlineIcon size="small" className={classes.smallIcon} />}
                    <Typography variant='h6' className={classes.iconText} >
                        {isSubscriber == true ? "UNSUBSCRIBE" : "SUBSCRIBE"}
                    </Typography>
                </IconButton>
            </Box>}
            {isSubscriber == 1 &&
                <Box p={1} justifyContent="flex-start" width="300px">
                    <TextField
                        label="Email Subscription Frequency"
                        fullWidth={true}
                        select
                        value={emailSubscriptionFrequency || ""}
                        autoComplete="off"
                        variant="outlined"
                        name="emailSubscriptionFrequency"
                        onChange={(event) => handleChange("emailSubscriptionFrequency", event)}
                    >
                        {subscriptionFrequencyList ? subscriptionFrequencyList.map(option => (
                            <MenuItem key={option.subscriptionTypeId} value={option.subscriptionTypeId}>
                                {option.description}
                            </MenuItem>
                        )) :
                            (
                                <Box width="100px" display="flex" mt={1.875} justifyContent="center" alignItems="center"><CircularProgress color="primary" /></Box>
                            )
                        }
                    </TextField>
                </Box>
            }

        </Box>
    );
}

export default withStyles(styles)(ReportOptions);
