import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, Grid, Box, Typography } from '@material-ui/core';
import styles from './styles';
import USBankPayments from './USBankPayments';
import ContactedPayees from './ContactedPayees';
import { fetchOnBoardedClients } from '~/redux/helpers/clients';
import accessRights from '~/config/accessRights';
import moment from 'moment';
import {
  getLineChartDataFormat,
  getBarChartDataFormat,
  getEnrolledPayeesBarChartData,
} from '~/utils/common.js';
import {
  B2CEnrollGraph,
  fetchDashboardPaymentSummary,
  fetchDashboardPayments,
} from '~/redux/helpers/dashboard';
import { SideDialog } from '~/components/Dialogs';
import DashboardFilter from './DashboardDateFilter';
import {
  lineChartOptions,
  mixedGraphOpt,
} from './chartOptions';
import Notification from '~/components/Notification';

let month = new Date().getMonth();
let year = new Date().getFullYear();
if (month === 0) {
  month = 12;
  year = year - 1;
}

class USBankDashboard extends Component {
  state = {
    ChildGraphRef: null,
    selectedCurrency: 'USD',
    selectedView: 'Amount',
    enableDateFilter: false,
    selectedCurrentDateFilter: 2,
    totalPaymentCount: 0,
    selectedPayeeId: 0,
    paymentsData: {},
    enrollmentConsumerData: null,
    enrollDoughnutAPIData: null,
    payeeEnrollGraphInfo: null,
    fileType: 'ALL',
    filter: {
      clientID: 0,
      payeeID: 0,
      year: year,
      month: month,
      quarter: '',
      lastDays: undefined,
      resultType: '',
      currency: '',
      fromDate: undefined,
      toDate: undefined,
    },
    usBankData: null,
    appType: 2,
    payeesList: null,
    viewAllStatus: false,
    mixedGraphData: {},
    mixedGraphOpt: {},
    barChartData: null,
    enrolledPayeesBarChartData: null,
    enrollGraphRefData: null,
    filters: [
      {
        label: 'All time',
        key: 0,
      },
      {
        label: 'Previous Month',
        key: 1,
      },
      {
        label: 'Previous Quarter',
        key: 2,
      },
      {
        label: 'Previous Year',
        key: 3,
      },
      {
        label: 'Last 7 days',
        key: 4,
      },
      {
        label: 'Last 30 Days',
        key: 5,
      },
      {
        label: 'Custom',
        key: 6,
      },
    ],
    selectedFilter: 2,
    alertMessage: null,
    alertType: null,
  };

  componentDidMount = () => {
    this.loadData();
    this.resetGraphStrike();
  };

  loadData = () => {
    const { claims } = this.props;
    // const bankId = this.props.user.info.portalProfileId;
    const { appType } = this.state;

    if (claims && claims.includes(accessRights['CLIENTS_LIST_VIEW'])) {
      const payload = {
        portalProfileId: undefined,
        filter: 1,
        appType: appType,
      };
      // Passed filter as 1 to get Onboarded clients.
      fetchOnBoardedClients(payload).then((response) => {
        this.setState({
          payeesList:
            response && response['data'] && response['data']['clients'],
        });
      });
    }
    this.prepareData();
  };

  prepareData() {
    const { selectedView, selectedCurrency, filter, selectedPayeeId, appType } =
      this.state;
    const payload = {
      clientID: selectedPayeeId,
      payeeID: 0,
      year: filter['year'],
      month: filter['month'],
      quarter: filter['quarter'],
      lastDays: filter['lastDays'],
      resultType: selectedView,
      currency: selectedCurrency,
      fromDate: filter['fromDate']
        ? moment(filter['fromDate']).format('MM/DD/YYYY')
        : undefined,
      toDate: filter['toDate']
        ? moment(filter['toDate']).format('MM/DD/YYYY')
        : undefined,
      BusinessType: appType,
    };
    this.prepareDashboardSummary(payload);
    this.prepareDashboardPayments(payload);
    this.getB2CEnrollGraph();
  }

  onB2BPaymentsChange = (e) => {
    const { selectedView, selectedCurrency, appType } = this.state;
    this.setState({ selectedPayeeId: e.target.value }, () => {
      const { filter } = this.state;
      const payload = {
        ...filter,
        clientID: e.target.value,
        BusinessType: appType,
        year: filter['year'],
        month: filter['month'],
        quarter: filter['quarter'],
        lastDays: filter['lastDays'],
        resultType: selectedView,
        currency: selectedCurrency,
        fromDate: filter['fromDate']
          ? moment(filter['fromDate']).format('MM/DD/YYYY')
          : undefined,
        toDate: filter['toDate']
          ? moment(filter['toDate']).format('MM/DD/YYYY')
          : undefined,
      };
      this.prepareDashboardSummary(payload);
      this.prepareDashboardPayments(payload);
      this.getB2CEnrollGraph();
    });
    this.resetGraphStrike();
  };

  handlePaymentsAmountClick = (fieldName) => {
    this.setState({ selectedView: fieldName }, () => {
      const { filter, selectedPayeeId, selectedCurrency, appType } = this.state;
      const payload = {
        ...filter,
        clientID: selectedPayeeId,
        BusinessType: appType,
        year: filter['year'],
        month: filter['month'],
        quarter: filter['quarter'],
        lastDays: filter['lastDays'],
        resultType: fieldName,
        currency: selectedCurrency,
        fromDate: filter['fromDate']
          ? moment(filter['fromDate']).format('MM/DD/YYYY')
          : undefined,
        toDate: filter['toDate']
          ? moment(filter['toDate']).format('MM/DD/YYYY')
          : undefined,
      };
      this.prepareDashboardSummary(payload);
      this.prepareDashboardPayments(payload);
    });
  };

  prepareDashboardSummary(payload) {
    fetchDashboardPaymentSummary(payload).then((res) => {
      if (res.error) {
        this.setState({
          alertType: 'error',
          alertMessage: res.message || 'Something Went Wrong',
          barChartData: {},
          usBankData: [{}],
        });
      } else if (res.data) {
        this.setState({
          usBankData: res.data,
          barChartData: getBarChartDataFormat(res.data?.paymentDetails ?? []),
        });
      } else {
        this.setState({
          barChartData: {},
          usBankData: [{}],
        });
      }
    });
  }

  prepareDashboardPayments(payload) {
    fetchDashboardPayments(payload).then((response) => {
      if (!response || response.error) {
        this.setState({
          alertType: 'error',
          alertMessage: response.message || 'Something Went Wrong',
          paymentsData: {
            labels: [],
            datasets: [
              {
                data: [],
                backgroundColor: [],
                borderWidth: 0,
              },
            ],
          },
        });
        return false;
      }
      const totalDataSets = [];
      const timeLine = [];
      response.data &&
        response.data.length &&
        response.data.forEach((obj) => {
          if (!timeLine.includes(obj['figureFor'])) {
            timeLine.push(obj['figureFor']);
          }
        });
      response &&
        response.data &&
        response.data.length &&
        response.data.forEach((obj) => {
          totalDataSets.push({
            figure: obj['figure'],
            figureFor: obj['figureFor'],
          });
        });

      var temp = {};
      var obj = null;
      for (var i = 0; i < totalDataSets.length; i++) {
        obj = totalDataSets[i];

        if (!temp[obj.figureFor]) {
          temp[obj.figureFor] = obj;
        } else {
          temp[obj.figureFor].figure = (
            Number(temp[obj.figureFor].figure) + Number(obj.figure)
          ).toFixed(2);
        }
      }
      var newTotalData = [];
      for (var prop in temp) {
        newTotalData.push(temp[prop]);
      }
      if (response?.data?.length) {
        this.setState({
          paymentsData: {
            labels: timeLine,
            datasets: [
              {
                fill: false,
                label: 'Total Payments',
                backgroundColor: '#002D72',
                borderColor: '#002D72',
                lineTension: 0,
                data:
                  newTotalData &&
                  newTotalData.map((item) => ({
                    y: item.figure,
                    x: item.figureFor,
                  })),
              },
              ...getLineChartDataFormat('description', response.data),
            ],
          },
        });
      }
    });
  }

  getB2CEnrollGraph = () => {
    const { fileType, viewAllStatus, filter, selectedPayeeId } = this.state;
    const payloadData = {
      clientId: selectedPayeeId === 0 ? -1 : selectedPayeeId,
      fileType: fileType,
      showAllStatus: viewAllStatus,
      lastDays: filter.lastDays || undefined,
      fromDate: filter['fromDate']
        ? moment(filter['fromDate']).format('MM/DD/YYYY')
        : undefined,
      toDate: filter['toDate']
        ? moment(filter['toDate']).format('MM/DD/YYYY')
        : undefined,
      month: filter.month || undefined,
      quarter: filter.quarter || undefined,
      year: filter.year || undefined,
    };

    B2CEnrollGraph(payloadData).then((res) => {
      if (!res.error) {
        if (res.data) {
          this.setState(
            {
              enrollmentConsumerData: res?.data?.enrollmentData ?? [],
              enrollDoughnutAPIData: Boolean(res.data.paymentTypeData)
                ? this.props.user.isPayeeChoicePortal
                  ? res.data.paymentTypeData
                  : res.data.paymentTypeData[0]
                : [],
              payeeEnrollGraphInfo: res?.data?.graphData ?? [],
            },
            () => {
              if (Boolean(res.data)) {
                this.createMixedGraph();
                this.loadEnrollDoughnut();
                this.loadEnrollBarChart();
              }
            }
          );
        } else {
          this.setState({
            enrollmentConsumerData: [],
            enrollDoughnutAPIData: [],
            payeeEnrollGraphInfo: [],
          });
        }
      } else {
        this.setState({
          enrollmentConsumerData: [],
          enrollDoughnutAPIData: [],
          payeeEnrollGraphInfo: [],
          alertMessage: res.message,
          alertType: 'error',
        });
      }
    });
    this.resetGraphStrike();
  };

  loadEnrollBarChart = () => {
    const { enrollDoughnutAPIData } = this.state;
    this.setState({
      enrolledPayeesBarChartData: getEnrolledPayeesBarChartData(
        enrollDoughnutAPIData
      ),
    });
  };
  loadEnrollDoughnut = () => {
    const { enrollDoughnutAPIData } = this.state;
    let totalCount = 0;
    enrollDoughnutAPIData.forEach((item, index) => {
      totalCount += item.totalcount;
    });
    this.setState({
      totalPaymentCount: totalCount,
    });
  };

  resetGraphStrike = () => {
    let item = document.getElementsByClassName('legendItem');
    for (let i = 0; i < item.length; i++) {
      item[i].classList.remove('strike');
    }

    const { enrollGraphRefData, ChildGraphRef } = this.state;

    if (Boolean(enrollGraphRefData)) {
      const meta_1 =
        enrollGraphRefData?.chartInstance?.getDatasetMeta(0) ?? null;
      if (Boolean(meta_1)) {
        for (let a = 0; a < meta_1.data.length; a++) {
          meta_1.data[a].hidden = false;
        }
        enrollGraphRefData.chartInstance.update();
      }
    }

    if (Boolean(ChildGraphRef)) {
      const meta_3 = ChildGraphRef?.chartInstance?.getDatasetMeta(0) ?? null;
      if (Boolean(meta_3)) {
        for (let c = 0; c < meta_3.data.length; c++) {
          meta_3.data[c].hidden = false;
        }
        ChildGraphRef.chartInstance.update();
      }
    }
  };

  createMixedGraph = () => {
    const { enrollmentConsumerData } = this.state;
    const labels = Boolean(enrollmentConsumerData.dates) && [
      ...new Set(enrollmentConsumerData.dates.map((obj) => obj)),
    ];
    let graphData = [];
    let legendsList = [];

    Object.keys(enrollmentConsumerData).forEach((e) => {
      if (e.toLocaleLowerCase() !== 'dates') {
        legendsList.push(e);
      }
    });
    legendsList.forEach((e) => {
      if (e.toLocaleLowerCase() === 'contacted') {
        graphData.push({
          type: 'line',
          label: enrollmentConsumerData[e]?.label ?? '',
          data: enrollmentConsumerData[e]?.data ?? [],
          backgroundColor: enrollmentConsumerData[e]?.colorCode ?? '',
          borderColor: enrollmentConsumerData[e]?.colorCode ?? '',
          fill: false,
          tension: 0,
          borderWidth: 2,
          //order: 1
        });
      } else {
        graphData.push({
          type: 'bar',
          label: enrollmentConsumerData[e]?.label ?? '',
          data: enrollmentConsumerData[e]?.data ?? [],
          backgroundColor: enrollmentConsumerData[e]?.colorCode ?? '',
        });
      }
    });
    const data = {
      labels: labels,
      datasets: graphData,
    };

    this.setState({
      mixedGraphData: data,
      mixedGraphOpt: mixedGraphOpt,
    });
  };

  graphRefFn = (data) => {
    if (Boolean(data)) {
      this.setState({
        ChildGraphRef: data,
      });
    }
  };

  returnFilterLabel(index) {
    this.resetGraphStrike();
    switch (index) {
      case 1:
        return 'All time';
      case 2:
        return 'Previous Month';
      case 3:
        return 'Previous Quarter';
      case 4:
        return 'Previous Year';
      case 5:
        return 'Last 7 days';
      case 6:
        return 'Last 30 days';
      case 7:
        return 'Custom';
      default:
        break;
    }
  }

  handleAllStatus = (e) => {
    this.setState(
      {
        viewAllStatus: e.target.checked,
      },
      () => {
        this.getB2CEnrollGraph();
      }
    );
  };

  handleFileType = (e) => {
    this.setState({ fileType: e.target.value }, () => {
      this.getB2CEnrollGraph();
    });
  };


  hideAlertMessage = () => {
    this.setState({ alertMessage: null, alertType: null });
  };

  render() {
    const { classes } = this.props;
    const {
      usBankData,
      enrollmentConsumerData,
      selectedCurrency,
      selectedView,
      payeesList,
      payeeEnrollGraphInfo,
      viewAllStatus,
      selectedCurrentDateFilter,
      selectedPayeeId,
      paymentsData,
      fileType,
      mixedGraphData,
      mixedGraphOpt,
      totalPaymentCount,
      filter,
      enableDateFilter,
      filters,
      selectedFilter,
      alertMessage,
      alertType,
      barChartData,
      enrolledPayeesBarChartData,
    } = this.state;
    const clientId = this.props.user.info.portalProfileId;
    const selectedPayee =
      payeesList &&
      payeesList.filter((payee) => payee['clientId'] === selectedPayeeId);
    return (
      <Grid>
        <Box className={classes.SubHeader}>
          <Typography variant='h1'>Dashboard</Typography>
        </Box>
        <Box my={3} mx={6}>
          <Grid container>
            <Grid item xs={12} sm={12}>
              <Box my={2}>
                <Box>
                  <USBankPayments
                    graphRefFn={this.graphRefFn}
                    usBankData={usBankData}
                    payeesList={payeesList}
                    selectedPayee={selectedPayee}
                    paymentsData={paymentsData}
                    lineChartOptions={lineChartOptions}
                    selectedCurrency={selectedCurrency}
                    selectedView={selectedView}
                    selectedPayeeId={selectedPayeeId}
                    onClickDate={() =>
                      this.setState({ enableDateFilter: true })
                    }
                    onFilterChange={this.returnFilterLabel(
                      selectedCurrentDateFilter
                    )}
                    handlePaymentsAmountClick={this.handlePaymentsAmountClick}
                    onPaymentsChange={this.onB2BPaymentsChange}
                    payeeEnrollGraphInfo={payeeEnrollGraphInfo}
                    enrollmentConsumerData={enrollmentConsumerData}
                    barChartData={barChartData}
                  />
                </Box>
              </Box>
            </Grid>
            <ContactedPayees
              selectedPayee={selectedPayee}
              fileType={fileType}
              payeeEnrollGraphInfo={payeeEnrollGraphInfo}
              enrollmentConsumerData={enrollmentConsumerData}
              viewAllStatus={viewAllStatus}
              mixedGraphData={mixedGraphData}
              mixedGraphOpt={mixedGraphOpt}
              handleAllStatus={this.handleAllStatus}
              handleFileType={this.handleFileType}
              totalPaymentCount={totalPaymentCount}
              enrolledPayeesBarChartData={enrolledPayeesBarChartData}
              isPayeeChoicePortal={this.props.user.isPayeeChoicePortal}
            />
          </Grid>
        </Box>
        {enableDateFilter && (
          <SideDialog
            showButton={false}
            alignSide={true}
            icon='calendar'
            onConfirm={() => this.setState({ enableDateFilter: false })}
            title={'Date Filter'}
          >
            <DashboardFilter
              filters={filters}
              selectedFilter={selectedFilter}
              handleFilterSelect={(i) => this.setState({ selectedFilter: i })}
              selectedView={selectedView}
              selectedCurrency={selectedCurrency}
              clientId={clientId}
              resetFilter={(filter) =>
                this.setState(
                  {
                    selectedFilter: 2,
                    selectedCurrentDateFilter: 2,
                    filter: {
                      ...this.state.filter,
                      year: year,
                      month: month,
                      quarter: '',
                      lastDays: undefined,
                      fromDate: undefined,
                      toDate: undefined,
                    },
                  },
                  () => {
                    this.prepareData();
                  }
                )
              }
              filterData={(filter, fromDate, toDate) =>
                this.setState(
                  {
                    selectedCurrentDateFilter: filter,
                    selectedFilter: filter,
                    enableDateFilter: false,
                    filter: {
                      ...this.state.filter,
                      fromDate: filter === 7 ? fromDate : undefined,
                      toDate: filter === 7 ? toDate : undefined,
                    },
                  },
                  () => {
                    this.prepareData();
                  }
                )
              }
              filter={filter}
              changeFilter={(filter) => {
                this.setState({ filter: filter });
              }}
            />
          </SideDialog>
        )}
        {alertType && (
          <Notification
            variant={alertType}
            message={alertMessage}
            handleClose={this.hideAlertMessage}
          />
        )}
      </Grid>
    );
  }
}

export default connect((state) => ({ ...state.user, ...state.campaign }))(
  withStyles(styles)(USBankDashboard)
);
