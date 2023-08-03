import React from "react";
import { connect } from "react-redux";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@material-ui/core";
import PromptImport from "~/components/Dialogs/PromptImport";
import Bank from "~/views/Payments/Types/Bank";
import VirtualCard from "~/views/Payments/Types/VirtualCard";
import Check from "~/views/Payments/Types/Check";
import { withStyles } from "@material-ui/styles";
import styles from "./styles";
import Button from "~/components/Forms/Button";
import ExpansionBar from "~/components/ExpansionBar";
import Checkbox from "~/components/Forms/Checkbox";
import {
  getClientPaymentTypes,
  getCurrencyList,
  getClientBankInfo,
  getVirtualCardInfo,
  getCheckDetailInfo,
  getPreferredClientPaymentTypes,
  updatePreferredPaymentTypes,
  getMasterCardInfo
} from "~/redux/actions/payments";
import { updateOnboardingStep } from "~/redux/actions/clients";
import ACHIcon from "~/assets/icons/ACH_main.svg";
import EFTIcon from "~/assets/icons/EFT_main.svg";
import VCAIcon from "~/assets/icons/VCA_main.svg";
import CheckIcon from '~/assets/icons/CHK_main.svg'
import Check_selected from '~/assets/icons/check_icon_selected.svg'
import ACH_selected from "~/assets/icons/ACH_selected.svg";
import EFT_selected from "~/assets/icons/EFT_selected.svg";
import VirtualCard_selected from "~/assets/icons/VirtualCard_selected.svg";
import { getClientDataActivated } from "../../redux/actions/clients";
import "./styles.css";
import Notification from "~/components/Notification";
import { PayerTypes } from "~/config/entityTypes";

class Payments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: sessionStorage.getItem("clientId"),
      isLoading: true,
      parentId: null,
      isHippa: null,
      selectedTab: 0,
      paymentTypes: [],
      selectedPaymentTypes: [],
      currencyList: [],
      bankDetail: null,
      preBankDetail: {},
      eftDetail: null,
      preEFTDetail: {},
      virtualCardDetail: null,
      checkDetail: null,
      updateProgress: {},
      errors: [],
      validation: {},
      importParentId: null,
      showParentInfo: false,
      paymentModeIcons: {
        ACH: ACHIcon,
        ACH_selected: ACH_selected,
        EFT: EFTIcon,
        EFT_selected: EFT_selected,
        VCA: VCAIcon,
        VCA_selected: VirtualCard_selected,
        CHK: CheckIcon,
        CHK_selected: Check_selected,
      },
      expandedAccordians: {
        CHK: false,
        EFT: false,
        VCA: false,
        ACH: false,
      },
      alertType: null,
      alertMsg: null,
      payerTypeId: null
    };
  }

  handlePaymentModeChange = (fileFormatId, isChecked) => {
    const { selectedPaymentTypes } = this.state;
    if (isChecked) {
      this.setState({
        selectedPaymentTypes: [...selectedPaymentTypes, fileFormatId],
      });
    } else {
      const newState = selectedPaymentTypes.filter((id) => id !== fileFormatId);
      this.setState({
        selectedPaymentTypes: newState || [],
      });
    }
  };

  async componentDidMount() {
    this.props.updateOnboardingStep(4);
    const clientId = sessionStorage.getItem("clientId");
    await this.fetchClientInformation(clientId);
    this.fetchCurrencyList();
    this.fetchBankDetail(clientId);
    this.fetchEFTDetail(clientId);
    this.fetchVirtualCardDetail(clientId);
    this.fetchMasterCardDetail(clientId);
    this.fetchCheckDetail(clientId);
    this.fetchPaymentTypes();
  }

  fetchClientInformation = async (clientId) => {
    const clientData = await getClientDataActivated(clientId);
    const { data = {}, error, message } = clientData;
    let parentId = null;
    let isHippa = null;
    let payerTypeId = null;
    if (data.rows && data.rows[0]) {
      clientId = data.rows[0].clientId;
      parentId = data.rows[0].parentId;
      isHippa = data.rows[0].isHippa;
      payerTypeId = data.rows[0].payerTypeId;
    }
    this.setState({
      clientId: clientId,
      parentId: parentId,
      isHippa: isHippa,
      payerTypeId: payerTypeId
    });
  };

  fetchCurrencyList = () => {
    this.props.dispatch(getCurrencyList()).then((response) => {
      if (!response) {
        return false;
      }
      this.setState({
        currencyList: this.props.payment.currencyList.rows,
      });
    });
  };

  fetchPaymentTypes = () => {
    const { dispatch } = this.props;
    const clientId = sessionStorage.getItem("clientId");
    dispatch(getClientPaymentTypes(clientId))
      .then((response) => {
        if (!response) {
          return false;
        }
        const paymentTypes = response.rows || [];

        this.setState(
          {
            isLoading: false,
            paymentTypes,
          },
          () => this.fetchPreferredPaymentTypes(clientId)
        );
      })
      .catch((error) => {
      });
  };

  fetchPreferredPaymentTypes = (clientId) => {
    this.props
      .dispatch(getPreferredClientPaymentTypes(clientId))
      .then((response) => {
        if (!response) {
          return false;
        }

        let selectedPaymentMethod = response.rows ? response.rows : [];
        this.setState({
          selectedPaymentTypes: selectedPaymentMethod,
        });
        const { paymentTypes, payerTypeId, selectedPaymentTypes } = this.state;

        // for Commercial card we have only master card 2.0
        if (payerTypeId == PayerTypes.CARDS && selectedPaymentTypes.length == 0) {
          this.setState({
            selectedPaymentTypes: [16]
          })
        }

        this.setState({
          ...this.state,
          paymentTypes: paymentTypes.map((paymentType) => ({
            ...paymentType,
            selected: Boolean(
              selectedPaymentMethod.includes(paymentType.paymentTypeId)
            ),
          })),
        });
      });
  };

  fetchBankDetail = async (clientId) => {
    const response = await this.props.dispatch(
      getClientBankInfo({ clientId, paymentType: "ACH" })
    );
    if (!response) {
      return false;
    }
    let bankDetailInfo = this.props.payment.bankDetail;
    if (this.state.showParentInfo) {
      const { accountId, ...restDetail } = this.props.payment.bankDetail;
      bankDetailInfo = restDetail;
    }

    this.setState({
      bankDetail: { ...bankDetailInfo },
    });
  };

  fetchEFTDetail = (clientId) => {
    this.props
      .dispatch(getClientBankInfo({ clientId, paymentType: "EFT" }))
      .then((response) => {
        if (!response) {
          return false;
        }
        let eftDetailInfo = this.props.payment.eftDetail;

        if (this.state.showParentInfo) {
          const { accountId, ...restDetail } = this.props.payment.eftDetail;
          eftDetailInfo = restDetail;
        }
        this.setState({
          eftDetail: eftDetailInfo,
        });
      });
  };

  fetchVirtualCardDetail = (clientId) => {
    this.props.dispatch(getVirtualCardInfo({ clientId })).then((response) => {
      if (!response) {
        return false;
      }

      let VCDetailInfo = this.props.payment.virtualCardDetails;
      if (this.state.showParentInfo && this.props.payment.virtualCardDetails) {
        const {
          cardAccountDetailsId,
          ...restDetail
        } = this.props.payment.virtualCardDetails;
        VCDetailInfo = restDetail;
      }
      this.setState({
        virtualCardDetail: VCDetailInfo,
      });
    });
  };

  fetchMasterCardDetail = (clientId) => {
    this.props.dispatch(getMasterCardInfo({ clientId })).then((response) => {
      if (!response) {
        return false;
      }
    });
  };

  fetchCheckDetail = (clientId) => {
    this.props.dispatch(getCheckDetailInfo({ clientId })).then((response) => {
      if (!response) {
        return false;
      }

      const checkDetil = this.props.payment.checkDetails;
      if (Object.keys(checkDetil).length !== 0) {
        this.setState({
          checkDetail: { ...this.props.payment.checkDetails },
        });
      }
    });
  };

  handleNext = () => {
    const { selectedPaymentTypes, clientId } = this.state;
    if (selectedPaymentTypes.length > 0) {
      this.props
        .dispatch(updatePreferredPaymentTypes(clientId, selectedPaymentTypes))
        .then((response) => {
          if (!response) {
            this.setState({
              updateProgress: false,
            });
            //alert("Error in API");
            //this.setState({updateProgress: false});
            return false;
          }
          this.props.dispatch(updateOnboardingStep());
          this.props.history.push({
            pathname: "/clientOnboard/fileSettings",
          });

          this.setState({
            updateProgress: false,
          });
        });
    } else {
      this.setState({
        updateProgress: false,
      });
      //alert("Atleast one payment type must be selected");
    }
  };

  importParentInformation = () => {
    const importParentId = sessionStorage.getItem("parentId");
    this.setState({
      isLoading: true,
    });
    this.fetchPreferredPaymentTypes(importParentId);
    this.fetchBankDetail(importParentId);
    this.fetchEFTDetail(importParentId);
    this.fetchVirtualCardDetail(importParentId);
    this.fetchCheckDetail(importParentId);
    this.fetchMasterCardDetail(importParentId);
    this.setState({
      isLoading: false,
      paymentTypes: this.props.payment.types.rows,
      showParentInfo: true,
    });
  };

  isPaymentTypeSelected = (paymentTypeCode) => {
    const { paymentTypes, selectedPaymentTypes } = this.state;
    if (Array.isArray(paymentTypes) && paymentTypes.length > 0) {
      const paymentTypeDetail = paymentTypes.filter(
        ({ paymentCode }) => paymentCode === paymentTypeCode
      );
      const currentPaymentTypeID =
        paymentTypeDetail.length && paymentTypeDetail[0].fileFormatId;
      return selectedPaymentTypes.includes(currentPaymentTypeID);
    }
    return false;
  };

  toggleAccordian = (type, isExpand = false) => {
    this.setState({
      expandedAccordians: {
        ...this.state.expandedAccordians,
        [type]: isExpand,
      },
    });
  };

  notification = (type, msg) => {
    if (msg) {
      this.setState({
        alertMsg: msg,
        alertType: type
      })
    }
  }

  renderSnackbar = (type, msg) => {
    return <Notification variant={type} message={msg} handleClose={this.hideAlertMessage} />
  }

  hideAlertMessage = () => {
    this.setState({
      alertMsg: null,
      alertType: null
    })
  }

  render() {
    const {
      selectedTab,
      paymentTypes,
      preBankDetail,
      bankDetail,
      updateProgress,
      eftDetail,
      preEFTDetail,
      virtualCardDetail,
      checkDetail,
      currencyList,
      selectedPaymentTypes,
      validation,
      paymentModeIcons,
      showParentInfo,
      parentId,
      clientId,
      isHippa,
      alertType,
      alertMsg,
      payerTypeId
    } = this.state;
    const { classes } = this.props;

    return (
      <>
        {Boolean(parentId) && (
          <Grid
            container
            direction="row"
            spacing={2}
            justify="center"
            alignItems="center"
          >
            <Box m={2} width="100%">
              <PromptImport
                promptText="We noticed that client's parent company is registered with us. Would you like to import the payment information?"
                importCb={this.importParentInformation}
              />
            </Box>
          </Grid>
        )}
        <Box className={classes.pRelative} mx={6} my={4}>
          <Paper display="flex" className={classes.root} elevation={0}>
            <Box p={3}>
              <Grid
                container
                direction="row"
                justify="flex-start"
                className={classes.gridContainers}

              >
                {payerTypeId != PayerTypes.CARDS ?
                  <Grid container item direction="row" spacing={2}>
                    <Grid item xs={12}>
                      <Box py={2} pl={1}>
                        <Typography className={classes.genralTitleBold}>
                          Please select modes of payment*:
                        </Typography>
                      </Box>
                    </Grid>

                    {this.state.isLoading ? (
                      <Grid item container justify="center" alignItems="center">
                        <CircularProgress color="primary" />
                      </Grid>
                    ) : (
                      !!paymentTypes &&
                      paymentTypes.map(
                        ({ label, description, paymentCode, fileFormatId }, index) => {
                          const checked = Boolean(
                            selectedPaymentTypes.includes(fileFormatId)
                          );
                          return (
                            <Grid
                              className="checkboxContainer"
                              key={`payment-mode-${index}`}
                              item
                              xs={3}
                              style={{ marginBottom: "16px" }}
                            >
                              <Box className={classes.paymentcheckedBox}>
                                <Checkbox
                                  color="primary"
                                  checked={checked}
                                  paymentClassName="paymentBox"
                                  label={label}
                                  index={index}
                                  icon={
                                    <Box display="flex" justifyContent="center">
                                      {" "}
                                      <img
                                        src={
                                          paymentModeIcons[
                                          `${paymentCode}${checked ? "_selected" : ""
                                          }`
                                          ]
                                        }
                                        alt={paymentCode}
                                        width="24"
                                        height="24"
                                      />
                                    </Box>
                                  }
                                  onChange={(e, index, isChecked) =>
                                    this.handlePaymentModeChange(
                                      fileFormatId,
                                      isChecked
                                    )
                                  }
                                />
                                </Box>
                            </Grid>
                          );
                        }
                      )
                    )}
                  </Grid> : null}
                <Grid
                  container
                  item
                  direction="column"
                  justify="flex-start"
                  className={classes.gridContainers}

                >
                  {this.isPaymentTypeSelected("ACH") && (
                    <Grid item spacing={2}>
                      <ExpansionBar
                        className={classes.accord}
                        expanded={this.state.expandedAccordians["ACH"]}
                        onChange={(e) => {
                          e.preventDefault();
                          this.toggleAccordian(
                            "ACH",
                            !this.state.expandedAccordians["ACH"]
                          );
                        }}
                        label="Please enter the Company Bank Account Details (Optional-Can be entered later)"
                      >
                        <Box>
                          <Bank
                            bankDetail={bankDetail}
                            paymentType="ACH"
                            currencyList={currencyList}
                            clientId={clientId}
                            parentId={parentId}
                            isHippa={isHippa}
                            showParentInfo={showParentInfo}
                            onPaymentMethodSave={this.toggleAccordian}
                            notification={this.notification}
                          />
                        </Box>
                      </ExpansionBar>
                    </Grid>
                  )}
                  {this.isPaymentTypeSelected("EFT") && (
                    <Grid item xs={12}>
                      <ExpansionBar
                        className={classes.accord}
                        expanded={this.state.expandedAccordians["EFT"]}
                        onChange={(e) => {
                          e.preventDefault();
                          this.toggleAccordian(
                            "EFT",
                            !this.state.expandedAccordians["EFT"]
                          );
                        }}
                        label="Please enter the EFT Bank Account Details (Optional-Can be entered later)"
                      >
                        <Bank
                          bankDetail={eftDetail}
                          paymentType="EFT"
                          currencyList={currencyList}
                          clientId={clientId}
                          parentId={parentId}
                          isHippa={isHippa}
                          showParentInfo={showParentInfo}
                          onPaymentMethodSave={this.toggleAccordian}
                          notification={this.notification}
                        />
                      </ExpansionBar>
                    </Grid>
                  )}
                  {this.isPaymentTypeSelected("VCA") && (
                    payerTypeId != PayerTypes.CARDS ?
                      <Grid item xs={12} className={classes.accordGrid}>
                        <ExpansionBar
                          className={classes.accord}
                          //expanded={this.state.expandedAccordians["VCA"]}
                          expanded={this.state.expandedAccordians["VCA"]}
                          onChange={(e) => {
                            e.preventDefault();
                            this.toggleAccordian(
                              "VCA",
                              !this.state.expandedAccordians["VCA"]
                            );
                          }}
                          label="Please enter the Company Virtual Card Details (Optional-Can be entered later)"
                        >
                          <VirtualCard
                            virtualCardDetail={virtualCardDetail}
                            paymentType="VCA"
                            currencyList={currencyList}
                            clientId={clientId}
                            parentId={parentId}
                            isHippa={isHippa}
                            showParentInfo={showParentInfo}
                            onPaymentMethodSave={this.toggleAccordian}
                            notification={this.notification}
                            payerTypeId={payerTypeId}
                          />
                        </ExpansionBar>
                      </Grid>
                      :
                      <VirtualCard
                        virtualCardDetail={virtualCardDetail}
                        paymentType="VCA"
                        currencyList={currencyList}
                        clientId={clientId}
                        parentId={parentId}
                        isHippa={isHippa}
                        showParentInfo={showParentInfo}
                        onPaymentMethodSave={this.toggleAccordian}
                        notification={this.notification}
                        payerTypeId={payerTypeId}
                        selectedPaymentTypes={selectedPaymentTypes}
                      />
                  )}
                  {this.isPaymentTypeSelected("CHK") && (
                    <Grid item xs={12}>
                      <ExpansionBar
                        className={classes.accord}
                        expanded={this.state.expandedAccordians["CHK"]}
                        onChange={(e) => {
                          e.preventDefault();
                          this.toggleAccordian(
                            "CHK",
                            !this.state.expandedAccordians["CHK"]
                          );
                        }}
                        label="Please enter the Check Details (Optional-Can be entered later)"
                      >
                        <Check
                          clientId={clientId}
                          parentId={parentId}
                          checkDetails={checkDetail}
                          paymentType="CHK"
                          showParentInfo={showParentInfo}
                          onPaymentMethodSave={this.toggleAccordian}
                          notification={this.notification}
                        />
                      </ExpansionBar>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Paper>
          {payerTypeId !== 2 && 
          <Grid container direction="row" alignItems="center" spacing={3}>
            <Grid container item xs={12} justify="center">
              <Button
                color={
                  selectedPaymentTypes.length > 0
                    ? "primary"
                    : "secondary"
                }
                disabled={selectedPaymentTypes.length > 0 ? false : true}
                variant="contained"
                onClick={(event) => this.handleNext(event)}
                style={{ padding: "0.60rem 2.15rem", marginTop: "24px", fontSize: 14 }}
              >
                NEXT
              </Button>
            </Grid>
          </Grid>
          }
        </Box>
        {alertMsg && this.renderSnackbar(alertType, alertMsg)}
      </>
    );
  }
}

export default connect((state) => ({ ...state.user, ...state.payment }))(
  withStyles(styles)(Payments)
);
