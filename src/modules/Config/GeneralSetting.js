import React, { useEffect } from "react";
import {
    Grid,
    TextField,
    makeStyles
} from "@material-ui/core";
import CustomSwitch from "../../components/form/CustomSwitch";
import { connect } from "react-redux";
import { getGeneralConfigInfo } from "../../redux/actions/clientConfig";
import { updateGeneralConfigInfo } from "../../redux/actions/clientConfig";

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

const GeneralSetting = ({ dispatch, generalConfigInfo }) => {   

    useEffect(() => {
        dispatch(getGeneralConfigInfo(2));
    }, [])
    
    const onChangeHandler = (event) => {        
        const { name, type, checked, value } = event.target;
        var newValue = value;
        if (type === "checkbox") {
            newValue = checked ? 1 : 0;
        }
        dispatch(updateGeneralConfigInfo({ [name]: newValue }));
    };

    const classes = useStyle();

    const {        
        IsAutoApproveFile,
        ReportFileFormat,
        ReconciliationReportTime,
        IsPaymentFileUploadsEnable,        
        PaymentDecisionEngine,
        PaymentExpieryDays,
        HonorDate,
        IsHIPAA,
        IsUpdatesSupplierProfile,
        IsApproveSupplierProfile,
        IsUploadMasterVendorfile,
        IsSupplierPlatformTnC,
        IsSuppliersDualFactorAuthentication,
    } = generalConfigInfo;

    return (
        <Grid container direction="row" spacing={6}>
            <Grid item container xs={12} justify="flex-start">
                <div className={classes.title}>General Configuration</div>
            </Grid>
            <Grid item container xs={12} sm={12} lg={8} justify="flex-start" spacing={3}>
                <Grid item sm={12} xs={12} lg={6}>
                    <TextField name={'ReportFileFormat'} select fullWidth label={'Report File format'}
                        value={ReportFileFormat}
                        SelectProps={{ native: true, }} InputLabelProps={{ shrink: true, }}
                        variant="outlined"
                        onChange={onChangeHandler}
                    >   <option key={'csv'} value={'csv'}>{'csv'}</option>
                        <option key={'excel'} value={'excel'}>{'excel'}</option>
                    </TextField>
                </Grid>
                <Grid item sm={12} xs={12} lg={6}>
                    <TextField name={'ReconciliationReportTime'}
                        fullWidth label={'Reconciliation Report Time'}
                        value={ReconciliationReportTime}
                        InputLabelProps={{ shrink: true, }}
                        onChange={onChangeHandler}
                        variant="outlined"
                    />
                </Grid>
            </Grid>
            <Grid item container xs={12} sm={12} lg={8} justify="flex-start" >
                <CustomSwitch id={'IsAutoApproveFile'} name={'IsAutoApproveFile'} label={'Auto Approval of files'} checked={Boolean(IsAutoApproveFile)} onChangeHandler={onChangeHandler} />
                <CustomSwitch id={'IsPaymentFileUploadsEnable'} name={'IsPaymentFileUploadsEnable'} label={'Enable Payment File Uploads'} checked={Boolean(IsPaymentFileUploadsEnable)} onChangeHandler={onChangeHandler} />
                <CustomSwitch id={'PaymentDecisionEngine'} name={'PaymentDecisionEngine'} label={'Payment Decision Engine'} checked={Boolean(PaymentDecisionEngine)} onChangeHandler={onChangeHandler} />
                <CustomSwitch id={'PaymentExpieryDays'} name={'PaymentExpieryDays'} label={'Payment Expiry days in case of Exceptions'} checked={Boolean(PaymentExpieryDays)} onChangeHandler={onChangeHandler} />
                <CustomSwitch id={'HonorDate'} name={'HonorDate'} label={'Honor Date'} checked={Boolean(HonorDate)} onChangeHandler={onChangeHandler} />
                <CustomSwitch id={'IsHIPAA'} name={'IsHIPAA'} label={'HIPAA Compliance'} checked={Boolean(IsHIPAA)} onChangeHandler={onChangeHandler} />
                <CustomSwitch id={'IsUpdatesSupplierProfile'} name={'IsUpdatesSupplierProfile'} label={'Supplier Profile Updates'} checked={Boolean(IsUpdatesSupplierProfile)} onChangeHandler={onChangeHandler} />
                <CustomSwitch id={'IsApproveSupplierProfile'} name={'IsApproveSupplierProfile'} label={'Supplier Profile Approvals'} checked={Boolean(IsApproveSupplierProfile)} onChangeHandler={onChangeHandler} />
                <CustomSwitch id={'IsUploadMasterVendorfile'} name={'IsUploadMasterVendorfile'} label={'Master vendor file upload'} checked={Boolean(IsUploadMasterVendorfile)} onChangeHandler={onChangeHandler} />
                <CustomSwitch id={'IsSupplierPlatformTnC'} name={'IsSupplierPlatformTnC'} label={'Supplier Platform T&C'} checked={Boolean(IsSupplierPlatformTnC)} onChangeHandler={onChangeHandler} />
                <CustomSwitch id={'IsSuppliersDualFactorAuthentication'} name={'IsSuppliersDualFactorAuthentication'} label={'Dual Factor Authentication by suppliers'} checked={Boolean(IsSuppliersDualFactorAuthentication)} onChangeHandler={onChangeHandler} />
            </Grid>
        </Grid>
    );
};

const mapStateToProps = ({ clientConfig }) => {
    const {
        generalConfigInfo = {},
        error = {},
    } = clientConfig;
    return { generalConfigInfo, error };
};

export default connect(mapStateToProps)(GeneralSetting);

