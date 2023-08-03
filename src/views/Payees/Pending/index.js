import {
  Box,
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  TableCell,
  TableBody,
  Typography,
  withStyles,
  CircularProgress,
  InputAdornment,
  Button,
  Divider,
  ClickAwayListener,Menu,
} from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import { MenuItem } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./styles";
import "react-notifications/lib/notifications.css";
import Notification from "~/components/Notification";
import ExportAsBtn from '~/components/ExportAsBtn';
import moment from "moment";
import Settings from "@material-ui/icons/Settings";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { SideDialog } from "~/components/Dialogs";
import {
  fetchPayeesList,
  fetchColumnsList,
  fetchOnboardingSrcList,
  fetchSubStatusList,
  fetchCampaignList,
  fetchVendorList,
  fetchPendingData,
} from "~/redux/actions/payees";
import ColumnSettings from "~/modules/ColumnSettings";
import PendingData from "~/modules/PayeesData/PendingData";
import PayeesFilters from "~/modules/PayeesFilters";
import accessRights from "~/config/accessRights";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

class Payees extends Component {

  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      showDownload: false,
      anchorEl: null,  
      message: "",
      page: 0,
      rowsPerPage: 10,
      payeesList: [],
      searchText: "",
      count: 0,
      columns: [],
      isFetching: false,
      source:state?.vendor || "",
      status: "",
      sourceList: [],
      statusList: [],
      openColumnSettings: false,
      alertType: "",
      alertMessage: null,
      annualPopover: false,
      searchPopover: false,
      name: "",
      id:"",
      timeRange:state?.selectedDateID || "",
      startDate: state?.startDate || "",
      endDate:state?.endDate || "",
      payer:state?.payer || "",
      campaign:state?.campaign || "",
      selectedCurrency:state?.currencyCode || "",
      filterCount:0,
      searchType: null,
      isFilterApplied: false,
      annualSpendList: [
        { key: "0-50000", label: "Under $ 50,000", selected: false },
        { key: "50000-100000", label: "$ 50,000 - $ 100,000", selected: false },
        { key: "100000-150000", label: "$ 100,000 - $ 150,000", selected: false },
        { key: "150000-0", label: "Above $ 150,000", selected: false },
      ],
      tempAmount: { minSpend: "", maxSpend: "" },
      amount: { minSpend: "", maxSpend: "" },
      annualLabel: "",
      searchFilter: [
        { key: "payeeName", label: "Payee Name", selected: false },
        { key: "payeeId", label: "Payee ID", selected: false },
        { key: "payerName", label: "Payer Name", selected: false },
      ],
      downloadFileData:[],
      openFiltersSection:false,
      payees: {},
      annualSpendUSD: {},
      annualSpendCAD: {},
      campaignList: [],
      vendorList: [],
      selectedVendorId: " ",
      selectedCampaignId: " ",
      selectedCurrencySpend: "USD",
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.selectedVendorId !== this.state.selectedVendorId ||
      prevState.selectedCampaignId !== this.state.selectedCampaignId
    ) {
      const { selectedVendorId, selectedCampaignId } = this.state;
      this.getPendingData(selectedVendorId, selectedCampaignId);
      if (prevState.selectedVendorId !== this.state.selectedVendorId) {
        this.getCampaignList(selectedVendorId);
      }
    }
  }

  componentDidMount() {
    const { selectedVendorId, selectedCampaignId } = this.state;
    this.getColumnListsName();
    this.loadTableData();
    this.getSourceListNames();
    this.getStatusList();
    this.getCampaignList(selectedVendorId);
    this.getVendorList();
    this.getPendingData(selectedVendorId, selectedCampaignId);
    this.calculateCount();
  }
  loadTableData = () => {
    this.getPayeesList();
  };
  getPayeesList = () => {
    const { rowsPerPage, page, name, 
      id,payer,
      campaign,startDate,endDate, source, status, amount,selectedCurrency, } =
      this.state;
    this.setState(
      {
        isFetching: true,
      },
      () => {
        const data = {
          status: "Pending",
          campaignVendorId: source,
          payeeName: name,
          payeeId: id,
          payerName: payer,
          minValue: amount.minSpend,
          maxValue: amount.maxSpend,
          payeeStatus: status,
          clientId:payer,
          campaignId:campaign,      
          toDate:endDate ? moment(endDate).format('YYYY-MM-DD'): '',     
          fromDate:startDate ? moment(startDate).format('YYYY-MM-DD'): '',
          selectedCurrency:selectedCurrency,
          declineReason: "",
          limit: rowsPerPage,
          offset: page > 0 ? (page) * rowsPerPage : 0,
          expectedResult: "",
        };
        this.props.dispatch(fetchPayeesList(data)).then((response) => {
          if (!response) {
            this.setState({
              alertType: "error",
              alertMessage: this.props.payees.error,
              isFetching: false,
            });
            return false;
          }

          this.setState({
            isFetching: false,
            payeesList: this.props.payees.payeelist,
            count: this.props.payees.count,
          });
        });
      }
    );
  };
  getColumnListsName = () => {
    this.props.dispatch(fetchColumnsList("Pending")).then((response) => {
      if (!response) {
        this.setState({
          alertType: "error",
          alertMessage: this.props.payees.error,
        });
        return false;
      }

      this.setState({
        columns: this?.props?.payees?.columnList.map((item) => ({
          ...item,
          isChecked: item.isCheckPending,
          key: item.infokey,
        })),
      });
    });
  };
  getSourceListNames = () => {
    this.props.dispatch(fetchOnboardingSrcList()).then((response) => {
      if (!response) {
        this.setState({
          alertType: "error",
          alertMessage: this.props.payees.error,
        });
        return false;
      }

      this.setState({
        sourceList: this.props.payees.onboardingSrcList,
      });
    });
  };
  getStatusList = () => {
    this.props.dispatch(fetchSubStatusList()).then((response) => {
      if (!response) {
        this.setState({
          alertType: "error",
          alertMessage: this.props.payees.error,
        });
        return false;
      }

      this.setState({
        statusList: this.props.payees.statusList,
      });
    });
  };

  getCampaignList = (selectedVendorId) => {
    this.props
      .dispatch(fetchCampaignList(selectedVendorId))
      .then((response) => {
        if (!response) {
          this.setState({
            alertType: "error",
            alertMessage: response.error,
            isFetching: false,
          });
          return false;
        }

        this.setState({
          isFetching: false,
          campaignList: this.props.payees.campaignList,
          selectedCampaignId: " ",
        });
      });
  };

  getVendorList = () => {
    this.props.dispatch(fetchVendorList()).then((response) => {
      if (!response) {
        this.setState({
          alertType: "error",
          alertMessage: response.error,
          isFetching: false,
        });
        return false;
      }

      this.setState({
        isFetching: false,
        vendorList: this.props.payees.vendorList,
      });
    });
  };

  getPendingData = (selectedVendorId, selectedCampaignId) => {
    this.props
      .dispatch(fetchPendingData(selectedVendorId, selectedCampaignId))
      .then((response) => {
        if (!response) {
          this.setState({
            alertType: "error",
            alertMessage: response.error,
            isFetching: false,
          });
          return false;
        }
        this.setState({
          isFetching: false,
          annualSpendUSD: this.props.payees.annualSpendUSD,
          annualSpendCAD: this.props.payees.annualSpendCAD,
          payees: this.props.payees.payees,
        });
      });
  };

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.checkFilterStatus();
        this.loadTableData();
      }
    );
  };

  onRangeChange = (e) => {
    const { tempAmount } = this.state;
    const { name, value } = e.target;
    this.setState({
      tempAmount: {
        ...tempAmount,
        [name]: parseInt(value) ? parseInt(value) : 0,
      },
    });
  };

  hideAlertMessage = () => {
    this.setState({ alertMessage: null, alertType: null });
  };

  handleChangePage = (event, newPage) => {
    this.setState(
      {
        page: newPage,
      },
      () => {
        this.loadTableData();
      }
    );
  };
  handleChangeRowsPerPage = (event) => {
    this.setState(
      {
        rowsPerPage: +event.target.value,
        page: 0,
      },
      () => {
        this.loadTableData();
      }
    );
  };
  cellText = (data, text, key) => {
    const { classes } = this.props;

    if (typeof text === "object") {
      let textArr = text?.map((item) => {
        return <Typography variant="subtitle2">{item}</Typography>;
      });
      return textArr;
    } else if (key === "name") {
      return (
        <>
          <span className={classes.roundBox}>{text && text[0]}</span>
          <span title={text} style={{ marginLeft: "10px" }}>
            {text && text.length > 20
              ? text.substring(0, 20) + "..."
              : text
            }
          </span>
        </>
      );
    } else if (key === "commitedSpent") {
      return (
        <>
          <img
            src={
              data.currency === "CAD"
                ? require(`~/assets/icons/CanadianFlag.svg`)
                : require(`~/assets/icons/USAFlag.svg`)
            }
            alt={data.currency === "CAD" ? "CAD Flag" : "USA Flag"}
            style={{ verticalAlign: "middle" }}
          />{" "}
          <span style={{ marginLeft: "10px" }}>{text}</span>
        </>
      );
    } else {
      return <Typography variant="subtitle2" title={text}>
        {text && text.length > 20
          ? text.substring(0, 20) + "..."
          : text
        }
      </Typography>;
    }
  };
  handleSearchClick = (event) => {
    event.stopPropagation();
    this.setState(
      {
        page: 0,
        rowsPerPage: 10,
        searchPopover: false,
      },
      () => {
        this.checkFilterStatus();
        this.loadTableData();
      }
    );
  };
  handleSearch = (event) => {
    if (event.keyCode === 13) {
      this.setState(
        {
          page: 0,
          rowsPerPage: 10,
          searchPopover: false,
        },
        () => {
          this.checkFilterStatus();
          this.loadTableData();
        }
      );
    }
  };

  handleRangeClick = (e) => {
    const rangeValue = e.target.getAttribute("data-value");
    const rangeArray = rangeValue.split("-");
    this.setState({
      tempAmount: {
        minSpend: parseInt(rangeArray[0]) ? parseInt(rangeArray[0]) : 0,
        maxSpend: parseInt(rangeArray[1]) ? parseInt(rangeArray[1]) : 0,
      },
    });
  };

  handleChipClick = (key) => {
    const { searchFilter } = this.state;
    this.setState({
      searchFilter: searchFilter.map((item) =>
        item.key === key
          ? {
              ...item,
              selected: true,
            }
          : {
              ...item,
              selected: false,
            }
      ),
      searchPopover: false,
      searchType: key,
    });
  };

  currencyFormateFn=(val)=> val.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

  annualLabel = () => {
    const { minSpend, maxSpend } = this.state.tempAmount;
    let annualL = "";
    if (minSpend || maxSpend) {
      if ((maxSpend == 0 && minSpend > 0) || minSpend > maxSpend) {
        annualL = `Above $ ${this.currencyFormateFn(minSpend)}`;
      } else if (minSpend == 0 && maxSpend > 0) {
        annualL = `Under $ ${this.currencyFormateFn(maxSpend)}`;
      } else {
        annualL = `${minSpend == 0 ? "Under" : `$ ${this.currencyFormateFn(minSpend)}`} ${
          minSpend == 0 || maxSpend == 0 ? "" : "-"
        } $ ${this.currencyFormateFn(maxSpend)}`;
      }
    } else {
      annualL = "Spend";
    }
    this.setState(
      {
        annualLabel: annualL,
        annualPopover: false,
        amount: { minSpend: minSpend, maxSpend: maxSpend },
      },
      () => {
        this.checkFilterStatus();
        this.loadTableData();
      }
    );
  };
  checkFilterStatus = () => {
    const { amount, source, status, name, searchType } = this.state;
    if (
      source.length === 0 &&
      status.length === 0 &&
      name.length === 0 &&
      searchType === null &&
      amount.minSpend.length === 0 &&
      amount.maxSpend.length === 0
    ) {
      this.setState({
        isFilterApplied: false,
      });
    } else {
      this.setState({
        isFilterApplied: true,
      });
    }
  };
  clearFilters = () => {
    this.setState(
      {
        amount: { minSpend: "", maxSpend: "" },
        name: "",
        source: "",
        status: "",
        searchType: null,
        annualLabel: "",
      },
      () => {
        this.checkFilterStatus();
        this.loadTableData();
      }
    );
  };
  renderDownloadOptions = (val) => {    
    const {anchorEl,} = this.state;
    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={val}
        onClose={() => {
            this.setState({
                anchorEl: null,
                showDownload: false
            })              
        }}
      >            
        <MenuItem onClick={(e)=>this.handleFileDownload("XLSX")}>.XLSX</MenuItem>
      </Menu >
    );
};

handleFileDownload=(fileType)=>{
  this.setState({
      anchorEl: null,
      showDownload: false,
      alertMessage: "Your file will get downloaded shortly",
      alertType: "success",
  }, ()=>{

    const {
      name,id,payer,
      campaign,startDate,endDate,
      source,
      status,
      amount,selectedCurrency,
    } = this.state;
      const data = {
        status: "Pending",
        campaignVendorId: source,
        payeeName: name,
        payeeId: id,
        payerName: payer,
        minValue: amount.minSpend,
        maxValue: amount.maxSpend,
        payeeStatus: status,
        clientId:payer,
        campaignId:campaign,      
        toDate:endDate ? moment(endDate).format('YYYY-MM-DD'): '',     
        fromDate:startDate ? moment(startDate).format('YYYY-MM-DD'): '',
        expectedResult: "",
        declineReason: "",
        selectedCurrency:selectedCurrency,
        limit: 0,
        offset: 0,
        type: "ALL",
      };
      this.props.dispatch(fetchPayeesList(data)).then((response) => {
        if (!response) {
          this.setState({
            alertType: "error",
            alertMessage: this.props.payees.error,
            isFetching: false,
          });
          return false;
        }

        this.setState({
          isFetching: false,
          downloadFileData: this.props.payees.payeelist,
          count: this.props.payees.count,
        },()=>{this.downloadXLSXFile()});
      });
  })
}

downloadXLSXFile=()=>{
  const {downloadFileData,columns} = this.state;
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const date = new Date().toLocaleString("en", { day: "numeric", month: "short", year: "numeric", 
    hour: "numeric", minute: "numeric", second: "numeric" }).replace(/[^ -~]/g, "").split(' ');

  let dateStr = `${date[0]}_${date[1]}_${date[2]}_${date[3]}`;
  var regex = /[.,\s]/g;
  dateStr = dateStr.replace(regex, '');        

  const fileName = `Payees_${dateStr}.xlsx`;

  if (Object.keys(downloadFileData).length > 0) {        
      const tableRows = [];        
      
      downloadFileData.forEach((field) => {
          const data = {};    
          columns.map((cell, i) =>
        cell.isChecked ? (
          data[cell.label] = field[cell.infokey]
        ) : null
      )                      
          tableRows.push(data);
      });
      const paymentFiles = "CC Card Payers";
      const ws = XLSX.utils.json_to_sheet(tableRows);
      const wb = {
      Sheets: {},
      SheetNames: [paymentFiles],
      };
      wb.Sheets[paymentFiles] = ws;

      const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
      });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName);
  }
}

calculateCount = () =>{
  let c =0;
  const {name,id,payer,campaign,timeRange,selectedCurrency}= this.state;

  if(name.length!==0){++c;}
  if(id.toString().length!==0){++c;}
  if(payer.toString().length!==0){ ++c;}
  if(campaign.toString().length!==0){++c;}
  if(timeRange.toString().length!==0){++c;}
  if(selectedCurrency.toString().length!==0){++c;}
  this.setState({filterCount:c});
}

  render() {
    const {
      payeesList,
      page,
      rowsPerPage,
      count,
      isFetching,
      source,
      name,
      statusList,
      sourceList,
      status,
      columns,
      openColumnSettings,
      tempAmount,
      amount,
      searchFilter,
      alertMessage,
      alertType,
      annualPopover,
      searchPopover,
      annualSpendList,
      annualSpendUSD,
      annualSpendCAD,
      campaignList,
      vendorList,
      payees,
      selectedVendorId,
      selectedCampaignId,
      selectedCurrencySpend,
      annualLabel,
      isFilterApplied,openFiltersSection,
      searchType,
      id,
      timeRange,
      startDate,
      endDate,
      payer,filterCount,
      campaign,selectedCurrency,showDownload, anchorEl, 
    } = this.state;
    const { classes,permissions } = this.props;
    const claims = permissions.minified;
    const isPayeesDownloadEnabled = (claims && claims.includes(accessRights["PAYEES_LIST_DOWNLOAD"])) || false;

    return (
      <Grid className={classes.root}>
        <Box mt={6} mx={6}>
          <Paper elevation={0} className={classes.enrollmentGraphs}>
            <Box mx={1}>
              <PendingData
                classes={classes}
                payees={payees}
                campaignList={campaignList}
                vendorList={vendorList}
                annualSpendUSD={annualSpendUSD}
                annualSpendCAD={annualSpendCAD}
                onChange={this.onChange}
                selectedVendorId={selectedVendorId}
                selectedCampaignId={selectedCampaignId}
                selectedCurrencySpend={selectedCurrencySpend}
              />
            </Box>
          </Paper>
        </Box>

        <Box my={0} mx={6}>
          <Box my={3} py={1}>
            <Paper>
              <Box px={3} py={2}>
                <Grid container direction="row" spacing={3}>
                  <Grid
                    container
                    item
                    xs={8}
                    justify="flex-start"
                    display="flex"
                    alignItems="center"
                  >
                    <Box mr={3} cursor="pointer" fontSize={14} color="#9E9E9E">
                      <div>Filters - </div>
                      {isFilterApplied && (
                        <Box
                          onClick={() => this.clearFilters()}
                          style={{
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {" "}
                          Clear All{" "}
                        </Box>
                      )}
                    </Box>
                    <Grid item xs={3}>
                      <Box mx={1}>
                        <TextField
                          className={classes.inputBox}
                          size="small"
                          color="secondary"
                          name="annualLabel"
                          label="Spend"
                          value={annualLabel || ""}
                          onClick={() => this.setState({ annualPopover: true })}
                          fullWidth={true}
                          variant="outlined"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <ArrowDropDownIcon
                                  style={{ color: "#757575" }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                        {annualPopover && (
                          <ClickAwayListener
                            onClickAway={() =>
                              this.setState({
                                annualPopover: false,
                                tempAmount: {
                                  minSpend: amount.minSpend,
                                  maxSpend: amount.maxSpend,
                                },
                              })
                            }
                          >
                            <Box className={classes.annualPopup}>
                              <Box p={3}>
                                <Box mb={2} width={0.75}>
                                  {annualSpendList &&
                                    annualSpendList.length > 0 &&
                                    annualSpendList.map((item) => (
                                      <Typography
                                        className={classes.cursorPointer}
                                      >
                                        <Box
                                          onClick={this.handleRangeClick}
                                          data-value={item.key}
                                          pb={1}
                                        >
                                          {item.label}
                                        </Box>
                                      </Typography>
                                    ))}
                                </Box>
                                <Box sx={{ maxWidth: "270px" }}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                      <TextField
                                        name="minSpend"
                                        label="Min"
                                        size="small"
                                        placeholder="Min"
                                        value={tempAmount.minSpend}
                                        onChange={(e) => this.onRangeChange(e)}
                                        InputProps={{
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              $
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={6}>
                                      <TextField
                                        name="maxSpend"
                                        label="Max"
                                        size="small"
                                        placeholder="Max"
                                        value={tempAmount.maxSpend}
                                        onChange={(e) => this.onRangeChange(e)}
                                        InputProps={{
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              $
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Box>
                              <Divider />
                              <Box
                                p={2}
                                display="flex"
                                justifyContent="space-around"
                              >
                                <Button
                                  onClick={() =>
                                    this.setState({
                                      annualPopover: false,
                                      tempAmount: {
                                        minSpend: amount.minSpend,
                                        maxSpend: amount.maxSpend,
                                      },
                                    })
                                  }
                                  variant="outlined"
                                  className={classes.annualPopBtn}
                                >
                                  CANCEL
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => this.annualLabel()}
                                  className={classes.annualPopBtn}
                                >
                                  APPLY FILTERS
                                </Button>
                              </Box>
                            </Box>
                          </ClickAwayListener>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box mx={1}>
                        <TextField
                          className={classes.inputBox}
                          color="secondary"
                          size="small"
                          name="source"
                          select
                          label="Onboarding Source"
                          value={source || ""}
                          onChange={(e) => this.onChange(e)}
                          fullWidth={true}
                          variant="outlined"
                        >
                          <MenuItem id="" value="">
                            <em>Select</em>
                          </MenuItem>
                          {sourceList &&
                            sourceList.map((item, i) => (
                              <MenuItem
                                key={item.campaignVendorId}
                                value={item.campaignVendorId}
                              >
                                {item.campaignVendorName}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box mx={1}>
                        <TextField
                          className={classes.inputBox}
                          color="secondary"
                          size="small"
                          name="status"
                          select
                          label="Sub-Statuses"
                          value={status || ""}
                          onChange={(e) => this.onChange(e)}
                          fullWidth={true}
                          variant="outlined"
                        >
                          <MenuItem id="" value="">
                            <em>Select</em>
                          </MenuItem>
                          {statusList &&
                            statusList.map((item, i) => (
                              <MenuItem
                                key={item.bucketId}
                                value={item.statusDescription}
                              >
                                {item.statusDescription}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container item xs={4} justify="flex-end">
                  {isPayeesDownloadEnabled && (
                  <Box className={classes.exportArea}>
                  <Box p={1}>
                  <ExportAsBtn
                    onClick={(e) => {
                        this.setState({
                            anchorEl: e.currentTarget,
                            showDownload: true
                        })                                
                    }}
                    btnName={'Export As'}
                    disabled={Object.keys(payeesList).length === 0 ? true : false}
                  />
                  {showDownload && this.renderDownloadOptions(showDownload)}
                  </Box>
                  </Box>
                  )}
                  <Box pt={1} pr={1} style={{"position":"relative"}}>
                  {filterCount!==0 && <img
                      src={require(`~/assets/icons/cancel.svg`)}
                      alt="cancel"
                      className={classes.textTop}
                      onClick={() =>{
                        this.setState({
                          name: "",
                          id:"",
                          payer:"",
                          campaign:"",
                          timeRange:"",
                          startDate:"",
                          endDate:"",
                          selectedCurrency:"",
                          filterCount:0
                        },()=>{
                          this.loadTableData();
                        });
                        }}
                    />}
                  <Button
                    color="primary"
                    aria-label="View"
                    title="More Filters"
                    component="span"
                    className={classes.smallBtn}
                    onClick={() => {
                      this.setState({
                        openFiltersSection: true,
                      });
                    }}
                  >
                    {filterCount!==0 && <Typography variant="h6" className={classes.textBottom}>
                    {filterCount}
                  </Typography>}
                    <img
                      src={require(`~/assets/icons/icon_filter.svg`)}
                      alt="View Filter"
                      className={classes.imgIcon}
                    />
                    <Typography variant="h6" className={classes.iconText}>
                    More Filters
                    </Typography>
                  </Button>
                </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
          <Grid container item xs={12} md={12} className={classes.gridItem}>
            <Paper className={classes.root}>
              <TableContainer className={classes.container}>
                <Table>
                  <TableHead
                    style={{ backgroundColor: "rgba(204,228,255,0.75)", whiteSpace: 'nowrap' }}
                  >
                    {columns?.length > 0 && (
                      <TableRow>
                        {columns.map((column) =>
                          column.isChecked ? (
                            <TableCell
                              key={column.key}
                              width={"18%"}
                              className={classes.tableCellStyle}
                            >
                              <Box
                                fontSize={16}
                                fontWeight="600"
                                color="rgba(18,18,18,0.87)"
                                padding={column.key==="name" ? "0 0 0 32px" : "0"}
                              >
                                {column.label}
                              </Box>
                            </TableCell>
                          ) : null
                        )}
                        <TableCell key={"settings"} className={classes.tableCellStyle}>
                          <Box
                            fontSize={16}
                            fontWeight="600"
                            color="rgba(18,18,18,0.87)"
                            onClick={() =>
                              this.setState({ openColumnSettings: true })
                            }
                          >
                            <Settings className={classes.iconAlign} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableHead>
                  {payeesList && payeesList.length === 0 && (
                    <Grid
                      container
                      style={{
                        padding: "10px 0",
                        margin: 32
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        style={{ position: "absolute", left: "48%" }}
                      >
                        No Results Found
                      </Grid>
                    </Grid>
                  )}
                  <TableBody
                    className="tableBody"
                  >
                    {isFetching ? (
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Box display="flex" justifyContent="center">
                              <CircularProgress color="primary" />
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ) : (
                      payeesList?.length > 0 &&
                      payeesList.map((payee, i) => (
                        <TableRow key={i}>
                          {columns.map((cell, i) =>
                            cell.isChecked ? (
                              <TableCell
                                key={`${cell.infokey}_${i}`}
                                style={{ width: "4%", whiteSpace: "nowrap" }}
                                className={classes.textBold}
                              >
                                {this.cellText(
                                  payee,
                                  payee[cell.infokey],
                                  cell.infokey
                                )}
                              </TableCell>
                            ) : null
                          )}
                          <TableCell
                            style={{ width: "2%", whiteSpace: "nowrap" }}
                            className={classes.textBold}
                          ></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid container xs={12}>
                <Table>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        labelRowsPerPage="Rows per page"
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        labelDisplayedRows={({ from, to, count }) =>
                          ` Page: ${page + 1} of ${
                            count !== -1 ? count : `More Than ${to}`
                          }`
                        }
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </Grid>
            </Paper>
          </Grid>

          {alertMessage && this.renderSnackbar(alertType, alertMessage)}
          {openFiltersSection && (
          <SideDialog
          showButton={false}
          alignSide={true}
          onConfirm={() => this.setState({ openFiltersSection: false })}
          title={
            <>
              <img
                src={require(`~/assets/icons/icon_filter.svg`)}
                alt="View Filter"
                className={classes.imgIcon}
                style={{ verticalAlign: "middle" }}
              />{" "}
              More Filters
            </>
          }
        >
          <PayeesFilters
            source={source}
            name={name}
            id={id}
            payer={payer}
            campaign={campaign}
            timeRange={timeRange}
            startDate={startDate}
            endDate={endDate}
            selectedCurrency={selectedCurrency}
            onCancelClick={() => {
              this.setState({
                openFiltersSection: false,
              });
            }}
          applyMoreFilters = {(filter) =>{
          const {name,id,payer,campaign,startDate,endDate,selectedDuration,selectedCurrency}= filter;
          this.setState({
          name: name,
          id:id,
          payer:payer,
          campaign:campaign,
          timeRange:selectedDuration,
          startDate:startDate,
          endDate:endDate,
          selectedCurrency:selectedCurrency,
          openFiltersSection: false,
          },()=>{
            this.getPayeesList();
            this.calculateCount();
          });
          }}
          resetMoreFilters = {() =>{
          this.setState({
            name: "",
            id:"",
            payer:"",
            campaign:"",
            timeRange:"",
            startDate:"",
            endDate:"",
            selectedCurrency:"",
            filterCount:0
          },()=>{
            this.getPayeesList();
          });
          }}
          />
        </SideDialog>
        )}
        </Box>

        {openColumnSettings && (
          <SideDialog
            showButton={false}
            alignSide={true}
            onConfirm={() => this.setState({ openColumnSettings: false })}
            title={
              <>
                <img
                  src={require(`~/assets/icons/Settings.svg`)}
                  alt={"settings"}
                  style={{ verticalAlign: "text-bottom" }}
                />{" "}
                Column Settings:
              </>
            }
          >
            <ColumnSettings
              columns={columns}
              setCol={(col) => {
                this.setState({ columns: col });
              }}
              onCancelClick={() => {
                this.setState({
                  openColumnSettings: false,
                });
              }}
              tab="pending"
            />
          </SideDialog>
        )}
      </Grid>
    );
  }

  renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={this.hideAlertMessage}
        onClose={this.handleNotificationClose}
      />
    );
  };
}

export default connect((state) => ({
  ...state.user,
  ...state.payees,
  ...state.permissions,
}))(withStyles(styles)(Payees));
