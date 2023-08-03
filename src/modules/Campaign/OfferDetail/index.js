import React from 'react';

import {Box,Typography,CircularProgress,  Accordion, AccordionSummary, AccordionDetails,  MenuItem } from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import TextField from '~/components/Forms/TextField';
import ACHRule from './ACHRule';
import RuleTable from './RuleTable';

import { withStyles } from '@material-ui/styles';
import styles from './styles';

const OfferDetail = (props) => {
    const { classes, title, offerId, offerItem, currencyList,  offerTypes, addRule, removeRule, 
    handleChange, handleChangeRule, validation, updateProgress, campaignType} = props;
      let offerTypeError = false;
      let acceptanceTextError = false;
      try{
         offerTypeError = validation.offers[offerId].offerType;
      } catch(ex){
          offerTypeError=false;
      }
       try{
         acceptanceTextError = validation.offers[offerId].acceptanceText;
      } catch(ex){
          acceptanceTextError=false;
      }

    return(
        <Box p={1} className={classes.root}>
            <Box display="flex" m={2} >
                <Accordion className={classes.accordion}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id={title}
                    >
                      <Box p={1} width="100%" display="flex" justifyContent="flex-start" >
                          <Box pl={1}>
                              <Typography variant="h4" className={classes.heading}> {title}</Typography>
                          </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box alignItems="flex-start" width="100%">
                            <Box p={1} pt={2} display="flex" width="100%" flexDirection="column">
                                <Box p={1} width="50%">
                                    <TextField
                                        required
                                        error={offerTypeError}
                                        helperText={offerTypeError}
                                        select
                                        value={offerItem && offerItem.offerType || ""}
                                        name="offerType"
                                        label="Select Offer Type"
                                        variant="outlined"
                                        fullWidth
                                        onChange={(event) =>
                                            handleChange("offerType", event, "", offerId)
                                        }
                                        dir="horizontal"
                                      >
                                        {offerTypes ? (
                                          offerTypes.map((option) => (
                                            <MenuItem key={option.name} value={option.name}>
                                              {option.value}
                                            </MenuItem>
                                          ))
                                        ) : (
                                          <Box
                                            width="100px"
                                            display="flex"
                                            mt={1.875}
                                            justifyContent="center"
                                            alignItems="center"
                                          >
                                            <CircularProgress color="primary" />
                                          </Box>
                                        )}
                                      </TextField>
                                </Box>
                                <Box pt={1}>
                                    <Box p={1}>
                                        <Typography variant='h3' color="primary">Enter Acceptance Rules*</Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <RuleTable 
                                            acceptanceRules={offerItem && offerItem.acceptanceRules || []}
                                            offerId={offerId}
                                            offerItem={offerItem}
                                            currencyList={currencyList}
                                            addRule={addRule}
                                            removeRule={removeRule} 
                                            validation={validation}
                                            handleChange = {handleChangeRule} 
                                            updateProgress = {updateProgress}
                                            campaignType   = {campaignType}
                                    />
                                </Box>
                                <Box>
                                    <ACHRule 
                                        offerId={offerId}
                                        offerItem={offerItem}
                                        achEnabled={offerItem && offerItem.achEnabled || 0}
                                        validation={validation}
                                        handleChange={handleChange}
                                    />
                                </Box>
                                <Box pt={1}>
                                    <Box p={1}>
                                        <Typography variant='h3' color="primary">Enter Acceptance Text*</Typography>
                                    </Box>
                                </Box>
                                <Box width="95%" p={1}>
                                    <TextField
                                        required
                                        multiline
                                        rowsMax={2}
                                        error={acceptanceTextError}
                                        helperText={acceptanceTextError}
                                        value={offerItem && offerItem.acceptanceText || ""}
                                        name="acceptanceText"
                                        label=""
                                        variant="outlined"
                                        fullWidth
                                        onChange={(event) => handleChange("acceptanceText", event, "", offerId)}
                                        inputProps={{
                                            maxLength:200,
                                        }}
                                      />
                                </Box>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );
}

export default withStyles(styles)(OfferDetail);