import React, { Component } from 'react';
import styles from './styles.js';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Divider,
  TableCell,
  TableHead,
  TableRow,
  Table,
  TableBody,
  CircularProgress,
  Tooltip,
  Backdrop,
  Checkbox,
  Button,
  MenuItem,
} from '@material-ui/core';
import FileUploadIcon from '~/assets/icons/file_upload.svg';
import DeleteIcon from '@material-ui/icons/Delete';
import NoDataFound from '~/assets/icons/no_data_found.svg';
import {
  uploadPrepaidCardFiles,
  fetchUSBankPrepaidCardData,
  createUsBankPrepaidCard,
  updateUSBankPrepaidCard,
  fetchUSBankChildBankAccountsList,
  fetchUSBankBankAccountsList,
  fetchUSBankAchProfilesInformation,
  fetchReliaFocusCardParams,
} from '~/redux/actions/USbank/payments';
import { downloadPrepaidCardFiles } from '~/redux/helpers/USbank/payments';
import trim from 'deep-trim-node';
import { paymentMethods } from '~/config/paymentMethods';
import { ConfirmDialog } from '~/components/Dialogs';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PreivewModal from '~/components/Model/PreviewModal.js';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FocusNonPayrollACHAccount from './CorporateRewardCardACH/focusReliaACH';

class FocusNonPayroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusNonPayrollData: {
        transId: null,
        cardType: null,
        certificateCardPasscode: null,
        certificateCardId: null,
        addThankYouNote: null,
        addPredisclosureText:"The documents set forth below are the Pre-Acquisition Disclosure and the fee schedule.  Please click on the link to acknowledge review of each document.",
        addVerbiageText: null,
        uploadFile: [],
        isName: false,
        isEmail: false,
        isSsn: false,
        isDateOfBirth: false,
        isAddress: false,
        isMobilePhone: false,
        isHomePhone: false,
        isEmployeeState: false,
        isUniqueId: false,
        isGovLocation: false,
        govIdTypeId: 0,
        cardUploadImageName: null,
        ndaFileNames: null,
        paymentTypeId: null,
        imageFullPath: null,
        clientDebitAccountId: null,
      },
      error: {
        transId: '',
        cardType: '',
        certificateCardPasscode: '',
        certificateCardId: '',
        addThankYouNote: '',
        addPredisclosureText: '',
        addVerbiageText: '',
      },
      showConfirmRemoveDialog: false,
      deleteFileType: null,
      confirmationText: null,
      disclosureFormIndex: null,
      formsUploading: false,
      cardImageUploading: false,
      openPreviewDialog: false,
      showPreviewDialogLoader: false,
      achAccountsList: [],
      clientACHAccountId: null,
      showParentList: false,
      saveProcessing: false,
      isSubmitClicked: false,
    };
  }

  componentDidMount = async () => {
    const clientID = sessionStorage.getItem('clientId') || null;
    let Id = clientID;
    if (this.props.showParentInfo) {
      Id = this.props.parentId;
      this.props.dispatch(fetchUSBankBankAccountsList(Id, 'ACH'));
      this.setState({
        showParentList: true,
      });
    }
    this.props.dispatch(fetchUSBankChildBankAccountsList(clientID, 'ACH'));

    // if (
    //   this.props.usBankpayment.storedPrepaidCardData?.data &&
    //   !this.props.usBankpayment.storedPrepaidCardData.data.nodata
    // ) {
    //   this.props.dispatch(fetchUSBankChildBankAccountsList(clientID, 'ACH'));
    // }

    this.props.dispatch(fetchUSBankAchProfilesInformation());
    this.props.dispatch(fetchReliaFocusCardParams());
    const paymentTypeList = this.props.b2cPaymentTypesList;
    const focusNonPayrollPayment = paymentTypeList.filter(
      (item) => item.paymentCode === paymentMethods.PrepaidFocusNonPayroll
    );
    if (focusNonPayrollPayment?.length) {
      this.setState({
        focusNonPayrollData: {
          ...this.state.focusNonPayrollData,
          transId: focusNonPayrollPayment[0]?.transId,
          paymentTypeId: focusNonPayrollPayment[0]?.paymentTypeId,
        },
      });
    }
    await this.getPrepaidCardAPIData();
  };

  getPrepaidCardAPIData = () => {
    const clientId = sessionStorage.getItem('clientId') || null;
    let Id = clientId;
    if (this.props.showParentInfo && this.props.parentId) {
      Id = this.props.parentId;
    }
    this.props.dispatch(fetchUSBankPrepaidCardData(Id)).then((response) => {
      if (response && response.error) {
        const errorMsg =
          this.props.usBankpayment.storedPrepaidCardData &&
          this.props.usBankpayment.storedPrepaidCardData.error
            ? this.props.usBankpayment.storedPrepaidCardData.error
            : null;
        this.props.notification('error', errorMsg);
        return false;
      } else {
        this.setAPIDataInState(Id !== this.props.parentId);
      }
    });
  };

  setAPIDataInState = (isChildData) => {
    if (
      this.props.usBankpayment.storedPrepaidCardData?.data &&
      !this.props.usBankpayment.storedPrepaidCardData.data.nodata
    ) {
      const prePaidCardData =
        this.props.usBankpayment.storedPrepaidCardData.data;
      if (
        Object.keys(prePaidCardData.prepaidCardData[0]).length &&
        prePaidCardData.prepaidCardData[0].paymentTypeId ===
          this.state.focusNonPayrollData.paymentTypeId
      ) {
        let finalCardDetails = prePaidCardData.registrationData[0];
        if (this.props.showParentInfo) {
          const { reliaFocusId, ...restDetail } =
            prePaidCardData.registrationData[0];
          finalCardDetails = restDetail;
        }
        this.setState({
          focusNonPayrollData: {
            ...this.state.focusNonPayrollData,
            ...finalCardDetails,
            uploadFile: [
              ...this.props.usBankpayment.storedPrepaidCardData.data
                ?.ndaFilesData,
            ],
          },
          clientACHAccountId: isChildData
            ? finalCardDetails.clientDebitAccountId
            : null,
        });
      }
    }
  };

  setReliaFocusId = () => {
    const prePaidCardData = this.props.usBankpayment.storedPrepaidCardData.data;
    this.setState({
      focusNonPayrollData: {
        ...this.state.focusNonPayrollData,
        ...prePaidCardData.registrationData[0],
        uploadFile: prePaidCardData?.ndaFilesData,
      },
    });
  };

  onChange = ({ target }) => {
    const numericFields = [
      'certificateCardId',
      'cardType',
      'certificateCardPasscode',
    ];
    const { name, value } = target;
    let targetValue = value;
    if (numericFields.includes(name)) {
      targetValue = value.replace(/[^0-9]/g, '');
    }
    this.setState({
      focusNonPayrollData: {
        ...this.state.focusNonPayrollData,
        [name]: targetValue,
      },
    });
  };

  handleRegParamsCheckbox = ({ target }) => {
    const { name, checked } = target;
    this.setState({
      focusNonPayrollData: {
        ...this.state.focusNonPayrollData,
        [name]: checked,
      },
    });
  };

  renderNotification = (type) => {
    if (type) {
      this.props.notification(
        'error',
        this.props.usBankpayment.usBankPrepaidCard?.error ??
          'Something went wrong'
      );
    } else {
      this.props.notification(
        'success',
        this.props.usBankpayment.usBankPrepaidCard?.data?.message
      );
    }
  };

  handleSaveProcessing = (val) => {
    this.setState({
      saveProcessing: val,
    });
  };

  handleParentClick = () => {
    this.handleIsSubmitClicked(true);
  };

  handleIsSubmitClicked = (val) => {
    this.setState({
      isSubmitClicked: val,
    });
  };

  onSubmit = (clientDebitAccountId) => {
    const valid = this.validation();
    const tempProps = this.props;
    if (valid) {
      const clientId = sessionStorage.getItem('clientId') || null;
      this.setState({
        saveProcessing: true,
      });
      const prepaidCardData = trim(this.state.focusNonPayrollData);
      if (this.state.focusNonPayrollData.uploadFile?.length) {
        if (this.state.focusNonPayrollData.uploadFile.length > 5) {
          tempProps.notification(
            'error',
            'More than 5 Disclosure Forms cannot be uploaded!'
          );
          this.setState({
            saveProcessing: false,
          });
          return false;
        }
        prepaidCardData.ndaFileNames = this.state.focusNonPayrollData.uploadFile
          .map((obj) => obj.fileActualName)
          .join(':');
      } else {
        prepaidCardData.ndaFileNames = null;
      }

      if (prepaidCardData.reliaFocusId) {
        tempProps
          .dispatch(
            updateUSBankPrepaidCard(
              prepaidCardData,
              clientId,
              clientDebitAccountId
            )
          )
          .then((response) => {
            if (response && !response.error) {
              this.renderNotification();
              tempProps.onSaveBtnClick(tempProps.paymentType, false);
              this.props.dispatch(
                fetchUSBankChildBankAccountsList(clientId, 'ACH')
              );
              this.setState({
                saveProcessing: false,
                clientACHAccountId: clientDebitAccountId,
                showParentList: false,
              });
            } else {
              this.renderNotification('error');
              this.setState({
                saveProcessing: false,
              });
              return false;
            }
          });
      } else {
        tempProps
          .dispatch(
            createUsBankPrepaidCard(
              prepaidCardData,
              clientId,
              clientDebitAccountId
            )
          )
          .then((response) => {
            if (response && !response.error) {
              this.setState({
                saveProcessing: false,
                clientACHAccountId: clientDebitAccountId,
                showParentList: false,
              });
              this.props
                .dispatch(fetchUSBankPrepaidCardData(clientId))
                .then((res) => {
                  this.setReliaFocusId();
                });
              this.renderNotification();
              this.props.dispatch(
                fetchUSBankChildBankAccountsList(clientId, 'ACH')
              );
              tempProps.onSaveBtnClick(tempProps.paymentType, false);
            } else {
              this.renderNotification('error');
              this.setState({
                saveProcessing: false,
              });
              return false;
            }
          });
      }
    } else {
      tempProps.notification(
        'error',
        'Validation error! Please fill the required information.'
      );
    }
  };

  validation = () => {
    let valid = true;
    let validation = {};
    const { transId, certificateCardPasscode, certificateCardId } =
      this.state.focusNonPayrollData;
    if (!transId) {
      validation['transId'] = 'Trans ID is required.';
      valid = false;
    }
    if (!certificateCardId) {
      validation['certificateCardId'] = 'Certification Card ID is required.';
      valid = false;
    }
    if (!certificateCardPasscode) {
      validation['certificateCardPasscode'] =
        'Certification Card Pass Code is required.';
      valid = false;
    }
    this.setState({
      error: { ...validation },
    });
    return valid;
  };

  validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  handleUploadFormClick = (e) => {
    if (e.target.files?.length) {
      if (e.target.files.length > 5) {
        this.props.notification(
          'error',
          'More than 5 Disclosure Forms cannot be uploaded!'
        );
        return false;
      } else if (
        this.state.focusNonPayrollData.uploadFile.length +
          e.target.files.length >
        5
      ) {
        this.props.notification(
          'error',
          'More than 5 Disclosure Forms cannot be uploaded!'
        );
        return false;
      }
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const isInvalidFile = ['application/pdf'].indexOf(files[i].type) === -1;
        if (isInvalidFile) {
          this.props.notification('error', 'Invalid file type uploaded!');
          return false;
        }
      }
      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
      this.setState({
        formsUploading: true,
      });
      this.props.dispatch(uploadPrepaidCardFiles(formData)).then((res) => {
        if (res?.error) {
          this.props.notification('error', res.message);
          this.setState({
            formsUploading: false,
          });
        } else if (res && res.data) {
          let filesUploaded = [];
          res.data.files.forEach((ele) => {
            let tempFilesObj = {
              fileActualName: ele.fileName,
              fileUploadedAt: res.data.uploadedAt,
            };
            filesUploaded.push(tempFilesObj);
          });
          this.setState({
            focusNonPayrollData: {
              ...this.state.focusNonPayrollData,
              uploadFile: [
                ...this.state.focusNonPayrollData.uploadFile,
                ...filesUploaded,
              ],
            },
            formsUploading: false,
          });
        } else {
          this.props.notification('error', 'Something went wrong!');
          this.setState({
            formsUploading: false,
          });
        }
      });
    }
  };

  handleUploadImageClick = (e) => {
    if (e.target.files?.length) {
      const files = e.target.files;
      const isValidFile = this.validateFile(files[0]);
      if (!isValidFile) {
        this.props.notification('error', 'Invalid file type uploaded!');
        return false;
      }
      this.setState({
        cardImageUploading: true,
      });
      let formData = new FormData();
      formData.append('file', files[0]);
      this.props.dispatch(uploadPrepaidCardFiles(formData)).then((res) => {
        if (res && res.data) {
          this.setState({
            focusNonPayrollData: {
              ...this.state.focusNonPayrollData,
              cardUploadImageName: res.data.files?.[0]?.fileName,
            },
            cardImageUploading: false,
          });
        }
      });
      e.target.value = ""
    }
  };

  handleDeleteFile = () => {
    const uploadedFiles = [...this.state.focusNonPayrollData.uploadFile];
    uploadedFiles.splice(this.state.disclosureFormIndex, 1);
    this.setState({
      focusNonPayrollData: {
        ...this.state.focusNonPayrollData,
        uploadFile: uploadedFiles,
        disclosureFormIndex: null,
      },
    });
  };

  handleDeleteImage = () => {
    this.setState({
      focusNonPayrollData: {
        ...this.state.focusNonPayrollData,
        cardUploadImageName: null,
      },
    });
  };

  handleOpenConfirmationDialog = (itemType, confirmationText, fileIndex) => {
    this.setState({
      showConfirmRemoveDialog: true,
      deleteFileType: itemType,
      confirmationText: confirmationText,
      disclosureFormIndex: fileIndex,
    });
  };

  onCancelDelete = () => {
    this.setState({
      showConfirmRemoveDialog: false,
      deleteFileType: null,
      confirmationText: null,
      disclosureFormIndex: null,
    });
  };

  onConfirmDelete = () => {
    if (this.state.deleteFileType === 'cardImage') {
      this.handleDeleteImage();
    } else if (this.state.deleteFileType === 'disclosureForm') {
      this.handleDeleteFile();
    }
    this.onCancelDelete();
  };

  renderDeleteDialog = (title, message) => {
    return (
      <ConfirmDialog
        title={title}
        message={message}
        onCancel={() => this.onCancelDelete()}
        onConfirm={() => this.onConfirmDelete()}
      />
    );
  };

  handleOpenPreviewDialog = () => {
    this.setState({
      showPreviewDialogLoader: true,
    });
    this.props
      .dispatch(
        downloadPrepaidCardFiles(
          this.state.focusNonPayrollData.cardUploadImageName
        )
      )
      .then((res) => {
        if (res && res.data) {
          const reader = new FileReader();
          reader.readAsDataURL(res.data);
          reader.onloadend = () => {
            const base64data = reader.result;
            this.setState({
              focusNonPayrollData: {
                ...this.state.focusNonPayrollData,
                imageFullPath: base64data,
              },
              openPreviewDialog: true,
              showPreviewDialogLoader: false,
            });
          };
        } else {
          this.setState({
            showPreviewDialogLoader: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          showPreviewDialogLoader: false,
        });
      });
  };
  handleClosePreviewDialog = () => {
    this.setState({
      openPreviewDialog: false,
    });
  };

  render() {
    const { classes } = this.props;
    const { error, showPreviewDialogLoader } = this.state;
    const {
      transId,
      cardType,
      certificateCardPasscode,
      certificateCardId,
      addThankYouNote,
      addPredisclosureText,
      addVerbiageText,
      uploadFile,
      isName,
      isEmail,
      isSsn,
      isDateOfBirth,
      isAddress,
      isMobilePhone,
      isHomePhone,
      isEmployeeState,
      isUniqueId,
      isGovLocation,
      govIdTypeId,
      cardUploadImageName,
      imageFullPath,
    } = this.state.focusNonPayrollData;
    return (
      <Box>
        <Grid container justifyContent='center' spacing={2}>
          <Grid container justifyContent='flex-start'>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label='Trans ID'
                  placeholder='Trans ID'
                  error={Boolean(error.transId)}
                  helperText={error.transId}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={transId ?? ''}
                  name='transId'
                  required
                  disabled
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label='Card Type'
                  placeholder='Card Type'
                  error={Boolean(error.cardType)}
                  helperText={error.cardType}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={cardType ?? ''}
                  name='cardType'
                  onChange={this.onChange}
                  // onBlur={this.handleBlur}
                  inputProps={{
                    maxLength: 2,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label='Certification Card Pass Code'
                  placeholder='Certification Card Pass Code'
                  error={Boolean(error.certificateCardPasscode)}
                  helperText={error.certificateCardPasscode}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={certificateCardPasscode ?? ''}
                  name='certificateCardPasscode'
                  onChange={this.onChange}
                  // onBlur={this.handleBlur}
                  required
                  inputProps={{
                    maxLength: 10,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label='Certification Card ID'
                  placeholder='Certification Card ID'
                  error={Boolean(error.certificateCardId)}
                  helperText={error.certificateCardId}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={certificateCardId ?? ''}
                  name='certificateCardId'
                  onChange={this.onChange}
                  // onBlur={this.handleBlur}
                  required
                  inputProps={{
                    maxLength: 10,
                  }}
                />
              </Box>
            </Grid>
            <FocusNonPayrollACHAccount
              onSubmit={this.onSubmit}
              notification={this.props.notification}
              handleValidation={this.validation}
              selectedSettlementAccountId={
                this.state.focusNonPayrollData.clientDebitAccountId
              }
              achAccountsList={
                this.props.showParentInfo && this.state.showParentList
                  ? this.props.usBankpayment.achUSBankAccountList
                  : this.props.usBankpayment.achUSBankClientAccountList
              }
              currencyList={this.props.currencyList}
              reliaFocusParams={this.props.usBankpayment?.reliaFocusCardParams}
              clientACHAccountId={this.state.clientACHAccountId}
              achUSBankProfileInfo={
                this.props.usBankpayment?.achUSBankProfileInfo
              }
              handleSaveProcessing={this.handleSaveProcessing}
              showParentInfo={this.props.showParentInfo}
              isSubmitClicked={this.state.isSubmitClicked}
              handleIsSubmitClicked={this.handleIsSubmitClicked}
            />

            <Grid item xs={12} sm={12}>
              <Typography className={classes.regParams}>
                Registration Parameters
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              style={{ display: 'flex', flexWrap: 'wrap' }}
            >
              <Grid item sm={2} xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isName)}
                      name='isName'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label='Name'
                />
              </Grid>
              <Grid item sm={2} xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isUniqueId)}
                      name='isUniqueId'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label='Unique ID'
                />
              </Grid>
              <Grid item sm={2} xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isEmail)}
                      name='isEmail'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label='Email'
                />
              </Grid>
              <Grid item sm={2} xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isMobilePhone)}
                      name='isMobilePhone'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label='Mobile Phone'
                />
              </Grid>
              <Grid item sm={2} xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isHomePhone)}
                      name='isHomePhone'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label='Home Phone'
                />
              </Grid>
              <Grid item sm={2} xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isDateOfBirth)}
                      name='isDateOfBirth'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label='DOB'
                />
              </Grid>
              <Grid item sm={2} xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isAddress)}
                      name='isAddress'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label='Address'
                />
              </Grid>
              <Grid item sm={2} xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isSsn)}
                      name='isSsn'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label='SSN'
                />
              </Grid>
              <Grid item sm={2} xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isEmployeeState)}
                      name='isEmployeeState'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label='Employer State'
                />
              </Grid>
              <Grid item sm={2} xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isGovLocation)}
                      name='isGovLocation'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label='Gov Location'
                />
              </Grid>
              <Grid item sm={2} xs={3} style={{ marginTop: '4px' }}>
                <TextField
                  size='small'
                  select
                  style={{ width: '85%' }}
                  variant='outlined'
                  autoComplete='off'
                  value={govIdTypeId ?? 0}
                  name='govIdTypeId'
                  label='GovID Type'
                  onChange={this.onChange}
                  dir='horizontal'
                  required
                >
                  <MenuItem value={0}>Select</MenuItem>
                  {this.props.usBankpayment.reliaFocusCardParams?.data &&
                    this.props.usBankpayment.reliaFocusCardParams.data.govIdTypes.map(
                      (item) => (
                        <MenuItem key={item.idTypeId} value={item.idTypeId}>
                          {item.description}
                        </MenuItem>
                      )
                    )}
                </TextField>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label='Add Verbiage Text'
                  placeholder='Add Verbiage Text'
                  error={Boolean(error.addVerbiageText)}
                  helperText={error.addVerbiageText}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={addVerbiageText ?? ''}
                  name='addVerbiageText'
                  multiline
                  minRows={5}
                  maxRows={5}
                  onChange={this.onChange}
                  // onBlur={this.handleBlur}
                  inputProps={{
                    maxLength: 2000,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label='Add Thank You Note'
                  placeholder='Add Thank You Note'
                  error={Boolean(error.addThankYouNote)}
                  helperText={error.addThankYouNote}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={addThankYouNote ?? ''}
                  name='addThankYouNote'
                  multiline
                  minRows={5}
                  maxRows={5}
                  onChange={this.onChange}
                  // onBlur={this.handleBlur}
                  inputProps={{
                    maxLength: 2000,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label='Add Pre-Disclosure text'
                  placeholder='Add Pre-Disclosure text'
                  error={Boolean(error.addPredisclosureText)}
                  helperText={error.addPredisclosureText}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={addPredisclosureText ?? ''}
                  name='addPredisclosureText'
                  multiline
                  minRows={5}
                  maxRows={5}
                  onChange={this.onChange}
                  // onBlur={this.handleBlur}
                  inputProps={{
                    maxLength: 2000,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2} style={{ display: 'flex' }}>
                <Grid item sm={6} xs={6}>
                  <Typography>Upload Disclosure Form</Typography>
                </Grid>
                <Grid item sm={6} xs={6}>
                  <>
                    <input
                      accept='.pdf'
                      id='upload-disclosure-form'
                      multiple
                      type='file'
                      style={{ display: 'none' }}
                      onChange={this.handleUploadFormClick}
                    />
                    {this.state.formsUploading ? (
                      <CircularProgress
                        style={{ marginLeft: '8px' }}
                        size={20}
                        color='primary'
                      />
                    ) : (
                      <label
                        htmlFor='upload-disclosure-form'
                        style={{ display: 'flex', cursor: 'pointer' }}
                      >
                        <img src={FileUploadIcon} alt='File Upload Icon' />
                        <Typography style={{ color: '#008CE6' }}>
                          Choose File
                        </Typography>
                      </label>
                    )}
                  </>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2} style={{ display: 'flex' }}>
                <Grid item sm={6} xs={6}>
                  <Typography>Upload Card Image</Typography>
                </Grid>
                <Grid item sm={6} xs={6}>
                  <>
                    <input
                      accept='image/png, image/jpg, image/jpeg'
                      id='upload-card-image'
                      type='file'
                      style={{ display: 'none' }}
                      onChange={this.handleUploadImageClick}
                    />
                    {cardUploadImageName && (
                      <Tooltip
                        title={cardUploadImageName}
                        placement={'top'}
                        arrow
                        classes={{ tooltip: classes.customWidth }}
                      >
                        <Typography className={classes.imageUploadedName}>
                          {cardUploadImageName}
                        </Typography>
                      </Tooltip>
                    )}
                    <Grid container>
                      <Grid item sm={10} xs={10}>
                        {this.state.cardImageUploading ? (
                          <CircularProgress size={20} color='primary' />
                        ) : (
                          <label
                            htmlFor='upload-card-image'
                            style={{ display: 'flex', cursor: 'pointer' }}
                          >
                            <img src={FileUploadIcon} alt='File Upload Icon' />
                            <Typography style={{ color: '#008CE6' }}>
                              Choose File
                            </Typography>
                          </label>
                        )}
                      </Grid>
                      <Grid
                        item
                        sm={2}
                        xs={2}
                        justifyContent='flex-end'
                        style={{ display: 'flex' }}
                      >
                        {cardUploadImageName && !this.state.cardImageUploading && (
                          <>
                            <VisibilityIcon
                              style={{ cursor: 'pointer' }}
                              fontSize='small'
                              onClick={() => this.handleOpenPreviewDialog()}
                            />
                            <DeleteIcon
                              style={{ cursor: 'pointer', marginLeft: '8px' }}
                              fontSize='small'
                              onClick={() =>
                                this.handleOpenConfirmationDialog(
                                  'cardImage',
                                  'Are you sure you want to delete this card image ?'
                                )
                              }
                            />
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </>
                </Grid>
              </Box>
            </Grid>
            <Divider
              style={{
                margin: '8px 0px',
                background: '#8F9EC4',
                width: '100%',
              }}
            />
            <Table>
              <TableHead
                style={{
                  background: '#E6E9EC',
                  borderRadius: '8px 8px 0px 0px',
                }}
              >
                <TableRow>
                  <TableCell>Form Name</TableCell>
                  <TableCell>Form Uploaded At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadFile?.length ? (
                  uploadFile.map((fileItem, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{fileItem.fileActualName}</TableCell>
                        <TableCell>
                          {moment(fileItem.fileUploadedAt).format('MM/DD/YYYY')}
                        </TableCell>
                        <TableCell>
                          <DeleteIcon
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              this.handleOpenConfirmationDialog(
                                'disclosureForm',
                                'Are you sure you want to delete this disclosure form ?',
                                index
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      <>
                        <img
                          src={NoDataFound}
                          alt='No Data Found!'
                          width='auto'
                          height='80px'
                        />
                        <Typography
                          style={{
                            marginTop: '8px',
                            color: '#A1A1A1',
                          }}
                        >
                          {'No Files Uploaded!'}
                        </Typography>
                      </>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Grid
              container
              item
              xs={12}
              justifyContent='center'
              style={{ marginTop: '16px' }}
            >
              {this.state.saveProcessing ||
              this.state.cardImageUploading ||
              this.state.formsUploading ? (
                <CircularProgress color='primary' />
              ) : (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => this.handleParentClick()}
                  style={{ color: 'white' }}
                >
                  Save
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
        {this.state.showConfirmRemoveDialog &&
          this.renderDeleteDialog(this.state.confirmationText, '')}
        <Backdrop className={classes.backdrop} open={showPreviewDialogLoader}>
          <CircularProgress color='primary' />
        </Backdrop>
        <PreivewModal
          dialogTitle='Card Preview'
          imageLocation={imageFullPath ?? NoDataFound}
          confirmButton='OK'
          handleClose={this.handleClosePreviewDialog}
          open={this.state.openPreviewDialog}
        />
      </Box>
    );
  }
}
export default connect((state) => ({
  ...state.USbankpayment,
}))(withStyles(styles)(FocusNonPayroll));
