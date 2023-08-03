import React from "react";
import { connect } from "react-redux";

import {
  Grid,
  Paper,
  Box,
  Typography,
} from "@material-ui/core";

import { TabPanel } from "~/components/TabPanel/index";
import Notification from "~/components/Notification";
import { AlertDialog } from "~/components/Dialogs";
import PayerInfo from "~/modules/Campaign/SelectPayer/";
import SetUpInfo from "~/modules/Campaign/SetUp/";
import OfferInfo from "~/modules/Campaign/Offers/";

import {
  fetchValidationList,
  fetchCampaignList,
  fetchOfferTypes,
  fetchPayerList,
  createCampaign,
} from "~/redux/actions/campaign";
import { withStyles } from "@material-ui/styles";

import CustomizedSteppers from "~/components/Stepper/Stepper";

import config from "~/config";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    margin: "20px",
    padding: "15px",
    textAlign: "left",
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  inputLabel: {
    margin: ".5rem 0",
    color: "#76777b",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "25px",
    display: "block",
    marginBottom: 0,
  },
  fieldset: {
    border: "1px solid #d8d8d8",
    padding: "0 20px 10px 20px",
    width: "90%",
    display: "block",
    marginBottom: "20px",
  },
  legend: {
    width: "auto",
    padding: "5px",
    fontSize: "14px",
    borderBottom: "0px",
    fontWeight: "500",
    marginBottom: "10px",
  },
  gridItem: {
    margin: 0,
  },
  panel: {
    background: "#fff",
  },
  pageHeader: {
    borderBottom: "0px",
    padding: "0px 0px 15px 0px",
    letterSpacing: "1px",
    fontSize: "24px",
    color: "#243d7d",
  },
  mandatory: {
    color: "#ff0000",
  },
  header: {
    marginBottom: 0,
    marginTop: "60px",
    width: "100%",
  },
  headingTop: {
    fontWeight: "bold",
    margin: "5px 0px",
    padding: "35px 0px 0px 20px",
    fontSize: "34px",
    color: "#0b1941",
  },
});

class AddView extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      isLoading: true,
      selectedTab: 0,
      selectedPayer: null,
      payerName: "",
      supplierFile: null,
      payerList: [],
      validation: {},
      payerProgress: false,
      setupProgress: false,
      valdationListProgress: false,
      campaignListProgress: false,
      offerProgress: false,
      offerTypeProgress: false,
      alertMessage: null,
      alertMessageCallbackType: null,
      stepperInfo: ["SELECT PAYER", "SETUP", "OFFER DETAILS"],
      dataInfo: {},      
      campaignList: [],
      campaignTypes: [
        { value: "ACH", label: "ACH Only" },
        { value: "VCA", label: "VCA Only" },
        { value: "ENROLL_ONLY", label: "Enroll Only" },
      ],
      countryList: [
        { value: "US", label: "US" },
        { value: "CA", label: "CA" },
      ],
      currencyList: [
        { value: "USD", label: "USD" },
        { value: "CAD", label: "CAD" },
      ],
      validationList: [],
      selectedPayerValidations: [],
      isHippaEnabled: "no",
      micrositesEnabled: 0,
      autoloadEnabled: 0,
      validationEnabled: "no",
      PAFEnabled: "no",
      PVTEnabled: "no",
      introText: "",
      offerList: [
        {
          achEnabled: 0,
          acceptanceText: "",
          offerType: "",
          acceptanceRules: [
            {
              offerId: "",
              amountFrom: "",
              amountTo: "",
              currency: "",
              term: "",
              rule: "",
            },
          ],
        },
      ],
      offerTypes: [],
      acceptanceRules: [
        {
          offerId: "",
          amountFrom: "",
          amountTo: "",
          currency: "",
          term: "",
          rule: "",
        },
      ],
    };
  }

  handleTabChange(id) {
    this.setState({ selectedTab: id, validation: {} });
  }

  componentDidMount() {
    this.getValidationList();    
    this.getPayerList();
  }

  getPayerList = () => {
    this.setState(
      {
        payerProgress: true,
      },
      () => {
        const { info } = this.props.user;
        const payerTypeId = 1; //FSINPAYB2B-14087: 1 for b2b user
        this.props
          .dispatch(
            fetchPayerList({
              userId: info.userId,
              appType: 1,
              portalProfileId: info.portalProfileId,
              portalTypeId: info.portalTypeId,
              payerTypeId: payerTypeId
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.campaign.error,
                payerProgress: false,
              });
              return false;
            }

            this.setState({
              payerProgress: false,
              payerList: this.props.campaign.payerList,
            });
          });
      }
    );
  };

  getValidationList = () => {
    this.setState(
      {
        valdationListProgress: true,
      },
      () => {
        const { info } = this.props.user;

        this.props
          .dispatch(
            fetchValidationList({
              userId: info.userId,
              portalProfileId: info.portalProfileId,
              portalTypeId: info.portalTypeId,
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.campaign.error,
                valdationListProgress: false,
              });
              return false;
            }

            this.setState({
              valdationListProgress: false,
              validationList: this.props.campaign.validationList,
            });
          });
      }
    );
  };

  getCampaignList = (selectedPayer) => {
    this.setState(
      {
        campaignListProgress: true,
      },
      () => {
        const { info } = this.props.user;

        this.props
          .dispatch(
            fetchCampaignList({
              payerId: selectedPayer,
              userId: info.userId,
              portalProfileId: info.portalProfileId,
              portalTypeId: info.portalTypeId,
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.campaign.error,
                campaignListProgress: false,
              });
              return false;
            }

            this.setState({
              campaignListProgress: false,
              campaignList: this.props.campaign.campaignList,
            });
          });
      }
    );
  };

  getOfferTypes = () => {
    const { dataInfo } = this.state;
    const campaignType = dataInfo.campaignType === 'ENROLL_ONLY' ? "non_pmtx" : "pmtx";
    this.setState(
      {
        offerTypeProgress: true,
      },
      () => {        
        this.props
          .dispatch(
            fetchOfferTypes({
              campaignType: campaignType
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.campaign.error,
                offerTypeProgress: false,
              });
              return false;
            }

            this.setState({
              offerTypeProgress: false,
              offerTypes: this.props.campaign.offerTypes,
            });
          });
      }
    );
  };

  handleChange = (field, event, position) => {
    const { payerList } = this.state;    
    const sPayerList =
      payerList &&
      payerList.filter((item) => item.clientId == event.target.value);
    const payerName =
      (sPayerList && sPayerList[0] && sPayerList[0].clientName) || "";
    const isHippaEnabled =
      sPayerList && sPayerList[0] && sPayerList[0].isHippa == 1 ? "yes" : "no";

    switch (field) {
      case "selectedPayer":
        const selectedPayer = event.target.value;
        this.setState({
          selectedPayer: selectedPayer,
          payerName: payerName,
          isHippaEnabled: isHippaEnabled,
        });
        this.getCampaignList(selectedPayer);
        break;
      default:
        break;
    }
  };

  handleOfferChange = (field, event, value, position) => {
    const { offerList, dataInfo, payerName } = this.state;
    const newOfferList = [...offerList];    

    switch (field) {
      case "achEnabled":
        if (value.value == 1) {
          let achEnabledList =
            newOfferList &&
            newOfferList.map((item, index) => {
              return index == position
                ? { ...item, achEnabled: value.value }
                : item;
            });
          this.setState({ offerList: achEnabledList, validation: {} });
        } else {
          let achEnabledList =
            newOfferList &&
            newOfferList.map((item, index) => {
              return index == position
                ? {
                  ...item,
                  achEnabled: value.value,
                  achLimit: null,
                  achLimitRule: null,
                }
                : item;
            });
          this.setState({ offerList: achEnabledList, validation: {} });
        }

        break;
      case "achLimit":
        const achLimitList =
          newOfferList &&
          newOfferList.map((item, index) => {
            return index == position
              ? { ...item, achLimit: event.target.value }
              : item;
          });
        this.setState({ offerList: achLimitList, validation: {} });
        break;
      case "achLimitRule":
        const achLimitRuledList =
          newOfferList &&
          newOfferList.map((item, index) => {
            return index == position
              ? { ...item, achLimitRule: event.target.value }
              : item;
          });
        this.setState({ offerList: achLimitRuledList, validation: {} });
        break;
      case "introText":
        const introText = event.target.value;
        this.setState({ introText: introText, validation: {} });
        break;
      case "offerType":
        const offerType = event.target.value;
        let clientIntroText = "";
        let clientAcceptanceText = "";
        if (dataInfo.campaignType === 'ENROLL_ONLY') {
          clientIntroText = introText ? introText : `${payerName} would like to collect your payment preference and respective banking information in order to send payments to you. Please select your preference from the options below.`;
          if (offerType === "CROSS_BORDER") {
            clientAcceptanceText = `Please confirm that you would like to receive Cross Border EFT/ACH payments from ${payerName} by selecting this option.`;
          }
          if (offerType === "WIRE") {
            clientAcceptanceText = `Please confirm that you would like to receive Wire payments from ${payerName} by selecting this option.`;
          }
        }

        const newOffList =
          newOfferList &&
          newOfferList.map((item, index) => {
            return index == position
              ? {
                ...item,
                offerType: offerType,
                achLimit: null,
                achLimitRule: null,
                acceptanceText: clientAcceptanceText
              }
              : item;
          });
        this.setState({ offerList: newOffList, validation: {} });
        break;
      case "acceptanceText":
        const acceptanceText = event.target.value;
        const acceptanceTextList =
          newOfferList &&
          newOfferList.map((item, index) => {
            return index == position
              ? { ...item, acceptanceText: acceptanceText }
              : item;
          });
        this.setState({ offerList: acceptanceTextList, validation: {} });
        break;
      default:
        break;
    }
  };

  handleCancel = () => {
    this.props.history.push(`${config.baseName}/dashboard`);
  };

  handleAddOffer = () => {
    const { offerList } = this.state;
    const newOfferList = [
      ...offerList,
      {
        achEnabled: 0,
        acceptanceText: "",
        offerType: "",
        acceptanceRules: [
          {
            offerId: "",
            amountFrom: "",
            amountTo: "",
            currency: "",
            term: "",
            rule: "",
          },
        ],
      },
    ];
    this.setState({ offerList: newOfferList, validation: {} });
  };

  handleRemoveOffer = (event, offerId) => {
    const { offerList } = this.state;
    const newOfferList =
      offerList && offerList.filter((item, index) => index != offerId);
    this.setState({ offerList: newOfferList, validation: {} });
  };

  handleAddRule = (event, offerId) => {
    const { offerList } = this.state;
    const offerItem =
      offerList && offerList.filter((item, index) => index == offerId);
    const acceptanceRules =
      (offerItem && offerItem[0] && offerItem[0].acceptanceRules) || [];

    let newAcceptanceRulesList =
      offerList &&
      offerList.map((item, index) => {
        return index == offerId
          ? {
            ...item,
            acceptanceRules: [
              ...acceptanceRules,
              {
                offerId: offerId,
                amountFrom: "",
                amountTo: "",
                currency: "",
                term: "",
                rule: "",
              },
            ],
          }
          : item;
      });
    this.setState({ offerList: newAcceptanceRulesList, validation: {} });
  };

  handleRemoveRule = (event, offerId, ruleIndex) => {
    const { offerList } = this.state;
    const offerItem =
      offerList && offerList.filter((item, index) => index == offerId);
    const acceptanceRules =
      offerItem &&
      offerItem[0] &&
      offerItem[0].acceptanceRules.filter((item, index) => index != ruleIndex);

    const newOfferList =
      offerList &&
      offerList.map((item, index) => {
        return index == offerId
          ? { ...item, acceptanceRules: [...acceptanceRules] }
          : item;
      });

    this.setState({ offerList: newOfferList, validation: {} });
  };

  handleChangeRule = (field, event, offerId, ruleIndex) => {
    const { offerList } = this.state;    

    const offerItem =
      offerList && offerList.filter((item, index) => index == offerId);
    switch (field) {
      case "amountFrom":
        const amountFrom = event.target.value;

        const acceptanceRules =
          offerItem &&
          offerItem[0] &&
          offerItem[0].acceptanceRules.map((item, index) => {
            return index == ruleIndex
              ? { ...item, amountFrom: amountFrom }
              : item;
          });

        const newOfferList =
          offerList &&
          offerList.map((item, index) => {
            return index == offerId
              ? { ...item, acceptanceRules: [...acceptanceRules] }
              : item;
          });

        this.setState({ offerList: newOfferList, validation: {} });
        break;
      case "amountTo":
        const amountTo = event.target.value;
        const amountToacceptanceRules =
          offerItem &&
          offerItem[0] &&
          offerItem[0].acceptanceRules.map((item, index) => {
            return index == ruleIndex ? { ...item, amountTo: amountTo } : item;
          });

        const amountToacceptanceRulesnewOfferList =
          offerList &&
          offerList.map((item, index) => {
            return index == offerId
              ? { ...item, acceptanceRules: [...amountToacceptanceRules] }
              : item;
          });

        this.setState({
          offerList: amountToacceptanceRulesnewOfferList,
          validation: {},
        });
        break;
      case "currency":
        const currencyTo = event.target.value;
        const currencyToacceptanceRules =
          offerItem &&
          offerItem[0] &&
          offerItem[0].acceptanceRules.map((item, index) => {
            return index == ruleIndex
              ? { ...item, currency: currencyTo }
              : item;
          });

        const currencyToacceptanceRulesnewOfferList =
          offerList &&
          offerList.map((item, index) => {
            return index == offerId
              ? { ...item, acceptanceRules: [...currencyToacceptanceRules] }
              : item;
          });

        this.setState({
          offerList: currencyToacceptanceRulesnewOfferList,
          validation: {},
        });
        break;
      case "term":
        const termTo = event.target.value;
        const re = /^[0-9\b]+$/;

        const termToacceptanceRules =
          offerItem &&
          offerItem[0] &&
          offerItem[0].acceptanceRules.map((item, index) => {
            return index == ruleIndex ? { ...item, term: termTo } : item;
          });

        const termToacceptanceRulesnewOfferList =
          offerList &&
          offerList.map((item, index) => {
            return index == offerId
              ? { ...item, acceptanceRules: [...termToacceptanceRules] }
              : item;
          });
        if (termTo === "" || re.test(termTo)) {
          this.setState({
            offerList: termToacceptanceRulesnewOfferList,
            validation: {},
          });
        }
        break;
      case "rule":
        const ruleTo = event.target.value;
        const ruleToacceptanceRules =
          offerItem &&
          offerItem[0] &&
          offerItem[0].acceptanceRules.map((item, index) => {
            return index == ruleIndex ? { ...item, rule: ruleTo } : item;
          });

        const ruleToacceptanceRulesnewOfferList =
          offerList &&
          offerList.map((item, index) => {
            return index == offerId
              ? { ...item, acceptanceRules: [...ruleToacceptanceRules] }
              : item;
          });

        this.setState({
          offerList: ruleToacceptanceRulesnewOfferList,
          validation: {},
        });
        break;
      default:
        break;
    }
  };

  handleSetUpChange = (field, event, value, position) => {
    const {
      validationList,
      micrositesEnabled,
      dataInfo,
      campaignTypes,
      campaignList,
      offerList,
      introText,
      payerName
    } = this.state;
    const newDataInfo = { ...dataInfo };
    const newCampaignTypes = [...campaignTypes];

    switch (field) {
      case "supplierFile":
        const supplierFile = event.target.files[0];
        this.setState({ supplierFile: supplierFile, validation: {} });
        break;
      case "micrositesEnabled":        
        const nct =
          newCampaignTypes &&
          newCampaignTypes.filter((item) => item.value !== "ENROLL_ONLY");        
        if (value.value == 1) {
          this.setState({
            micrositesEnabled: 1,
            autoloadEnabled: 0,
            supplierFile: null,
          });
        } else {
          this.setState({ micrositesEnabled: 0 });
        }
        break;
      case "autoloadEnabled":  
        if (
          newDataInfo &&
          newDataInfo["campaignType"] !== "ENROLL_ONLY" &&
          value.value == 1 &&
          (!micrositesEnabled || micrositesEnabled !== 1)
        ) {
          this.setState({ autoloadEnabled: 1 });
        } else {
          this.setState({ autoloadEnabled: 0 });
        }
        break;
      case "validationEnabled":
        const validationEnabled = event.target.value;

        if (validationEnabled === "yes") {
          const selectedPayerValidations =
            (validationList &&
              validationList.map((item) => item.validationTypeId)) ||
            [];
          this.setState({
            validationEnabled: validationEnabled,
            selectedPayerValidations: selectedPayerValidations,
          });
        } else {
          this.setState({
            validationEnabled: validationEnabled,
            PAFEnabled: "no",
            PVTEnabled: "no",
            selectedPayerValidations: [],
          });
        }
        break;
      case "PAFEnabled":
        const PAFEnabled = event.target.value;
        this.setState({ PAFEnabled: PAFEnabled });
        break;
      case "PVTEnabled":
          const PVTEnabled = event.target.value;
          this.setState({ PVTEnabled: PVTEnabled });
          break;  
      case "phone":
        const phoneValue = event.target.value;
        newDataInfo["phoneCountryCode"] = phoneValue.ccode;
        newDataInfo["phone"] = phoneValue.phone;
        newDataInfo["phoneExt"] = phoneValue.ext;
        this.setState({ dataInfo: { ...newDataInfo } });
        break;
      case "email":
        const email = event.target.value;
        newDataInfo["email"] = email;
        this.setState({ dataInfo: { ...newDataInfo } });
        break;
      case "campaignName":
        const campaignName = event.target.value;
        const scl =
          campaignList &&
          campaignList.filter((item) => item.campaignId == campaignName);
        const micrositesEnabledFlag =
          scl.length > 0
            ? scl[0] && scl[0].isMicrosite == 1
              ? true
              : false
            : false;

        const campaignTypeValue =
          scl.length > 0 ? (scl[0] && scl[0].campaignType) || "" : "";
        newDataInfo["campaignName"] = campaignName;        
        newDataInfo["campaignType"] = campaignTypeValue;
        newDataInfo["country"] = null;
        newDataInfo["currency"] = null;
       
        let newOffList = [...offerList];
        let newIntroText = introText;
        if (campaignTypeValue === "ACH") {
          newIntroText = "";
          newOffList = [
            {
              achEnabled: 0,
              acceptanceText: "",
              offerType: "",
              acceptanceRules: [
                {
                  offerId: "",
                  amountFrom: "",
                  amountTo: "",
                  currency: "",
                  term: "",
                  rule: "",
                },
              ],
            },
          ];
        }
        if (campaignTypeValue === "VCA") {
          newIntroText = "";
          newOffList =
            offerList && offerList.length > 0
              ? offerList
              : [
                {
                  achEnabled: 0,
                  acceptanceText: "",
                  offerType: "",
                  acceptanceRules: [
                    {
                      offerId: "",
                      amountFrom: "",
                      amountTo: "",
                      currency: "",
                      term: "",
                      rule: "",
                    },
                  ],
                },
              ];
        }        
        if (campaignTypeValue === "ENROLL_ONLY") {
          newIntroText = `${payerName} would like to collect your payment preference and respective banking information in order to send payments to you. Please select your preference from the options below.`;
          newOffList = offerList && offerList.length > 0
            ? offerList
            : [
              {
                achEnabled: 0,
                acceptanceText: "",
                offerType: "",
                acceptanceRules: [
                  {
                    offerId: "",
                    amountFrom: "",
                    amountTo: "",
                    currency: "",
                    term: "",
                    rule: "",
                  },
                ],
              },
            ];
        }

        if (micrositesEnabledFlag) {
          this.setState({
            micrositesEnabled: 1,
            autoloadEnabled: 0,
            supplierFile: null,
            offerList: newOffList,
            introText: newIntroText,
            dataInfo: { ...newDataInfo },
          });
        } else {
          this.setState({
            micrositesEnabled: 0,
            offerList: newOffList,
            introText: newIntroText,
            dataInfo: { ...newDataInfo },
          });
        }

        break;
      case "campaignType":        
        break;
      case "country":
        const country = event.target.value;
        if (country === "US") {
          newDataInfo["currency"] =
            (newDataInfo["currency"] &&
              newDataInfo["currency"] !== "CAD" &&
              newDataInfo["currency"]) ||
            null;
        }
        newDataInfo["country"] = country;
        this.setState({ dataInfo: { ...newDataInfo } });
        break;
      case "currency":
        const currencyValue = event.target.value;
        newDataInfo["currency"] = currencyValue;
        this.setState({ dataInfo: { ...newDataInfo } });
        break;
      default:
        break;
    }
  };

  validatePayerInfo = () => {
    const { selectedPayer } = this.state;
    let valid = true;
    let validation = {};

    if (!selectedPayer || selectedPayer.toString().trim() === "") {
      validation["selectedPayer"] = true;
      valid = false;
    }
    this.setState({ validation: { ...validation } });
    return valid;
  };

  validateSetUpInfo = () => {
    const { dataInfo, micrositesEnabled, supplierFile } = this.state;

    let valid = true;
    let validation = {};
    if (
      !dataInfo ||
      !dataInfo.campaignName ||
      dataInfo.campaignName.toString().trim() === ""
    ) {
      validation["campaignName"] = true;
      valid = false;
    }
    if (
      !dataInfo ||
      !dataInfo.campaignType ||
      dataInfo.campaignType.toString().trim() === ""
    ) {
      validation["campaignType"] = true;
      valid = false;
    }

    if (
      dataInfo &&
      dataInfo.campaignType &&
      dataInfo.campaignType !== "ENROLL_ONLY"
    ) {
      if (
        !dataInfo ||
        !dataInfo.country ||
        dataInfo.country.toString().trim() === ""
      ) {
        validation["country"] = true;
        valid = false;
      }

      if (
        !dataInfo ||
        !dataInfo.currency ||
        dataInfo.currency.toString().trim() === ""
      ) {
        validation["currency"] = true;
        valid = false;
      }
    }

    if (!dataInfo || !dataInfo.email || dataInfo.email.trim() === "") {
      validation["email"] = true;
      valid = false;
    }
    if (dataInfo && dataInfo.email && dataInfo.email.trim().length > 0) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(dataInfo.email.trim().toLowerCase())) {
        validation["email"] = "Invalid email address";
        valid = false;
      }
    }

    if (
      !dataInfo ||
      !dataInfo.phone ||
      dataInfo.phone.toString().trim() === ""
    ) {
      validation["phone"] = "Phone number must be of at least 10 digits.";
      valid = false;
    }

    if (
      dataInfo &&
      dataInfo.phone &&
      dataInfo.phone.toString().trim().length < 10
    ) {
      validation["phone"] = "Phone number must be of at least 10 digits.";
      valid = false;
    }

    if (micrositesEnabled == 0) {      
      if (!supplierFile || supplierFile.name.trim() === "") {
        validation["supplierFile"] = "Supplier file is mandatory";
        valid = false;
      }
    }

    this.setState({ validation: { ...validation } });    
    return valid;
  };

  validateOfferInfo = () => {
    const { introText, offerList, dataInfo } = this.state;
    let valid = true;
    let validation = {};

    let validOfferType = false;
    let errorMessage = "Please select at least one VCA offer type for this campaign type.";
    if (dataInfo.campaignType.toString().trim() === "VCA") {
      offerList &&
        offerList.map((item) => {
          if (item.offerType.toString().trim() === "VCA") {           
            validOfferType = true;
          }
          return item;
        });
    } else {
      if (dataInfo.campaignType.toString().trim() === "ENROLL_ONLY") {
        if (offerList && offerList.length == 2) {
          const [firstOffer, secondOffer] = offerList;

          if (firstOffer.offerType.toString().trim() !== secondOffer.offerType.toString().trim()) {
            validOfferType = true;
          } else {
            validOfferType = false;
            errorMessage = "Two offers (Cross Border EFT and Wire) are mandatory for this campaign type.";
          }
        } else {
          validOfferType = false;
          errorMessage = "Two offers (Cross Border EFT and Wire) are mandatory for this campaign type.";
        }

      } else {
        validOfferType = true;
      }
    }

    if (!validOfferType) {
      this.setState({
        alertMessage: errorMessage,
        alertMessageCallbackType: null,
      });
      return false;
    }    

    if (!introText || introText.toString().trim() === "") {
      validation["introText"] = true;
      valid = false;
    }

    const offers = [];    
    offerList.forEach((item, index) => {
      if (!item || !item.offerType || item.offerType.toString().trim() === "") {
        offers[index] = { ...offers[index], offerType: true };
        valid = false;
      }
      if (
        !item ||
        !item.acceptanceText ||
        item.acceptanceText.toString().trim() === ""
      ) {
        offers[index] = { ...offers[index], acceptanceText: true };
        valid = false;
      }
      if (item && item.achEnabled && item.achEnabled == 1) {
        if (
          !item ||
          !item.achLimitRule ||
          item.achLimitRule.toString().trim() === ""
        ) {
          offers[index] = { ...offers[index], achLimitRule: true };
          valid = false;
        }
        if (!item || !item.achLimit || item.achLimit.toString().trim() === "") {
          offers[index] = { ...offers[index], achLimit: true };
          valid = false;
        }
      }
      const acceptanceRules = item.acceptanceRules;
      const acceptanceRulesValidation = [];
      acceptanceRules &&
        acceptanceRules.forEach((item, index) => {
          if (
            !item ||
            !item.amountFrom ||
            item.amountFrom.toString().trim() === ""
          ) {
            acceptanceRulesValidation[index] = {
              ...acceptanceRulesValidation[index],
              amountFrom: true,
            };
            valid = false;
          }
          if (
            item &&
            item.amountFrom &&
            item.amountFrom.toString().trim() !== ""
          ) {
            const testAmt = /^\d{0,7}(?:[.]\d{1,2})?$/;
            if (!testAmt.test(item.amountFrom.toString().trim())) {
              acceptanceRulesValidation[index] = {
                ...acceptanceRulesValidation[index],
                amountFrom: "7 digits with 2 decimal places allowed.",
              };
              valid = false;
            }
          }
          if (
            !item ||
            !item.amountTo ||
            item.amountTo.toString().trim() === ""
          ) {
            acceptanceRulesValidation[index] = {
              ...acceptanceRulesValidation[index],
              amountTo: true,
            };
            valid = false;
          }
          if (item && item.amountTo && item.amountTo.toString().trim() !== "") {            
            const testAmtTo = /^\d{0,7}(?:[.]\d{1,2})?$/;
            if (!testAmtTo.test(item.amountTo.toString().trim())) {
              acceptanceRulesValidation[index] = {
                ...acceptanceRulesValidation[index],
                amountTo: "7 digits with 2 decimal places allowed.",
              };
              valid = false;
            }
          }
          if (
            !item ||
            !item.currency ||
            item.currency.toString().trim() === ""
          ) {
            acceptanceRulesValidation[index] = {
              ...acceptanceRulesValidation[index],
              currency: true,
            };
            valid = false;
          }
          if (!item || !item.term || item.term.toString().trim() === "") {
            acceptanceRulesValidation[index] = {
              ...acceptanceRulesValidation[index],
              term: true,
            };
            valid = false;
          }
          if (!item || !item.rule || item.rule.toString().trim() === "") {
            acceptanceRulesValidation[index] = {
              ...acceptanceRulesValidation[index],
              rule: true,
            };
            valid = false;
          }
        });

      if (acceptanceRulesValidation.length > 0) {
        offers[index] = {
          ...offers[index],
          acceptanceRules: acceptanceRulesValidation,
        };
        valid = false;
      }
    });

    if (offers.length > 0) {
      validation["offers"] = offers;
      valid = false;
    }

    this.setState({ validation: { ...validation } });    
    return valid;
  };
  handlePayerSubmit = () => {
    const valid = this.validatePayerInfo();
    if (!valid) {
      return false;
    }
    this.setState({ selectedTab: 1, validation: {} });
  };

  handleSetUpSubmit = () => {
    const valid = this.validateSetUpInfo();
    if (!valid) {
      return false;
    }
    this.setState({ selectedTab: 2, validation: {} }, () => {      
      this.getOfferTypes();
    });
  };

  handleOfferSubmit = () => {
    const {
      validation,
      offerList,
      dataInfo,
      supplierFile,
      selectedPayer,
      autoloadEnabled,
      micrositesEnabled,
      PAFEnabled,
      PVTEnabled,
      introText,
      validationEnabled,
    } = this.state;
    const valid = this.validateOfferInfo();
    if (!valid) {
      if (validation.validOfferType) {
      }
      return false;
    }

    const newOffers =
      offerList &&
      offerList.map((item, index) => {
        const acceptanceRules =
          item.acceptanceRules &&
          item.acceptanceRules.map((rule) => {
            return {
              amountFrom: rule.amountFrom,
              amountTo: rule.amountTo,
              currencyCode: rule.currency,
              terms: rule.term,
              rules: rule.rule,
            };
          });

        return {
          acceptance: item.acceptanceText,
          achLimit: item.achLimit,
          achLimitText: item.achLimitRule,
          offerType: item.offerType,
          offerRules: [...acceptanceRules],
        };
      });

    this.setState(
      {
        updateProgress: true,
      },
      () => {
        const { info } = this.props.user;
        this.props
          .dispatch(
            createCampaign({
              portalProfileId: info.portalProfileId,
              portalTypeId: info.portalTypeId,
              userId: info.userId,
              campaign: dataInfo,
              offers: newOffers,
              supplierFile: supplierFile,
              selectedPayer: selectedPayer,
              autoloadEnabled: autoloadEnabled,
              micrositesEnabled: micrositesEnabled,
              PAFEnabled: PAFEnabled,
              PVTEnabled: PVTEnabled,
              introText: introText,
              validationEnabled: validationEnabled,
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertMessage: this.props.campaign.error,
                alertMessageCallbackType: null,
                alertType: "error",
                updateProgress: false,
              });
              return false;
            }

            this.setState({
              updateProgress: false,
              alertMessage: "Campaign Launched successfully.",
              alertType: "success",
              alertMessageCallbackType: "REDIRECT",
            });
          });
      }
    );
  };

  handleSelectAll = () => { };
  handleClearAll = () => { };

  handleBack = (index) => {
    this.handleTabChange(index);
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
  };

  goBack = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
    this.props.history.push(`${config.baseName}/dashboard`);
  };

  goToLogin = () => {
    this.props.history.push({
      pathname: `${config.baseName}/`,
      state: {
        fromEnrollment: true,
      },
    });
  };

  render() {
    const {
      selectedPayer,
      payerList,
      supplierFile,
      selectedTab,
      stepperInfo,
      payerProgress,
      setupProgress,
      offerProgress,
      valdationListProgress,
      validation,
      alertMessage,
      alertMessageCallbackType,
      dataInfo,
      campaignList,
      campaignTypes,
      countryList,
      currencyList,
      validationList,
      selectedPayerValidations,
      isHippaEnabled,
      micrositesEnabled,
      autoloadEnabled,
      validationEnabled,
      PAFEnabled,
      PVTEnabled,
      offerList,
      offerTypes,
      acceptanceRules,
      introText,
      payerName,
    } = this.state;
    const { classes } = this.props;
    
    return (
      <Box width="100%">
        <Box display="flex" justifyContent="flex-start">
          <Paper square className={classes.header}>
            <Box p={2} display="flex" justifyContent="flex-start">
              <Box>
                <Typography variant="h2" className={classes.headingTop}>
                  {selectedTab == 0 ? "Campaign Launch" : payerName}
                </Typography>
              </Box>
              <Box width="600px">
                <CustomizedSteppers
                  stepsList={stepperInfo}
                  activeStep={selectedTab + 1}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
        <Box p={1} pl={5}>
          <Grid xs={12} sm={12} container spacing={2}>
            <TabPanel value={selectedTab} index={0} style={{ width: "100%" }}>
              {
                <PayerInfo
                  payerList={payerList}
                  selectedPayer={selectedPayer}
                  handleChange={this.handleChange}
                  onSubmit={this.handlePayerSubmit}
                  onCancel={this.handleCancel}
                  updateProgress={payerProgress}
                  validation={validation}
                />
              }
            </TabPanel>
            <TabPanel value={selectedTab} index={1} style={{ width: "100%" }}>
              {
                <SetUpInfo
                  dataInfo={dataInfo}
                  supplierFile={supplierFile}
                  validationList={validationList}
                  selectedPayerValidations={selectedPayerValidations}
                  campaignList={campaignList}
                  campaignTypes={campaignTypes}
                  countryList={countryList}
                  currencyList={currencyList}
                  isHippaEnabled={isHippaEnabled}
                  micrositesEnabled={micrositesEnabled}
                  autoloadEnabled={autoloadEnabled}
                  validationEnabled={validationEnabled}
                  PAFEnabled={PAFEnabled}
                  PVTEnabled={PVTEnabled}
                  handleChange={this.handleSetUpChange}
                  onSubmit={this.handleSetUpSubmit}
                  onCancel={this.handleCancel}
                  handleSelectAll={this.handleSelectAll}
                  handleClearAll={this.handleClearAll}
                  onBack={this.handleBack}
                  updateProgress={setupProgress}
                  valdationListProgress={valdationListProgress}
                  validation={validation}
                />
              }
            </TabPanel>
            <TabPanel value={selectedTab} index={2} style={{ width: "100%" }}>
              {
                <OfferInfo
                  introText={introText}
                  dataInfo={dataInfo}
                  acceptanceRules={acceptanceRules}
                  currencyList={currencyList}
                  offerList={offerList}
                  offerTypes={offerTypes}
                  addOffer={this.handleAddOffer}
                  removeOffer={this.handleRemoveOffer}
                  addRule={this.handleAddRule}
                  removeRule={this.handleRemoveRule}
                  handleChange={this.handleOfferChange}
                  handleChangeRule={this.handleChangeRule}
                  onSubmit={this.handleOfferSubmit}
                  onCancel={this.handleCancel}
                  handleSelectAll={this.handleSelectAll}
                  handleClearAll={this.handleClearAll}
                  onBack={this.handleBack}
                  updateProgress={offerProgress}
                  validation={validation}
                />
              }
            </TabPanel>
          </Grid>
          {alertMessage &&
            this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
        </Box>
      </Box>
    );
  }

  renderSnackbar = (message) => {
    return <Notification variant="error" message={message} />;
  };

  renderAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => {
          callbackType === "REDIRECT" ? this.goBack() : this.hideAlertMessage();
        }}
      />
    );
  };
}

export default connect((state) => ({
  ...state.user,
  ...state.campaign,
}))(withStyles(styles)(AddView));
