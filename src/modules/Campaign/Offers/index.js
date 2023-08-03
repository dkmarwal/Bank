import React from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";

import AddIcon from '@material-ui/icons/Add';

import DeleteIcon from '@material-ui/icons/Delete';

import OfferDetail from "~/modules/Campaign/OfferDetail/";
import TextField from "~/components/Forms/TextField";

import { withStyles } from '@material-ui/styles';
import styles from './styles';

const OfferInfo = (props) => {
  const {
    classes, 
    introText,
    currencyList,
    offerList,
    offerTypes,
    acceptanceRules,
    handleChange,
    handleChangeRule,
    addOffer,
    removeOffer,
    addRule,
    removeRule,
    onSubmit,
    onBack,
    updateProgress,
    validation,
    dataInfo,
  } = props;
    let canAddOffer = true;
    if(dataInfo && dataInfo.campaignType=='ACH' && offerList && offerList.length>0){
        canAddOffer=false;
    }
    if(dataInfo && dataInfo.campaignType=='VCA' && offerList && offerList.length>4){
        canAddOffer=false;
    }
    //Changes:FSINPAYB2B-5723
    if(dataInfo && dataInfo.campaignType=='ENROLL_ONLY'&& offerList && offerList.length>1){
        canAddOffer=false;
    }

    let newOfferTypes = [...offerTypes];
    //If campaignType is ACH then show only ACH offer type
    if(dataInfo && dataInfo.campaignType=='ACH'){
        newOfferTypes = offerTypes && offerTypes.filter(item => item.name != 'VCA');
    }

  return (
      <Grid container direction="horizontal" xs={12} sm={12} >
         <Paper elevation={3} square className={classes.paper}>
            <Grid item container justify="flex-start">
                <Grid item xs={12} sm={12} >
                    <Box p={4}>
                        <Typography variant='h1'>Offers & Details</Typography>
                    </Box>
                </Grid>
                <Grid item xs={8} sm={8}>
                    {<Box display="flex" p={1} pl={4} width="100%" justifyContent="flex-start"  flexDirection="column" >
                        <Box pb={1}>
                            <Typography variant='h3' color="primary">Enter Introduction Text*</Typography>
                        </Box>
                        <TextField
                            required
                            multiline
                            rowsMax={2}
                            error={validation.introText}
                            helperText={validation.introText}
                            value={introText || ""}
                            name="introText"
                            label=""
                            variant="outlined"
                            fullWidth
                            onChange={(event) => handleChange("introText", event)}
                            inputProps={{
                                maxLength:200,
                            }}
                          />
                    </Box>
                    }
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Box display="flex" p={1} pl={2} width="95%" justifyContent="flex-start"  flexDirection="column" >
                        {offerList && offerList.map((offer, index) => {

                            return <Box display="flex" alignContent="flex-start" width="98%">
                                <OfferDetail
                                    key={index}
                                    offerId={index}
                                    title={`Offer ${index+1}`}
                                    offerItem   = {offer}
                                    acceptanceRules = {acceptanceRules}
                                    currencyList    = {currencyList}
                                    offerList      = {offerList}
                                    offerTypes    = {newOfferTypes}
                                    addRule       = {addRule}
                                    removeRule    = {removeRule}
                                    handleChange  = {handleChange}
                                    handleChangeRule  = {handleChangeRule}
                                    validation    = {validation}
                                    updateProgress = {updateProgress}
                                    campaignType={dataInfo.campaignType || ""}
                                />
                                <Box pt={2} width="2%">
                                    {index !==0 && <Button color="primary" aria-label="Delete Offer" title="Delete Offer"
                                        component="span" className={classes.smallBtn}
                                        onClick ={(event)=> removeOffer(event, index)}
                                    >
                                        <DeleteIcon size="small" className={classes.smallIcon} />
                                        <Typography variant='h6' className={classes.iconText}>
                                            Delete
                                        </Typography>
                                    </Button>
                                    }
                                </Box>
                            </Box>
                        })
                    }
                    </Box>
                    {canAddOffer && <Box display="flex" p={1} pl={4}>
                        <Button variant="outlined" color="primary"
                            component="span"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={()=> addOffer()}
                            >
                            ADD ANOTHER OFFER
                        </Button>
                    </Box>
                    }
                </Grid>
            </Grid>
            <Grid item container xs={12} justify="center">
                <Box display="flex" mb={5} mt={3} justifyContent="space-between">
                    <Button variant="outlined" color="primary" onClick={()=> onBack(1)} >
                       Back
                    </Button>
                    {updateProgress ? (
                      <CircularProgress color="primary" />
                    ) : (
                        <Button variant="contained" style={{ marginLeft: "30px" }} color="primary" onClick={()=> onSubmit()} >
                            SAVE & LAUNCH
                        </Button>
                      )}
                </Box>
            </Grid>
        </Paper>
      </Grid>
  );
};

export default withStyles(styles)(OfferInfo);
