import React, { Component } from "react";
import styles from './style';
import { 
    Typography, 
    withStyles, 
    Box,
    MenuItem, FormControl, InputLabel, Select,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Menu,
    TextField, TablePagination, Button, InputAdornment,   
    Divider,
    ClickAwayListener, Grid, CircularProgress                
} from '@material-ui/core';
import { connect } from "react-redux";
import ExportAsBtn from '~/components/ExportAsBtn';
import ReplayIcon from '@material-ui/icons/Replay';
import USAFlag from '~/assets/images/USA_flag.svg';
import CADFlag from '~/assets/images/CAD_flag.svg';
import accessRights from "../../config/accessRights";
import AddIcon from "@material-ui/icons/Add";
import Notification from "~/components/Notification";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import _ from "lodash";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import generatePDF from '~/modules/GeneratePDF/';

import {
    fetchCCPayeeListing,
    fetchCCAllPayeesData, 
    fetchCCGroupList,
    fetchCCStatuList,
    fetchCCSelectedPayeesData,
    fetchClientDetails
} from "~/redux/helpers/clients";
import { updateOnboardingCLient } from "~/redux/actions/clients";
import {fetchResultsList} from '~/redux/actions/payees';
import { fetchCompanyData } from "~/redux/helpers/userProfile";
import { CustomDialog } from "~/components/Dialogs/index.js";
import ClientDetails from "~/modules/Clients/clientDetails";
import Pagination from '@material-ui/lab/Pagination';

class CardPayers extends Component{
    constructor(props){
        super(props);
        this.state ={
            showDownload: false,
            anchorEl: null,            
            payees: '-1',
            industryType: '',
            status: '',
            commitedSpend: '',
            expectedResult: this?.props?.location?.state?.filterID ?? '',
            payerName: '',
            payerID: '',
            contactNo: '',
            page: 0,
            rowsPerPage: 10,
            paginationCount: 0,
            alertType: null,
            alertMsg: null,
            payeesList:[],
            annualSpendList: [
                { key: "0-50000", label: "Under $ 50,000", selected: false },
                { key: "50000-100000", label: "$ 50,000 - $ 100,000", selected: false },
                { key: "100000-150000", label: "$ 100,000 - $ 150,000", selected: false },
                { key: "150000-0", label: "Above $ 150,000", selected: false },
              ],
            tempAmount: { minSpend: "", maxSpend: "" },
            amount: { minSpend: "", maxSpend: "" },
            annualLabel: "",            
            annualPopover: false,
            industryTypeList: [],
            expectedResultList: [],
            statusList: [],
            isLoading: false,
            tableData:[],
            selectedClient:{},            
            showClientModal: false, 
            downloadFileData: [],
            currentPage: 1,           
        }
        this.loadTableData =  _.debounce(this.loadTableData, 1000);
    }  
    
    componentDidMount=()=>{  
        this.fetchPayeeListingAPI();      
        this.fetchTypeOfIndutryList();
        this.fetchExpectedResultList(); 
        this.fetchStatuList();
    }

    fetchPayeeListingAPI=()=>{
        fetchCCPayeeListing().then((res) => {            
            if(res.error || res.isError){
                this.setState({
                    alertMsg: res.message || res.title,
                    alertType: "error",
                    payeesList: []
                }, ()=>{
                    this.loadTableData();
                })
                return false
            }
            else{
                this.setState({
                    payeesList: res?.data ?? []
                }, ()=>{
                    this.loadTableData();
                })                
            } 
        })
    } 

    handlePayeeChange=(e)=>{
        this.handleReset();
        const name = e.currentTarget.getAttribute('name');
        const value = e.currentTarget.value;
        this.setState({
            [name]: value,  
            status: value === "-1" ? "" : 'Onboarded'                     
        }, ()=>{            
            this.loadTableData();
        })
    }

    handleChange=(e)=>{        
        const name = e.currentTarget.getAttribute('name');
        const value = name === 'contactNo' 
                    ? e.currentTarget.value.replace(/[^0-9]/g, "")  
                    : e.currentTarget.value 
        
        this.setState({
            [name]: value, 
            page: 0,
            rowsPerPage: 10,
            paginationCount: 0,
            currentPage: 1            
        }, ()=>{                   
            this.loadTableData();
        })
    } 

    handleReset=()=>{
        const {payees} = this.state;
        this.setState({            
            industryType: '',
            status: payees === "-1" ? '' : "Onboarded",
            commitedSpend: '',
            expectedResult: '',
            payerName: '',
            payerID: '',
            contactNo: '',
            annualLabel: '',
            tempAmount: { minSpend: "", maxSpend: "" },
            amount: { minSpend: "", maxSpend: "" },
            page: 0,
            rowsPerPage: 10,
            paginationCount: 0,
            currentPage: 1
        }, ()=>{            
            this.loadTableData();
        })
    }

    loadTableData=()=>{
        const {payees} = this.state;
        if(payees === "-1"){
            this.fetchAllPayeesData()
        }
        else{
            this.fetchSelectPayeeData()
        }
    }

    fetchAllPayeesData=()=>{
        this.setState({
            isLoading: true
        }, ()=>{
            const {status, 
                payerName, 
                payerID, 
                contactNo, 
                page, 
                rowsPerPage, 
                expectedResult, 
                industryType, 
                amount
            } = this.state;            

            const payload ={
                status: status?.toString()?.trim("") ?? "",
                type: "ALL",
                clientName: payerName?.trim("") ?? "",
                taxId: payerID?.trim("") ?? "",
                phoneNumber: contactNo?.trim("") ?? "",
                groupId: industryType?.trim("") ?? "",
                limit: rowsPerPage || 10,
                offset: (page*rowsPerPage) || 0,
                expectedResult: expectedResult?.trim("") ?? "",
                minValue: amount?.minSpend ?? "",
                maxValue: amount?.maxSpend ?? "",            
            }

            fetchCCAllPayeesData(payload).then((res) => { 
                if(res.error || res.isError){
                    this.setState({
                        alertMsg: res.message || res.title,
                        alertType: "error",
                        isLoading: false,
                        tableData: []
                    })
                    return false
                }
                else{                    
                    this.setState({
                        isLoading: false,
                        tableData: res?.data?.rows ?? [],
                        paginationCount: res?.data?.count ?? 0
                    })           
                } 
            })
        })
    }

    fetchSelectPayeeData=()=>{
        this.setState({
            isLoading: true
        }, ()=>{
            const {status, 
                payerName, 
                payerID, 
                contactNo, 
                page, 
                rowsPerPage, 
                expectedResult, 
                industryType, 
                amount,
                payees
            } = this.state;

            const payload ={
                taxId: payees,
                status: status?.toString()?.trim("") ?? "",
                clientName: payerName?.trim("") ?? "",
                infoId: payerID?.trim("") ?? "",
                phoneNumber: contactNo?.trim("") ?? "",
                groupId: industryType?.trim("") ?? "",
                limit: rowsPerPage || 10,
                offset: page || 0,
                expectedResult: expectedResult?.trim("") ?? "",
                minValue: amount?.minSpend ?? "",
                maxValue: amount?.maxSpend ?? "",            
            }

            fetchCCSelectedPayeesData(payload).then((res) => { 
                if(res.error || res.isError){
                    this.setState({
                        alertMsg: res.message || res.title,
                        alertType: "error",
                        isLoading: false,
                        tableData: []
                    })
                    return false
                }
                else{
                    this.setState({
                        isLoading: false,
                        tableData: res?.data?.rows ?? [],
                        paginationCount: res?.data?.count ?? 0
                    })           
                } 
            })
        })
    }

    fetchTypeOfIndutryList=()=>{
        fetchCCGroupList().then((res) => {                        
            if(res.error || res.isError){
                this.setState({
                    alertMsg: res.message || res.title,
                    alertType: "error",
                    industryTypeList: []
                })
                return false
            }
            else{
                this.setState({
                    industryTypeList: res?.data?.rows ?? []
                })         
            } 
        })
    }

    fetchExpectedResultList=()=>{
        this.props.dispatch(fetchResultsList()).then((res) => {
            if (!res) {
              this.setState({
                alertType: "error",
                alertMessage: this.props.payees.error,
                expectedResultList: []
              });
              return false;
            }            
            this.setState({
                expectedResultList: this?.props?.payees?.resultList ?? []
            }) 
        });
    }

    fetchStatuList=()=>{
        fetchCCStatuList().then((res) => {
            if(res.error || res.isError){
                this.setState({
                    alertMsg: res.message || res.title,
                    alertType: "error",
                    statusList: []                    
                })
                return false
            }
            else{                
                this.setState({
                    statusList: res?.data ?? []                    
                })         
            } 
        })
    }

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
            < MenuItem onClick={(e)=>this.handleFileDownload("PDF")}>.PDF</MenuItem>
          </Menu >
        );
    };

    handleFileDownload=(fileType)=>{
        this.setState({
            anchorEl: null,
            showDownload: false,
            alertMsg: "Your file will get downloaded shortly",
            alertType: "success",
        }, ()=>{

            const {status, 
                payerName, 
                payerID, 
                contactNo,             
                expectedResult, 
                industryType, 
                amount,
                payees
            } = this.state;

            const commonPayload = {
                status: status?.toString()?.trim("") ?? "",            
                clientName: payerName?.trim("") ?? "",                
                phoneNumber: contactNo?.trim("") ?? "",
                groupId: industryType?.trim("") ?? "",
                limit: 0,
                offset: 0,
                expectedResult: expectedResult?.trim("") ?? "",
                minValue: amount?.minSpend ?? "",
                maxValue: amount?.maxSpend ?? "",
            }

            let payload = {};

            if(payees === "-1"){
                payload ={
                    type: "ALL",
                    taxId: payerID?.trim("") ?? "",
                    ...commonPayload
                }
            }
            else{
                payload ={
                    taxId: payees,
                    infoId: payerID?.trim("") ?? "",
                ...commonPayload 
                }
            }

            const hitAPI = payees === "-1" ? fetchCCAllPayeesData : fetchCCSelectedPayeesData

            hitAPI(payload).then((res)=>{
                if(res.error || res.isError){
                    this.setState({
                        alertMsg: res.message || res.title,
                        alertType: "error"                    
                    })
                    return false
                }
                else{ 
                    this.setState({                        
                        downloadFileData: res?.data?.rows ?? []   
                    }, ()=>{
                        if(fileType === "XLSX"){
                            this.downloadXLSXFile()
                        }
                        else{
                            this.downloadPDFFile()
                        }
                    })         
                }
            })
        })
    }

    downloadXLSXFile=()=>{
        const {downloadFileData} = this.state;
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const date = new Date().toLocaleString("en", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).replace(/[^ -~]/g, "").split(' ');

        let dateStr = `${date[0]}_${date[1]}_${date[2]}_${date[3]}`;
        var regex = /[.,\s]/g;
        dateStr = dateStr.replace(regex, '');        

        const fileName = `B2B_Card_Payers_${dateStr}.xlsx`;

        if (Object.keys(downloadFileData).length > 0) {        
            const tableRows = [];        
            downloadFileData.forEach((field) => {
                const data = {};                
                data["Payer Name"] = field?.clientName ?? "";
                data["Identification Number"] = field?.TaxID ?? "";
                data["Contact"] = field?.phoneNumber ?? "";
                data["Type of Industry"] = field?.industryType ?? "";
                data["Status"] = field?.status ?? "";
                data["Currency Code"] = field?.currencyCode ?? "";
                data["Enrolled Spend"] = field?.totalCommittedVolume ?? "";
                data["Spend Status"] = field?.ExpectedResult ?? "";                
                tableRows.push(data);
            });
            const paymentFiles = "B2B Card Clients";
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

    downloadPDFFile=()=>{
        const {downloadFileData} = this.state;
        if (Object.keys(downloadFileData).length > 0) {
            const tableColumn = [
              "Payer Name",
              "Identification Number",
              "Contact",
              "Type of Industry",
              "Status",
              "Currency Code",
              "Enrolled Spend",
              "Spend Status"
            ];
            
            const tableRows = [];
            
            downloadFileData.forEach((field) => {
              const data = [
                field?.clientName ?? "",
                field?.TaxID ?? "",
                field?.phoneNumber ?? "",
                field?.industryType ?? "",
                field?.status ?? "",
                field?.currencyCode ?? "",
                field?.totalCommittedVolume ?? "",
                field?.ExpectedResult ?? ""
              ];              
              tableRows.push(data);
            });
            const title = "B2B Card Clients";
  
            const date = new Date().toLocaleString("en", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).replace(/[^ -~]/g, "").split(' ');
            let dateStr = `${date[0]}_${date[1]}_${date[2]}_${date[3]}`;
            var regex = /[.,\s]/g;
            dateStr = dateStr.replace(regex, '');
            const fileName = `B2B_Card_Payers__${dateStr}.pdf`; 
            generatePDF(title, fileName, tableColumn, tableRows);            
        }
    }

    handleChangePage = (event, newPage) => {
        this.setState({
            page: Number(newPage-1),
            currentPage: newPage 
        }, ()=> this.loadTableData())        
      };
    
    handleChangeRowsPerPage = (event) => {          
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0,
            currentPage: 1
        }, ()=> this.loadTableData()) 
    };

    gotoOnboardclient = () => {
        this.props.history.push({
            pathname: `/clientOnboard/EntityType`,
        });
    };

    renderSnackbar = (type, msg) => {
        return <Notification variant={type} message={msg} handleClose={this.hideAlertMessage} />
    }

    hideAlertMessage = () => {
        this.setState({
            alertMsg: null,
            alertType: null
        })
    }

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

    annualLabel = () => {
        const { minSpend, maxSpend } = this.state.tempAmount;
        let annualL = "";
        if (minSpend || maxSpend) {
          if ((maxSpend === 0 && minSpend > 0) || minSpend > maxSpend) {
            annualL = `Above $${minSpend}`;
          } else if (minSpend === 0 && maxSpend > 0) {
            annualL = `Under $${maxSpend}`;
          } else {
            annualL = `${minSpend === 0 ? "Under" : `$${minSpend}`} ${
              minSpend === 0 || maxSpend === 0 ? "" : "-"
            } $${maxSpend}`;
          }
        } else {
          annualL = "Annual Spend";
        }
        this.setState(
          {
            annualLabel: annualL,
            annualPopover: false,
            amount: { minSpend: minSpend, maxSpend: maxSpend },
            page: 0,
            rowsPerPage: 10,
            paginationCount: 0,
            currentPage: 1
        }, ()=>{
            this.loadTableData();
        });
    };

    openClientPopup=(client)=>{                
        this.props.dispatch(
            updateOnboardingCLient({
              selectedEntityType: 'B2B',
            })
          );  
          
          const clientDetails =
            client.status === "In Progress" ? fetchCompanyData : fetchClientDetails;            

          this.setState({ selectedClient: {} }, () => {              
            clientDetails({ clientId: client.clientId }).then((response) => {                
              if (response.error || _.isEmpty(response.data)) {
                this.setState({ 
                    alertMsg: response?.message ?? '',
                    alertType: "error" 
                })
                return false;
              }
              this.setState({
                selectedClient:
                    client.status.trim().toLowerCase() == "in progress"
                    ? { ...response.data.rows[0], status: "Inprogress" }
                    : { ...response.data, status: client.status },
                showClientModal: true,
              });
            });
        });
    }
    
    currencyFormateFn=(val)=> Number(val).toFixed(2)?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");    
    getFirstChrName=(str)=> str?.split(" ")?.map((n, i)=> i<=1 ? n[0] : null)?.join("")?.toUpperCase();

    render(){
        const {classes, permissions} = this.props;  
        const {showDownload, 
            payees, 
            industryType, 
            status,
            expectedResult,
            payerName,
            payerID,
            contactNo,
            page,
            rowsPerPage,
            paginationCount,
            alertType,
            alertMsg,
            payeesList,
            annualSpendList,
            tempAmount,
            amount,
            annualLabel,
            annualPopover,
            industryTypeList,
            expectedResultList,
            statusList,
            isLoading,
            tableData,
            showClientModal,
            selectedClient,
            currentPage            
        } = this.state; 
        
        const claims = permissions.minified;
        const isAddClientsAllowed = claims && claims.includes(accessRights["CLIENTS_LIST_ONBOARDING"]);
        const isDownloadAllowed = (claims && claims.includes(accessRights["CARDS_CLIENTS_LIST_DOWNLOAD"])) || false;
        
        return(
            <>
                {isAddClientsAllowed && (
                    <Box
                        mt={-6}
                        mb={2}
                        mx={1}
                        display="flex"
                        justifyContent="flex-end"
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.onboardButton}
                            onClick={this.gotoOnboardclient}
                            startIcon={<AddIcon />}                            
                        >
                            ONBOARD A CLIENT
                        </Button>
                    </Box>
                )}

                <Box
                    component={'div'}
                    className={classes.cardPayersDiv}
                >
                    <Box 
                        component={'div'}
                        className={classes.downloadSec}
                    >
                        {isDownloadAllowed && (
                            <>
                                <Box className="exportArea">
                                    <Box p={1}>
                                        <ExportAsBtn
                                            onClick={(e) => {
                                                this.setState({
                                                    anchorEl: e.currentTarget,
                                                    showDownload: true
                                                })                                
                                            }}
                                            btnName={'Export As'}
                                            disabled={Object.keys(tableData).length === 0 ? true : false}
                                        />
                                        {showDownload && this.renderDownloadOptions(showDownload)}
                                    </Box>
                                </Box>
                                <Box className="divider"></Box>
                            </>
                        )}                          

                        <Box className="payeesList">
                            <FormControl variant="outlined" size="small">
                                <InputLabel htmlFor="outlined-age-native-simple">Payees</InputLabel>
                                <Select
                                    native
                                    value={payees}
                                    onChange={(e)=>this.handlePayeeChange(e)}
                                    label="Payees"
                                    inputProps={{
                                        name: 'payees',
                                        id: 'outlined-age-native-simple',
                                    }}
                                >    
                                    <option value="-1"> All </option>
                                    {payeesList.map((item)=>{
                                        if(Boolean(item?.taxId ?? false) && Boolean(item?.supplierName ?? false)){
                                           return(<option value={item.taxId}>{item.supplierName}</option>)
                                        }
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                        
                    </Box>

                   <Box
                    component={'div'}
                    className={classes.tableArea}
                   >
                       <TableContainer 
                            component={'div'}  
                            style={{minHeight: 400}}                          
                        >
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="h4">Payer Name</Typography> 
                                            <TextField 
                                                id="PayerName"                                                  
                                                variant="outlined" 
                                                size="small"
                                                autoComplete="off"
                                                placeholder="Payer Name"
                                                onChange={(e)=>this.handleChange(e)}
                                                name="payerName" 
                                                value={payerName}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography 
                                                variant="h4"
                                                style={{width: 160}}
                                            >Identification Number</Typography>
                                            <TextField 
                                                id="PayerID"                                                 
                                                variant="outlined" 
                                                size="small"
                                                autoComplete="off"
                                                placeholder="Identification Number"
                                                onChange={(e)=>this.handleChange(e)}
                                                name="payerID" 
                                                value={payerID}
                                                inputProps={{ maxLength: 15 }}
                                                className="IdentificationNumber"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="h4">Contact</Typography>
                                            <TextField 
                                                id="Contact"                                                 
                                                variant="outlined" 
                                                size="small"
                                                autoComplete="off"
                                                placeholder="Contact"
                                                onChange={(e)=>this.handleChange(e)}
                                                name="contactNo" 
                                                value={contactNo}
                                                inputProps={{ maxLength: 10 }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="h4">Type of Industry</Typography>
                                            <FormControl variant="outlined" size="small">
                                                <Select
                                                    native
                                                    value={industryType}
                                                    onChange={(e)=>this.handleChange(e)}
                                                    inputProps={{
                                                        name: 'industryType',
                                                        id: 'outlined-age-native-simple',
                                                    }}
                                                >                
                                                    <option value="">All</option>   
                                                    {industryTypeList.map((item)=>{
                                                        if(Boolean(item?.groupId ?? false) && Boolean(item?.name ?? false)){
                                                            return(
                                                                <option value={item.groupId}>
                                                                    {item.name}
                                                                </option>
                                                            )       
                                                        }                                                       
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="h4">Status</Typography>
                                            <FormControl variant="outlined" size="small">
                                                <Select
                                                    native
                                                    value={status}
                                                    onChange={(e)=>this.handleChange(e)}
                                                    inputProps={{
                                                        name: 'status',
                                                        id: 'outlined-age-native-simple',
                                                    }}
                                                    disabled={payees != "-1" ? true : false}
                                                >   
                                                    <option value="">All</option>
                                                    {statusList.map((item)=>{
                                                        if(Boolean(item?.id ?? false) && Boolean(item?.status ?? false)){
                                                            return(
                                                                <option value={item.status}>
                                                                    {item.status}
                                                                </option>
                                                            )
                                                        }
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </TableCell>

                                        <TableCell 
                                            style={{minWidth:220}}
                                        >
                                            <Typography variant="h4">Enrolled Spend</Typography>
                                            <Box className="enrollSpendBox">
                                                <TextField                                                    
                                                    size="small"
                                                    color="secondary"
                                                    name="annualLabel"
                                                    //label="Annual Spend"
                                                    value={annualLabel || ""}
                                                    onClick={() => this.setState({ annualPopover: true })}
                                                    fullWidth={true}
                                                    variant="outlined"
                                                    title={annualLabel}
                                                    autoComplete='off'
                                                    InputProps={{
                                                        endAdornment: (
                                                        <InputAdornment position="end">
                                                            <ArrowDropDownIcon style={{"color":"#757575"}} />
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
                                                                >
                                                                    CANCEL
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => this.annualLabel()}
                                                                >
                                                                    APPLY FILTERS
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </ClickAwayListener>
                                                )}
                                            </Box>

                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="h4">Spend Status</Typography>
                                            <FormControl variant="outlined" size="small">
                                                <Select
                                                    native
                                                    value={expectedResult}
                                                    onChange={(e)=>this.handleChange(e)}
                                                    inputProps={{
                                                        name: 'expectedResult',
                                                        id: 'outlined-age-native-simple',
                                                    }}
                                                >                
                                                    <option value="">All</option> 
                                                    {expectedResultList.map((item)=>{
                                                        if(Boolean(item?.id ?? false) && Boolean(item?.expectedValue ?? false)){
                                                            // Removing Others option from list
                                                            if(item.id !== 4){ 
                                                                return(
                                                                    <option value={item.id}>
                                                                        {item.expectedValue}
                                                                    </option>
                                                                )
                                                            }        
                                                        }
                                                    })}                                                    
                                                </Select>
                                            </FormControl>
                                        </TableCell>

                                        <TableCell className="resetBtn">
                                            <ReplayIcon onClick={()=> this.handleReset()} />
                                        </TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Boolean(isLoading) 
                                        ? <>
                                            <TableRow>
                                                <TableCell colSpan={8} style={{border: 'none'}}>
                                                    <Box 
                                                        style={{
                                                            margin: '20px auto',
                                                            float: 'left',
                                                            width: '100%',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        <CircularProgress />
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                        : Object.keys(tableData).length === 0
                                            ? <>
                                                <TableRow>
                                                    <TableCell colSpan={8} style={{border: 'none'}}>
                                                        <Box                            
                                                            textAlign="center"
                                                            width={1}
                                                            mt={16}
                                                            style={{float: 'left'}}
                                                        >
                                                        <img
                                                            alt="no-data"
                                                            src={require("~/assets/images/nodata.svg")}
                                                            style={{
                                                                float: 'none',
                                                                width: 'auto',
                                                                height: 'auto',
                                                                margin: 'auto',
                                                                borderRadius: '0',
                                                            }}
                                                        />
                                                        <Box
                                                            py={3}
                                                            color="#A1A1A1"
                                                            fontSize={14}
                                                            display="block"
                                                        >
                                                            {" "}
                                                            No Data to show
                                                        </Box>
                                                    </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                            : tableData.map((item)=>{
                                                return(
                                                    <TableRow
                                                        style={{
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={(e)=>this.openClientPopup(item)}
                                                    >
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center">
                                                                <label>
                                                                    {this.getFirstChrName(item?.clientName ?? '')}
                                                                </label>
                                                            <Box
                                                            component="div"
                                                            textOverflow="ellipsis"
                                                            maxWidth="180px"
                                                            width="auto"
                                                            title={item?.clientName ?? ''}
                                                            >
                                                            <Typography noWrap={true}>
                                                            {item?.clientName ?? ''}
                                                            </Typography>
                                                            </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{item?.TaxID ?? ''}</TableCell>
                                                        <TableCell>{item?.phoneNumber ?? ''}</TableCell>
                                                        <TableCell>{item?.industryType ?? ''}</TableCell>
                                                        <TableCell>
                                                            <span style={{
                                                                background:`${item?.statusColor}`
                                                            }}>
                                                                {item?.status ?? ''}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>   
                                                            {Boolean(item?.totalCommittedVolume ?? false) && Boolean(item?.currencyCode ?? false)
                                                                ? <>
                                                                    <img 
                                                                        src={item.currencyCode === "CAD" 
                                                                            ? CADFlag
                                                                            : USAFlag
                                                                        } 
                                                                        alt=""
                                                                    /> 
                                                                    {item?.totalCommittedVolume}
                                                                </>
                                                                : null
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography 
                                                                variant="h5"
                                                                style={{
                                                                    background: `${item?.expectedColorCode}` 
                                                                }}
                                                            >
                                                               {item?.ExpectedResult ?? ""}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell></TableCell>                                        
                                                    </TableRow>
                                                )
                                            })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {tableData.length > 0 && (
                            <>
                                {/* <TablePagination
                                    component="div"
                                    count={paginationCount}
                                    page={page}
                                    onChangePage={(e, page)=>this.handleChangePage(e, page)}
                                    rowsPerPage={rowsPerPage}
                                    onChangeRowsPerPage={(e)=>this.handleChangeRowsPerPage(e)}
                                /> */}

                                <Pagination 
                                    count={Math.ceil(Number(paginationCount/rowsPerPage))} 
                                    page={currentPage}
                                    showFirstButton={true} 
                                    showLastButton={true} 
                                    onChange={(e, page)=>this.handleChangePage(e, page)}
                                    style={{
                                        float: 'right',
                                        padding: "10px 0",
                                        margin: '5px 0 0'
                                    }}
                                />

                            </> 
                        )}
                    </Box>
                </Box>

                {alertMsg && this.renderSnackbar(alertType, alertMsg)}   

                {showClientModal && (
                    <CustomDialog>
                        <ClientDetails
                            setDialogMessage={(message) => {
                                this.setState({ 
                                    alertMsg: message,
                                    alertType: "error" 
                                })
                            }}
                            selectedClient={selectedClient}
                            closeModal={() => this.setState({ showClientModal: false })}
                            history={this.props.history}
                        />
                    </CustomDialog>
                )}

            </>
        )
    }
}

export default connect((state) => ({
    ...state.user,
    ...state.clientConfig,
    ...state.permissions,
    ...state.payees
  }))(withStyles(styles)(CardPayers))