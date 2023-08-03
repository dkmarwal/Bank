import React from 'react';

import { Paper,  Box,  Button,
  TableContainer, TableHead, Table, TableRow, TableBody, TableCell, TableFooter,
  CircularProgress,  MenuItem
  } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import TextField from '~/components/Forms/TextField';

import { withStyles } from '@material-ui/styles';
import styles from './styles';

const OfferDetail = (props) => {
    const { classes, campaignType, offerId, acceptanceRules, currencyList, addRule, removeRule, handleChange, validation} = props;

    return(
        <Box p={1} className={classes.root}>
            <Box p={1} display="flex" width="95%">
                <TableContainer component={Paper}>
                      <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Amount From</TableCell>
                            <TableCell align="center">Amount To</TableCell>
                            <TableCell align="center">Currency</TableCell>
                            <TableCell align="center">Terms</TableCell>
                            <TableCell align="center">Rules</TableCell>
                            <TableCell align="center" ></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {acceptanceRules && acceptanceRules.map((row, index) => {
                              let amountFromError = false;
                              let amountToError = false;
                              let currencyError = false;
                              let termError = false;
                              let ruleError = false;
                              try{
                                 if(validation.offers[offerId].acceptanceRules[index].amountFrom) {
                                     amountFromError = validation.offers[offerId].acceptanceRules[index].amountFrom;
                                 }
                              } catch(ex){
                                  amountFromError=false;
                              }

                              try{
                                 if(validation.offers[offerId].acceptanceRules[index].amountTo) {
                                     amountToError = validation.offers[offerId].acceptanceRules[index].amountTo;
                                 }
                              } catch(ex){
                                  amountToError=false;
                              }
                              try{
                                 if(validation.offers[offerId].acceptanceRules[index].currency) {
                                     currencyError = validation.offers[offerId].acceptanceRules[index].currency;
                                 }
                              } catch(ex){
                                  currencyError=false;
                              }
                              try{
                                 if(validation.offers[offerId].acceptanceRules[index].term) {
                                     termError = validation.offers[offerId].acceptanceRules[index].term;
                                 }
                              } catch(ex){
                                  termError=false;
                              }
                              try{
                                 if(validation.offers[offerId].acceptanceRules[index].rule) {
                                     ruleError = validation.offers[offerId].acceptanceRules[index].rule;
                                 }
                              } catch(ex){
                                  ruleError=false;
                              }

                            return <TableRow key={row.name}>
                              <TableCell scope="row">
                                 <Box p={1}>
                                    <TextField
                                        required
                                        error={amountFromError}
                                        helperText={amountFromError}
                                        value={row.amountFrom || ""}
                                        name="amountFrom"
                                        label=""
                                        variant="outlined"
                                        fullWidth
                                        onChange={(event) => handleChange("amountFrom", event, offerId , index)}
                                        inputProps={{
                                            maxLength:10,
                                        }}
                                      />
                                  </Box>
                              </TableCell>
                              <TableCell align="center">
                                  <Box p={1}>
                                      <TextField
                                        required
                                        error={amountToError}
                                        helperText={amountToError}
                                        value={row.amountTo || ""}
                                        name="amountTo"
                                        label=""
                                        variant="outlined"
                                        fullWidth
                                        onChange={(event) => handleChange("amountTo", event, offerId , index)}
                                        inputProps={{
                                            maxLength:10,
                                        }}
                                      />
                                  </Box>
                              </TableCell>
                              <TableCell align="center">
                                   <TextField
                                        required
                                        error={currencyError}
                                        helperText={currencyError}
                                        select
                                        value={row.currency || ""}
                                        name="currency"
                                        label=""
                                        variant="outlined"
                                        fullWidth
                                        onChange={(event) =>
                                            handleChange("currency", event, offerId , index)
                                        }
                                        dir="horizontal"
                                      >
                                        {currencyList ? (
                                          currencyList.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                              {option.label}
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

                              </TableCell>
                              <TableCell align="center">
                                  <Box p={1}>
                                     <TextField
                                        required
                                        error={termError}
                                        helperText={termError}
                                        value={row.term || ""}
                                        name="term"
                                        label=""
                                        variant="outlined"
                                        fullWidth
                                        onChange={(event) => handleChange("term", event, offerId , index)}
                                        inputProps={{
                                            maxLength:8,
                                        }}
                                      />
                                  </Box>
                              </TableCell>
                              <TableCell align="center">
                                  <Box p={1}>
                                     <TextField
                                        required
                                        error={ruleError}
                                        helperText={ruleError}
                                        value={row.rule || ""}
                                        name="rule"
                                        label=""
                                        variant="outlined"
                                        fullWidth
                                        onChange={(event) => handleChange("rule", event, offerId , index)}
                                        inputProps={{
                                            maxLength:500,
                                        }}
                                      />
                                      </Box>
                              </TableCell>
                              <TableCell align="right" >
                              {(index !==0 || campaignType.trim() == 'ENROLL_ONLY') && <Button color="primary" aria-label="Delete Rule" title="Delete Rule" 
                                        component="span" className={classes.smallBtn}
                                        onClick ={(event)=> removeRule(event, offerId, index)}
                                    >
                                        <DeleteOutlineIcon size="small" className={classes.smallIcon} />
                                    </Button>
                              }
                              </TableCell>
                            </TableRow>
                          })}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Button variant="outlined" color="primary" 
                                        component="span"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={(event)=>addRule(event, offerId)}
                                        >
                                        ADD ANOTHER RULE
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                      </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default withStyles(styles)(OfferDetail);