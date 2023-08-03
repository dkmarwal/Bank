import React from 'react';

import { Box, Typography, FormGroup, Checkbox, FormControl, Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import { withStyles } from '@material-ui/styles';
import styles from './styles';

const PayerValidation = (props) => {
    const { classes, title, validationList, selectedPayerValidations} = props;

    return(
        <Box p={1} className={classes.root}>
            <Box display="flex" m={2}>
                <Accordion className={classes.accordion}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header">
                      <Box p={1} width="100%" display="flex" justifyContent="flex-start" >
                          <Box pl={2}>
                              <Typography variant="h4" className={classes.heading}> {title}</Typography>
                          </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box alignItems="flex-start" width="100%">
                            <Box p={1} display="flex" width="100%">
                                <Box display="flex" >
                                    <FormControl required error={""} component="fieldset" >
                                        <FormGroup>
                                            {validationList && validationList.map(item => {
                                                const selected = selectedPayerValidations && selectedPayerValidations.indexOf(item.validationTypeId) !==-1 ;
                                                return <Box display="flex" key={item.validationTypeId} justifyContent="flex-start" alignItems="flex-start">
                                                    <Box pt={1}>
                                                        <Checkbox checked={selected} name={item.validationTypeId} />
                                                    </Box>
                                                    <Box pt={2} pl={4}>
                                                        <Typography variant="h3" >{item.validationType}</Typography>
                                                        <Typography variant="subtitle1" style={{paddingTop:"4px"}} >{item.description}</Typography>
                                                    </Box>
                                                </Box>
                                                }
                                            )}
                                            </FormGroup>
                                      </FormControl>
                                </Box>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );
}


export default withStyles(styles)(PayerValidation);
