import React from "react";
import { connect } from "react-redux";
import {
    Grid,
    Box,
    Paper,
    Button,
    MenuItem,
    CircularProgress, Typography, Backdrop,
} from "@material-ui/core";

import TextField from "~/components/Forms/TextField";

import { withStyles } from '@material-ui/styles';
import moment from 'moment';

import EventIcon from '@material-ui/icons/Event';
import InfoIcon from '@material-ui/icons/Info';

import Notification from '~/components/Notification';
import { ConfirmDialog, AlertDialog } from "~/components/Dialogs";
import ReportsFilter from "~/components/Dialogs/reports/";
import { createReport, getDataTypes, getPaymentParameterList, downloadDynamicReport, downloadPaymentReport, fetchReportFilter, getFrequencyList } from "~/redux/actions/reports";

import ParameterSelector from "~/modules/Reports/ParameterSelector/";
import ReportOptions from "~/modules/Reports/Options/";
import DynamicDateFilter from "~/modules/Reports/DynamicDateFilter/";
import accessRights from "~/config/accessRights";
import config from '~/config';
// import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import styles from './styles';

class ReportAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isDownloadProgress: false,
            page: 0,
            rowsPerPage: 10,
            sortColumn: "",
            sortOrder: "",
            validation: {},
            updateProgress: false,
            alertType: "success",
            alertMessage: null,
            alertMessageCallbackType: null,
            list: [],
            dataTypeList: [],
            paymentParameterList: [],
            name: "",
            reportType: null,
            selectedPaymentParameters: [],
            dataList: [],
            dataListTotalCount: 0,
            fetchingList: false,
            downloadProgress: false,
            isSubscriber: false,
            emailSubscriptionFrequency: null,
            subscriptionFrequencyList: [],
            showFilter: false,
            filterList: [],
            dateFilter: "PM",
            startDate: this.getFormattedDate(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)),
            endDate: this.getFormattedDate(new Date(new Date().getFullYear(), new Date().getMonth(), 0)),
            filterListProgress: false,
            showConfirmCloseDialog: false,
        };
    }
    getFormattedDate = (dateVal) => {
        return moment(dateVal).format('YYYY-MM-DD');
    }

    componentDidMount = async () => {
        this.getFilterList();
        this.fetchDataTypeList();
        this.fetchFrequencyList();
    }

    resetFilter = (selectedFilter, startDt, endDt) => {
        this.setState({
            dateFilter: selectedFilter,
            startDate: startDt,
            endDate: endDt
        })
    }

    applyFilter = (selectedFilter, startDt, endDt) => {
        this.setState({
            showFilter: false,
        }, () => {
            // this.getReportData();
            this.setState({
                dateFilter: selectedFilter,
                startDate: startDt,
                endDate: endDt
            })
        });
    }

    hideFilter = () => {
        this.setState({
            showFilter: false
        });
    }

    // handlePageChange = (event, page) => {
    //     const { sortColumn, sortOrder } = this.state;
    //     const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
    //     this.setState({
    //         page,
    //         sortColumn: sortColumn,
    //         sortOrder: newSortOrder
    //     }, () => this.getReportData())
    // }

    // handleRowsPerPageChange = (event) => {
    //     console.log(event.target.value);
    //     const { sortColumn, sortOrder } = this.state;
    //     const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
    //     this.setState({
    //         page: 0,
    //         rowsPerPage: parseInt(event.target.value, 10),
    //         sortOrder: newSortOrder
    //     }, () => this.getReportData())
    // }

    // handleSorting(sortColumn) {
    //     const { sortOrder } = this.state;
    //     const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    //     this.setState({ sortColumn: sortColumn, sortOrder: newSortOrder }, () => {
    //         this.getReportData();
    //     });
    // }

    getFilterList = () => {
        const { reportType } = this.state;

        this.setState({
            filterListProgress: true
        }, () => {
            const { info } = this.props.user;
            this.props.dispatch(fetchReportFilter({ reportType, userId: info.userId, portalProfileId: info.portalProfileId, portalTypeId: info.portalTypeId })).then((response) => {
                if (!response) {
                    this.setState({
                        isLoading: false,
                        alertType: "error",
                        alertMessageCallbackType: null,
                        alertMessage: this.props.report.error,
                        filterListProgress: false,
                    });
                    return false;
                }

                this.setState({
                    isLoading: false,
                    filterListProgress: false,
                    filterList: this.props.report.filterList,
                })
            })
        })
    }

    fetchFrequencyList = () => {
        this.setState(
            {
                frequencyListProgress: true,
            },
            () => {
                this.props.dispatch(getFrequencyList()).then((response) => {
                    if (!response) {
                        this.setState({
                            alertType: "error",
                            alertMessageCallbackType: null,
                            alertMessage: this.props.report.error,
                            frequencyListProgress: false,
                        });
                        return false;
                    }
                    this.setState({
                        frequencyListProgress: false,
                        subscriptionFrequencyList: this.props.report.frequencyList,
                        emailSubscriptionFrequency: 2
                    });
                });
            }
        );
    };

    // getReportData = () => {
    //     const { name, page, reportType, dateFilter, rowsPerPage, sortColumn, sortOrder } = this.state;

    //     this.setState({
    //         fetchingList: true
    //     }, () => {
    //         const { info } = this.props.user;
    //         console.log(this.props);
    //         this.props.dispatch(fetchReportView({ dateFilter, reportType, userId: info.userId, portalProfileId: info.portalProfileId, portalTypeId: info.portalTypeId, name, pageNo: page + 1, pageSize: rowsPerPage, sortColumn, sortOrder })).then((response) => {
    //             if (!response) {
    //                 this.setState({
    //                     alertType: "error",
    //                     alertMessageCallbackType: null,
    //                     alertMessage: this.props.report.error,
    //                     fetchingList: false,
    //                     isLoading: false,
    //                 });
    //                 return false;
    //             }

    //             this.setState({
    //                 isLoading: false,
    //                 fetchingList: false,
    //                 dataList: this.props.report.reportData,
    //                 dataListTotalCount: this.props.report.reportDataCount,
    //             })
    //         })
    //     })
    // }

    fetchPaymentParameterList = () => {
        const { reportType } = this.state;
        this.props.dispatch(getPaymentParameterList(reportType)).then((response) => {
            if (!response) {
                this.setState({
                    alertMessage: this.props.report.error,
                    alertType: "error",
                    alertMessageCallbackType: null,
                    isLoading: false,
                });
                return false;
            }
            this.setState({
                isLoading: false,
                paymentParameterList: this.props.report.paymentParameterList
            })
        });
    }

    fetchDataTypeList = () => {
        this.props.dispatch(getDataTypes()).then((response) => {
            if (!response) {
                this.setState({
                    alertMessage: this.props.report.error,
                    alertType: "error",
                    alertMessageCallbackType: null,
                });
                return false;
            }
            const selectedDataType = response.find((item) => item.dataTypeId === 1);
            this.setState({
                reportType: selectedDataType.dataTypeId,
                dataTypeList: this.props.report.dataTypeList
            }, () => {
                this.fetchPaymentParameterList();
            })
        });
    }

    validateForm = () => {
        const { name, selectedPaymentParameters, dateFilter, startDate, endDate } = this.state;

        let valid = true;
        let validation = {};

        if (name.trim() === '') {
            validation["name"] = true;
            this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: "Please select a report name",
                subscriptionProgress: false,
            });
            valid = false;
        }
        if (selectedPaymentParameters && selectedPaymentParameters.length === 0) {
            this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: "Please select a parameter",
                subscriptionProgress: false,
            });
            valid = false;
        }
        if (dateFilter !== null && startDate === null) {
            this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: "Please select a start date in filter section",
                subscriptionProgress: false,
            });
            valid = false;
        }
        if (dateFilter !== null && endDate === null) {
            this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: "Please select an end date in filter section",
                subscriptionProgress: false,
            });
            valid = false;
        }
        if (dateFilter !== null && (Date.parse(startDate) > Date.parse(endDate))) {
            this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: "Start date can not be greater than End date.",
                subscriptionProgress: false,
            });
            valid = false;
        }

        this.setState({ validation: { ...validation } });
        //console.log("validation", validation);
        return valid;
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
        const { selectedPaymentParameters, isSubscriber } = this.state;

        switch (field) {
            case 'name':
                const reportName = event.target.value;
                this.setState({ name: reportName });
                break;
            case 'selectedDateFilter':
                this.setState({ dateFilter: value });
                // this.setDateRange(value);
                break;
            case 'paymentParameter':
                //this.setState({selectedPaymentParameters: [...selectedPaymentParameters, value ]});
                if (position) {
                    this.setState({ selectedPaymentParameters: [...selectedPaymentParameters, value] });
                } else {
                    const newSelectedPaymentParameters = selectedPaymentParameters && selectedPaymentParameters.filter((item, index) => item != value);
                    this.setState({ selectedPaymentParameters: [...newSelectedPaymentParameters] });
                }
                break;
            case 'isSubscriber':
                this.setState({ isSubscriber: !isSubscriber });
                break;
            case 'emailSubscriptionFrequency':
                const emailSubscriptionFrequency = event.target.value;
                this.setState({ emailSubscriptionFrequency: emailSubscriptionFrequency });
                break;
            default:
                break;
        }
    }

    handleDownload = () => {
        const { name, reportType, startDate, endDate, selectedPaymentParameters } = this.state;
        this.setState({
            isDownloadProgress: true
        }, () => {
            if (reportType === 1) {
                const downloadData = {
                    fromDate: startDate,
                    toDate: endDate,
                    // clientID: info.portalProfileId,
                    tokenString: selectedPaymentParameters.join(),
                    datatypeid: reportType,
                    isBankReport: 1,
                }
                this.props.dispatch(downloadPaymentReport(downloadData)).then((response) => {
                    if (!response || (response && response.error)) {
                        this.setState({
                            isDownloadProgress: false,
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
                                isDownloadProgress: false,
                                alertMessage: response.message,
                                alertType: 'error',
                                alertMessageCallback: null,
                            });
                        });
                        return false;
                    } else {
                        this.setState({ isDownloadProgress: false });
                        const fileName = (name ? name : `Report_${new Date().toISOString()}`) + ".xlsx";
                        const type = response.headers["content-type"];
                        const data = new Blob([response.data], {
                            type: type,
                            encoding: "UTF-8",
                        });
                        FileSaver.saveAs(data, fileName);
                    }
                }).catch((error) => {
                    this.setState({
                        isDownloadProgress: false,
                        alertType: "error",
                        alertMessageCallbackType: null,
                        alertMessage: this.props.report.error,
                        subscriptionProgress: false,
                    });
                    return false
                });
            } else {
                const downloadData = {
                    fromDate: startDate,
                    toDate: endDate,
                    // clientId: info.portalProfileId,
                    selectedParameters: selectedPaymentParameters,
                    dataTypeId: reportType
                }
                this.props.dispatch(downloadDynamicReport(downloadData)).then((response) => {
                    if (!response || (response && response.error)) {
                        this.setState({
                            isDownloadProgress: false,
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
                                isDownloadProgress: false,
                                alertMessage: JSON.parse(response).message,
                                alertType: 'error',
                                alertMessageCallback: null,
                            });
                        });
                        return false;
                    } else {
                        this.setState({ isDownloadProgress: false });
                        const fileName = (name ? name : `Report_${new Date().toISOString()}`) + ".xlsx";
                        const type = response.headers["content-type"];
                        const data = new Blob([response.data], {
                            type: type,
                            encoding: "UTF-8",
                        });
                        FileSaver.saveAs(data, fileName);
                    }
                }).catch((error) => {
                    this.setState({
                        isDownloadProgress: false,
                        alertType: "error",
                        alertMessageCallbackType: null,
                        alertMessage: this.props.report.error,
                        subscriptionProgress: false,
                    });
                    return false
                })
            }
        })
    }

    handleSubmit = () => {
        const { name, dataTypeList, reportType, isSubscriber, emailSubscriptionFrequency, selectedPaymentParameters, subscriptionFrequencyList, startDate, endDate, dateFilter } = this.state;
        const valid = this.validateForm();
        if (!valid) {
            return false;
        }

        this.setState({
            updateProgress: true,
        }, () => {
            const selectedDataType = dataTypeList.find((item) => item.dataTypeId === reportType);
            const selectedFrequency = subscriptionFrequencyList.find((item) => item.subscriptionTypeId === emailSubscriptionFrequency);
            const data = {
                name: name, dataType: selectedDataType.dataTypeName,
                dataTypeId: reportType, isSubscriber: isSubscriber,
                emailSubscriptionFrequency: isSubscriber && emailSubscriptionFrequency !== null ? selectedFrequency.description : null,
                frequencyId: isSubscriber && emailSubscriptionFrequency !== null ? selectedFrequency.subscriptionTypeId : null,
                selectedPaymentParameters: selectedPaymentParameters, startDate: startDate, endDate: endDate, dateFilter: dateFilter
            };
            this.props.dispatch(createReport(data)).then((response) => {
                if (!response) {
                    this.setState({
                        alertMessage: this.props.report.error,
                        alertMessageCallbackType: null,
                        alertType: "error",
                        updateProgress: false
                    });
                    return false;
                }
                this.setState({
                    saveNotificationSetup: true,
                    updateProgress: false,
                    alertMessage: "Report added successfully",
                    alertMessageCallbackType: "REDIRECT",
                    alertType: "success",
                });

            });

        });
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
        });
        this.props.history.push(`${config.baseName}/reports`);
    }

    handleCancel = () => {
        //this.props.history.push(`${config.baseName}/reports`);
        this.setState({
            showConfirmCloseDialog: true,
        })
    }

    onCancelClose = () => {
        this.setState({
            showConfirmCloseDialog: false,
        })
    }

    onConfirmClose = () => {
        this.setState({
            showConfirmCloseDialog: false,
        }, () => {
            this.props.history.push(`${config.baseName}/reports`);
        })
    }

    render() {
        const { fetchingList, selectedPaymentParameters, paymentParameterList,
            downloadProgress, isSubscriber, emailSubscriptionFrequency, subscriptionFrequencyList,
            reportType, dataTypeList, isLoading, isDownloadProgress, name, validation, updateProgress, showFilter,
            filterList, dateFilter, startDate, endDate, showConfirmCloseDialog,
            alertMessage, alertMessageCallbackType } = this.state;
        const { classes } = this.props;
        const selectedDataType = dataTypeList.length > 0 && dataTypeList.find((item) => item.dataTypeId === reportType);
        const parametersTitle = `Select ${selectedDataType ? selectedDataType.dataTypeName : ""} Parameters`;

        const { permissions } = this.props;
        const claims = permissions.minified;

        const isReportDownloadEnabled =
            (claims && claims.includes(accessRights["REPORTS_DYNAMIC_DOWNLOAD"])) || false;
        const isReportSubscribeEnabled =
            (claims && claims.includes(accessRights["REPORTS_DYNAMIC_SUBSCRIBE"])) || false;

        if (isLoading) {
            return (
                <Box display="flex" p={10} justifyContent="center" alignItems="center">
                    <CircularProgress color="primary" />
                </Box>
            );
        }
        return (
            <Grid container justify="center" className={classes.root} >
                <Grid item container xs={12} >
                    <Paper className={classes.paper} square>
                        <Grid container justify="center">
                            <Grid item xs={12} sm={12} className={classes.gridItem}>
                                <Backdrop className={classes.backdrop} open={isDownloadProgress}>
                                    <CircularProgress color="primary" />
                                </Backdrop>
                                <Box p={1}>
                                    <Typography variant="h1">Add a New Report</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={6} className={classes.gridItem}>
                                <Box mx={1} pt={1}>
                                    <TextField
                                        required
                                        label="Name of Report"
                                        error={validation.name}
                                        helperText={validation.name}
                                        fullWidth={true}
                                        autoComplete="off"
                                        autoFocus={false}
                                        inputProps={{
                                            maxLength: 50,
                                        }}
                                        variant="outlined"
                                        value={name || ""}
                                        name="name"
                                        onChange={(event) => this.handleChange("name", event)}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={3} sm={3} className={classes.gridItem}>
                                <Box mx={1} pt={1}>
                                    <TextField
                                        required
                                        label="Report Type"
                                        fullWidth={true}
                                        select
                                        value={reportType || ""}
                                        autoComplete="off"
                                        variant="outlined"
                                        name="reportType"
                                        onChange={(event) => this.handleChangeDataType(event)}

                                    >
                                        {dataTypeList ? dataTypeList.map(option => (
                                            <MenuItem key={option.dataTypeId} value={option.dataTypeId}>
                                                {option.dataTypeName}
                                            </MenuItem>
                                        )) :
                                            (
                                                <Box width="100px" display="flex" mt={1.875} justifyContent="center" alignItems="center"><CircularProgress color="primary" /></Box>
                                            )
                                        }
                                    </TextField>
                                </Box>
                            </Grid>
                            <Grid item xs={3} sm={3} className={classes.gridItem}>
                                <Box display="flex" mx={1} pt={1} alignItems="center" justifyContent="flex-end">
                                    <Box p={1}>
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
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <ParameterSelector
                    title={parametersTitle}
                    paymentParameterList={paymentParameterList}
                    selectedPaymentParameters={selectedPaymentParameters}
                    handleChange={this.handleChange}
                    validation={validation}
                    updateProgress={updateProgress}
                />

                {/* {selectedPaymentParameters.length > 0 && <ReportView
                    reportType={reportType}
                    dataList={dataList}
                    totalCount={dataListTotalCount}
                    dataColumns={paymentParameterList}
                    selectedColumns={selectedPaymentParameters}
                    isLoading={fetchingList}
                    page={page}
                    rowsPerPage={this.rowsPerPage}
                    handleSorting={this.handleSorting}
                    handlePageChange={this.handlePageChange}
                    handleRowsPerPageChange={this.handleRowsPerPageChange}
                />
                } */}

                {selectedPaymentParameters.length > 0 && <ReportOptions
                    isSubscriber={isSubscriber}
                    emailSubscriptionFrequency={emailSubscriptionFrequency}
                    subscriptionFrequencyList={subscriptionFrequencyList}
                    handleChange={this.handleChange}
                    handleDownload={this.handleDownload}
                    validation={validation}
                    downloadProgress={downloadProgress}
                    updateProgress={updateProgress}
                    isReportDownloadEnabled={isReportDownloadEnabled}
                    isReportSubscribeEnabled={isReportSubscribeEnabled}
                />
                }

                <Grid container xs={12} >
                    <Grid container justify="center">
                        <Grid item container xs={12} sm={12} className={classes.gridItem} justify="center">
                            <Box display="flex" mb={5} mt={3} justifyContent="space-between">
                                <Button variant="outlined" color="primary" onClick={() => this.handleCancel()} >
                                    Cancel
                                </Button>
                                {updateProgress ? (
                                    <CircularProgress color="primary" />
                                ) : (
                                    <Button variant="contained" style={{ marginLeft: "30px" }} color="primary" onClick={() => this.handleSubmit()} >
                                        Save
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <ReportsFilter
                    open={showFilter}
                    handleClose={() => this.hideFilter()}
                    headerText="Date Filter"
                    icon={<EventIcon size="medium" />}
                >
                    <DynamicDateFilter
                        filterList={filterList}
                        selectedDateFilter={dateFilter}
                        startDate={startDate}
                        endDate={endDate}
                        handleChange={this.handleChange}
                        resetFilter={this.resetFilter}
                        applyFilter={this.applyFilter}
                        handleDateChange={this.handleDateChange}
                        validation={validation}
                        processing={fetchingList}
                    />
                </ReportsFilter>
                {alertMessage && this.renderAlertMessage('', alertMessage, alertMessageCallbackType)}
                {showConfirmCloseDialog && this.renderCancelDialog(<InfoIcon size="small" />, '', 'You have not saved the report. To subscribe to the report kindly save it. Cancel the changes you have made?')}
            </Grid>
        );
    }

    renderSnackbar = (type, message) => {
        return <Notification variant={type} message={message} handleClose={this.hideAlertMessage} />
    }

    renderCancelDialog = (icon, title, message) => {
        return <ConfirmDialog icon={icon} title={title} message={message} onCancel={() => this.onCancelClose()} onConfirm={() => this.onConfirmClose()} />
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

export default connect(state => ({ ...state.user, ...state.report, ...state.permissions }))(withStyles(styles)(ReportAdd));