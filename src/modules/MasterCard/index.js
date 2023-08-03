import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    Box,
    Grid,
    Button,
    CircularProgress,
    Typography,
    Tooltip,
    Divider,
    Checkbox,
    Paper,
    MenuItem
} from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import MuiAlert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ConfirmModal from './ConfirmModal';

import TextField from "~/components/Forms/TextField";
import AutoCompleteChip from "~/components/AutoComplete";
import "react-notifications/lib/notifications.css";
import { useDispatch } from 'react-redux'
import AddIcon from '@material-ui/icons/Add';
import Notification from "~/components/Notification";
import {
    createMasterCardInfo, updateMasterCardInfo, savePaymentCardtype, getTemplateList,
    deleteProgramDetails, getTimeZoneList, updatePreferredPaymentTypes, getMasterCardInfo
} from "~/redux/actions/payments";
import { updateOnboardingStep } from "~/redux/actions/clients";
import { CardType, GroupLimit, validForOptions } from "~/config/entityTypes";
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DeleteIcon from '@material-ui/icons/Delete';
import { ConfirmDialog, CustomDialog } from "~/components/Dialogs";
import { CountryIso3 } from "~/components/CSC";

const MasterCard = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [saveProcessing, setSaveProcessing] = useState(false);
    const [onNextLoading, setOnNextLoading] = useState(false);
    const [templateLoader, setTemplateLoader] = useState({
        loaderIndex: null, status: false
    });
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [deleteProgramModal, setDeleteProgramModal] = useState({
        isOpen: false,
        message: '',
        deleteId: null,
        deleteIndex: null
    });
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        message: '',
    });
    const [purchaseTemplateAlert, setPurchaseTemplateAlert] = useState('');
    const [timeZoneList, setTimeZoneList] = useState([]);
    const { clientId, classes, payment, selectedPaymentTypes } = props;
    const { masterCardDetails } = payment;
    const [formValues, setFormValues] = useState({
        data: [{
            programName: "", companyNumber: "", purchaseDetails: [], cardImage: false, timeZoneId: 508, validFor: validForOptions.length>0?validForOptions[0].title:'',
            country: "USA"
        }],
        cardAccountDetailsId: null,
        error: { programName: "", companyNumber: "", purchaseType: '', mccGroup: "", timeZoneId: "" },
        errorIndex: { programName: [], companyNumber: [], purchaseType: [], templateName: [], mccGroup: [], timeZoneId: [] }
    })

    const { data, error, errorIndex } = formValues;

    useEffect(() => {
        if (masterCardDetails && masterCardDetails.length) {
            const { programDetailsId } = masterCardDetails[0];
            setFormValues({
                ...formValues,
                data: masterCardDetails,
                cardAccountDetailsId: programDetailsId
            });
        } 
        fetchTimeZoneList();
    }, [masterCardDetails]);

    const fetchTimeZoneList = async () => {
        const options = await getTimeZoneList();
        if (options && options.data) {
            setTimeZoneList(options.data);
        }
    }
    const handleTimeZoneChange = (values, index) => {
        const newFormValues = [...formValues.data];
        if (values) {
            newFormValues[index]["timeZoneId"] = values.timeZoneId;
            setFormValues({ ...formValues, data: newFormValues });
        }
    }

    const onMccChange = (values, index, ind) => {
        const newFormValues = [...formValues.data];
        const { purchaseDetails } = newFormValues[index];
        purchaseDetails[ind]['mccGroup'] = values;

        setFormValues({ ...formValues, data: newFormValues });
    }

    const handleChange = (i, e, typeIndex) => {
        const { name, value, checked } = e.target;
        const newFormValues = [...formValues.data];
        const { purchaseDetails } = newFormValues[i];

        switch (name) {
            case 'programName':
                newFormValues[i][name] = value.replace(/[^A-Za-z0-9 ]/g, '');
                break;
            case 'purchaseType':
            case 'templateName':
                purchaseDetails[typeIndex][name] = value.replace(/[^A-Za-z0-9 ]/g, '');
                break;
            case 'cardImage':
                newFormValues[i][name] = checked;
                break;
            case 'companyNumber':
                newFormValues[i][name] = value.replace(/[^0-9]/g, '');
                break;
            case 'validFor':
                newFormValues[i][name] = value;
                break;
            default:
                newFormValues[i][name] = value;
        }
        setFormValues({ ...formValues, data: newFormValues });
    }

    const addNewProgram = () => {
        setFormValues({
            ...formValues,
            data: [...formValues.data,
            { programName: "", companyNumber: "", purchaseDetails: [], cardImage: false, timeZoneId: 508, 
                validFor: validForOptions.length>0?validForOptions[0].title:'', country: "USA" }]
        });
    }

    const deleteProgram = () => {
        const newFormValues = [...formValues.data];
        if (deleteProgramModal.deleteId) {
            dispatch(deleteProgramDetails({
                clientId: clientId,
                programId: deleteProgramModal.deleteId
            })).then(res => {
                if (res && !res.error) {
                    setAlertMessage(res.message);
                    setAlertType('success');
                    newFormValues.splice(deleteProgramModal.deleteIndex, 1);
                    setFormValues({
                        ...formValues,
                        data: newFormValues
                    });
                } else {
                    setAlertMessage(res.message ? res.message : 'Something went wrong');
                    setAlertType('error');
                }
                closeDeleteProgramModal();
            })
        } else {
            newFormValues.splice(deleteProgramModal.deleteIndex, 1);
            setFormValues({
                ...formValues,
                data: newFormValues
            });
            closeDeleteProgramModal();
        }
    }

    const openDeleteProgramModal = (i) => {
        const newFormValues = [...formValues.data];
        const { programName, programDetailsId = null } = newFormValues[i];
        if (programName) {
            setDeleteProgramModal({
                isOpen: true,
                message: `Are you sure want to delete ${programName}?`,
                deleteId: programDetailsId,
                deleteIndex: i
            });
        }
        else {
            newFormValues.splice(i, 1);
            setFormValues({
                ...formValues,
                data: newFormValues
            });
        }
    }
    const closeDeleteProgramModal = () => {
        setDeleteProgramModal({ isOpen: false, message: '', deleteId: null, deleteIndex: null });
    }

    const openConfirmModal = () => {
        setConfirmModal({
            isOpen: true,
            message: `You have unsaved payment information. What do you wish to do?`,
        });
    }

    const closeConfirmModal = () => {
        setConfirmModal({ isOpen: false, message: '' });
        setOnNextLoading(false);
    }

    const goNext = () => {
        if (selectedPaymentTypes && selectedPaymentTypes.length > 0) {
            dispatch(updatePreferredPaymentTypes(clientId, selectedPaymentTypes))
              .then((response) => {
                    if (!response) {
                        return false;
                    } 
                    dispatch(updateOnboardingStep());
                    history.push({
                    pathname: "/clientOnboard/fileSettings",
                    });
                    setOnNextLoading(false);
                    closeConfirmModal();
                })
            }

    }
    const saveInfo = ()  => {
        onSubmit();
        closeConfirmModal();
    }

    const fetchTemplateList = async (index, e) => {
        const errors = { ...formValues.errorIndex };
        const validation = {};
        const programValue = e.target.value.trim();
        const copyFormData = [...formValues.data];

        if (programValue) {
            const isExist = data.filter(x => x.programName == programValue);
            if (isExist.length > 1) {
                validation["programName"] = "Program or Company Name cannot be duplicate";
                errors.programName.push(index);
                setFormValues({
                    ...formValues,
                    error: { ...validation },
                    errorIndex: { ...errors }
                });
            }
            else {
                setTemplateLoader({ status: true, loaderIndex: index });
                const removeProgramInd = errors.programName && errors.programName.indexOf(index);
                if (removeProgramInd > -1) {
                    errors.programName.splice(removeProgramInd, 1);
                }

                const list = await getTemplateList([programValue]); // INCEDO USD TEST COMPANY
                const createData = [];
                setTemplateLoader({ status: false, loaderIndex: null });
                if (list && list.length) {
					if (list[0]?.errorCode === "ERROR") {
						setPurchaseTemplateAlert(list[0]?.errorDescription ? list[0]?.errorDescription : `Purchase template settings import failed, please check the 
                            program name entered or update the same on Mastercard Smart data application.`
						);
						errors.templateName.push(index);
					}
				}
                else{
                    if (list.result && list.result.length > 0) {
                        list.result.forEach(templateItem => {
                            const { purchaseTemplates, messageId, programId, errorDescription } = templateItem;
                            copyFormData[index].messageId = messageId;
                            copyFormData[index].programId = programId;
                            if (purchaseTemplates && purchaseTemplates.length) {
                                purchaseTemplates.forEach(item => {
                                    createData.push({
                                        purchaseType: 'ALLPURCHASES',
                                        templateId: item.templateId,
                                        templateDescription: item.templateDescription,
                                        templateName: item.templateName,
                                        mccGroup: ["ALL MCCs"]
                                    });
                                });
                                const removeTemplateInd = errors.templateName && errors.templateName.indexOf(index);
                                if (removeTemplateInd > -1) {
                                    errors.templateName.splice(removeTemplateInd, 1);
                                }
                            }
                            else {
                                if (errors.templateName.includes(index) === false) {
                                    errors.templateName.push(index);
                                }
                                setPurchaseTemplateAlert(errorDescription ? errorDescription :`Purchase template settings import failed, please check the 
                            program name entered or update the same on Mastercard Smart data application.`);
                            }
                        })
                    }
                    else {
                        if (errors.templateName.includes(index) === false) {
                            errors.templateName.push(index);
                        }
                        setPurchaseTemplateAlert(`Purchase template settings import failed, please check the 
                                program name entered or update the same on Mastercard Smart data application.`
                        );
                    }
                }
                
                copyFormData[index].purchaseDetails = createData;
                setFormValues({
                    ...formValues,
                    data: copyFormData,
                    errorIndex: errors
                });
            }
        }
		else{
            const removeProgramInd = errors.templateName && errors.templateName.indexOf(index);
            if (removeProgramInd > -1) {
                errors.templateName.splice(removeProgramInd, 1);
            }
            copyFormData[index].purchaseDetails = [];
            setFormValues({
                ...formValues,
                data: copyFormData,
                errorIndex: errors
            });
		}
    }

    const validation = () => {
        let valid = true;
        const validation = {}, errorInd = {
            programName: [], companyNumber: [], purchaseType: [], templateName: [], mccGroup: [],
            timeZoneId: []
        };

        data.forEach((item, index) => {
            const { programName, companyNumber, timeZoneId, purchaseDetails } = item;
            if (!programName || programName.trim().length === 0) {
                validation["programName"] = "Program or Company Name is required";
                errorInd["programName"].push(index);
                valid = false;
            }

            if (!companyNumber || companyNumber.trim().length === 0) {
                validation["companyNumber"] = "Program or Company Number is required";
                errorInd["companyNumber"].push(index);
                valid = false;
            }
            if (!timeZoneId) {
                validation["timeZoneId"] = "Time Zone is required";
                errorInd["timeZoneId"].push(index);
                valid = false;
            }
            if (purchaseDetails.length) {
                const typeErrorInd = [], mccErrorIndexes = [];
                purchaseDetails.forEach((typeItem, ind) => {
                    const { purchaseType } = typeItem;

                    if (!purchaseType || purchaseType.trim().length === 0) {
                        validation["purchaseType"] = "Purchase Type is required";
                        typeErrorInd.push(ind);
                        valid = false;
                    }
                });
                errorInd["purchaseType"][index] = typeErrorInd;
                errorInd["mccGroup"][index] = mccErrorIndexes;
            } else {
                errorInd["templateName"].push(index);
                validation["templateName"] = "Template Name is required"
                valid = false
            }
        })

        setFormValues({ ...formValues, error: { ...validation }, errorIndex: { ...errorInd } });
        return valid;
    };

    const validateNext = () => {
        let show = false;
        data.forEach((item) => {
            if(!show){
                const { programName, companyNumber, programDetailsId} = item;
                if(!programDetailsId){
                    if (programName || programName.trim().length !== 0) {
                        show = true;
                    }else if (companyNumber || companyNumber.trim().length !== 0) {
                        show = true;
                    }
                }
            }
        })

        return show;
    };

    const onSubmit = () => {
        setSaveProcessing(true);
        const valid = validation();

        if (valid) {
            const { data, cardAccountDetailsId } = formValues;
            if (cardAccountDetailsId) {
                dispatch(
                    updateMasterCardInfo({
                        clientId: clientId,
                        masterCardDetail: data
                    })
                ).then((response) => {
                    setSaveProcessing(false);
                    if (response && !response.error) {
                        setAlertMessage('Information has been Updated Successfully.');
                        setAlertType('success');
                        dispatch(savePaymentCardtype({
                            clientId: clientId,
                            cardTypeId: CardType.MSC2
                        }));
                        dispatch(getMasterCardInfo({ clientId: clientId }));
                    } else {
                        setAlertMessage('Something went wrong');
                        setAlertType('error');
                        return false;
                    }
                });
            } else {
                dispatch(
                    createMasterCardInfo({
                        clientId: clientId,
                        masterCardDetail: data
                    })
                ).then((response) => {
                    setSaveProcessing(false);
                    if (response && !response.error) {
                        setAlertMessage('Information has been Saved Successfully.');
                        setAlertType('success');
                        dispatch(savePaymentCardtype({
                            clientId: clientId,
                            cardTypeId: CardType.MSC2
                        }))
                        dispatch(getMasterCardInfo({ clientId: clientId }));
                    } else {
                        setAlertMessage('Something went wrong');
                        setAlertType('error');
                        return false;
                    }
                });
            }
        }
        else {
            setAlertMessage('Validation error! Please fill the required information.');
            setAlertType('error');
            setSaveProcessing(false);
        }
    }

    const onNext = () => {
        setOnNextLoading(true);
        const showNextModal = validateNext();
        if(showNextModal){
            openConfirmModal();
            setOnNextLoading(false);
        }
        else{
            goNext();
        }
    }

    const hideAlertMessage = () => {
        setAlertMessage(null);
        setAlertType(null);
    }

    const renderSnackbar = (type, message) => {
        return (
            <Notification
                variant={type}
                message={message}
                handleClose={hideAlertMessage}
            />
        );
    };

    return (
        <>
            <Grid container item xs={12} spacing={2} className={classes.mainGrid}>
            <Box className={classes.headItem}>
                Mastercard
            </Box>
            {data.map((element, index) => (<>
                <Grid item xs={12} className={classes.gridItem}>
                    <Box my={2} mx={1} display="flex">
                        <Typography>Program Details (Optional - Can be entered later)</Typography>
                        {index > 0 ?
                            <Tooltip title="Delete" placement="top">
                                <DeleteIcon fontSize="small" className={classes.deleteIcon} onClick={() => openDeleteProgramModal(index)} />
                            </Tooltip>
                            : null
                        }
                    </Box>
                </Grid>

                <Grid container spacing={2} className={classes.p9}>
                    <Grid item xs={12} sm={6} className={classes.gridItem}>
                        <Box mx={1} my={1}>
                            <TextField
                                color="secondary"
                                inputProps={{
                                    maxLength: 50,
                                    minLength: 1
                                }}
                                label="Program or Company Name"
                                placeholder="Program or Company Name"
                                error={errorIndex.programName.includes(index)}
                                helperText={errorIndex.programName.includes(index) ?
                                    error.programName : ''}
                                fullWidth={true}
                                autoComplete="off"
                                InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                variant="outlined"
                                value={element.programName || ""}
                                name="programName"
                                onChange={e => handleChange(index, e)}
                                onBlur={e => fetchTemplateList(index, e)}
                            />
                            {/* <FormHelperText className={classes.programInfoText}>
                                Data is case sensitive and shall be same as configured on Mastercard Portal
                            </FormHelperText> */}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} className={classes.gridItem}>
                        <Box mx={1} my={1}>
                            <Autocomplete
                                id="timezone-select"
                                options={timeZoneList}
                                disableClearable
                                getOptionLabel={(option) => option.utcTimezone}
                                value={element.timeZoneId && timeZoneList.find(x => x.timeZoneId === element.timeZoneId) || {}}
                                onChange={(e, values) => {
                                    handleTimeZoneChange(values, index)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Time Zone"
                                        placeholder="Select Time Zone"
                                        InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                        variant="outlined"
                                        inputProps={{
                                            ...params.inputProps,
                                            style: { fontSize: 14 }
                                        }}
                                        error={errorIndex.timeZoneId.includes(index)}
                                        helperText={errorIndex.timeZoneId.includes(index) ?
                                            error.timeZoneId : ''}
                                    />
                                )}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={3} className={classes.gridItem}>
                        <Box mx={1} my={1}>
                            <TextField
                                color="secondary"
                                inputProps={{
                                    maxLength: 7,
                                    minLength: 1
                                }}
                                label="Program or Company Number"
                                placeholder="Program or Company Number"
                                error={errorIndex.companyNumber.includes(index)}
                                helperText={errorIndex.companyNumber.includes(index) ?
                                    error.companyNumber : ''}
                                fullWidth={true}
                                autoComplete="off"
                                InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                variant="outlined"
                                value={element.companyNumber || ''}
                                name="companyNumber"
                                onChange={e => handleChange(index, e)}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3} className={classes.gridItem}>
                        <Box mx={1} my={1} className={classes.countryStyle}>
                            <CountryIso3
                                required
                                selectedCountry={element.country || ""}
                                //error={Boolean(countryIsoError)}
                                //helperText={countryIsoError}
                                name={"country"}
                                onChange={e => handleChange(index, e)}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={2} className={classes.gridItem}>
                        <Box my={1} className={classes.cardImageLabel}>
                            <Checkbox
                                name="cardImage"
                                checked={element.cardImage}
                                onChange={e => handleChange(index, e)}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                disabled={true} // don't need in this phase
                            />
                            <CreditCardIcon className={classes.cardImageIcon} />
                            MC Image
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4} className={classes.gridItem}>
                        <Box mx={1} my={1} className={classes.cardImageLabel}>
                            <TextField
                                select
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="validFor"
                                label="Valid For"
                                variant="outlined"
                                onChange={e => handleChange(index, e)}
                                value={element.validFor}
                                defaultValue={validForOptions.length > 0 && validForOptions[0].title}
                            >
                                {validForOptions &&
                                validForOptions.map((option) => (
                                    <MenuItem
                                        id={option.id}
                                        key={option.id}
                                        value={option.title}
                                    >
                                        {option.title}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Typography className={classes.btnInfoText}>
                                Required for Card ISO XML File type (To be taken on next step)
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {templateLoader.status && templateLoader.loaderIndex != null && templateLoader.loaderIndex == index ?
                    <Grid item xs={12} sm={12}>
                        <Box textAlign={"center"}>
                            <CircularProgress color="primary" />
                        </Box>
                    </Grid>
                    :
                    element.purchaseDetails.length ?
                        <Paper elevation={1} className={classes.paper}>
                            <Grid container spacing={2}>
                                {element.purchaseDetails.map((item, ind) => (<>
                                    <Grid item xs={12} sm={12} className={classes.gridItem}>
                                        <Box pl={2} pt={1} display={"flex"}>
                                            <Typography>Purchase Template {ind + 1}</Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} className={classes.gridItem}>
                                        <Box pl={2} pr={1} my={1}>
                                            <TextField
                                                color="secondary"
                                                inputProps={{
                                                    maxLength: 70,
                                                    minLength: 1
                                                }}
                                                label="Template Name"
                                                placeholder="Template Name"
                                                //error={errorIndex.templateName[index] && errorIndex.templateName[index].includes(ind)}
                                                //helperText={errorIndex.templateName[index] && errorIndex.templateName[index].includes(ind) ?
                                                //error.templateName : ''}
                                                fullWidth={true}
                                                autoComplete="off"
                                                InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                                variant="outlined"
                                                value={item.templateName}
                                                name="templateName"
                                                onChange={e => handleChange(index, e, ind)}
                                                disabled={true}
                                            //onBlur={handleBlur}
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} className={classes.gridItem}>
                                        <Box pl={1} pr={2} pt={1} className={classes.mccInput}>
                                            <AutoCompleteChip
                                                label="Merchant Category Code(s)"
                                                name="mccGroup"
                                                value={item.mccGroup}
                                                onHandleChange={onMccChange}
                                                options={[]}
                                                disabled={true}
                                                parentIndex={index}
                                                childIndex={ind}
                                                isError={errorIndex.mccGroup[index] && errorIndex.mccGroup[index].includes(ind)}
                                                helperText={errorIndex.mccGroup[index] && errorIndex.mccGroup[index].includes(ind) ?
                                                    error.mccGroup : ''}
                                            />
                                            {/* <Typography className={classes.mccBtnInfoText}>
                                            You can add upto {GroupLimit.MCCGROUPLIMIT} Merchant Category Code(s)
                                        </Typography> */}
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} className={classes.gridItem}>
                                        <Box pl={2} pr={1} my={1}>
                                            <TextField
                                                color="secondary"
                                                inputProps={{
                                                    maxLength: 69,
                                                    minLength: 1
                                                }}
                                                label="Purchase Type"
                                                placeholder="Purchase Type"
                                                error={errorIndex.purchaseType[index] && errorIndex.purchaseType[index].includes(ind)}
                                                helperText={errorIndex.purchaseType[index] && errorIndex.purchaseType[index].includes(ind) ?
                                                    error.purchaseType : ''}
                                                fullWidth={true}
                                                autoComplete="off"
                                                InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                                variant="outlined"
                                                value={item.purchaseType}
                                                name="purchaseType"
                                                onChange={e => handleChange(index, e, ind)}
                                            //onBlur={handleBlur}
                                            />
                                            {/* <FormHelperText className={classes.programInfoText}>
                                                Data is case sensitive
                                            </FormHelperText> */}
                                        </Box>
                                    </Grid>
                                    {!(element.purchaseDetails.length == ind + 1) ?
                                        <Grid item xs={12} sm={12} className={classes.gridItem}>
                                            <Box mx={1}>
                                                <Divider className={classes.divider} />
                                            </Box>
                                        </Grid>
                                        : null}
                                </>
                                ))}
                            </Grid>
                        </Paper> : null
                }
                {
                    purchaseTemplateAlert && errorIndex.templateName.includes(index) ?
                        <Grid item xs={12} sm={12} className={classes.gridItem}>
                            <Box my={2} mx={1}>
                                <MuiAlert severity="error" className={classes.errorAlertText}>
                                    ERROR: {purchaseTemplateAlert}
                                </MuiAlert>
                            </Box>
                        </Grid> : null}

                <Grid item xs={12} sm={12} className={classes.gridItem}>
                    <Box my={1}>
                        <Divider className={classes.divider} />
                    </Box>
                </Grid>
                {data.length == index + 1 &&
                    <Grid item xs={12} sm={12} className={classes.gridItem}>
                        <Box className={classes.addBtnGrid}>
                            <Button variant="outlined"
                                className={classes.addBtn}
                                startIcon={<AddIcon />}
                                onClick={() => addNewProgram()}
                                disabled={data.length >= GroupLimit.PROGRAMLIMIT}
                            >
                                PROGRAM
                            </Button>
                            <Typography className={classes.btnInfoText}>
                                You can add upto {(GroupLimit.PROGRAMLIMIT - data.length)} more program names
                            </Typography>
                        </Box>
                    </Grid>
                }
            </>
            ))}

            <Grid container item xs={12} justify="center" className={classes.saveButton}>
                {saveProcessing ? (
                    <CircularProgress color="primary" />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onSubmit()}
                        style={{ fontSize: 14 }}
                    >
                        SAVE
                    </Button>
                )}
            </Grid>
            {alertMessage && renderSnackbar(alertType, alertMessage)}
            {deleteProgramModal.isOpen && <ConfirmDialog
                dialogClassName={"alert-dialoge-root"}
                title={deleteProgramModal.message}
                message={""}
                onCancel={closeDeleteProgramModal}
                onConfirm={deleteProgram}
            />}
            {confirmModal.isOpen && 
                <CustomDialog >
                    <ConfirmModal 
                        closeModal={closeConfirmModal} 
                        goNext={goNext} 
                        saveInfo={saveInfo} 
                        message={confirmModal.message}
                        confirmText="DISCARD PAYEMENT INFO"
                        declineText="SAVE PAYMENT INFO"
                    />
                </CustomDialog>
            }
            </Grid>
            <Grid container item xs={12} justify="center" className={classes.nextButtonGrid}>
                {onNextLoading ? (
                    <CircularProgress color="primary" />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.nextButton}
                        onClick={() => onNext()}
                    >
                        NEXT
                    </Button>
                )}
            </Grid>
            
        </>

    )
}
export default connect((state) => ({ ...state.payment }))(
    withStyles(styles)(MasterCard)
);
