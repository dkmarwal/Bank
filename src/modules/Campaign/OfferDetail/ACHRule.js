import React from 'react';

import { Box } from '@material-ui/core';

import TextField from '~/components/Forms/TextField';
import CheckboxGroupCampaign from "~/components/Forms/CheckboxGroupCampaign";

import { withStyles } from '@material-ui/styles';
import styles from './styles';

const ACHRule = (props) => {
    const { classes, offerId, offerItem, handleChange, validation} = props;

    const enableACH = offerItem.offerType=='VCA'?true:false;
    return(
        <Box p={1} className={classes.root}>
            <Box display="flex" p={1} mt={1} mb={1} width="95%">
                <Box p={1} pt={5} border={1} >
                    <CheckboxGroupCampaign
                          options={[
                            {
                              label: "On",
                              value: 1,
                            },
                            {
                              label: "Off",
                              value: 0,
                            },
                          ]}
                          disabled={!enableACH}
                          onChange={(value, index, event) => handleChange("achEnabled", event, value, offerId)}
                          selectedOption={offerItem && offerItem.achEnabled || 0}
                        />
                </Box>
                <Box border={1} >
                    <Box p={1}>ACH Limit</Box>
                    <Box p={1} borderTop={1}>
                        {offerItem && offerItem.achEnabled ==1 && enableACH&&<TextField
                            required
                            error={validation && validation.offers && validation.offers[offerId] &&validation.offers[offerId].achLimit}
                            helperText={validation && validation.offers && validation.offers[offerId] &&validation.offers[offerId].achLimit}
                            value={offerItem&& offerItem.achLimit|| ""}
                            name="achLimit"
                            label=""
                            variant="outlined"
                            fullWidth
                            onChange={(event) => handleChange("achLimit", event, "" , offerId)}
                            inputProps={{
                                maxLength:50,
                            }}
                          />
                        }
                    </Box>
                </Box>
                <Box border={1} flexGrow={2}>
                    <Box p={1}>ACH Limit Rule</Box>
                    <Box p={1} borderTop={1}>
                        {offerItem && offerItem.achEnabled ==1 &&enableACH&&<TextField
                            required
                            error={validation && validation.offers && validation.offers[offerId] && validation.offers[offerId].achLimitRule||""}
                            helperText={validation && validation.offers && validation.offers[offerId]&& validation.offers[offerId].achLimitRule||""}
                            value={offerItem&& offerItem.achLimitRule || ""}
                            name="achLimitRule"
                            label=""
                            variant="outlined"
                            fullWidth
                            onChange={(event) => handleChange("achLimitRule", event, "", offerId)}
                            inputProps={{
                                maxLength:50,
                            }}
                          />
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default withStyles(styles)(ACHRule);
