import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from "~/components/Forms/Checkbox";
import { withStyles } from '@material-ui/styles';
import styles from '../styles';

const ParameterSelector = (props) => {
    const { paymentParameterList, selectedPaymentParameters, classes, title, handleChange } = props;

    const parameterList = paymentParameterList && paymentParameterList.map((item, index) => {
        return { id: item.parameterId, label: item.parameterName, selected: (selectedPaymentParameters.length > 0 && 
            selectedPaymentParameters.indexOf(item.parameterId) !== -1) ? true : false };
    }) || [];

    return (
        <Box p={1} display="flex" justifyContent="flex-start" className={classes.root}>
            <Accordion className={classes.accordion}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Box p={1} width="100%" display="flex" justifyContent="flex-start" >
                        <Box pl={1}>
                            <Typography variant="h4" className={classes.heading}>{title}</Typography>
                        </Box>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box alignItems="center" width="100%">
                        <Box display="flex" justifyContent="center" width="100%" flexWrap="wrap">
                            {parameterList && parameterList.map((item, index) => {
                                return <Box p={1} pb={2} width="30%">
                                    <Checkbox
                                        onChange={(event, index, checked) => handleChange("paymentParameter", event, item.id, checked)}
                                        label={item.label}
                                        checked={item.selected}
                                        index={index}
                                    />
                                </Box>
                            })
                            }
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

export default withStyles(styles)(ParameterSelector);
