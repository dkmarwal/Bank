import React, { useState, useEffect } from "react";
import {
    Grid,    
    makeStyles,    
    Paper,
} from "@material-ui/core";
import CustomSwitch from "../../components/form/CustomSwitch";
import { connect } from "react-redux";
import { getRemittanceConfigInfo, updateRemittanceConfigInfo } from "../../redux/actions/clientConfig";
import MultipleSelect from "../../components/form/multiSelect";

const useStyle = makeStyles({
    paper: {
        padding: "40px",
        margin: "20px",
    },
    title: {
        width: '100%',
        padding: '15px 0',
        margin: '15px 0',
        borderBottom: '1px solid #d8d8d8',
        fontWeight: '600',
        textAlign: 'left',
    },

    formLabel: {
        textAlign: "left",
        marginLeft: "20px",
        marginTop: "10px",
        fontSize: "0.9rem",
    },
});

const RemittanceSetting = ({ dispatch, remittanceConfigInfo, remittanceDeliveryModeList, remittanceFormatList }) => {

    const [remittanceFormat, setRemittanceFormat] = useState([])
    const [remittancedelivery, setRemittancedelivery] = useState([])

    useEffect(() => {
        dispatch(getRemittanceConfigInfo(2));
    }, [remittanceFormatList, remittanceDeliveryModeList]);

    const onChangeHandler = (event) => {
        const { name, type, checked, value } = event.target;
        let newValue = value;
        if (type === "checkbox") {
            newValue = checked ? 1 : 0;
        }
        dispatch(updateRemittanceConfigInfo({ [name]: newValue }));
    }

    const onChangeFileFormat= (value) =>{
        setRemittanceFormat(value);        
    }

    const onChangeDeliveryMode= (value) =>{
        setRemittancedelivery(value);        
    }   
   
    const classes = useStyle();

    const {        
        IsPaymentID,
        IsAmount,
        IsPaymentType,
        IsClientID,
        IsValueDate,
        IsPaymentReference,
        IsInvoiceNo,
        IsInvoiceDate,
        IsInvoiceGrossAmount,        
        IsPurchaseOrder,
        IsAmountPaid,
        IsAdjustmentAmount,
        IsAdjustmentCode } = remittanceConfigInfo;    

    const remittanceFormatOptions = [{ name: "CSV", value: "1" }, { name: "PDF", value: "2" }]
    const remittanceDeliveryOptions = [{ name: "Email", value: "1" }, { name: "Download", value: "2" }]

    return (
        <Paper elevation={3} className={classes.paper}>
            <Grid container direction="row" spacing={3}>
                <Grid item container xs={12} justify="flex-start">
                    <div className={classes.title}>Remittance Configuration</div>
                </Grid>
                <Grid item container xs={12} sm={12} lg={8} justify="flex-start" spacing={3}>
                    <Grid item sm={12} xs={12} lg={6}>
                        <MultipleSelect
                            label={"Remittance Format"}
                            optionsArr={remittanceFormatOptions || []}
                            personName={remittanceFormat}
                            setPersonName={onChangeFileFormat}
                        />
                    </Grid>
                    <Grid item sm={12} xs={12} lg={6}>
                        <MultipleSelect
                            label={"Remittance Delivery Mode"}
                            optionsArr={remittanceDeliveryOptions || []}
                            personName={remittancedelivery}
                            setPersonName={onChangeDeliveryMode }
                        />
                    </Grid>
                </Grid>
                <Grid item container xs={12} justify="flex-start">
                    <div className={classes.title}>Remittance Parameters</div>
                </Grid>
                <Grid container item xs={12} sm={8}>
                    <CustomSwitch id={'IsPaymentID'} name={'IsPaymentID'} label={'Payment ID'} checked={Boolean(IsPaymentID)} onChangeHandler={onChangeHandler} />
                    <CustomSwitch id={'IsAmount'} name={'IsAmount'} label={'Amount'} checked={Boolean(IsAmount)} onChangeHandler={onChangeHandler} />
                    <CustomSwitch id={'IsPaymentType'} name={'IsPaymentType'} label={'Payment Type'} checked={Boolean(IsPaymentType)} onChangeHandler={onChangeHandler} />
                    <CustomSwitch id={'IsClientID'} name={'IsClientID'} label={'Client ID'} checked={Boolean(IsClientID)} onChangeHandler={onChangeHandler} />
                    <CustomSwitch id={'IsValueDate'} name={'IsValueDate'} label={'Value Date'} checked={Boolean(IsValueDate)} onChangeHandler={onChangeHandler} />
                    <CustomSwitch id={'IsPaymentReference'} name={'IsPaymentReference'} label={'Payment Reference'} checked={Boolean(IsPaymentReference)} onChangeHandler={onChangeHandler} />
                    <CustomSwitch id={'IsInvoiceNo'} name={'IsInvoiceNo'} label={'Invoice No'} checked={Boolean(IsInvoiceNo)} onChangeHandler={onChangeHandler} />
                    <CustomSwitch id={'IsInvoiceDate'} name={'IsInvoiceDate'} label={'Invoice Date'} checked={Boolean(IsInvoiceDate)} onChangeHandler={onChangeHandler} />
                    <CustomSwitch id={'IsInvoiceGrossAmount'} name={'IsInvoiceGrossAmount'} label={'Invoice Gross Amount'} checked={Boolean(IsInvoiceGrossAmount)} onChangeHandler={onChangeHandler} />
                    <CustomSwitch id={'IsAmountPaid'} name={'IsAmountPaid'} label={'Amount Paid'} checked={Boolean(IsAmountPaid)} onChangeHandler={onChangeHandler} />
                    <CustomSwitch id={'IsPurchaseOrder'} name={'IsPurchaseOrder'} label={'Purchase Order'} checked={Boolean(IsPurchaseOrder)} onChangeHandler={onChangeHandler} />
                    <CustomSwitch id={'IsAdjustmentAmount'} name={'IsAdjustmentAmount'} label={'Adjustment Amount'} checked={Boolean(IsAdjustmentAmount)} onChangeHandler={onChangeHandler} />
                    <CustomSwitch id={'IsAdjustmentCode'} name={'IsAdjustmentCode'} label={'Adjustment Code'} checked={Boolean(IsAdjustmentCode)} onChangeHandler={onChangeHandler} />
                </Grid>
            </Grid>
        </Paper >
    );
};

const mapStateToProps = ({ clientConfig, common }) => {
    const {
        remittanceConfigInfo = {},
        error = {},
    } = clientConfig;
    const { remittanceDeliveryModeList, remittanceFormatList } = common;
    return { remittanceConfigInfo, error, remittanceDeliveryModeList, remittanceFormatList };
};

export default connect(mapStateToProps)(RemittanceSetting);
