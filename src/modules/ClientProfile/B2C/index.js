import React, { useEffect, useState } from 'react';
import Button from '~/components/Forms/Button';
import TextField from '~/components/Forms/TextField';
import {
  Grid,
  makeStyles,
  Paper,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CountryPhoneCode from '~/components/Forms/CountryPhoneCode';
import {
  updateOnboardingCLient,
  getClientDataActivated,
} from '~/redux/actions/clients';
import { connect } from 'react-redux';
import {
  getB2CIndustryGroupList,
  getB2CParentClientList,
  createB2CClientProfile,
} from '~/redux/helpers/clientProfileSetup';
import 'react-notifications/lib/notifications.css';
import Notification from '~/components/Notification';
import SimpleDialog from '~/components/Model/SimpleDialog';
import MaskedInput from '~/components/MaskedInput';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import './styles.scss';
import trim from 'deep-trim-node';

const useStyle = makeStyles((theme) => ({
  paper: {
    padding: 40,
  },
  title: {
    padding: '15px 0',
    borderBottom: '1px solid #d8d8d8',
    fontWeight: '500',
    textAlign: 'left',
  },
  gridItemSpace: {
    paddingLeft: theme.spacing(2),
  },
  registered: {
    paddingLeft: theme.spacing(17),
  },
}));

const identificationNumbers = [
  {
    name: 'Federal Tax ID',
    value: 0,
  },
  {
    name: 'Social Security Number',
    value: 1,
  },
];

const B2CClientProfile = ({
  history,
  dispatch,
  updateOnboardingStep,
  updateOnboardTitle,
  match,
  user,
}) => {
  const { isPayeeChoicePortal } = user;
  const dialogModalActions = {
    clientExistActions: [
      {
        label: 'OK',
        onClickHandler: () => onCloseModal(),
        variant: 'contained',
      },
    ],
    partialOnBoardActions: [
      {
        label: 'No',
        onClickHandler: () => onPartialOnBoardAbortHandler(),
        variant: 'ouPermissionsOptionListtlined',
      },
      {
        label: 'Yes',
        onClickHandler: () => onPartialOnBoardProceedHandler(),
        variant: 'contained',
      },
    ],
  };
  const [clientProfileDetail, setClientProfileDetail] = useState({
    data: {
      emailAddress: '',
      clientName: '',
      taxIdIsSSN: 0,
      taxId: '',
      phoneNumber: '',
      phoneExt: '',
      countryCode: '+1',
      groupId: '',
      parentId: null,
      deletePreviousRecord: 0,
      isSSO: 0,
      ssoUserId: null,
    },
    error: {
      emailAddress: '',
      clientName: '',
      taxId: '',
      phoneNumber: '',
      phoneExt: '',
      groupId: '',
      parentId: '',
      ssoUserId: '',
    },
  });

  const [isRegisteredCompany, setIsRegisteredCompany] = useState(2);
  const [industryGroupList, setIndustryGroupList] = useState({
    data: [],
    error: {},
  });
  const [clientParentList, setClientParentList] = useState({
    data: [],
    error: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOnboardType] = useState(
    sessionStorage.getItem('selectedOnboardType')
  );
  const [clientId, setClientId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalActions, setModalActions] = useState(
    dialogModalActions.clientExistActions
  );
  const [modalTitle, setModalTitle] = useState('Response Error');
  const [, setApiClientProfileDetail] = useState({
    emailAddress: '',
    clientName: '',
    taxIdIsSSN: 0,
    taxId: '',
    phoneNumber: '',
    phoneExt: '',
    countryCode: '+1',
    groupId: '',
    parentId: null,
  });

  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    fetchIndustryGroupList();
    fetchClientParentList();

    if (match && match.params && match.params.clientId) {
      setClientId(match.params.clientId);
      fetchClientInformation(match.params.clientId);
    } else if (selectedOnboardType === 'self') {
      updateOnboardingStep(1);
    } else {
      updateOnboardTitle('COMPANY PROFILE SETUP');
    }
  }, []);

  const fetchClientInformation = async (clientId) => {
    const clientData = await getClientDataActivated(clientId);
    const { data = {} } = clientData;

    if (data.rows && data.rows[0]) {
      const {
        emailAddress,
        clientName,
        taxIdIsSSN,
        taxId,
        phoneNumber,
        phoneExt,
        countryCode,
        groupId,
        parentId,
      } = data.rows[0];
      setClientProfileDetail({
        ...clientProfileDetail,
        data: {
          emailAddress,
          clientName,
          taxIdIsSSN,
          taxId,
          phoneNumber,
          phoneExt,
          countryCode,
          groupId,
          parentId,
        },
      });
    }
  };

  const fetchIndustryGroupList = async () => {
    const industryGroupData = await getB2CIndustryGroupList();
    const { data, error, message } = await industryGroupData;
    if (!error) {
      setIndustryGroupList({ ...industryGroupList, data: data && data.rows });
    } else {
      // report Error Message here for not getting grouplist;
      setIndustryGroupList({ ...industryGroupList, error: message });
    }
  };

  const fetchClientParentList = async () => {
    try {
      const clientParentData = await getB2CParentClientList();
      const { data, error, message } = await clientParentData;
      if (!error) {
        setClientParentList({ ...clientParentList, data: data.rows });
      } else {
        setClientParentList({ ...clientParentList, error: message });
      }
    } catch (error) {
      //console.log("Server Error");
    }
  };

  const handleChange = (event) => {
    setIsRegisteredCompany(parseInt(event.target.value));
    setClientProfileDetail({
      ...clientProfileDetail,
      data: { ...clientProfileDetail.data, parentId: null },
      error: { ...clientProfileDetail.error, parentId: '' },
    });
  };

  const onChange = (event) => {
    const { name, type, checked } = event.target;
    let { value } = event.target;
    if (type === 'checkbox') {
      value = +checked;
    }
    if (type === 'select') {
      value = value === '' ? null : value;
    }
    setClientProfileDetail({
      ...clientProfileDetail,
      data: {
        ...clientProfileDetail.data,
        [name]: name === 'taxId' ? value.replace(/[^0-9]/g, '') : value,
        ssoUserId:
          name === 'isSSO' && !value
            ? null
            : name !== 'ssoUserId'
            ? clientProfileDetail.data?.ssoUserId
            : value.replace(/[^0-9A-Za-z]/g, ''),
      },
      error: {
        ...clientProfileDetail.error,
        ssoUserId:
          name === 'isSSO' && !value ? '' : clientProfileDetail.error.ssoUserId,
        taxId: name === "taxIdIsSSN" ? '' : clientProfileDetail.error.taxId
      },
    });
  };

  const onNext = async (e, deletePreviousRecord = 0) => {
    const valid = formValidation();
    if (valid) {
      setIsLoading(true);
      let clientProfile = {
        ...clientProfileDetail.data,
        phoneNumber:
          clientProfileDetail?.data?.phoneNumber?.replace(/-/g, '') || null,
        phoneExt:
          clientProfileDetail?.data?.phoneExt?.replace(/-/g, '') || null,
        taxId: clientProfileDetail?.data?.taxId?.replace(/-/g, '') || null,
        isSSO: isPayeeChoicePortal
          ? clientProfileDetail?.data?.isSSO
          : undefined,
        ssoUserId: isPayeeChoicePortal
          ? clientProfileDetail?.data?.ssoUserId
          : undefined,
        ...(deletePreviousRecord ? { deletePreviousRecord } : {}),
      };
      clientProfile = trim(clientProfile);
      const response = await createB2CClientProfile(clientProfile);
      const { error, data, message } = response;

      if (!error && data.clientId) {
        const {
          clientId = null,
          parentId = null,
          taxId = null,
          isVerified = null,
        } = data || [];
        sessionStorage.setItem('clientId', clientId);
        sessionStorage.setItem('parentId', parentId);

        await dispatch(
          updateOnboardingCLient({
            clientId,
            parentId,
            taxId,
            isVerified,
          })
        );
        setIsLoading(false);
        history.push(`/clientOnboard/b2c/clientPermissions/${clientId}`);
      } else {
        setIsLoading(false);
        if (
          message &&
          message ===
            'Your profile already exists in the system, do you wish to continue with the same profile information'
        ) {
          setModalActions(dialogModalActions.partialOnBoardActions);
          const { isVerified, clientId, ...apiData } = data;

          delete apiData['duns'];
          delete apiData['isHippa'];
          setApiClientProfileDetail(apiData);
          setClientProfileDetail({
            ...clientProfileDetail,
            data: { ...clientProfileDetail.data, deletePreviousRecord: 1 },
          });
        } else if (
          message &&
          message ===
            'Your profile already exists in the system, please contact to the profile owner'
        ) {
          setModalActions(dialogModalActions.clientExistActions);
        }
        setModalTitle(message || 'Response Error');
        setOpenModal(!openModal);
      }
    } else {
      setAlertMessage(
        'Validation error! Please fill the required information.'
      );
      setAlertType('error');
    }
  };

  const updateError = (data) => {
    setClientProfileDetail({
      ...clientProfileDetail,
      error: { ...clientProfileDetail.error, ...data },
    });
  };

  const formValidation = () => {
    let validation = true;
    const dataError = {};
    const { data } = clientProfileDetail;
    const reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
    const {
      emailAddress,
      clientName,
      taxId,
      phoneNumber,
      phoneExt,
      countryCode,
      groupId,
      parentId,
      isSSO,
      ssoUserId,
    } = data;
    if (!emailAddress || emailAddress.length === 0) {
      dataError.emailAddress = 'Email is required';
      validation = false;
    } else if (!reg.test(emailAddress)) {
      dataError.emailAddress = 'Please enter valid Email Address';
      validation = false;
    }
    if (!clientName || clientName.length === 0) {
      dataError.clientName = 'Company Name is required';
      validation = false;
    } else if (clientName && clientName.length > 100) {
      dataError.clientName =
        'Company Name should be less than or equals to 100 characters';
      validation = false;
    }

    if (!countryCode) {
      dataError.countryCode = 'Country Code is required';
      validation = false;
    }

    if (phoneNumber && phoneNumber.length !== 0 && phoneNumber.length !== 10) {
      dataError.phoneNumber = 'Phone Number should be of 10 digits';
      validation = false;
    } else if (
      phoneNumber &&
      phoneNumber.length !== 0 &&
      phoneNumber.startsWith('0')
    ) {
      dataError.phoneNumber = 'Phone Number should be valid';
      validation = false;
    }

    if (!taxId || taxId.trim().length === 0) {
      dataError.taxId = 'Tax ID/SSN is required';
      validation = false;
    } else if (!taxId || taxId.length !== 9) {
      dataError.taxId = 'Federal Tax ID/SSN should be of 9 digits';
      validation = false;
    } else if (!taxId || taxId.startsWith('0')) {
      dataError.taxId = 'Tax ID/SSN should be valid';
      validation = false;
    }

    if (phoneExt && phoneExt.length > 10) {
      dataError.phoneExt = 'Extension should not be more than 10 digits';
      validation = false;
    }

    if (!groupId || groupId.length === 0) {
      dataError.groupId = 'Industry Type is required';
      validation = false;
    }
    if (isRegisteredCompany === 1 && !parentId) {
      dataError.parentId = 'Parent Company is required';
      validation = false;
    }
    if (isPayeeChoicePortal && isSSO) {
      if (!ssoUserId) {
        dataError.ssoUserId = 'SinglePoint Customer ID is required';
        validation = false;
      }
    }
    updateError(dataError);
    return validation;
  };

  const Validation = (event) => {
    const { name } = event.target;
    const taxIdIsSSN = clientProfileDetail?.data?.taxIdIsSSN;
    let { value } = event.target;
    let validation = true;
    let dataError = { [name]: '' };
    switch (name) {
      case 'emailAddress':
        if (value.length === 0) {
          dataError[name] = 'Email is required';
          validation = false;
        } else if (
          !/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(
            value
          )
        ) {
          dataError[name] = 'Please enter valid Email Address';
          validation = false;
        }

        break;
      case 'clientName':
        if (value.length === 0) {
          dataError[name] = 'Company Name is required';
          validation = false;
        } else if (value && value.length > 100) {
          dataError[name] =
            'Company Name should be less than or equals to 100 characters';
          validation = false;
        }

        break;
      case 'countryCode':
        if (value.length === 0) {
          dataError[name] = 'Country Code is required';
          validation = false;
        }
        break;
      case 'taxId':
        if (!taxId || taxId.trim().length === 0) {
          dataError[name] = isPayeeChoicePortal
            ? `${identificationNumbers[taxIdIsSSN]?.name} is required`
            : 'Tax ID/SSN is required';
          validation = false;
        } else if (taxId.length !== 9) {
          dataError[name] = isPayeeChoicePortal
            ? `${identificationNumbers[taxIdIsSSN]?.name} should be of 9 digits`
            : 'Federal Tax ID/SSN should be of 9 digits';
          validation = false;
        } else if (!taxId || taxId.startsWith('0')) {
          dataError[name] = isPayeeChoicePortal
            ? `${identificationNumbers[taxIdIsSSN]?.name} should be valid`
            : 'Tax ID/SSN should be valid';
          validation = false;
        }

        break;
      case 'phoneNumber':
        if (phoneNumber.length !== 0 && phoneNumber.length !== 10) {
          dataError[name] = 'Phone Number should be of 10 digits';
          validation = false;
        } else if (phoneNumber.length !== 0 && phoneNumber.startsWith('0')) {
          dataError[name] = 'Phone Number should be valid';
          validation = false;
        }
        break;
      case 'phoneExt':
        if (value.length > 10) {
          dataError[name] = 'Please Enter a Valid phone Extention';
          validation = false;
        }
        break;
      case 'groupId':
        if (value.length === 0) {
          dataError[name] = 'Industry Type is required';
          validation = false;
        }
        break;
      case 'parentId':
        if (isRegisteredCompany === 1 && !value) {
          dataError.parentId = 'Parent Company is required';
          validation = false;
        }
        break;
      case 'ssoUserId':
        if (isPayeeChoicePortal && !value) {
          dataError.ssoUserId = 'SinglePoint Customer ID is required';
          validation = false;
        }
        break;
      default:
        break;
    }
    updateError(dataError);
  };

  const classes = useStyle();
  const { data, error } = clientProfileDetail;
  const tooltipPC = {
    title:
      "Clients have the option to maintain multiple PMTX profiles within 1 Parent Company PMTX profile. This is typically used when a company has different business lines who want to have separate PMTX profiles but management wants to have 1 profile that gives consolidated reporting and views for all the profiles. If this is the first time a company is signing up to use PMTX, they will always fall into the 'Register yourself as Parent Company' bucket here.",
    arrow: true,
    placement: 'right-end',
  };

  const tooltipSSO = {
    title: 'Register using Single Sign On ID to enable login access using single credentials',
    arrow: true,
    placement: 'right-end',
  };

  const {
    emailAddress,
    clientName,
    taxIdIsSSN,
    taxId,
    phoneNumber,
    phoneExt,
    countryCode,
    groupId,
    parentId,
    isSSO,
    ssoUserId,
  } = data;
  const {
    emailAddress: emailAddressError,
    clientName: clientNameError,
    taxId: taxIdError,
    phoneNumber: phoneNumberError,
    phoneExt: phoneExtError,
    groupId: groupIdError,
    parentId: parentIdError,
    ssoUserId: ssoUserIdError,
  } = error;

  const onCloseModal = () => {
    setOpenModal(false);
    /*setClientProfileDetail({
      ...clientProfileDetail,
      data: { ...clientProfileDetail.data, deletePreviousRecord: 0 },
    });*/
  };

  const onPartialOnBoardAbortHandler = () => {
    setOpenModal(false);
    onNext(null, 1);
  };

  const onPartialOnBoardProceedHandler = () => {
    setOpenModal(false);
    setApiClientProfileDetail((apiState) => {
      const data = apiState;
      setClientProfileDetail((state) => ({
        data: {
          ...state.data,
          ...data,
        },
        error: {
          emailAddress: '',
          clientName: '',
          taxId: '',
          phoneNumber: '',
          phoneExt: '',
          groupId: '',
          parentId: '',
          ssoUserId: '',
        },
      }));
    });
    onNext(null, 1);
  };

  const renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={hideAlertMessage}
      />
    );
  };

  const hideAlertMessage = () => {
    setAlertMessage(null);
    setAlertType(null);
  };

  return (
    <>
      <Box m={6}>
        <Paper elevation={3} className={classes.paper}>
          <Grid
            className='textfieldContainer'
            container
            direction='row'
            spacing={4}
          >
            <Grid
              item
              container
              xs={12}
              lg={12}
              justifyContent='flex-start'
              spacing={4}
            >
              <Grid item xs={6}>
                <TextField
                  color='secondary'
                  name={'clientName'}
                  id={'clientName'}
                  label={'Company Name'}
                  type='text'
                  value={clientName}
                  required
                  onChange={onChange}
                  onBlur={Validation}
                  error={Boolean(clientNameError)}
                  helperText={clientNameError}
                  disabled={Boolean(clientId)}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  select
                  color='secondary'
                  name={'taxIdIsSSN'}
                  id={'taxIdIsSSN'}
                  label={'Identification Number'}
                  type={'select'}
                  value={taxIdIsSSN}
                  required
                  onChange={onChange}
                  disabled={Boolean(clientId)}
                >
                  {identificationNumbers.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item.value}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                  {/* <MenuItem key={'0'} value={1}>
                    Social Security Number
                  </MenuItem>
                  <MenuItem key={'1'} value={0}>
                    Federal Tax ID
                  </MenuItem> */}
                </TextField>
              </Grid>

              <Grid item xs={3}>
                <TextField
                  name={'taxId'}
                  color='secondary'
                  id={'taxId'}
                  label={
                    isPayeeChoicePortal
                      ? identificationNumbers[taxIdIsSSN]?.name
                      : 'Federal Tax ID/SSN'
                  }
                  type='text'
                  value={taxId}
                  required
                  placeholder={'XXXXXXXXX'}
                  onChange={onChange}
                  onBlur={Validation}
                  error={Boolean(taxIdError)}
                  helperText={taxIdError}
                  inputProps={{ maxLength: 9 }}
                  disabled={Boolean(clientId)}
                />
              </Grid>

              <Grid container item xs={6} justifyContent='flex-start'>
                <Grid item xs={3}>
                  <CountryPhoneCode
                    name={'countryCode'}
                    id={'countryCode'}
                    label={'Country'}
                    type={'select'}
                    value={countryCode}
                    onChange={onChange}
                    disabled={Boolean(clientId)}
                    excludeCountryCode={['CA', 'UM']}
                  />
                </Grid>
                <Grid item xs={6} className={classes.gridItemSpace}>
                  <MaskedInput
                    value={phoneNumber}
                    name='phoneNumber'
                    type='text'
                    label='Phone'
                    id={'phoneNumber'}
                    onChange={onChange}
                    onBlur={Validation}
                    placeholder={'XXX-XXX-XXXX'}
                    error={Boolean(phoneNumberError)}
                    helperText={phoneNumberError}
                    inputProps={{ maxLength: 10 }}
                    disabled={Boolean(clientId)}
                    formatterProps={{
                      format: '###-###-####',
                      isNumericString: true,
                    }}
                  />
                </Grid>
                <Grid item xs={3} className={classes.gridItemSpace}>
                  <TextField
                    name={'phoneExt'}
                    color='secondary'
                    id={'phoneExt'}
                    label={'Ext'}
                    type='text'
                    value={phoneExt}
                    onChange={onChange}
                    onBlur={Validation}
                    error={Boolean(phoneExtError)}
                    helperText={phoneExtError}
                    inputProps={{ maxLength: 10 }}
                    disabled={Boolean(clientId)}
                  />
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  select
                  color='secondary'
                  name={'groupId'}
                  id={'groupId'}
                  label={'Industry Type'}
                  type={'select'}
                  value={groupId}
                  required
                  onChange={onChange}
                  onBlur={Validation}
                  error={Boolean(groupIdError)}
                  helperText={groupIdError}
                  disabled={Boolean(clientId)}
                >
                  {industryGroupList.data &&
                    industryGroupList.data.map(({ name, groupId }) => (
                      <MenuItem key={groupId} value={groupId}>
                        {name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name={'emailAddress'}
                  color='secondary'
                  id={'emailAddress'}
                  label={'Email Address'}
                  type='text'
                  value={emailAddress}
                  required
                  onChange={onChange}
                  onBlur={Validation}
                  error={Boolean(emailAddressError)}
                  helperText={emailAddressError}
                  disabled={Boolean(clientId)}
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={6}>
                  <Typography>
                    Is your Parent Company already registered with us?
                    <Tooltip {...tooltipPC}>
                      <Box
                        p={1}
                        component='div'
                        display='inline'
                        style={{ verticalAlign: 'middle' }}
                      >
                        <InfoOutlinedIcon color='primary' />
                      </Box>
                    </Tooltip>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component='div' fullWidth>
                    <RadioGroup
                      row
                      aria-label='position'
                      name='isRegisteredCompany'
                      value={isRegisteredCompany || 2}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value={1}
                        control={<Radio color='primary' />}
                        label='Registered'
                        labelPlacement='end'
                      />
                      <FormControlLabel
                        className={classes.registered}
                        value={2}
                        control={<Radio color='primary' />}
                        label='Register yourself as Parent Company'
                        labelPlacement='end'
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid item xs={3}>
                <TextField
                  select
                  color='secondary'
                  name={'parentId'}
                  id={'parentId'}
                  label={'Parent Company'}
                  type={'select'}
                  value={parentId || ''}
                  // required
                  onChange={onChange}
                  onBlur={Validation}
                  error={Boolean(parentIdError)}
                  helperText={parentIdError || ''}
                  disabled={Boolean(clientId) || isRegisteredCompany === 2}
                >
                  <MenuItem key={'none'} value={null}>
                    <em>Select Company</em>
                  </MenuItem>
                  {clientParentList.data &&
                    clientParentList.data.map(({ clientName, clientId }) => (
                      <MenuItem key={clientId} value={clientId}>
                        {clientName}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              {isPayeeChoicePortal && (
                <>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(isSSO)}
                          color='primary'
                          onChange={onChange}
                          name='isSSO'
                          icon={<CheckBoxOutlineBlankIcon />}
                          checkedIcon={<CheckBoxIcon />}
                        />
                      }
                      label='Is SSO'
                    />
                    <Tooltip {...tooltipSSO}>
                      <Box
                        p={1}
                        component='div'
                        display='inline'
                        style={{ verticalAlign: 'middle' }}
                      >
                        <InfoOutlinedIcon
                          color='primary'
                          style={{ marginTop: '4px' }}
                        />
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      color='secondary'
                      name={'ssoUserId'}
                      id={'ssoUserId'}
                      label='SSO Customer ID'
                      value={ssoUserId || ''}
                      required={Boolean(isSSO)}
                      onChange={onChange}
                      onBlur={Validation}
                      error={Boolean(ssoUserIdError)}
                      helperText={ssoUserIdError || ''}
                      inputProps={{
                        maxLength: 12,
                      }}
                      disabled={!isSSO}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            {!clientId && (
              <Grid item container xs={12} justifyContent='center' spacing={3}>
                {isLoading ? (
                  <CircularProgress color='primary' />
                ) : (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={onNext}
                    style={{ color: 'white', padding: '0.60rem 2.15rem' }}
                  >
                    Next
                  </Button>
                )}
              </Grid>
            )}
          </Grid>
        </Paper>
        {alertMessage && renderSnackbar(alertType, alertMessage)}
        <SimpleDialog
          open={openModal}
          onCloseModal={onCloseModal}
          modalActions={modalActions}
          title={modalTitle}
        />
      </Box>
    </>
  );
};

export default connect((state) => ({
  ...state.user,
}))(B2CClientProfile);
