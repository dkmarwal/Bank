import React, { Component, Fragment } from 'react';
import {
    TextField, InputAdornment,
    Grid, Paper, Box, Button,
    CircularProgress, Table, TableRow, TableBody,
    TablePagination, TableCell, TableSortLabel,
    Checkbox,
    MenuItem, Menu, ListItemIcon,
    IconButton,
    Typography,
} from '@material-ui/core';
import { StyledTableHead, StyledTableRow, StyledTableCell, StyledTableFooter } from '~/components/StyledTable';
import { withStyles } from '@material-ui/styles';

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EventIcon from '@material-ui/icons/Event';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import GetAppIcon from '@material-ui/icons/GetApp';

import SearchIcon from '@material-ui/icons/Search';

import { connect } from 'react-redux';

import { downloadDynamicReport, downloadPaymentReport, deleteDynamicReport, getReportList, fetchReportFilter } from "~/redux/actions/reports";
import Notification from '~/components/Notification';

import ReportsFilter from "~/components/Dialogs/reports/";
import DateFilter from "~/modules/Reports/DateFilter/";

import { ConfirmDialog, AlertDialog } from '~/components/Dialogs';

import './styles.scss';
import config from '~/config'
import styles from './styles';
import * as FileSaver from "file-saver";
import accessRights from '~/config/accessRights';

class ReportListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchingList: false,
            page: 0,
            rowsPerPage: 10,
            sortColumn: "reportName",
            sortOrder: "asc",
            name: "",
            phone: "",
            email: "",
            role: "",
            roleList: [], //System Role list
            filterOpen: false,
            alertType: "success",
            alertMessage: "",
            alertMessageCallbackType: null,
            showConfirmRemoveDialog: false,
            removeReportId: null,
            editDetail: false,
            list: [],
            selectedReports: [],
            validation: {},
            checkedAll: false,
            canEditAction: false,
            listOptions: [
                { icon: <GetAppIcon fontSize="small" />, text: "Download" },
                { icon: <EditOutlinedIcon fontSize="small" />, text: "Edit" },
                { icon: <DeleteOutlineIcon fontSize="small" />, text: "Delete" },
            ],
            anchorEls: null,
            selectedReport: null,
            showFilter: false,
            filterList: [],
            dateFilter: null,
            startDate: null,
            endDate: null,
            clientList: [],
            selectedClient: null,
            filterListProgress: false,
        };
    }

    componentDidMount = async () => {
        //const { accessToken } = this.props.user.userData;

        this.fetchReportList();
        //this.getFilterList();

    }

    filterCliCkFun = () => {
        this.setState({
            filterOpen: !this.state.filterOpen
        })
    }

    clearFilter = () => {
        this.setState({
            name: '',
            phone: '',
            email: '',
            role: '',
        }, () => { this.fetchReportList() });
    }

    handlePageChange = (event, page) => {

        const { sortColumn, sortOrder } = this.state;
        const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
        this.setState({
            page,
            sortColumn: sortColumn,
            sortOrder: newSortOrder
        }, () => this.fetchReportList())
    }

    handleRowsPerPageChange = (event) => {
        const { sortOrder } = this.state;
        const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
        this.setState({
            page: 0,
            rowsPerPage: parseInt(event.target.value, 10),
            sortOrder: newSortOrder
        }, () => this.fetchReportList())
    }

    handleSorting(sortColumn) {
        const { sortOrder } = this.state;
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        this.setState({ sortColumn: sortColumn, sortOrder: newSortOrder }, () => {
            this.fetchReportList();
        });
    }


    fetchReportList = () => {
        const { selectedClient, name, dateFilter, startDate, endDate, page, rowsPerPage, sortColumn, sortOrder } = this.state;

        /*if(!selectedClient){
            this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: "Please select a client.",
                validation:{selectedClient:true}
            });
            return false;
        }*/
        this.setState({
            fetchingList: true,
            validation: {}
        }, () => {
            const { info } = this.props.user;
            //console.log("this.props.user", this.props.user);

            this.props.dispatch(getReportList({ portalProfileId: info.portalProfileId, portalTypeId: info.portalTypeId, selectedClient, name, dateFilter, startDate, endDate, page, rowsPerPage, sortColumn, sortOrder })).then((response) => {
                if (!response) {
                    this.setState({
                        alertType: "error",
                        alertMessageCallbackType: null,
                        alertMessage: this.props.report.error,
                        fetchingList: false,
                        isLoading: false,
                    });
                    return false;
                }

                this.setState({
                    isLoading: false,
                    fetchingList: false,
                    list: this.props.report.list,
                })
            })
        })
    }

    hideAlertMessage = () => {
        this.setState({
            alertMessage: null,
            alertType: null,
            alertMessageCallbackType: null,
        })
    }

    goBack = () => {
        this.setState({
            alertMessage: null,
            alertMessageCallbackType: null,
        })
    }

    resetFilter = () => {
        this.setState({
            dateFilter: null,
            startDate: null,
            endDate: null,
        }, () => {
            //this.getReportData();
        });
    }

    applyFilter = () => {
        this.setState({
            showFilter: false,
        }, () => {
            //this.getReportData();
        });
    }

    hideFilter = () => {
        this.setState({
            showFilter: false,
            dateFilter: null,
            startDate: null,
            endDate: null,
        });
    }

    handleFormPageChange = (pageNo) => {
        this.setState({ formPageNo: pageNo });
    }

    handleDelete = (e, id) => {
        e.stopPropagation();
        const { selectedReports } = this.state;
        const selectedConfirmReport = id ? [id] : [...selectedReports];
        if (selectedConfirmReport.length > 0) {
            this.setState({
                showConfirmRemoveDialog: true,
                removeReportId: id ? id : null,
            })
        } else {
            this.setState({
                alertType: "info",
                alertMessage: 'Please select at least one report',
            })
        }
    }

    onConfirmDelete = () => {
        const { removeReportId, selectedReports } = this.state;
        const selectedConfirmReport = removeReportId ? [removeReportId] : [...selectedReports];
        this.setState({
            showConfirmRemoveDialog: false,
            removeReportId: null
        }, () => {

            this.props.dispatch(deleteDynamicReport({ reportIds: selectedConfirmReport })).then((response) => {
                //set state here on success
                if (!response) {
                    this.setState({
                        alertType: "error",
                        alertMessageCallbackType: null,
                        alertMessage: this.props.report.error,
                    });
                    return false;
                }
                this.fetchReportList();
                this.setState({
                    selectedReports: [],
                    removeReportId: null,
                    alertType: "success",
                    alertMessage: 'Report deleted successfully',
                })

            })
        })
    }
    // onDynamicDelete = (id) => {
    //     this.props.dispatch(deleteDynamicReport({ reportIds: id })).then((response) => {
    //         //set state here on success
    //         if (!response) {
    //             this.setState({
    //                 alertType: "error",
    //                 alertMessageCallbackType: null,
    //                 alertMessage: this.props.report.error,
    //             });
    //             return false;
    //         }

    //         this.setState({
    //             list: this.props.report.list,
    //             selectedReports: [],
    //             removeReportId: null,
    //             alertType: "success",
    //             alertMessage: 'Report deleted successfully',
    //         })
    //     });
    // }

    isSuperAdmin = (item) => {
        const { roleList } = this.state;
        const currentRoles = item.roles.map(user => user.roleId);
        const selectedRoles = roleList ? roleList.filter(role => {
            const flag = currentRoles.length > 0 && currentRoles.indexOf(role.roleId) != -1 && role.roleName == 'System Admin'
            if (flag) {
                return true;
            }
        }) : [];

        return selectedRoles.length > 0 ? true : false;
    }

    onCancelDelete = () => {
        this.setState({
            showConfirmRemoveDialog: false,
            removeReportId: null
        })
    }

    handleSelectAllClick = (event) => {
        const { list } = this.state;
        if (event.target.checked) {
            const newSelecteds = list.filter(x => x.isDynamic).map((n) => n.bankReportId);
            this.setState({ selectedReports: newSelecteds, checkedAll: true });

            return;
        }
        this.setState({ selectedReports: [], checkedAll: false });

    };

    handleClick = (event, item) => {
        const { selectedReports } = this.state;

        const selectedIndex = selectedReports.indexOf(item.bankReportId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedReports, item.bankReportId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedReports.slice(1));
        } else if (selectedIndex === selectedReports.length - 1) {
            newSelected = newSelected.concat(selectedReports.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedReports.slice(0, selectedIndex),
                selectedReports.slice(selectedIndex + 1),
            );
        }

        this.setState({ selectedReports: newSelected });
    };

    getFilterList = () => {
        const { reportType } = this.state;

        this.setState({
            filterListProgress: true
        }, () => {
            const { info } = this.props.user;
            this.props.dispatch(fetchReportFilter({ reportType, userId: info.userId, portalProfileId: info.portalProfileId, portalTypeId: info.portalTypeId })).then((response) => {
                if (!response) {
                    this.setState({
                        alertType: "error",
                        alertMessageCallbackType: null,
                        alertMessage: this.props.report.error,
                        filterListProgress: false,
                    });
                    return false;
                }

                this.setState({
                    filterListProgress: false,
                    filterList: this.props.report.filterList,
                })
            })
        })
    }

    handleChangeDataType = (event) => {
        const reportType = event.target.value;
        this.setState({
            reportType: reportType,
            selectedPaymentParameters: [],
        }, () => {
            this.fetchPaymentParameterList();
        });
    }

    handleDateChange = (fieldName, date) => {
        switch (fieldName) {
            case 'startDate':
                this.setState({ startDate: date });
                break;
            case 'endDate':
                this.setState({ endDate: date });
                break;
            default:
                break;
        }
    }

    handleChange = (field, event, value, position) => {
        const { selectedPaymentParameters } = this.state;

        switch (field) {
            case 'name':
                const reportName = event.target.value;
                this.setState({ name: reportName });
                break;
            case 'client':
                this.setState({ selectedClient: event.target.value }, () => {

                    this.fetchReportList();
                });

                break;
            case 'dateFilter':
                this.setState({ dateFilter: value });
                break;
            case 'paymentParameter':
                if (position) {
                    this.setState({ selectedPaymentParameters: [...selectedPaymentParameters, value] });
                } else {
                    const newSelectedPaymentParameters = selectedPaymentParameters && selectedPaymentParameters.filter((item, index) => item != value);
                    this.setState({ selectedPaymentParameters: [...newSelectedPaymentParameters] });
                }
                break;
            default:
                break;
        }

        //console.log(newUserDetail);
    }

    handleSearch = (event) => {
        if (event.keyCode === 13) {
            this.setState({
                page: 0
            }, () => {
                this.fetchReportList();
            })
        }
    }

    handleOption = (event, item) => {
        const selectedEl = {
            [item.bankReportId]: event.target
        }
        this.setState({ anchorEls: selectedEl });
    }

    handleOptionClose = (event, item) => {
        this.setState({ anchorEls: null });
    }

    handleDownload = (item) => {
        const { info } = this.props.user;
        const selectedParams = item ? item.BankParameters.map((item) => item.dataTypeMappingId) : "";

        if (item.dataTypeId === 1) {
            const downloadData = {
                fromDate: item.fromDate,
                toDate: item.toDate,
                clientID: info.portalProfileId,
                tokenString: selectedParams.join(),
                datatypeid: item.dataTypeId,
                isBankReport: 1,
            }
            this.props.dispatch(downloadPaymentReport(downloadData)).then((response) => {
                if (!response || (response && response.error)) {
                    this.setState({
                        alertType: "error",
                        alertMessageCallbackType: null,
                        alertMessage: this.props.report.error,
                        subscriptionProgress: false,
                    });
                    return false
                }
                if (response.data.type === 'text/plain') {
                    const blobData = new Response(response.data).text();
                    blobData.then((response) => {
                        this.setState({
                            alertMessage: response.message,
                            alertType: 'error',
                            alertMessageCallback: null,
                        });
                    });
                    return false;

                } else {
                    const fileName = (item.reportName ? item.reportName : `Report_${new Date().toISOString()}`) + ".xlsx";
                    const type = response.headers["content-type"];
                    const data = new Blob([response.data], {
                        type: type,
                        encoding: "UTF-8",
                    });
                    FileSaver.saveAs(data, fileName);
                }
            }).catch((error) => {
                this.setState({
                    alertType: "error",
                    alertMessageCallbackType: null,
                    alertMessage: this.props.report.error,
                    subscriptionProgress: false,
                });
                return false
            });
        } else {
            const downloadData = {
                fromDate: item.fromDate,
                toDate: item.toDate,
                clientId: info.portalProfileId,
                selectedParameters: selectedParams,
                dataTypeId: item.dataTypeId
            }
            this.props.dispatch(downloadDynamicReport(downloadData)).then((response) => {
                if (!response || (response && response.error)) {
                    this.setState({
                        alertType: "error",
                        alertMessageCallbackType: null,
                        alertMessage: this.props.report.error,
                        subscriptionProgress: false,
                    });
                    return false
                }
                if (response.data.type === 'application/json') {
                    const blobData = new Response(response.data).text();
                    blobData.then((response) => {
                        this.setState({
                            alertMessage: JSON.parse(response).message,
                            alertType: 'error',
                            alertMessageCallback: null,
                        });
                    });
                    return false;
                } else {
                    const fileName = (item.reportName ? item.reportName : `Report_${new Date().toISOString()}`) + ".xlsx";
                    const type = response.headers["content-type"];
                    const data = new Blob([response.data], {
                        type: type,
                        encoding: "UTF-8",
                    });
                    FileSaver.saveAs(data, fileName);
                }
            }).catch((error) => {
                this.setState({
                    alertType: "error",
                    alertMessageCallbackType: null,
                    alertMessage: this.props.report.error,
                    subscriptionProgress: false,
                });
                return false
            })
        }
    }

    handleListClick = (e, item) => {
        const { selectedClient } = this.state;
        switch (e.currentTarget.id) {
            case 'Edit':
                this.props.history.push({
                    pathname: `${config.baseName}/reports/edit`,
                    state: { report: item, selectedClient: selectedClient }
                })
                break;
            case 'Delete':
                e.stopPropagation();
                this.handleDelete(e, item.bankReportId);
                this.handleOptionClose(e, item);
                break;
            case 'Download':
                this.handleDownload(item);
                this.handleOptionClose(e, item);
                break;
            default:
                break;
        }
        this.setState({ anchorEls: null });
    }
    showReport = (item) => {
        const { selectedClient } = this.state;

        /*if(!selectedClient){
            this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: "Please select a client.",
                validation:{selectedClient:true}
            });
            return false;
        }*/
        if (!item.isDynamic) {
            if (item.reportCode === "EnrolmentJourneyReport") {
                this.props.history.push({
                    pathname: `${config.baseName}/reports/view/payeeauditreport`,
                    state: { isValidReport: true  }
                })
            } else {
            this.props.history.push({
                pathname: `${config.baseName}/reports/view`,
                state: { report: item, selectedClient: selectedClient }
            })}
        }
    }

    render() {
        const { alertMessage, validation, filterList, checkedAll,
            selectedReports, list,
            dateFilter, filterListProgress, startDate, endDate, showFilter,
            showConfirmRemoveDialog, alertMessageCallbackType, isLoading, fetchingList, listOptions, anchorEls,
            page, rowsPerPage, sortColumn, sortOrder } = this.state;
        const { classes } = this.props;
        const { user, permissions, report } = this.props;

        const claims = permissions.minified;
        const dynamicList = list.filter(x => x.isDynamic).map((n) => n);
        //const isReportViewEnabled   = user.userRoles && user.userRoles.includes(accessRights['REPORTS_VIEW']) || false;
        const isReportEditEnabled = claims ? claims.includes(accessRights['REPORTS_DYNAMIC_EDIT']) : false;
        const isReportDeleteEnabled = claims ? claims.includes(accessRights['REPORTS_DYNAMIC_DELETE']) : false;
        const isReportDownloadEnabled = claims ? claims.includes(accessRights['REPORTS_DYNAMIC_DOWNLOAD']) : false;
        // const isReportSubscribeEnabled = claims && claims.includes(accessRights['REPORTS_SUBSCRIBE']) || false;
        const isReportBuilderEnabled = claims ? claims.includes(accessRights['REPORTS_DYNAMIC_CREATE']) : false;
        if (isLoading) {
            return <Box display="flex" p={10} justifyContent="center" alignItems="center"><CircularProgress color="primary" /></Box>
        }

        return (
            <Fragment>
                <Grid container xs={12} className={classes.root}>
                    <Grid container item xs={12} md={12} justify="flex-end">
                        {isReportBuilderEnabled && <Box mt={-3} mr={8}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.mediumBtn}
                                startIcon={<AddOutlinedIcon />}
                                onClick={() => this.props.history.push(`${config.baseName}/reports/add`)}
                            >
                                BUILD NEW REPORT
                            </Button>
                        </Box>
                        }
                    </Grid>
                    <Paper className={classes.paper}>
                        <Grid container item xs={12} md={12} className={classes.gtidItem} >
                            <Box display="flex" width='100%' p={1} >
                                <Box p={1} flexGrow={1}>
                                    <TextField
                                        className={classes.searchBox}
                                        placeholder="Search Report Name"
                                        inputProps={{ 'aria-label': 'Search Report Name' }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="search"
                                                    onClick={() => { this.setState({ page: 0 }, () => this.fetchReportList()) }}
                                                    onMouseDown={null}
                                                    edge="end"
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>,
                                        }}
                                        onChange={event => this.setState({ name: event.target.value })}
                                        onKeyDown={(event) => this.handleSearch(event)}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                                <Box p={1} width="120px">
                                    {isReportDeleteEnabled && <Button
                                        color="primary"
                                        aria-label="Delete Report"
                                        title="Delete Report"
                                        component="span" className={classes.smallBtn}
                                        onClick={(event) => this.handleDelete(event)}
                                    >
                                        <DeleteOutlineIcon size="small" className={classes.smallIcon} />
                                        <Typography variant='h6' className={classes.iconText}>
                                            Delete
                                        </Typography>
                                    </Button>
                                    }
                                </Box>
                                <Box p={1} style={{ display: 'none' }} >
                                    <Button
                                        color="primary"
                                        aria-label="View"
                                        title="View Filter"
                                        component="span"
                                        className={classes.smallBtn}
                                        onClick={() => {
                                            this.setState({
                                                showFilter: true,
                                            });
                                        }}
                                    >
                                        <img
                                            src={require(`~/assets/icons/icon_filter.svg`)}
                                            alt={"View Filter"}
                                            className={classes.smallIcon}
                                        />
                                        <Typography variant="h6" className={classes.iconText}>
                                            Filters
                                        </Typography>
                                    </Button>
                                </Box>
                                <Box p={1} style={{ display: 'none' }} display="flex" alignItems="center" >
                                    <EventIcon size="small" className={classes.smallIcon} />
                                    <Typography variant='h3' className={classes.iconText}>
                                        Previous Month
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid container item xs={12} md={12} >
                            <Table>
                                <StyledTableHead>
                                    <TableRow>
                                        {isReportDeleteEnabled && <StyledTableCell>
                                            <Checkbox
                                                checked={checkedAll}
                                                indeterminate={selectedReports.length > 0 && selectedReports.length < dynamicList.length}
                                                onChange={(event) => this.handleSelectAllClick(event)}
                                                icon={<CheckBoxOutlineBlankIcon style={{ color: 'rgba(0,0,0,0.6)' }} />}
                                                checkedIcon={<CheckBoxIcon style={{ color: 'rgba(0,0,0,0.6)' }} />}
                                            />
                                        </StyledTableCell>}
                                        <StyledTableCell sortDirection={sortColumn === "reportName" ? sortOrder : false}>
                                            <TableSortLabel style={{ fontSize: '16px' }}
                                                active={sortColumn === "reportName"}
                                                direction={sortColumn === "reportName" ? sortOrder : 'asc'}
                                                onClick={() => this.handleSorting("reportName")}
                                            >
                                                Name of Report
                                                {sortColumn === "reportName" ? (
                                                    <span style={{ border: 0, clip: 'rect(0 0 0 0)', height: 1, margin: -1, overflow: 'hidden', padding: 0, position: 'absolute', top: 20, width: 1, }}>
                                                        {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </span>
                                                ) : null}
                                            </TableSortLabel>
                                        </StyledTableCell>
                                        <StyledTableCell style={{ fontSize: '16px' }}>
                                            Report Type
                                        </StyledTableCell>
                                        <StyledTableCell style={{ fontSize: '16px' }}>
                                            Frequency
                                        </StyledTableCell>
                                        <StyledTableCell style={{ fontSize: '16px' }}>
                                            Generated By
                                        </StyledTableCell>
                                        <StyledTableCell style={{ fontSize: '16px' }}>
                                            Subscription
                                        </StyledTableCell>
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody class="reportsTableBody">
                                    {fetchingList ? (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Box display="flex" p={5} justifyContent="center" alignItems="center"><CircularProgress color="primary" /></Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        report.list && report.list.map((item, index) => {
                                            const isSelected = selectedReports.indexOf(item.bankReportId) !== -1;
                                            return <Fragment key={index}>
                                                <StyledTableRow >
                                                    {isReportDeleteEnabled && <StyledTableCell onClick={() => this.showReport(item)} >
                                                        {item.isDynamic && <Checkbox
                                                            onChange={(event) => this.handleClick(event, item)}
                                                            checked={isSelected}
                                                            inputProps={{ 'aria-labelledby': item.bankReportId }}
                                                        />}
                                                    </StyledTableCell>
                                                    }
                                                    <StyledTableCell onClick={() => this.showReport(item)}>
                                                        <Typography variant="body1" component="h2">
                                                            {item.reportName}
                                                        </Typography>
                                                    </StyledTableCell>
                                                    <StyledTableCell onClick={() => this.showReport(item)}>{item.dataType ? item.dataType : ""}</StyledTableCell>
                                                    <StyledTableCell onClick={() => this.showReport(item)}>
                                                        {item.frequency ? item.frequency : "N.A."}
                                                    </StyledTableCell>
                                                    <StyledTableCell onClick={() => this.showReport(item)}>
                                                        {item.generatedBy}
                                                    </StyledTableCell>
                                                    <StyledTableCell onClick={() => this.showReport(item)}>
                                                        <Box display="flex" width='100%'>
                                                            <Box p={1} flexGrow={1}>
                                                                {item.subscription ? "Subscribed" : "Not Subscribed"}
                                                            </Box>
                                                            {item.isDynamic && (isReportDeleteEnabled ||
                                                                isReportDownloadEnabled ||
                                                                isReportEditEnabled) && <Box>
                                                                    <Button
                                                                        aria-label="more"
                                                                        aria-controls="long-menu"
                                                                        aria-haspopup="true"
                                                                        onClick={(event) => this.handleOption(event, item)}
                                                                    >
                                                                        <MoreVertIcon />
                                                                    </Button>
                                                                    {anchorEls && anchorEls[item.bankReportId] && <Menu
                                                                        id={item.userId}
                                                                        keepMounted
                                                                        anchorEl={anchorEls[item.bankReportId]}
                                                                        open={Boolean(anchorEls[item.bankReportId])}
                                                                        onClose={e => this.handleOptionClose(e, item)}
                                                                    >
                                                                        {listOptions.map((option) => (
                                                                            <>
                                                                                {(claims && claims.includes(accessRights[`REPORTS_DYNAMIC_${option.text.toUpperCase()}`])) ?
                                                                                    <MenuItem key={option.text} id={option.text} onClick={e => this.handleListClick(e, item)}>
                                                                                        <ListItemIcon >
                                                                                            {option.icon}
                                                                                        </ListItemIcon>
                                                                                        <Typography variant="inherit">{option.text}</Typography>
                                                                                    </MenuItem> : null}
                                                                            </>
                                                                        ))}
                                                                    </Menu>}
                                                                </Box>}
                                                        </Box>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            </Fragment>
                                        })
                                    )}

                                    {report.list.length === 0 && <TableRow>
                                        <TableCell colSpan={6}>
                                            <Box display="flex" p={1} justifyContent="center" alignItems="center">No result found.</Box>
                                        </TableCell>
                                    </TableRow>
                                    }
                                </TableBody>
                                <StyledTableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[10, 25, 50, { label: 'All', value: report.totalCount || 10 }]}
                                            colSpan={6}
                                            count={report.totalCount || 0}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            SelectProps={{
                                                inputProps: { 'aria-label': 'rows per page' },
                                                native: true,
                                            }}
                                            onChangePage={this.handlePageChange}
                                            onChangeRowsPerPage={this.handleRowsPerPageChange}
                                        />
                                    </TableRow>
                                </StyledTableFooter>
                            </Table>
                        </Grid>
                    </Paper>
                    {alertMessage && this.renderAlertMessage('', alertMessage, alertMessageCallbackType)}
                    {showConfirmRemoveDialog && this.renderDeleteDialog('', 'Are you sure you want to delete this report?')}
                </Grid>

                <ReportsFilter
                    open={showFilter}
                    handleClose={() => this.hideFilter()}
                    headerText="Date Filter"
                    icon={<EventIcon size="medium" />}
                >
                    <DateFilter
                        filterList={filterList}
                        dateFilter={dateFilter}
                        startDate={startDate}
                        endDate={endDate}
                        handleChange={this.handleChange}
                        resetFilter={this.resetFilter}
                        applyFilter={this.applyFilter}
                        handleDateChange={this.handleDateChange}
                        validation={validation}
                        processing={filterListProgress}
                    />
                </ReportsFilter>
            </Fragment>
        )
    }

    renderSnackbar = (type, message) => {
        return <Notification variant={type} message={message} handleClose={this.hideAlertMessage} />
    }

    renderDeleteDialog = (title, message) => {
        return <ConfirmDialog title={title} message={message} onCancel={() => this.onCancelDelete()} onConfirm={() => this.onConfirmDelete()} />
    }

    renderAlertMessage = (title, message, callbackType) => {
        return <AlertDialog
            dialogClassName={"alert-dialoge-root"}
            title={title}
            message={message}
            onConfirm={() => { callbackType === 'REDIRECT' ? this.goBack() : this.hideAlertMessage() }}
        />
    }
}

export default connect(state => ({ ...state.user, ...state.role, ...state.permissions, ...state.report, ...state.bankClients, ...state.permissions }))(withStyles(styles)(ReportListView));
