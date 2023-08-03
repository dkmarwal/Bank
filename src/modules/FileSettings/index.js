import React, { Component } from "react";
import { connect } from "react-redux";
import Notification from "~/components/Notification";
import PromptImport from "~/components/Dialogs/PromptImport";
import GridCheckbox from "~/components/Forms/GridCheckbox";
import {
  Paper,
  Grid,
  Box,
  CircularProgress,
  FormGroup,
  FormControl,
  FormLabel,
  Typography,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio
} from "@material-ui/core";
import Button from "~/components/Forms/Button";
import TextField from "~/components/Forms/TextField";
import { withStyles } from "@material-ui/styles";
import {
  fetchFileType,
  fetchSelectedFileType,
  fetchPaymentMethods,
  fetchNamingConvention,
  fetchIncomingFileSettings,
  fetchResponseFileSettings,
  updateIncomingFileSettings,
  updateResponseFileSettings,
  updatePaymentFileTypes,
} from "~/redux/helpers/filesettings";
import styles from "./styles";
import ResponseFileFields from "./responseFileFields";
import CheckboxGroup from "../../components/Forms/CheckboxGroup";
import SimpleDialog from "../../components/Model/SimpleDialog";
import "react-notifications/lib/notifications.css";
import { getClientDataActivated } from "../../redux/actions/clients";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

class FileSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: null,
      parentId: null,
      isHippa: null,
      openModal: false,
      isLoading: true,
      isEDIselected: false,
      ediFileTypeId: null,
      isISOselected: false,
      isCSVMSCSelected: false,
      isXMLMSCSelected: false,
      isISOXMLMSCSelected: false,
      showResponseFile: 0,
      showXMLMSCResponse: 1,
      showISOXMLMSCResponse: 1,
      showCSVMSCResponse: 1,
      delimiters: [
        { label: "~", value: "~" },
        { label: ",", value: "," },
        { label: "*", value: "*" },
        { label: ":", value: ":" },
      ],
      subElementDelimiters: [
        { label: "~", value: "~" },
        { label: ",", value: "," },
        { label: "*", value: "*" },
        { label: ":", value: ":" },
        { label: "\\", value: "\\" },
        { label: ">", value: ">" },
      ],
      segmentDelimiters: [
        { label: "~", value: "~" },
        { label: ",", value: "," },
        { label: "*", value: "*" },
        { label: ":", value: ":" },
        { label: "\\", value: "\\" },
        { label: "Space", value: " " },
      ],
      validation: {},
      responseValidation: {},
      incomingPaymentFileType: [],
      selectedPaymentMethod: [],
      ediResponsePaymentFile: {},
      namingConvention: {},
      fileSettings: {},
      returnFileSettings: {},
      incomingDelimeterSetting: {},
      returnEDI: {
        intSenderId: { label: "ISA06", value: "", length: 15 },
        intRecvrId: { label: "ISA08", value: "", length: 15 },
        authInfoQualifier: { label: "ISA01", value: "", length: 2 },
        secInfoQualifier: { label: "ISA03", value: "", length: 2 },
        intSenderIDQualifier: { label: "ISA05", value: "", length: 2 },
        intRecvrIDQualifier: { label: "ISA07", value: "", length: 2 },
        interchangeControlVersionNumber: {
          label: "ISA12",
          value: "",
          length: 5,
        },
        subElementDelimiter: { label: "ISA16", value: "", length: 1 },
        contactName: { label: "PER02", value: "", length: 100 },
        contactNumber: { label: "PER04", value: "", length: 100 },
        isPaymentMethodEnabled: { label: "BGN07", value: "1" },
      },
      scheduleSetting: [],
      ackSetting: [], // for master card 2.0
      error: null,
      variant: "error",
    };
  }

  async componentDidMount() {
    this.props.updateOnboardingStep(5);
    const clientId = sessionStorage.getItem("clientId");
    await this.fetchClientInformation(clientId);
    this.fetchAllFilesData(clientId);
  }

  fetchClientInformation = async (clientId) => {
    const clientData = await getClientDataActivated(clientId);
    const { data = {} } = clientData;
    let parentId = null;
    let isHippa = null;
    if (data.rows && data.rows[0]) {
      parentId = data.rows[0].parentId;
      isHippa = data.rows[0].isHippa;
    }
    this.setState({
      clientId: clientId,
      parentId: parentId,
      isHippa: isHippa,
    });
  };

  fetchAllFilesData = (id) => {
    //Don't change "isHippa") == 1
    Promise.all([
      fetchFileType({
        isHippa: sessionStorage.getItem("isHippa") === 1 ? 1 : 0,
        clientId: id
      }),
      fetchSelectedFileType({ clientId: id }),
      fetchPaymentMethods({ clientId: id }),
      fetchNamingConvention({ clientId: id }),
      fetchIncomingFileSettings({ clientId: id }),
      fetchResponseFileSettings({ clientId: id }),
    ])
      .then(
        ([
          fileTypes,
          selectedFileTypes,
          fetchPaymentMethods,
          namingConvention,
          incomingFileSettings,
          responseFileSettings,
        ]) => {
          for (const [key, value] of Object.entries(
            fileTypes.data.ediPaymentFile
          )) {
            if (
              selectedFileTypes.data.includes(value.id) &&
              (value.fileName === "EDI835" || value.fileName === "EDI820")
            ) {
              this.setState({
                isEDIselected: true,
                ediFileTypeId: value.id,
              });
            } else if (
              selectedFileTypes.data.includes(value.id) &&
              value.fileName === "ISO XML"
            ) {
              this.setState({
                isISOselected: true
              });
            }
            else if (selectedFileTypes.data.includes(value.id) && value.fileName === "MC XML") {
              this.setState({
                isXMLMSCSelected: true
              });
              if (responseFileSettings.data.ackSetting && responseFileSettings.data.ackSetting.length) {
                const exist = responseFileSettings.data.ackSetting.find(x => x.fileTypeId == value.id);
                if (exist) {
                  this.setState({ showXMLMSCResponse: exist.isAckRequired });
                }
              }
            }
            else if (selectedFileTypes.data.includes(value.id) && value.fileName === "Card ISO XML") {
              this.setState({
                isISOXMLMSCSelected: true
              });
              if (responseFileSettings.data.ackSetting && responseFileSettings.data.ackSetting.length) {
                const exist = responseFileSettings.data.ackSetting.find(x => x.fileTypeId == value.id);
                if (exist) {
                  this.setState({ showISOXMLMSCResponse: exist.isAckRequired });
                }
              }
            }
            else if (selectedFileTypes.data.includes(value.id) && value.fileName === "MC CSV") {
              this.setState({
                isCSVMSCSelected: true
              });
              if (responseFileSettings.data.ackSetting && responseFileSettings.data.ackSetting.length) {
                const exist = responseFileSettings.data.ackSetting.find(x => x.fileTypeId == value.id);
                if (exist) {
                  this.setState({ showCSVMSCResponse: exist.isAckRequired });
                }
              }
            }
          }
          const obj = {};
          fileTypes.data.ediResponsePaymentFile.map(function (val) {
            obj[val.description] = val.id;
          });

          this.setState({
            incomingPaymentFileType: fileTypes.data.ediPaymentFile.map((item) =>
              selectedFileTypes.data.includes(item.id)
                ? { ...item, checked: true }
                : { ...item, checked: false }
            ),
            ediResponsePaymentFile: obj,
            selectedPaymentMethod: fetchPaymentMethods.data.rows2
              ? fetchPaymentMethods.data.rows2
              : [],
            namingConvention:
              namingConvention.data !== null ? namingConvention.data : {},
            incomingDelimeterSetting: incomingFileSettings.data
              ? incomingFileSettings.data
              : {},
            returnFileSettings: responseFileSettings.data.ediFileSetting
              ? responseFileSettings.data.ediFileSetting
              : {},
            scheduleSetting: responseFileSettings.data.scheduleSetting
              ? responseFileSettings.data.scheduleSetting
              : [],
            ackSetting: responseFileSettings.data.ackSetting
              ? responseFileSettings.data.ackSetting
              : [],
            isLoading: false,
            showResponseFile: responseFileSettings.data && responseFileSettings.data.isResponseActive ? responseFileSettings.data.isResponseActive : 0,
          });
        }
      )
      .catch((error) => {
        this.setState({
          isLoading: false,
          variant: "error",
          error:
            typeof error === "string" ? error : "An unknown error has occured.",
        });
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      validation,
      responseValidation,
      incomingPaymentFileType,
    } = this.state;

    const selectedMethods = [];
    incomingPaymentFileType.filter((s) => {
      if (s.checked === true) {
        selectedMethods.push(s.id);
      }
    });
    if (selectedMethods.length === 0) {
      this.setState({
        error: "Please select incoming payment file.",
        variant: "error",
      });
    } else {
      const isValid = (Object.keys(responseValidation).length === 0 &&
        (validation.clientUid ? validation["clientUid"] === false : true) && (validation.fpid ? validation["fpid"] === false : true)) ? true : false;
      if (isValid) {
        this.handleUpdateFileSettings();
      } else {
        this.setState({
          processingUpdate: false,
          error: null,
          variant: null,
        });
      }
    }
  };
  validateForm = () => {
    const {
      namingConvention,
      isEDIselected,
      returnEDI,
      showResponseFile,
      returnFileSettings,
      incomingDelimeterSetting,
      ediResponsePaymentFile,
      isISOselected,
    } = this.state;

    let valid = true;
    const validation = {},
      responseValidation = {};
    const convention = {
      clientUid: "",
      outBesId: "",
      fpid: "",
    };
    for (const [key, value] of Object.entries(convention)) {
      const obj = Object.keys(namingConvention).find((item) => item === key);
      if (
        typeof obj === "undefined" ||
        namingConvention[obj] === null ||
        namingConvention[obj].toString().trim().length === 0
      ) {
        valid = false;
        validation[key] = true;
        this.setState({ validation: { ...validation } });
      }
    }
    if (isEDIselected && showResponseFile === 1) {
      for (const [key, value] of Object.entries(returnEDI)) {
        const obj = Object.keys(returnFileSettings).find((item) => item === key);
        if (
          typeof obj === "undefined" ||
          returnFileSettings[obj] === null ||
          returnFileSettings[obj].toString().trim().length === 0
        ) {
          valid = false;
          responseValidation[key] = true;
          this.setState({ responseValidation: { ...responseValidation } });
        }
      }
      if (
        typeof returnFileSettings["segmentDelimiter"] === "undefined" ||
        returnFileSettings["segmentDelimiter"] === null ||
        returnFileSettings["segmentDelimiter"].toString().trim().length === 0
      ) {
        valid = false;
        responseValidation["segmentDelimiter"] = true;
        this.setState({ responseValidation: { ...responseValidation } });
      }
      if (
        typeof returnFileSettings["elementDelimiter"] === "undefined" ||
        returnFileSettings["elementDelimiter"] === null ||
        returnFileSettings["elementDelimiter"].toString().trim().length === 0
      ) {
        valid = false;
        responseValidation["elementDelimiter"] = true;
        this.setState({ responseValidation: { ...responseValidation } });
      }
      if (
        typeof this.getScheduledTime("824/997 File") === "undefined" ||
        this.getScheduledTime("824/997 File") === null ||
        this.getScheduledTime("824/997 File").toString().trim().length === 0 ||
        this.getScheduledTime("824/997 File").toString().trim().match(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/) == null
      ) {
        valid = false;
        responseValidation[
          `scheduleSetting${ediResponsePaymentFile["824/997 File"]}`
        ] = "Please enter time in HH:MM:SS";
        this.setState({ responseValidation: { ...responseValidation } });
      }
      if (
        typeof this.getScheduledTime("DeltaFile") === "undefined" ||
        this.getScheduledTime("DeltaFile") === null ||
        this.getScheduledTime("DeltaFile").toString().trim().length === 0 ||
        this.getScheduledTime("DeltaFile").toString().trim().match(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/) == null
      ) {
        valid = false;
        responseValidation[
          `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
        ] = "Please enter time in HH:MM:SS";
        this.setState({ responseValidation: { ...responseValidation } });
      }
    }
    if (isEDIselected) {
      if (
        typeof incomingDelimeterSetting["elementDelimiter"] === "undefined" ||
        incomingDelimeterSetting["elementDelimiter"] === null ||
        incomingDelimeterSetting["elementDelimiter"].toString().trim().length ===
        0
      ) {
        valid = false;
        validation["incomingelementDelimiter"] = true;
        this.setState({ validation: { ...validation } });
      }
      if (
        typeof incomingDelimeterSetting["segmentDelimiter"] === "undefined" ||
        incomingDelimeterSetting["segmentDelimiter"] === null ||
        incomingDelimeterSetting["segmentDelimiter"].toString().trim().length ===
        0
      ) {
        valid = false;
        validation["incomingsegmentDelimiter"] = true;
        this.setState({ validation: { ...validation } });
      }
      if (
        typeof incomingDelimeterSetting["subElementDelimiter"] ===
        "undefined" ||
        incomingDelimeterSetting["subElementDelimiter"] === null ||
        incomingDelimeterSetting["subElementDelimiter"].toString().trim()
          .length === 0
      ) {
        valid = false;
        validation["incomingsubElementDelimiter"] = true;
        this.setState({ validation: { ...validation } });
      }
    }
    if (isISOselected) {
      if (
        typeof this.getScheduledTime("ISOTransactional XML") === "undefined" ||
        this.getScheduledTime("ISOTransactional XML") === null ||
        this.getScheduledTime("ISOTransactional XML").toString().trim()
          .length === 0 ||
        this.getScheduledTime("ISOTransactional XML").toString().trim().match(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/) == null
      ) {
        valid = false;
        responseValidation[
          `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}`
        ] = "Please enter time in HH:MM:SS";
        this.setState({ responseValidation: { ...responseValidation } });
      }
    }
    return valid;
  };
  handleFileTypeSelection = (e, index) => {
    const { incomingPaymentFileType } = this.state;
    const obj = incomingPaymentFileType.find(
      (paymentFileType, i) => index === i
    );
    if (e.target.textContent === "ISO XML") {
      this.setState({
        isISOselected: e.target.checked,
      });
    } else if (
      e.target.textContent === "EDI820" ||
      e.target.textContent === "EDI835"
    ) {
      this.setState({
        isEDIselected: e.target.checked,
        ediFileTypeId: obj.id,
      });
    }
    else if (e.target.textContent === "MC CSV") {
      this.setState({
        isCSVMSCSelected: e.target.checked
      });
    }
    else if (e.target.textContent === "MC XML") {
      this.setState({
        isXMLMSCSelected: e.target.checked
      });
    }
    else if (e.target.textContent === "Card ISO XML") {
      this.setState({
        isISOXMLMSCSelected: e.target.checked
      });
    }
    this.setState({
      incomingPaymentFileType: incomingPaymentFileType.map((item, i) =>
        i === index
          ? {
            ...item,
            checked: e.target.checked,
          }
          : item
      ),
    });
  };
  onBlurNamingChange = (e) => {
    const { validation } = this.state;
    delete validation[e.target.name];
    if ((e.target.name === "clientUid" || e.target.name === "fpid") && (e.target.value.toString().trim().length !== 0)
      && (e.target.value.toString().trim().replace(/^0+/, '').length === 0)) {
      validation[e.target.name] = true;
    }
    this.setState({ validation: { ...validation } });
  };
  onBlurDelimiterChange = (e) => {
    const { validation } = this.state;
    delete validation[e.target.name];
    if (e.target.value.toString().trim().length === 0) {
      validation[e.target.name] = true;
    }
    this.setState({ validation: { ...validation } });
  };
  validateMinLength = (value, item) => {
    const { returnEDI, responseValidation } = this.state;
    switch (returnEDI[item] && returnEDI[item].label) {
      case "ISA01":
      case "ISA03":
      case "ISA05":
      case "ISA06":
      case "ISA07":
      case "ISA08":
        if (value.toString().trim().length !== 0 && value.toString().trim().length < 2) {
          responseValidation[item] = "Minimum length allowed is 2";
        }
        break;
      case "ISA12":
        if (value.toString().trim().length !== 0 && value.toString().trim().length < 5) {
          responseValidation[item] = "Minimum length allowed is 5";
        }
        break;
      case "PER02":
      case "PER04":
      case "ISA16":
        if (value.toString().trim().length !== 0 && value.toString().trim().length < 1) {
          responseValidation[item] = "Minimum length allowed is 1";
        }
        break;
      default:
        break;
    }
  }

  onBlurResponseChange = (e, item) => {
    const { responseValidation, ediResponsePaymentFile } = this.state;
    const { value } = e.target;
    delete responseValidation[item];
    this.validateMinLength(value, item);
    if (value.toString().trim().length !== 0 &&
      (item === `scheduleSetting${ediResponsePaymentFile["824/997 File"]}` || item === `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
        || item === `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}` || item === 'MC XML' || item === 'Card ISO XML' || item === 'MC CSV')
      && value.toString().trim().match(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/) == null) {
      responseValidation[item] = "Please enter time in HH:MM:SS";
    }

    this.setState({ responseValidation: { ...responseValidation } });
  };
  handleScheduleSettingsChange = (e) => {
    const { scheduleSetting } = this.state;
    const { value, id } = e.target;
    const restObj = scheduleSetting.filter(
      (item) => item.fileTypeId !== parseInt(id)
    );
    const obj = {
      scheduleTime: value.toString().length === 0 ? null : value,
      fileTypeId: parseInt(id),
    };
    this.setState({
      scheduleSetting: [...restObj, obj],
    });
  };

  handleAckSettingChange = (e) => {
    const { ackSetting, incomingPaymentFileType } = this.state;
    const { value, name } = e.target;

    const filterObj = incomingPaymentFileType.filter(x => x.fileName == name);
    let obj = {};
    if (filterObj.length) {
      const restObj = ackSetting.filter(
        (item) => item.fileTypeId !== parseInt(filterObj[0].id)
      );
      const exist = ackSetting && ackSetting.find(x => x.fileTypeId == filterObj[0].id);
      if (exist) {
        obj = {
          ...exist,
          ackTime: value.toString().length === 0 ? null : value,
          isAckRequired: filterObj[0].checked?1:0
        };
        this.setState({
          ackSetting: [...restObj, obj]
        });
      } else {
        obj = {
          ackTime: value.toString().length === 0 ? null : value,
          fileTypeId: filterObj[0].id,
          isAckRequired: filterObj[0].checked?1:0
        };
        this.setState({
          ackSetting: [...restObj, obj]
        });
      }
    }
  }

  handleAckToggleChange = (e, name) => {
    const { ackSetting, incomingPaymentFileType, responseValidation } = this.state;
    const toggleValue = Number(e.target.value);

    const filterObj = incomingPaymentFileType.find(x => x.fileName == name);
    let obj = {};
    if (filterObj) {
      const restObj = ackSetting.filter(
        (item) => item.fileTypeId !== parseInt(filterObj.id)
      );
      const exist = ackSetting && ackSetting.find(x => x.fileTypeId == filterObj.id);
      if (exist) {
        obj = {
          ...exist,
          isAckRequired: toggleValue || 0
        };
        this.setState({
          ackSetting: [...restObj, obj]
        });
      } else {
        obj = {
          ackTime: null,
          fileTypeId: filterObj.id,
          isAckRequired: toggleValue || 0
        };
        this.setState({
          ackSetting: [...restObj, obj]
        });
      }
      if(!toggleValue && exist){
        delete responseValidation[name];
        this.setState({ responseValidation: { ...responseValidation } });
        obj = {
          ...exist,
          ackTime: null,
          isAckRequired: 0
        };
        this.setState({
          ackSetting: [...restObj, obj]
        });
      }
    }
    if (name === "MC XML") {
      this.setState({ showXMLMSCResponse: toggleValue })
    } else if (name === "Card ISO XML") {
      this.setState({ showISOXMLMSCResponse: toggleValue })
    } else if (name === "MC CSV") {
      this.setState({ showCSVMSCResponse: toggleValue })
    }
  }

  handleUpdateFileSettings = () => {
    this.setState(
      {
        processingUpdate: true,
      },
      () => {
        const {
          incomingPaymentFileType,
          incomingDelimeterSetting,
          returnFileSettings,
          namingConvention,
          scheduleSetting,
          ackSetting,
          ediResponsePaymentFile,
          isEDIselected,
          ediFileTypeId,
          isISOselected,
          showResponseFile,
        } = this.state;
        const selectedMethods = [];
        incomingPaymentFileType.filter((s) => {
          if (s.checked === true) {
            selectedMethods.push(s.id);
          }
        });
        const clientId = sessionStorage.getItem("clientId");
        let restObj = [],
          incomingSettings = {};
        if (isEDIselected && !isISOselected) {
          if (showResponseFile === 1) {
            restObj = scheduleSetting.filter(
              (item) =>
                item.fileTypeId !==
                ediResponsePaymentFile["ISOTransactional XML"]
            );
          }
        } else if (!isEDIselected && isISOselected) {
          restObj = scheduleSetting.filter(
            (item) =>
              item.fileTypeId === ediResponsePaymentFile["ISOTransactional XML"]
          );
        } else {
          showResponseFile === 1
            ? (restObj = scheduleSetting)
            : (restObj = scheduleSetting.filter(
              (item) =>
                item.fileTypeId ===
                ediResponsePaymentFile["ISOTransactional XML"]
            ));
        }
        incomingSettings = {
          ...incomingDelimeterSetting,
          fileTypeId: ediFileTypeId,
        };
        let data = {
          scheduleSetting: restObj,
          namingConvention: namingConvention,
          ediFileSetting: null,
          isResponseActive: showResponseFile,
          ackSetting: ackSetting
        };
        data =
          isEDIselected && showResponseFile === 1
            ? { ...data, ediFileSetting: returnFileSettings }
            : data;
        updatePaymentFileTypes({
          clientId: clientId,
          data: { fileTypeIds: selectedMethods },
        }).then((response) => {
          if (response.error) {
            this.setState({
              processingUpdate: false,
              error:
                typeof response.message === "string"
                  ? response.message
                  : "An unknown error has occured.",
              variant: "error",
            });
            return false;
          }
          const promiseArray = isEDIselected
            ? [
              updateResponseFileSettings({
                clientId: clientId,
                data: data,
              }),
              updateIncomingFileSettings({
                clientId: clientId,
                data: incomingSettings,
              }),
            ]
            : [
              updateResponseFileSettings({
                clientId: clientId,
                data: data,
              }),
            ];

          Promise.all(promiseArray)
            .then((response) => {
              response.find(function (item) {
                if (item.error === true) {
                  throw item;
                }
              });
              this.setState({
                processingUpdate: false,
              });

              this.props.history.push({
                pathname: `/clientOnboard/remittance`,
              });
            })
            .catch((error) => {
              this.setState({
                processingUpdate: false,
                error:
                  typeof error.message === "string"
                    ? error.message
                    : "An unknown error has occured.",
                variant: "error",
              });
            });
        });
      }
    );
  };
  getScheduledTime = (filetype) => {
    const value =
      this.state.scheduleSetting.length > 0 &&
      this.state.scheduleSetting.find((settings) =>
        settings.fileTypeId === this.state.ediResponsePaymentFile[filetype]
          ? settings.scheduleTime
          : ""
      );
    return value ? value.scheduleTime : "";
  };

  getAckTime = (fileName) => {
    const { ackSetting, incomingPaymentFileType } = this.state;
    let value = '';
    const filterObj = incomingPaymentFileType.filter(x => x.fileName == fileName);
    if (filterObj.length) {
      value = ackSetting.length > 0 && ackSetting.find((item) =>
        item.fileTypeId === filterObj[0].id ? item : ''
      )
    }
    return value ? value.ackTime : '';
  };

  getEdiFieldValue = (field, code) => {
    let value = "";
    Object.values(this.state.fileSettings).length > 0 &&
      Object.values(this.state.fileSettings).find((settings) =>
        settings[code] &&
          ([field] !== null || typeof settings[code][field] !== "undefined")
          ? (value = settings[code][field])
          : (value = "")
      );
    return value;
  };


  cancelMOdalOperation = () => {
    this.toggleModal();
    this.props.history.push("/clients");
  };

  onCloseModal = () => {
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState((state) => ({
      openModal: !state.openModal,
    }));
  };

  render() {
    const {
      isLoading,
      isEDIselected,
      isISOselected,
      isCSVMSCSelected,
      isXMLMSCSelected,
      isISOXMLMSCSelected,
      returnEDI,
      showResponseFile,
      delimiters,
      subElementDelimiters,
      segmentDelimiters,
      incomingPaymentFileType,
      ediResponsePaymentFile,
      namingConvention,
      incomingDelimeterSetting,
      returnFileSettings,
      scheduleSetting,
      validation,
      responseValidation,
      processingUpdate,
      error,
      variant,
      parentId,
      showXMLMSCResponse,
      showISOXMLMSCResponse,
      showCSVMSCResponse,
    } = this.state;

    const { classes,user } = this.props;
    const {isPayeeChoicePortal}=user;
    const title = isPayeeChoicePortal ? 'Onboarding is completed successfully':'Onboarding is completed Successfully';
    const subtitle = "";
    const modalActions = [
      {
        label: "OK",
        onClickHandler: this.cancelMOdalOperation,
        variant: "outlined",
      },
    ];

    if (isLoading) {
      return (
        <Box display="flex" p={10} justifyContent="center" alignItems="center">
          <CircularProgress color="primary" />
        </Box>
      );
    }

    return (
      <>
        {Boolean(parentId) && (
          <Grid item xs={12} className={classes.importText}>
            <PromptImport
              promptText="We noticed that client's parent company is registered with us. Would you like to import File Settings?"
              importCb={() =>
                this.fetchAllFilesData(sessionStorage.getItem("parentId"))
              }
            />
          </Grid>
        )}
        <Paper display="flex" className={classes.root} elevation={1}>
          <Grid container justify="center" id="filesettings-list-view">
            <Grid
              container
              justify="flex-start"
              direction="row"
              alignItems="flex-start"
              className={classes.gridContainers}
            >
              <FormControl component="fieldset" className={classes.fieldset}>
                <Grid item xs={12} className={classes.gridMArgin}>
                  <Typography variant="caption" className={classes.legend}>
                    File Naming Convention:
                  </Typography>
                </Grid>
                <FormGroup
                  aria-label="position"
                  row={true}
                  justify="space-between"
                >
                  <Grid container justify="flex-start">
                    <Grid item xs={3} sm={3} className={classes.gridItem}>
                      <Box className={classes.boxRadius}>
                        <TextField color="secondary"
                          label="Client ID"
                          value={
                            namingConvention.clientUid
                              ? namingConvention.clientUid
                              : ""
                          }
                          name="clientUid"
                          error={validation.clientUid}
                          inputProps={{
                            ref: (el) => (this.clientUid = el),
                            maxLength: 10
                          }}
                          onChange={(event) =>
                            this.setState({
                              namingConvention: {
                                ...namingConvention,
                                clientUid:
                                  event.target.value === ""
                                    ? null
                                    : event.target.value.replace(/[^0-9A-Za-z_#-]/g, ""),
                              },
                            })
                          }
                          onBlur={(e) => this.onBlurNamingChange(e)}
                        // required
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} sm={3} className={classes.gridItem}>
                      <Box className={classes.boxRadius}>
                        <TextField color="secondary"
                          label="Out Bes. ID"
                          error={validation.outBesId}
                          value={
                            namingConvention.outBesId
                              ? namingConvention.outBesId
                              : ""
                          }
                          name="outBesId"
                          inputProps={{
                            ref: (el) => (this.outBesId = el),
                            maxLength: 10,
                          }}
                          onChange={(event) =>
                            this.setState({
                              namingConvention: {
                                ...namingConvention,
                                outBesId:
                                  event.target.value === ""
                                    ? null
                                    : event.target.value.replace(/[^0-9A-Za-z / _#-]/g, ""),
                              },
                            })
                          }
                        // onBlur={(e) => this.onBlurNamingChange(e)}
                        // required
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} sm={3} className={classes.gridItem}>
                      <Box className={classes.boxRadius}>
                        <TextField color="secondary"
                          label="File Profile ID"
                          error={validation.fpid}
                          value={
                            namingConvention.fpid ? namingConvention.fpid : ""
                          }
                          name="fpid"
                          inputProps={{
                            ref: (el) => (this.fpid = el),
                            maxLength: 10,
                          }}
                          onChange={(event) =>
                            this.setState({
                              namingConvention: {
                                ...namingConvention,
                                fpid:
                                  event.target.value === ""
                                    ? null
                                    : event.target.value.replace(/[^0-9A-Za-z_#-]/g, ""),
                              },
                            })
                          }
                          onBlur={(e) => this.onBlurNamingChange(e)}
                        // required
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid
              container
              justify="flex-start"
              className={classes.gridContainers}
            >
              <Grid item xs={12} className={classes.gridMArgin}>
                <Typography variant="caption" className={classes.legend}>
                  Incoming Payment File*
                </Typography>
              </Grid>

              {incomingPaymentFileType.map((fileType, index) => (
                <Grid item xs={3} className={classes.gridCheckbox}>
                  <GridCheckbox
                    label={fileType.fileName}
                    id={fileType.id}
                    checked={fileType.checked}
                    index={index}
                    onChange={(e) => this.handleFileTypeSelection(e, index)}
                  />
                </Grid>
              ))}
            </Grid>

            {isEDIselected && (
              <Grid
                container
                justify="flex-start"
                className={classes.gridContainers}
              >
                <Grid item xs={12} className={classes.gridMArgin}>
                  <FormControl
                    component="fieldset"
                    className={classes.fieldset}
                  >
                    <FormLabel component="legend" className={classes.legend} style={{ paddingBottom: "15px" }}>
                      Incoming File Settings:
                    </FormLabel>
                    <FormGroup
                      aria-label="position"
                      row={true}
                      justify="space-between"
                    >
                      <Grid item xs={3} sm={3} className={classes.gridItem}>
                        <Box mx={1} className={classes.boxRadius}>
                          <TextField color="secondary"
                            error={validation.incomingsegmentDelimiter}
                            label="Segment Delimiter"
                            fullWidth={true}
                            select
                            name="incomingsegmentDelimiter"
                            value={
                              incomingDelimeterSetting &&
                                incomingDelimeterSetting.segmentDelimiter
                                ? incomingDelimeterSetting.segmentDelimiter
                                : " "
                            }
                            autoComplete="off"
                            variant="outlined"
                            onChange={(event) =>
                              this.setState({
                                incomingDelimeterSetting: {
                                  ...incomingDelimeterSetting,
                                  segmentDelimiter:
                                    event.target.value === ""
                                      ? null
                                      : event.target.value,
                                },
                              })
                            }
                          // onBlur={(e) => this.onBlurDelimiterChange(e)}
                          // required
                          >
                            <MenuItem value=" ">
                              <em>Select</em>
                            </MenuItem>
                            {segmentDelimiters ? (
                              segmentDelimiters.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))
                            ) : (
                              <Box className={classes.boxRadius}
                                width="100px"
                                display="flex"
                                mt={1.875}
                                justifyContent="center"
                                alignItems="center"
                              >
                                <CircularProgress color="primary" />
                              </Box>
                            )}
                          </TextField>
                        </Box>
                      </Grid>
                      <Grid item xs={3} sm={3} className={classes.gridItem}>
                        <Box mx={1} className={classes.boxRadius}>
                          <TextField color="secondary"
                            error={validation.incomingelementDelimiter}
                            label="Element Delimiter"
                            fullWidth={true}
                            select
                            value={
                              incomingDelimeterSetting &&
                                incomingDelimeterSetting.elementDelimiter
                                ? incomingDelimeterSetting.elementDelimiter
                                : " "
                            }
                            autoComplete="off"
                            variant="outlined"
                            name="incomingelementDelimiter"
                            onChange={(event) =>
                              this.setState({
                                incomingDelimeterSetting: {
                                  ...incomingDelimeterSetting,
                                  elementDelimiter:
                                    event.target.value === ""
                                      ? null
                                      : event.target.value,
                                },
                              })
                            }
                          // onBlur={(e) => this.onBlurDelimiterChange(e)}
                          // required
                          >
                            <MenuItem value=" ">
                              <em>Select</em>
                            </MenuItem>
                            {delimiters ? (
                              delimiters.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))
                            ) : (
                              <Box className={classes.boxRadius}
                                width="100px"
                                display="flex"
                                mt={1.875}
                                justifyContent="center"
                                alignItems="center"
                              >
                                <CircularProgress color="primary" />
                              </Box>
                            )}
                          </TextField>
                        </Box>
                      </Grid>
                      <Grid item xs={3} sm={3} className={classes.gridItem}>
                        <Box mx={1} className={classes.boxRadius}>
                          <TextField color="secondary"
                            label="Sub Element Delimiter"
                            error={validation.incomingsubElementDelimiter}
                            fullWidth={true}
                            select
                            value={
                              incomingDelimeterSetting &&
                                incomingDelimeterSetting.subElementDelimiter
                                ? incomingDelimeterSetting.subElementDelimiter
                                : " "
                            }
                            autoComplete="off"
                            variant="outlined"
                            name="incomingsubElementDelimiter"
                            onChange={(event) =>
                              this.setState({
                                incomingDelimeterSetting: {
                                  ...incomingDelimeterSetting,
                                  subElementDelimiter:
                                    event.target.value === ""
                                      ? null
                                      : event.target.value,
                                },
                              })
                            }
                          // onBlur={(e) => this.onBlurDelimiterChange(e)}
                          // required
                          >
                            <MenuItem value=" ">
                              <em>Select</em>
                            </MenuItem>
                            {subElementDelimiters ? (
                              subElementDelimiters.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))
                            ) : (
                              <Box className={classes.boxRadius}
                                width="100px"
                                display="flex"
                                mt={1.875}
                                justifyContent="center"
                                alignItems="center"
                              >
                                <CircularProgress color="primary" />
                              </Box>
                            )}
                          </TextField>
                        </Box>
                      </Grid>
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
            )}
            {isEDIselected && (
              <Grid
                container
                direction="row"
                alignItems="flex-start"
                justify="flex-start"
                spacing={3}
                className={classes.gridItem}
              >
                <Grid item xs={12}>
                  <Typography variant="caption" className={classes.legend}>
                    Do you want Response File EDI 824-997?
                  </Typography>
                </Grid>
                <Box pr={4} pl={4} pt={1}>
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
                    onChange={(selectedValue) => {
                      this.setState({
                        showResponseFile: selectedValue.value,
                      });
                    }}
                    selectedOption={showResponseFile}
                  />
                </Box>
              </Grid>
            )}
            {isISOselected && (
              <Grid
                container
                justify="flex-start"
                className={classes.gridContainers}
              >
                <Grid item xs={12} className={classes.gridMArgin} style={{ paddingTop: "20px" }}>
                  <Typography variant="caption" className={classes.legend}>
                    Return ISO XML File Setting
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Box pl={2}>
                    <TextField color="secondary"
                      helperText={
                        responseValidation[
                        `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}`
                        ]
                      }
                      error={responseValidation[
                        `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}`
                      ] && responseValidation[
                        `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}`
                      ].length > 0}
                      onBlur={
                        (e) =>
                          this.onBlurResponseChange(
                            e,
                            `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}`
                          )
                      }
                      autoComplete="off"
                      label="Acknowledgement file Delivery time"
                      id={ediResponsePaymentFile["ISOTransactional XML"]}
                      value={this.getScheduledTime("ISOTransactional XML")}
                      onChange={(event) =>
                        this.handleScheduleSettingsChange(event)
                      }
                      inputProps={{
                        maxLength: 8,
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            )}

            {isEDIselected && showResponseFile === 1 && (
              <Grid
                container
                justify="flex-start"
                className={classes.gridContainers}
              >
                <ResponseFileFields
                  returnFileSettings={returnFileSettings}
                  validation={validation}
                  responseValidation={responseValidation}
                  delimiters={delimiters}
                  subElementDelimiters={subElementDelimiters}
                  segmentDelimiters={segmentDelimiters}
                  classes={classes}
                  handleScheduleSettingsChange={
                    this.handleScheduleSettingsChange
                  }
                  returnEDI={returnEDI}
                  scheduleSetting={scheduleSetting}
                  getScheduledTime={this.getScheduledTime}
                  ediResponsePaymentFile={ediResponsePaymentFile}
                  onChange={(event, item) =>
                    this.setState({
                      returnFileSettings: {
                        ...returnFileSettings,
                        [item]:
                          event.target.value === "" ? null : event.target.value,
                      },
                    })
                  }
                  onBlurResponseChange={this.onBlurResponseChange}
                />
              </Grid>
            )}

            {/* for commercial card changes */}
            {isXMLMSCSelected ?
              <Grid
                container
                direction="row"
                alignItems="flex-start"
                justify="flex-start"
                spacing={2}
                className={classes.radioGridItem}
              >
                <Grid item xs={4}>
                  <Box pl={2} my={2}>
                    {/* <CheckboxGroup
                    options={[
                      {
                        label: "Yes",
                        value: 1
                      },
                      {
                        label: "No",
                        value: 0
                      }
                    ]}
                    onChange={(e) => this.handleAckToggleChange(e, "MC XML")}
                    selectedOption={showXMLMSCResponse}
                  /> */}
                    <FormControl component="xmlmsc_fieldset">
                      <FormLabel component="legend" className={classes.mscResponseLegend}>Turn on MC XML transaction response?</FormLabel>
                      <RadioGroup row aria-label="xmlmsc" name="xmlmsc" value={showXMLMSCResponse} onChange={(e) => this.handleAckToggleChange(e, "MC XML")}>
                        <FormControlLabel value={1} control={<Radio size="small" />} label="Yes" />
                        <FormControlLabel value={0} control={<Radio size="small" />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  {showXMLMSCResponse ?
                    <Box pl={1} my={2}>
                      <TextField
                        className={classes.smallPlaceholderText}
                        color="secondary"
                        autoComplete="off"
                        name="MC XML"
                        label="MC XML Transaction Response Delivery Time"
                        placeholder="HH:MM:SS"
                        value={this.getAckTime("MC XML")}
                        onChange={(event) =>
                          this.handleAckSettingChange(event)
                        }
                        onBlur={(e) => this.onBlurResponseChange(e, "MC XML")}
                        helperText={responseValidation["MC XML"]}
                        error={responseValidation["MC XML"] && responseValidation["MC XML"].length > 0}
                        inputProps={{
                          maxLength: 8
                        }}
                      />
                    </Box>
                    : null}
                </Grid>
              </Grid>
              : null}

            {isISOXMLMSCSelected ?
              <Grid
                container
                direction="row"
                alignItems="flex-start"
                justify="flex-start"
                spacing={2}
                className={classes.radioGridItem}
              >
                <Grid item xs={4}>
                  <Box pl={2} my={2}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" className={classes.mscResponseLegend}>Turn on Card ISO XML transaction response?</FormLabel>
                      <RadioGroup row aria-label="isoxmlmsc" name="isoxmlmsc" value={showISOXMLMSCResponse} onChange={(e) => this.handleAckToggleChange(e, "Card ISO XML")}>
                        <FormControlLabel value={1} control={<Radio size="small" />} label="Yes" />
                        <FormControlLabel value={0} control={<Radio size="small" />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  {showISOXMLMSCResponse ?
                    <Box pl={1} my={2}>
                      <TextField
                        className={classes.smallPlaceholderText}
                        color="secondary"
                        autoComplete="off"
                        name="Card ISO XML"
                        label="Card ISO XML Transaction Response Delivery Time"
                        placeholder="HH:MM:SS"
                        value={this.getAckTime("Card ISO XML")}
                        onChange={(event) =>
                          this.handleAckSettingChange(event)
                        }
                        onBlur={(e) => this.onBlurResponseChange(e, "Card ISO XML")}
                        helperText={responseValidation["Card ISO XML"]}
                        error={responseValidation["Card ISO XML"] && responseValidation["Card ISO XML"].length > 0}
                        inputProps={{
                          maxLength: 8
                        }}
                      />
                    </Box>
                    : null}
                </Grid>
              </Grid>
              : null}

            {isCSVMSCSelected && (
              <Grid
                container
                direction="row"
                alignItems="flex-start"
                justify="flex-start"
                spacing={2}
                className={classes.radioGridItem}
              >
                <Grid item xs={4}>
                  <Box pl={2} my={2}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" className={classes.mscResponseLegend}>Turn on MC CSV transaction response?</FormLabel>
                      <RadioGroup row aria-label="csvmsc" name="csvmsc" value={showCSVMSCResponse} onChange={(e) => this.handleAckToggleChange(e, "MC CSV")}>
                        <FormControlLabel value={1} control={<Radio size="small" />} label="Yes" />
                        <FormControlLabel value={0} control={<Radio size="small" />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  {showCSVMSCResponse ?
                    <Box pl={1} my={2}>
                      <TextField
                        className={classes.smallPlaceholderText}
                        color="secondary"
                        autoComplete="off"
                        name="MC CSV"
                        label="MC CSV Transaction Response Delivery Time"
                        placeholder="HH:MM:SS"
                        value={this.getAckTime("MC CSV")}
                        onChange={(event) =>
                          this.handleAckSettingChange(event)
                        }
                        onBlur={(e) => this.onBlurResponseChange(e, "MC CSV")}
                        helperText={responseValidation["MC CSV"]}
                        error={responseValidation["MC CSV"] && responseValidation["MC CSV"].length > 0}
                        inputProps={{
                          maxLength: 8
                        }}
                      />
                    </Box>
                    : null}
                </Grid>
                {/* <Box>
                  <Grid item className={classes.gridMArgin}>
                    <Typography className={classes.csvLabel}>
                      CSV MC file format for Payment and Payee file can be customized on Payer Portal
                    </Typography>
                    <Typography className={classes.csvLocation}>
                      {`Location: Login > Settings > File Settings`}
                    </Typography>
                  </Grid>
                </Box> */}
              </Grid>
            )}

            {(isXMLMSCSelected && showXMLMSCResponse) || (isISOXMLMSCSelected && showISOXMLMSCResponse) ||
              (isCSVMSCSelected && showCSVMSCResponse) ?
              <Grid item xs={12}>
                <Box display={"flex"} pl={2}>
                  <Box pr={1}>
                    <InfoOutlinedIcon fontSize="small" />
                  </Box>
                  <Typography className={classes.resHelperTxt}>
                    If response delivery time is left empty, then the transaction response will be sent as soon as all the requests of the file have been completely processed.
                  </Typography>
                </Box>
              </Grid> : null
            }
          </Grid>
        </Paper>
        <Grid item xs={12}>
          {processingUpdate ? (
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center"
              spacing={3}
              className={classes.gridItem}
            >
              <CircularProgress color="primary" />
            </Grid>
          ) : (
            <Grid container alignItems="center">
              <Grid item xs={6}>
                <Box px={2} pb={3} textAlign="end">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      this.props.history.push({
                        pathname: `/clientOnboard/payments`,
                      })
                    }
                    style={{ padding: "0 2.75rem", height: '2.5rem' }}
                  >
                    BACK
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box px={2} pb={3}>
                  <Button
                    color="primary"
                    // style={{background:'#0b1941',color:'white'}}
                    onClick={(event) => this.handleSubmit(event)}
                    style={{ padding: "0 2.75rem", height: '2.5rem', fontSize: 14 }}
                  >
                    NEXT
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Grid>

        {error && <Notification variant={variant} message={error} handleClose={() => { this.setState({ error: false }) }} />}
        <SimpleDialog
          open={this.state.openModal}
          onCloseModal={this.onCloseModal}
          modalActions={modalActions}
          title={title}
          subtitle={subtitle}
        />
      </>
    );
  }
}

export default connect((state) => ({ ...state.user }))(
  withStyles(styles)(FileSettings)
);
