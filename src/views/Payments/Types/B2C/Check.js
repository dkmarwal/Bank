import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import styles from '~/views/Payments/B2C/styles';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import 'react-notifications/lib/notifications.css';
import {
  addCheckDetail,
  updateCheckDetail,
  getCheckDetail,
} from '~/redux/actions/B2C/payments';
import trim from 'deep-trim-node';

class Check extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAdded: false,
      data: {
        clientId: null,
        ediInterchangeSenderId: null,
        ediGroupSenderId: null,
        ediGroupReceiverId: null,
        ediInterchangeReceiverId: null,
        originatingCompanyID: null,
        originatingDFIIdentification: null,
      },
      error: {
        clientId: '',
        ediInterchangeSenderId: '',
        ediGroupSenderId: '',
        ediGroupReceiverId: '',
        ediInterchangeReceiverId: '',
        originatingCompanyID: '',
        originatingDFIIdentification: '',
      },
    };
  }

  async componentDidMount() {
    await this.getCheckAPIData();
  }

  onChange = (event) => {
    const field = event.target.name;
    const { data } = this.state;
    const newDetail = { ...data };
    switch (field) {
      case "originatingCompanyID":
        const originatingCompanyIdentifier = event.target.value.replace(/[^a-zA-Z0-9]/g, "");
        newDetail[field] = originatingCompanyIdentifier;
        break;
      case "originatingDFIIdentification":
        const originatingDFIIdentification = event.target.value.replace(/[^0-9]/g, "");
        newDetail[field] = originatingDFIIdentification;
        break;
      default:
        newDetail[field] = event.target.value || null;
        break;
    }
    this.setState({ data: { ...newDetail } });
  };

  handleBlur = (event) => {
    const { name, value } = event.target;
    this.setState({
      data: {
        ...this.state.data,
        [name]: value?.trim() ?? value,
      },
    });
  };

  onSubmit = () => {
    const valid = this.validation();
    if (valid) {
      const clientId = sessionStorage.getItem('clientId') || null;  
      const checkData = trim(this.state.data);
      const apiCheckData = this.props.updateCheckDetail;      
      
      
      if (checkData.checkId) {
        this.props
          .dispatch(updateCheckDetail(checkData, clientId))
          .then((response) => {                        
            if (response && !response.error) {
              this.props.notification(
                'success',
                'Check data updated successfully'
              );
              this.props.onSaveBtnClick(this.props.paymentType, false);
            } else {
              const errorMsg = apiCheckData && apiCheckData.error ? apiCheckData.error : null;
              this.props.notification('error', errorMsg);
              return false;
            }
          });
      }
      else {
        this.props
          .dispatch(addCheckDetail(checkData, clientId))
          .then((response) => {                       
            if (response && !response.error) {
              this.setState({
                ...this.state,
                data: {
                  ...checkData,
                  checkId: response.data && response.data.checkId ? response.data.checkId : null
                },
              }, () => {
                this.props.notification(
                  'success',
                  'Check data saved successfully'
                );
                this.props.onSaveBtnClick(this.props.paymentType, false);
              })
            } else {
              const errorMsg = apiCheckData && apiCheckData.error ? apiCheckData.error : null;
              this.props.notification('error', errorMsg);
              return false;
            }
          });
      }
    } else {
      this.props.notification(
        'error',
        'Validation error! Please fill the required information.'
      );
    }
  };

  validation = () => {
    let valid = true;
    let validation = {};
    const {
      ediInterchangeSenderId,
      ediGroupSenderId,
      ediGroupReceiverId,
      ediInterchangeReceiverId,
      originatingCompanyID,
      originatingDFIIdentification
    } = this.state.data;

    if(ediInterchangeSenderId && ediInterchangeSenderId.length < 2) {
      validation['ediInterchangeSenderId'] =
        'EDI Interchange Sender ID cannot be less than 2 characters.';
      valid = false;
    }

    if(ediInterchangeReceiverId && ediInterchangeReceiverId.length < 2) {
      validation['ediInterchangeReceiverId'] =
        'EDI Interchange Receiver ID cannot be less than 2 characters.';
      valid = false;
    }

    if(ediGroupReceiverId && ediGroupReceiverId.length < 2) {
      validation['ediGroupReceiverId'] =
        'EDI Group App Receiver ID cannot be less than 2 characters.';
      valid = false;
    }

    if(ediGroupSenderId && ediGroupSenderId.length < 2) {
      validation['ediGroupSenderId'] =
        'EDI Group App Sender ID cannot be less than 2 characters.';
      valid = false;
    }

    if(originatingCompanyID && originatingCompanyID.length < 10) {
      validation['originatingCompanyID'] =
        'Originating Company ID cannot be less than 10 characters.';
      valid = false;
    }

    if(originatingDFIIdentification && originatingDFIIdentification.length < 9) {
      validation['originatingDFIIdentification'] =
        'Originating DFI Identification cannot be less than 9 characters.';
      valid = false;
    }

    this.setState({
      error: {
        ...validation,
      },
    });
    return valid;
  };

  getCheckAPIData = () => {
    const { showParentInfo, getCheckData } = this.props;
    const clientId = sessionStorage.getItem('clientId') || null;
    const parentId = sessionStorage.getItem('parentId');
    let Id = clientId;
    if (showParentInfo && parentId) {
      Id = parentId;
    }
    this.props.dispatch(getCheckDetail(Id)).then((response) => {
      if (response && !response.error) {
        this.setDataInState();
      } else {
        const errorMsg = getCheckData && getCheckData.error ? getCheckData.error : null;
        this.props.notification('error', errorMsg);
        return false;
      }
    });
  };

  setDataInState = () => {
    const { showParentInfo } = this.props;
    
    let finalCheckDetails = this.props.getCheckData.data;
    if (showParentInfo) {
      const { checkId, ...restDetail } = this.props.getCheckData.data;
      finalCheckDetails = restDetail;
    }
    
    if (Boolean(this.props.getCheckData) && Object.keys(this.props.getCheckData.data).length > 0) {
      this.setState({
        data: {
          ...finalCheckDetails,
        },
      });
    }
  };
  render() {
    const { classes } = this.props;
    const { error } = this.state;
    const {
      ediInterchangeSenderId,
      ediGroupSenderId,
      ediGroupReceiverId,
      ediInterchangeReceiverId,
      originatingCompanyID,
      originatingDFIIdentification
    } = this.state.data;
    return (
      <Box>
        <Grid container justify="center" spacing={2}>
          <Grid container justify="flex-start">
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 15,
                    minLength: 2,
                  }}
                  label="EDI Interchange Sender ID"
                  error={error.ediInterchangeSenderId}
                  helperText={error.ediInterchangeSenderId}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={ediInterchangeSenderId}
                  name="ediInterchangeSenderId"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 15,
                    minLength: 2,
                  }}
                  label="EDI Interchange Receiver ID"
                  error={error.ediInterchangeReceiverId}
                  helperText={error.ediInterchangeReceiverId}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={ediInterchangeReceiverId}
                  name="ediInterchangeReceiverId"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 15,
                    minLength: 2,
                  }}
                  label="EDI Group App Sender ID"
                  error={error.ediGroupSenderId}
                  helperText={error.ediGroupSenderId}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={ediGroupSenderId}
                  name="ediGroupSenderId"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 15,
                    minLength: 2,
                  }}
                  label="EDI Group App Receiver ID"
                  error={error.ediGroupReceiverId}
                  helperText={error.ediGroupReceiverId}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={ediGroupReceiverId}
                  name="ediGroupReceiverId"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 10,
                    minLength: 10,
                  }}
                  label="Originating Company ID"
                  error={error.originatingCompanyID}
                  helperText={error.originatingCompanyID}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={originatingCompanyID}
                  name="originatingCompanyID"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 9,
                    minLength: 9,
                  }}
                  label="Originating DFI Identification"
                  error={error.originatingDFIIdentification}
                  helperText={error.originatingDFIIdentification}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={originatingDFIIdentification}
                  name="originatingDFIIdentification"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                />
              </Box>
            </Grid>

          </Grid>
          <Grid container item xs={11} justify="center">
            <Button
              className={classes.b2cSaveButton}
              variant="contained"
              color="primary"
              onClick={this.onSubmit}
            >
              SAVE
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default connect((state) => ({
  ...state.clientConfig,
  ...state.b2cPayments,
  ...state.user,
  ...state.payment,
}))(withStyles(styles)(Check));
