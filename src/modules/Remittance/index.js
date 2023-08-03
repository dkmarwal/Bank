import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import {
    Grid,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Box
} from "@material-ui/core";

import "./styles.scss";
import Style from './styles'
import PromptImport from '../../components/Dialogs/PromptImport';
import GridBoxSelect from '../../components/Forms/GridBoxSelect';
import { withStyles } from '@material-ui/styles';
import {
    getRemittanceParams, updateRemittanceParams, getRemittanceConfigRule, updateRemittanceConfig, getClientRemConfig, postClientMailCall,
    getRemittanceSettingShow, updateRemittanceSettingShow, getCSVSelected
} from "~/redux/helpers/remittance";
import { getClientDataActivated } from "~/redux/actions/clients";
import SimpleDialog from "~/components/Model/SimpleDialog";
import 'react-notifications/lib/notifications.css';
import CheckboxGroup from "~/components/Forms/CheckboxGroup";
import Notification from "~/components/Notification";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const Remittance = ({ history, updateOnboardingStep, classes }) => {
    const [configLoading, setConfigLoading] = useState(false);
    const [clientId, setClientId] = useState(sessionStorage.getItem("clientId"));
    const [email, setEmail] = useState(null);
    const [parentId, setParentId] = useState(null);
    const [remittanceConfig, setRemittanceConfig] = useState([]);
    const [clientRemittanceConfig, setClientRemittanceConfig] = useState({});
    const [isBulkRemittance, setBulkRemittances] = useState(0);
    const [isCSVSelected, setIsCSVSelected] = useState(false);
    const [mapDeliveryFormat, setMapDeliveryFormat] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [showRemittance, setShowRemittance] = useState(1);

    const [remittanceParams, setRemittanceParams] = useState({
        "clientId": clientId,
        "isClientId": 1,
        "isPaymentId": 1,
        "isAmount": 1,
        "isPaymentType": 1,
        "isValueDate": 1,
        "isPaymentReference": 1,
        "isInvoiceNo": 1,
        "isInvoiceDate": 1,
        "isInvoiceGrossAmount": 1,
        "isPurchaseOrder": 1,
        "isAmountPaid": 1,
        "isDiscountAmount": 1,
        "isAdjustmentAmount": 1,
        "isAdjustmentCode": 1,
        "isClientName": 1,
        "isRemitToId": 1,
        "isPayeeName": 1,
        "isAchCompanyName": 1,
        "isCurrencyCode":1
    });
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);

    useEffect(() => {
        updateOnboardingStep(6);
        const clientId = sessionStorage.getItem("clientId");
        fetchClientInformation(clientId);
        fetchRemitConfigRule(clientId);
        fetchCSVSelectedClient(clientId);
        fetchClientRemConfig(clientId);
        fetchRemittanceSettingShow(clientId);
    }, []);

    const fetchRemittanceSettingShow = (id) => {
        getRemittanceSettingShow(id).then((response) => {
            setShowRemittance(response.data === 1 ? 0 : 1);
            if (response.data) {
                fetchClientRemittanceParams(id);
            }
        });
    };

    const fetchClientInformation = async (clientId) => {
        const clientData = await getClientDataActivated(clientId);
        const { data = {} } = clientData;
        let parentId = null;
        let clientEmail = null;
        if (data.rows && data.rows[0]) {
            parentId = data.rows[0].parentId;
            clientEmail = data.rows[0].emailAddress;
        }
        setParentId(parentId);
        setClientId(clientId);
        setEmail(clientEmail);
    }

    const fetchCSVSelectedClient = async (id) => {
        setConfigLoading(true);
        try {
            const resp = await getCSVSelected(id);
            if (resp) {
                const { data, error, message } = resp;
                if (error) {
                    setAlertMessage(message || 'Server Response Error');
                    setAlertType("error");
                    return
                } else if (data) {
                    setIsCSVSelected(data);
                }
            } else {
                setAlertMessage('Server Error');
                setAlertType("error");
            }
            setConfigLoading(false);
        } catch (error) {
            setConfigLoading(false);
            setAlertMessage('Server Error');
            setAlertType("error");
        }
    }

    const fetchRemitConfigRule = async (id) => {
        setConfigLoading(true);
        try {
            const resp = await getRemittanceConfigRule(id);
            if (resp) {
                const { data, error, message } = resp;
                if (error) {
                    setAlertMessage(message || 'Server Response Error');
                    setAlertType("error");
                    return
                } else if (data) {
                    setRemittanceConfig(data);
                    // set Mapping for delivery Formats
                    const mapformat = data.reduce(
                        (obj, { rmtDeliveryOptionId, deliveryOptionId }) => {
                            const formatIds = Array.isArray(deliveryOptionId)
                                && deliveryOptionId.map(({ formatId }) => formatId);
                            obj[rmtDeliveryOptionId] = formatIds
                            return obj
                        }, {}
                    );
                    setMapDeliveryFormat(mapformat);
                }
            } else {
                setAlertMessage('Server Error');
                setAlertType("error");
            }
            setConfigLoading(false);
        } catch (error) {
            setConfigLoading(false);
            setAlertMessage('Server Error');
            setAlertType("error");
        }
    }

    const fetchClientRemConfig = async (paramClientId) => {

        try {
            const resp = await getClientRemConfig(parseInt(paramClientId));
            if (resp) {
                const { data, error, message } = resp;
                if (error) {
                    setAlertMessage(message || 'Server Response Error');
                    setAlertType("error");
                    return
                } else if (data) {
                    const clientRemitConfig = data && Array.isArray(data.remittanceDetails)
                        && data.remittanceDetails.reduce(
                            (obj, { rmtDeliveryOptionId, remittanceFormats }) => {
                                obj[rmtDeliveryOptionId] = Array.isArray(remittanceFormats) && remittanceFormats.map(({ formatId }) => formatId);
                                return obj;
                            }, {}
                        );

                    setClientRemittanceConfig(clientRemitConfig);
                    setBulkRemittances(data && typeof data.isBulkRemittance === 'undefined'? 1
                    : data.isBulkRemittance );
                }
            } else {
                setAlertMessage('Server Error');
                setAlertType("error");
            }
        } catch (error) {
            setAlertMessage('Client Error');
            setAlertType("error");
        }
    }

    const fetchClientRemittanceParams = async (paramClientId) => {
        try {
            const resp = await getRemittanceParams(parseInt(paramClientId));
            if (resp !== undefined && resp) {
                const { data: { data, error } } = await resp;
                if (!error) {
                    data.rows && setRemittanceParams({ ...remittanceParams, ...data.rows[0], clientId });
                }
            }
        } catch (error) {
        }
    }

    const updateClientRemitParam = async () => {
        try {
            // if (Object.keys(remittanceParams).some((key, value) =>
            //     [
            //         "isClientId",
            //         "isPaymentId",
            //         "isAmount",
            //         "isPaymentType",
            //         "isValueDate",
            //         "isPaymentReference",
            //         "isInvoiceNo",
            //         "isInvoiceDate",
            //         "isInvoiceGrossAmount",
            //         "isPurchaseOrder",
            //         "isAmountPaid",
            //         "isDiscountAmount",
            //         "isAdjustmentAmount",
            //         "isAdjustmentCode",
            //         "isClientName",
            //         "isRemitToId", "isPayeeName", "isAchCompanyName"
            //     ].includes(key) && remittanceParams[key]
            // )) {
            const resp = await updateRemittanceParams(remittanceParams);
            if (resp !== undefined && resp) {
                const { data: { error, message } } = await resp;
                if (!error) {
                    return true;
                } else {
                    setAlertMessage(message || 'Server Error');
                    setAlertType("error");
                }
            }
            // } else {
            //     setAlertMessage('Please select a Remittance Parameter');
            //     setAlertType("error");
            // }
        } catch (error) {
            setAlertMessage('Server Error');
            setAlertType("error");
            return false;

        }
    }

    const updateClientRemitConfig = async (remittanceDetails) => {
        try {
            if (remittanceDetails && remittanceDetails.length) {
                const data = {
                    remittanceDetails: remittanceDetails,
                    isBulkRemittance: isBulkRemittance
                }


                const resp = await updateRemittanceConfig(clientId, data);
                if (resp !== undefined && resp) {
                    const { data: { data, error } } = await resp;
                    if (!error) {
                        return true;
                    } else {
                        setAlertMessage("Server Error");
                        setAlertType("error");
                    }
                }
            } else {
                setAlertMessage("Please select a Remittance Format");
                setAlertType("error");
            }
        } catch (error) {
            setAlertMessage("Server Error");
            setAlertType("error");
            return false;
        }
    }

    const onChangeFormat = (deliveryId, name, checked) => {

        const newFormats = [...new Set([...(clientRemittanceConfig[deliveryId] || []), name])];
        if (checked) {
            setClientRemittanceConfig({
                ...clientRemittanceConfig,
                [deliveryId]: newFormats
            })
        } else {
            const restArr = clientRemittanceConfig[deliveryId].filter(formatId => formatId !== parseInt(name));
            setClientRemittanceConfig({
                ...clientRemittanceConfig,
                [deliveryId]: restArr
            })
        }
    };

    const onChangeDelivery = (name, checked, event) => {
        let selectedFormat = [];
        if (checked) {
            selectedFormat = [...new Set([...(clientRemittanceConfig[name] || []), ...mapDeliveryFormat[name]])];
        }
        setClientRemittanceConfig({
            ...clientRemittanceConfig,
            [name]: selectedFormat
        })
    };

    const onChangeBulkRemit = (selectedValue) => {
        setBulkRemittances(selectedValue.value);
    }

    const onChangeParameter = (name, checked, event) => {
        const newValue = checked ? 1 : 0;
        setRemittanceParams({ ...remittanceParams, [name]: parseInt(newValue) });
    };

    const importParentPermissions = async () => {
        try {
            if (parentId) {
                fetchClientRemittanceParams(parentId);
                fetchClientRemConfig(parentId);
            };
        } catch (error) {
        }
    }

    const onNext = async () => {
        try {
            const remittanceDetails = Object.keys(clientRemittanceConfig).filter((key) => clientRemittanceConfig[key] && clientRemittanceConfig[key].length > 0)
                .reduce(
                    (arr, key) => {
                        arr.push({
                            deliveryModeId: key,
                            formatIds: clientRemittanceConfig[key]
                        })
                        return arr;
                    }, []
                );

            if (!showRemittance) {
                if (remittanceDetails && remittanceDetails.length) {
                } else {
                    setAlertMessage('Please select a Remittance delivery format');
                    setAlertType('error');
                    return false;
                }
            }

            const saveRemittanceSettings = await updateRemittanceSettingShow({
                clientId,
                isRemittanceRequired: showRemittance ? 0 : 1,
            });
            if (saveRemittanceSettings) {
                const paramConfigResponse = !showRemittance
                    ? await updateClientRemitParam()
                    : true;
                const configResponse = !showRemittance
                    ? await updateClientRemitConfig(remittanceDetails)
                    : true;
                if (configResponse && paramConfigResponse && saveRemittanceSettings) {
                    setOpenModal(!openModal);
                }
            }
            else {
                setAlertMessage('Something went wrong!');
                setAlertType('error');
            }
        } catch (error) {
            setAlertMessage("Something went wrong!");
            setAlertType("error");
        }
    };

    const onBack = async () => {
        history.push({
            pathname: "/clientOnboard/fileSettings",
        });
    };
    // Modal Variable and Event Hanlders
    const { isPayeeChoicePortal } = this.props.user;
    const title = isPayeeChoicePortal ? 'Onboarding is completed successfully':'Onboarding is completed Successfully';
    const subtitle = "";


    const cancelMOdalOperation = () => {
        setOpenModal(!openModal);
        history.push("/clients");
        postClientMail();
    }
    const postClientMail = async () => {
        const data = {
            "email": email,
            "dynamicData": {
                "user_name": "System Action"
            },
            "portalTypeId": 1,
            "portalProfileId": clientId
        }
        await postClientMailCall(data);
    }
    const onCloseModal = () => {
        setOpenModal(!openModal);
    }

    const modalActions = [
        { label: 'OK', onClickHandler: cancelMOdalOperation, variant: "outlined" },
    ]

    const {
        isPaymentId,
        isPaymentType,
        isClientId,
        isValueDate,
        isPaymentReference,
        isInvoiceNo,
        isInvoiceDate,
        isInvoiceGrossAmount,
        isDiscountAmount,
        isPurchaseOrder,
        isAmount,
        isAmountPaid,
        isAdjustmentAmount,
        isAdjustmentCode,
        isClientName,
        isRemitToId, isPayeeName, isAchCompanyName,isCurrencyCode
    } = remittanceParams
    const renderSnackbar = (type, message) => {
        return <Notification variant={type} message={message} handleClose={hideAlertMessage} />
    }

    const hideAlertMessage = () => {
        setAlertMessage(null);
        setAlertType(null);
    }
    return (
        <React.Fragment>
            <Paper className={classes.paperBg} display="flex" >
                {parentId && <PromptImport
                    promptText="We noticed that client's parent company is registered with us. Would you like to import Remittance Settings?"
                    importCb={importParentPermissions}
                />}
                <Box className={classes.gridBox} p={3}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography className={classes.genralTitle}>
                                Enable Remittances setup?
                            </Typography>
                        </Grid>
                        <Box my={2}>
                            <ToggleButtonGroup
                                className={classes.remittanceBtnGroup}
                                value={showRemittance}
                                exclusive
                                onChange={(e, value) => {
                                    setShowRemittance(value);
                                }}
                            >
                                <ToggleButton
                                    value={0}
                                >
                                    {showRemittance === 0 &&
                                        <CheckCircleIcon fontSize="small" className={classes.checkedIcon} />
                                    }
                                    Yes
                                </ToggleButton>
                                <ToggleButton
                                    value={1}
                                >
                                    {showRemittance === 1 &&
                                        <CheckCircleIcon fontSize="small" className={classes.checkedIcon} />
                                    }
                                    No
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Grid>
                    {!showRemittance ?
                        <Grid container className={classes.gridTypesWraper} spacing={5}>
                            <Grid item xs={12} ><Typography className={classes.required}>* These fields are required</Typography></Grid>
                            {!isCSVSelected && <Grid container item xs={12} spacing={3}>
                                <Grid container item xs={12}><Typography className={classes.genralTitleBold}>Remittance Delivery Mode*</Typography></Grid>
                                <Grid container item spacing={2}>
                                    {remittanceConfig.map(
                                        ({ rmtDeliveryOptionId, description }) => {
                                            let checked = false;
                                            if (Array.isArray(clientRemittanceConfig[rmtDeliveryOptionId])) {
                                                checked = clientRemittanceConfig[rmtDeliveryOptionId].length > 0
                                            }
                                            return (
                                                <Grid key={rmtDeliveryOptionId} item xs={12} sm={6} md={3} className={classes.remitModeBox}>
                                                    <GridBoxSelect name={rmtDeliveryOptionId} label={description}
                                                        checked={checked}
                                                        onChange={onChangeDelivery}
                                                    />
                                                </Grid>)
                                        }
                                    )}
                                </Grid>
                            </Grid>}
                            <Grid container item xs={12} spacing={5}>
                                <Grid container item xs={12}><Typography className={classes.genralTitleBold}>Remittance Format*</Typography></Grid>
                                <Grid container item spacing={3}>
                                    {remittanceConfig.filter(({ rmtDeliveryOptionId }) => [1, 2].includes(rmtDeliveryOptionId))
                                        .map(
                                            ({ rmtDeliveryOptionId, deliveryOptionId, description }) =>
                                            (
                                                <>
                                                    <Grid item xs={12}><Typography>{description}</Typography></Grid>
                                                    <Grid container item spacing={2}>
                                                        {configLoading ? <Box align="center" width="100%">
                                                            <CircularProgress color="primary" />
                                                        </Box> :
                                                            (deliveryOptionId.map(({ formatId, description }) => {
                                                                let checked = clientRemittanceConfig[rmtDeliveryOptionId]
                                                                    && clientRemittanceConfig[rmtDeliveryOptionId].includes(formatId)
                                                                return (
                                                                    <Grid key={formatId} item xs={12} sm={6} md={3}>
                                                                        <GridBoxSelect name={formatId} label={description}
                                                                            checked={checked}
                                                                            onChange={(name, checked, event) => onChangeFormat(rmtDeliveryOptionId, name, checked)} />
                                                                    </Grid>)
                                                            }))}
                                                    </Grid>
                                                </>
                                            )
                                        )
                                    }
                                </Grid>
                                {!isCSVSelected && <Grid item={12}><Typography variant='subtitle'>Note - Remittance format for CTX & VAN will be EDI only</Typography></Grid>}
                            </Grid>
                            {!isCSVSelected && <Grid container item xs={12} spacing={3}>
                                <Grid container item xs={12}><Typography className={classes.genralTitleBold}>Bulk Remittances </Typography></Grid>
                                <Grid container item >
                                    <Grid item xs={12} sm={6} md={3}>
                                        <CheckboxGroup
                                            options={[
                                                {
                                                    label: "Yes",
                                                    value: 1,
                                                },
                                                {
                                                    label: "No",
                                                    value: 0,
                                                },
                                            ]}
                                            onChange={onChangeBulkRemit}
                                            selectedOption={isBulkRemittance}
                                        />
                                        {/* <GridBoxSelect name={'isBulkRemittance'} label={'Yes'}
                                        checked={Boolean(isBulkRemittance)} onChange={onChangeBulkRemit} /> */}
                                    </Grid>
                                </Grid>
                            </Grid>}
                            {isCSVSelected ? 
                            <Grid container item xs={12} spacing={3}>
                                <Grid container item xs={12}> <Typography className={classes.genralTitleBold}>Select Remittance Parameters </Typography></Grid>
                                <Grid container item spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isAmount"} label={"Amount"} checked={Boolean(isAmount)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isInvoiceDate"} label={"Invoice Date"} checked={Boolean(isInvoiceDate)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isInvoiceNo"} label={"Invoice Number"} checked={Boolean(isInvoiceNo)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isPurchaseOrder"} label={"Purchase Order"} checked={Boolean(isPurchaseOrder)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isCurrencyCode"} label={"Currency Code"} checked={Boolean(isCurrencyCode)} onChange={onChangeParameter} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            : 
                            <Grid container item xs={12} spacing={3}>
                                <Grid container item xs={12}> <Typography className={classes.genralTitleBold}>Select Remittance Parameters </Typography></Grid>
                                <Grid container item spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isPaymentId"} label={"Payment ID"} checked={Boolean(isPaymentId)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isPaymentType"} label={"Payment Type"} checked={Boolean(isPaymentType)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isAmount"} label={"Amount"} checked={Boolean(isAmount)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isClientId"} label={'Client ID'} checked={Boolean(isClientId)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isInvoiceDate"} label={"Invoice Date"} checked={Boolean(isInvoiceDate)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isInvoiceNo"} label={"Invoice Number"} checked={Boolean(isInvoiceNo)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isPaymentReference"} label={"Payment Reference"} checked={Boolean(isPaymentReference)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isInvoiceGrossAmount"} 
                                            label={"Invoice Gross Amount"} checked={Boolean(isInvoiceGrossAmount)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isValueDate"} label={"Value Date"} checked={Boolean(isValueDate)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isAmountPaid"} label={"Amount Paid"} checked={Boolean(isAmountPaid)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isDiscountAmount"} label={"Discount Amount"} checked={Boolean(isDiscountAmount)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isPurchaseOrder"} label={"Purchase Order"} checked={Boolean(isPurchaseOrder)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isAdjustmentAmount"} label={"Adjustment Amount"} checked={Boolean(isAdjustmentAmount)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isAdjustmentCode"} label={"Adjustment Code"} checked={Boolean(isAdjustmentCode)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isClientName"} label={"Client Name"} checked={Boolean(isClientName)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isRemitToId"} label={"Remit to ID"} checked={Boolean(isRemitToId)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isPayeeName"} label={"Payee Name"} checked={Boolean(isPayeeName)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isAchCompanyName"} label={"ACH Company Name"} checked={Boolean(isAchCompanyName)} onChange={onChangeParameter} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <GridBoxSelect name={"isCurrencyCode"} label={"Currency Code"} checked={Boolean(isCurrencyCode)} onChange={onChangeParameter} />
                                    </Grid>
                                </Grid>
                            </Grid>}
                        </Grid>
                        : null
                    }
                </Box>
            </Paper>
            <Grid className={classes.ButtonGrouop} item xs={12} >
                <Button onClick={onBack} className={classes.BackButton} variant="outlined">BACK</Button>
                <Button onClick={onNext} className={`nxtBtn ${classes.NextButton}`} variant="outlined">FINISH</Button>
            </Grid>
            {alertMessage && renderSnackbar(alertType, alertMessage)}
            <SimpleDialog
                open={openModal}
                onCloseModal={onCloseModal}
                modalActions={modalActions}
                title={title}
                subtitle={subtitle}
            />
        </React.Fragment >
    );
}

export default connect(state => ({ ...state.user, ...state.payment }))(withStyles(Style)(Remittance));
