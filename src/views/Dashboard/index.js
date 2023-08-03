import {
  Box,
  Grid,
  Paper,
  TextField,
  withStyles,
  MenuItem,
  Typography,
  FormControlLabel, Checkbox, Tooltip
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import styles from "./styles";
import {
  fetchDashboardCampaigns,
  fetchDashboardPayments,
  fetchDashboardPaymentSummary,
  fetchSupplierEnrollmentData,
  fetchSupplierEnrollmentStats,
  fetchDashboardSankeyData,
  B2CEnrollGraph
} from "~/redux/helpers/dashboard";
import { SideDialog } from "~/components/Dialogs";
import DashboardDateFilter from "~/modules/DashboardDateFilter";
import { fetchOnBoardedClients, fetchAppType } from "~/redux/helpers/clients";
import accessRights from "~/config/accessRights";
import moment from "moment";

import Highcharts from "highcharts";
import HighchartsSankey from "highcharts/modules/sankey";
import HighchartsReact from "highcharts-react-official";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import B2BPayments from "./B2BPayments";
import B2CPayments from "./B2CPayments";
import { EntityType } from "~/config/entityTypes";
import PayeeDetail from "~/components/PayeeDetail";
import Cards from './Cards';


const StyledToggleButtonGroup = withStyles(() => ({
  grouped: {
    border: 'none',
    '&:selected': {
      backgroundColor: '#fff',
    },
    padding: "2px 16px",
    color: "#0b1941",
    backgroundColor: "#fff",
    margin: "14px 10px 0 0",
    borderRadius: 0,
    borderBottom: '2px solid rgba(0,0,0,0)',
    fontSize: '16px',
    '&.Mui-selected': {
      backgroundColor: '#fff',
      color: '#008ce6 !important',
      borderBottom: '2px solid #008ce6',
      '&:hover': {
        backgroundColor: '#fff !important',
        color: '#4C4C4C',
      },
    },
    '&:hover': {
      backgroundColor: '#fff',
    },
    '&:active': {
      backgroundColor: '#fff',
    },
    '& .MuiTouchRipple-root': {
      display: 'none',
    },
  },
}))(ToggleButtonGroup);
HighchartsSankey(Highcharts);

var H = Highcharts;

H.seriesTypes.sankey.prototype.pointAttribs = function (point, state) {
  var opacity = this.options.linkOpacity,
    color = point.color;

  if (state) {
    opacity = this.options.states[state].linkOpacity || opacity;
    color = this.options.states[state].color || point.color;
  }

  return {
    fill: point.isNode
      ? color
      : {
          linearGradient: {
            x1: 0,
            x2: 1,
            y1: 0,
            y2: 0,
          },
          stops: [
            [0, H.color(color).setOpacity(opacity).get()],
            [1, H.color(point.toNode.color).setOpacity(0.8).get()],
          ],
        },
  };
};

let month = new Date().getMonth();
let year = new Date().getFullYear();
if (month === 0) {
  month = 12;
  year = year - 1;
}

class Dashboard extends Component {
  state = {
    name: 'React',
    type: 'line',
    selectedCampaign: {
      campaignId: -1,
    },
    supplierStats: null,
    payeesList: [],
    campaignList: [],
    supplierEnrollmentData: [],
    supplierUpdates: [],
    supplierApproval: [],
    paymentFiles: [],
    sankeyData: [],
    fileType: 'ALL',
    selectedEnrollID: 1,
    B2CEnrollAPIData: [],
    B2CEnrollDoughnutAPIData: [],
    AveragePayees: 0,
    PayeesEnrolled: 0,
    selectedPayeeId: 0,
    selectedPayeeId2: 0,
    selectedCampaignId: 0,
    openSupplierUpdates: false,
    openSupplierApproval: false,
    openPaymentFiles: false,
    enableDateFilter: false,
    selectedFilter: 2,
    selectedCurrentDateFilter: 2,
    appType: EntityType.B2B,
    B2CEnrollGraphRefData: null,
    ChildB2BGraphRef: null,
    ChildB2CGraphRef: null,
    payeeEnrollGraphInfo: [],
    enrollmentConsumerData: [],
    viewAllStatus: false,
    mixedGraphData: {},
    mixedGraphOpt: {},
    userType: [],
    usBankData: [{}],
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
    selectedCurrency: 'USD',
    selectedView: 'Amount',
    selectedPayeeView: 'status',
    totalPayments: '',
    totalCADPayments: '',
    totalUSDPayments: '',
    totalCHKPayment: '',
    totalACHPayment: '',
    totalVCAPayment: '',
    totalPPLPayment: '',
    totalMSCPayment: '',
    totalZELPayment: '',
    totalCADAmount: '',
    totalUSDAmount: '',
    totalACHAmount: '',
    totalCHKAmount: '',
    totalVCAAmount: '',
    totalPPLAmount: '',
    totalMSCAmount: '',
    totalZELAmount: '',
    chkPercent: '',
    achPercent: '',
    vcaPercent: '',
    pplPercent: '',
    mscPercent: '',
    zelPercent: '',
    paymentsData: {},
    payeeEnrollmentData: {},
    B2CEnrollData: {},
    doughnutData: {
      labels: ['ACH', 'CHK', 'VCA'],
      datasets: [
        {
          label: '# of Tomatoes',
          data: [0, 0, 0],
          backgroundColor: [
            '#1088E5',
            '#89B6B5',
            '#7CB6E9',
            '#257675',
            '#B8A9D8',
          ],
          borderWidth: 0,
        },
      ],
    },
    b2cDonutData: {
      labels: ['ACH', 'CHECK', 'PAYPAL', 'PUSH TO CARD', 'ZELLE'],
      datasets: [
        {
          label: '# of Tomatoes',
          data: [0, 0, 0],
          backgroundColor: ["#3F007D", "#DADAEB", "#C5BBDB", "#9B7FBC", "#6F459C"],
          borderWidth: 0,
        },
      ],
    },
    totalPaymentCount: 0,
    b2cEnrollDonutData: {
      labels: ['ACH', 'PAYPAL', 'ZELLE', 'CHECK', 'PUSH TO CARD'],
      datasets: [
        {
          label: '# of Tomatoes',
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            '#3F007D',
            '#C5BBDB',
            '#6F459C',
            '#DADAEB',
            '#9B7FBC',
          ],
          borderWidth: 0,
        },
      ],
    },

    lineChartOptions: {
      responsive: true,
      maintainAspectRatio: true,
      layout: {
        padding: {
          // Any unspecified dimensions are assumed to be 0
          bottom: 40,
        },
      },
      legend: {
        display: false,
        position: 'right',
        fillStyle: '',
        color: 'rgba(0,0,0,0)',
        labels: {
          usePointStyle: true,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: { color: '#E9EBF1' },
            ticks: {
              beginAtZero: true,
              fontColor: '#9AA1A9',
              maxTicksLimit: 5,
              min: 0,
              callback: function (value, index, array) {
                return value < 1000
                  ? value
                  : value < 1000000
                  ? value / 1000 + 'K'
                  : value < 1000000000
                  ? value / 1000000 + 'M'
                  : value / 1000000000 + 'B';
              },
            },
          },
        ],
        xAxes: [
          {
            gridLines: { color: '#E9EBF1' },
            ticks: {
              beginAtZero: true,
              fontColor: '#9AA1A9',
            },
          },
        ],
      },
      tooltips: {
        fontSize: 10,
        bodyFontSize: 10,
        titleFontSize: 10,
        titleFontStyle: 'bold',
        backgroundColor: 'white',
        titleFontColor: '#7F7F7F',
        bodyFontColor: '#7F7F7F',
        bodySpacing: 2,
        bodyFontStyle: 'bold',
        bodyAlign: 'left',
        bodyFontFamily: '"Interstate", Arial, Helvetica, sans-serif',
        axis: 'x',
        animationDuration: 400,
        mode: 'index',
        intersect: false,
        usePointStyle: true,
        itemSort: function (a, b) {
          return b.value - a.value;
        },
        callbacks: {
          label: function (tooltipItem, data) {
            const dataSetIndex = tooltipItem && tooltipItem["datasetIndex"];
            const currObject = data && data["datasets"][dataSetIndex];
            return (
              tooltipItem &&
              ` ${currObject && currObject["label"]}: ${tooltipItem["value"]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              `
            );
          },
        },
      },
      hover: {
        usePointStyle: true,
        mode: 'y',
      },
    },
    payeeEnrollmentOptions: {
      responsive: true,
      maintainAspectRatio: true,
      layout: {},
      legend: {
        display: true,
        position: 'bottom',
        fillStyle: '',
        color: 'rgba(0,0,0,0)',
        labels: {
          usePointStyle: true,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: { color: '#E9EBF1' },
            ticks: {
              beginAtZero: true,
              fontColor: '#9AA1A9',
              maxTicksLimit: 5,
              min: 0,
              callback: function (value, index, array) {
                return value < 1000
                  ? value
                  : value < 1000000
                  ? value / 1000 + 'K'
                  : value < 1000000000
                  ? value / 1000000 + 'M'
                  : value / 1000000000 + 'B';
              },
            },
          },
        ],
        xAxes: [
          {
            gridLines: { color: '#E9EBF1' },
            ticks: {
              beginAtZero: true,
              fontColor: '#9AA1A9',
            },
          },
        ],
      },
      tooltips: {
        titleFontSize: 14,
        titleFontStyle: 'bold',
        backgroundColor: 'white',
        titleFontColor: '#7F7F7F',
        bodyFontColor: '#7F7F7F',
        bodySpacing: 2,
        bodyFontStyle: 'bold',
        bodyAlign: 'left',
        bodyFontFamily: '"Interstate", Arial, Helvetica, sans-serif',
        axis: 'x',
        animationDuration: 400,
        mode: "index",
        intersect: false,
        usePointStyle: true,
        callbacks: {
          label: function (tooltipItem, data) {
            const dataSetIndex = tooltipItem && tooltipItem["datasetIndex"];
            const currObject = data && data["datasets"][dataSetIndex];
            return (
              tooltipItem &&
              `${tooltipItem['value']
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} - ${
                currObject && currObject['label']
              }`
            );
          },
        },
      },
      hover: {
        usePointStyle: true,
        mode: 'y',
      },
    },

    B2CEnrollmentOptions: {
      responsive: true,
      maintainAspectRatio: true,
      layout: {},
      legend: {
        display: true,
        position: 'bottom',
        fillStyle: '',
        color: 'rgba(0,0,0,0)',
        labels: {
          usePointStyle: true,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: { color: '#E9EBF1' },
            ticks: {
              beginAtZero: true,
              fontColor: '#9AA1A9',
              maxTicksLimit: 5,
              min: 0,
              callback: function (value, index, array) {
                return value < 1000
                  ? value
                  : value < 1000000
                  ? value / 1000 + 'K'
                  : value < 1000000000
                  ? value / 1000000 + 'M'
                  : value / 1000000000 + 'B';
              },
            },
          },
        ],
        xAxes: [
          {
            gridLines: { color: '#E9EBF1' },
            ticks: {
              beginAtZero: true,
              fontColor: '#9AA1A9',
            },
          },
        ],
      },
      tooltips: {
        titleFontSize: 12,
        titleFontStyle: 'bold',
        backgroundColor: 'white',
        titleFontColor: '#7F7F7F',
        bodyFontColor: '#7F7F7F',
        bodySpacing: 2,
        //bodyFontStyle: "bold",
        bodyAlign: 'left',
        bodyFontFamily: '"Interstate", Arial, Helvetica, sans-serif',
        axis: 'x',
        animationDuration: 400,
        mode: 'index',
        //enabled: false,
        intersect: false,
        usePointStyle: true,
        callbacks: {
          label: function (tooltipItem, data) {
            let dataSetIndex = tooltipItem && tooltipItem['datasetIndex'];
            let currObject = data && data['datasets'][dataSetIndex];
            return (
              tooltipItem &&
              `${tooltipItem['value']
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} - ${
                currObject && currObject['label']
              }`
            );
          },
        },
      },
      hover: {
        usePointStyle: true,
        mode: 'y',
      },
    },

    doughnutOptions: {
      aspectRatio: 1,
      clip: { left: 5, top: false, right: -2, bottom: 0 },
      height: 200,
      width: 200,
      cutoutPercentage: 60,
      animation: {
        animateRotate: true,
      },
      responsive: false,
      tooltips: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem, data) {
            const label = data.labels[tooltipItem.index];
            const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return ` ${label}: ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
          }
        }
      },
      legend: {
        display: false,
        position: 'right',
        labels: {
          usePointStyle: true,
          fontSize: 11,
          fontStyle: 'bold',
          padding: 15,
          boxWidth: 8,
          fontColor: 'rgba(18,18,18,0.87)',
        },
        title: {
          padding: 6,
        },
      },
    },

    b2cEnrolldoughnutOptions: {
      aspectRatio: 1,
      clip: { left: 5, top: false, right: -2, bottom: 0 },
      height: 200,
      width: 200,
      cutoutPercentage: 60,
      animation: {
        animateRotate: true,
      },
      responsive: false,
      tooltips: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem, data) {
            const label = data.labels[tooltipItem.index];
            const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return ` ${label}: ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
          }
        }
      },
      legend: {
        display: false,
        position: 'right',
        labels: {
          usePointStyle: true,
          fontSize: 11,
          fontStyle: 'bold',
          padding: 15,
          boxWidth: 8,
          fontColor: 'rgba(18,18,18,0.87)',
        },
        title: {
          padding: 6,
        },
      },
    },

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
  };

  sortDates(timeline) {
    return (
      timeline &&
      timeline.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    );
  }

  sortArrayonDate(array) {
    array.sort(function compare(a, b) {
      var dateA = new Date(a['figureFor']);
      var dateB = new Date(b['figureFor']);
      return dateA - dateB;
    });
  }

  componentDidMount() {
    this.getAppType();
    this.loadData();  
    this.resetGraphStrike(); 
  }

  getAppType = async () => {
    await fetchAppType().then((response) => {       
      const { error } = response;
      if (error)
      {
        return false;
      }
      else {
        this.setState({
          userType: response?.data ?? [],
          appType: response?.data?.length === 1 ? response?.data[0] : EntityType.B2B
        }, () => {
          this.loadData();
        })
      }
    })
  }

  loadData = () => {
    const { claims } = this.props;
    const bankId = this.props.user.info.portalProfileId;

    //Check campaign list has rights
    const isAllowed = claims && claims.includes(accessRights['CAMPAIGNS_VIEW']);
    if (isAllowed) {
      this.fetchCampaigns(0);
    }

    const { appType } = this.state;

    if (claims && claims.includes(accessRights['CLIENTS_LIST_VIEW'])) {
      const payload = {
        portalProfileId: bankId,
        filter: 1,
        appType: appType,
        payerTypeId: [1]
      }
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

  getSankeyChartData = () => {
    const { selectedEntityClientId, selectedCampaignId } = this.state;
    const reportType =
      selectedCampaignId === 0
        ? 'ALL'
        : selectedCampaignId === -1
        ? 'ACTIVE'
        : 'SPECIFIC';
    fetchDashboardSankeyData(
      selectedEntityClientId,
      selectedCampaignId,
      reportType
    ).then((res) => {
      if (res) {
        this.setState({ sankeyData: res && res['data'] });
      }
    });
  };

  fetchCampaigns(clientId) {
    //Check campaign list has rights
    const { claims } = this.props;
    const isAllowed = claims && claims.includes(accessRights['CAMPAIGNS_VIEW']);
    if (isAllowed) {
      fetchDashboardCampaigns([clientId]).then((resp) => {
        this.setState({ campaignList: (resp && resp['data']) || [] });
      });
    }
  }

  prepareSupplierEnrollmentData(campaignId, clientId, reportType) {
    fetchSupplierEnrollmentData(campaignId, clientId, reportType).then((re) => {
      this.setState({ supplierEnrollmentData: re && re.data }, () => {
        const { supplierEnrollmentData } = this.state;
        const timeline = [];
        const approved =
          supplierEnrollmentData &&
          supplierEnrollmentData.length &&
          supplierEnrollmentData.length > 0 &&
          supplierEnrollmentData.map((o) => ({
            y: o && o['approved'],
            x: o && o['figureFor'],
          }));
        const enrollmentInitiated =
          supplierEnrollmentData &&
          supplierEnrollmentData.length &&
          supplierEnrollmentData.length > 0 &&
          supplierEnrollmentData.map((o) => ({
            y: o && o['enrollmentInitiated'],
            x: o && o['figureFor'],
          }));
        const total =
          supplierEnrollmentData &&
          supplierEnrollmentData.length &&
          supplierEnrollmentData.length > 0 &&
          supplierEnrollmentData.map((o) => ({
            y: o && o['totalPayee'],
            x: o && o['figureFor'],
          }));
        supplierEnrollmentData &&
          supplierEnrollmentData.length &&
          supplierEnrollmentData.length > 0 &&
          supplierEnrollmentData.forEach((obj) => {
            if (!timeline.includes(obj['date'])) {
              timeline.push(obj['date']);
            }
          });

        this.setState({
          payeeEnrollmentData: {
            labels: this.sortDates(timeline),
            datasets: [
              {
                fill: true,
                label: 'Approved',
                backgroundColor: '#F7B500',
                borderColor: '#F7B500',
                lineTension: 0,
                data: approved,
                pointHoverBackgroundColor: '#ffffff',
              },
              {
                fill: true,
                label: 'Enrollment Initiated',
                lineTension: 0,
                backgroundColor: '#68BBF1',
                borderColor: '#68BBF1',
                data: enrollmentInitiated,
                pointHoverBackgroundColor: '#ffffff',
              },
              {
                fill: true,
                label: 'Total Payee',
                lineTension: 0,
                backgroundColor: '#264D88',
                borderColor: '#264D88',
                data: total,
                pointHoverBackgroundColor: '#ffffff',
              },
            ],
          },
        });
      });
    });
  }

  prepareDashboardSummary(payload) {
    fetchDashboardPaymentSummary(payload).then((res) => {
      this.setState(res.data && res.data[0], () => {
        const {
          totalCHKPayment,
          totalACHPayment,
          totalVCAPayment,
          totalMSCPayment,
          totalPPLPayment,
          totalZELPayment,
          appType,
        } = this.state;
        if (appType === EntityType.B2B) {
          this.setState({
            doughnutData: {
              labels: [`ACH`, `CHK`, `VCA`],
              datasets: [
                {
                  label: '# of Tomatoes',
                  data: [totalACHPayment, totalCHKPayment, totalVCAPayment],
                  backgroundColor: ['#1AABA3', '#478ce6', '#CCE4FF'],
                  //   borderColor: [
                  //     "rgba(255,99,132,1)",
                  //     "rgba(54, 162, 235, 1)",
                  //     "rgba(255, 206, 86, 1)"
                  //   ],
                  borderWidth: 0,
                },
              ],
            },
          });
        } else if (appType === EntityType.B2C) {
          this.setState({
            b2cDonutData: {
              labels: [
                'BANK DEPOSIT (ACH)',
                'CHECK',
                'PAYPAL',
                'INSTANT PAY (P2C)',
                'ZELLE',
              ],
              datasets: [
                {
                  label: "# of Tomatoes",
                  data: [totalACHPayment, totalCHKPayment, totalPPLPayment, totalMSCPayment, totalZELPayment],
                  backgroundColor: ["#3F007D", "#DADAEB", "#C5BBDB", "#9B7FBC", "#6F459C"],
                  borderWidth: 0,
                },
              ],
            },
          });
        }
      });
    });
  }

  prepareDashboardPayments(payload) {
    fetchDashboardPayments(payload).then((response) => {
      const totalDataSets = [];
      const CHKPayments =
        response.data && response.data.filter((o) => o["paymentType"] === "CHK");
      const ACHPayments =
        response.data && response.data.filter((o) => o["paymentType"] === "ACH");
      const VCAPayments =
        response.data && response.data.filter((o) => o["paymentType"] === "VCA");
      const PPLPayments =
        response.data && response.data.filter((o) => o["paymentType"] === "PPL");
      const MSCPayments =
        response.data && response.data.filter((o) => o["paymentType"] === "MSC");
      const ZELPayments =
        response.data && response.data.filter((o) => o["paymentType"] === "CXC");
      const timeLine = [];
      response.data &&
        response.data.forEach((obj) => {
          if (!timeLine.includes(obj['figureFor'])) {
            timeLine.push(obj['figureFor']);
          }
        });
      response &&
        response.data &&
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
      const { appType } = this.state;
      if (appType === EntityType.B2B) {
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
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              },
              {
                fill: false,
                hoverBackgroundColor: 'white',
                pointHoverBackgroundColor: 'white',
                label: 'CHK',
                backgroundColor: '#478ce6',
                borderColor: '#478ce6',
                lineTension: 0,
                pointStyle: 'circle',
                data:
                  CHKPayments &&
                  CHKPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              },
              {
                fill: false,
                label: 'VCA',
                hoverBackgroundColor: 'white',
                pointHoverBackgroundColor: 'white',
                backgroundColor: '#CCE4FF',
                borderColor: '#CCE4FF',
                pointStyle: 'circle',
                lineTension: 0,
                data:
                  VCAPayments &&
                  VCAPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              },
              {
                fill: false,
                label: 'ACH',
                hoverBackgroundColor: 'white',
                pointHoverBackgroundColor: 'white',
                lineTension: 0,
                pointStyle: 'circle',
                backgroundColor: '#1AABA3',
                borderColor: '#1AABA3',
                data:
                  ACHPayments &&
                  ACHPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              },
            ],
          },
        });
      } else if (appType === EntityType.B2C) {
        this.setState({
          paymentsData: {
            labels: timeLine,
            datasets: [
              {
                fill: false,
                label: 'Total Payments',
                backgroundColor: '#333',
                borderColor: '#333',
                lineTension: 0,
                data:
                  newTotalData &&
                  newTotalData.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              },
              {
                fill: false,
                hoverBackgroundColor: 'white',
                pointHoverBackgroundColor: 'white',
                label: 'CHECK',
                backgroundColor: '#DADAEB',
                borderColor: '#DADAEB',
                lineTension: 0,
                pointStyle: 'circle',
                data:
                  CHKPayments &&
                  CHKPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              },
              {
                fill: false,
                label: 'PAYPAL',
                hoverBackgroundColor: 'white',
                pointHoverBackgroundColor: 'white',
                backgroundColor: '#C5BBDB',
                borderColor: '#C5BBDB',
                pointStyle: 'circle',
                lineTension: 0,
                data:
                  PPLPayments &&
                  PPLPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              },
              {
                fill: false,
                label: 'BANK DEPOSIT (ACH)',
                hoverBackgroundColor: 'white',
                pointHoverBackgroundColor: 'white',
                lineTension: 0,
                pointStyle: 'circle',
                backgroundColor: '#3F007D',
                borderColor: '#3F007D',
                data:
                  ACHPayments &&
                  ACHPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              },
              {
                fill: false,
                label: 'INSTANT PAY (P2C)',
                hoverBackgroundColor: 'white',
                pointHoverBackgroundColor: 'white',
                lineTension: 0,
                pointStyle: 'circle',
                backgroundColor: '#9B7FBC',
                borderColor: '#9B7FBC',
                data:
                  MSCPayments &&
                  MSCPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              },
              {
                fill: false,
                label: 'ZELLE',
                hoverBackgroundColor: 'white',
                pointHoverBackgroundColor: 'white',
                lineTension: 0,
                pointStyle: 'circle',
                backgroundColor: '#6F459C',
                borderColor: '#6F459C',
                data:
                  ZELPayments &&
                  ZELPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              },
            ],
          },
        });
      }
    });
  }

  getSupplierStats() {
    fetchSupplierEnrollmentStats().then((response) => {
      this.setState({ supplierStats: response.data });
    });
  }

  prepareData() {
    const {
      selectedView,
      selectedCurrency,
      filter,
      selectedPayeeId,
      selectedCampaignId,
      appType,
    } = this.state;
    const campaignId = selectedCampaignId;
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
    this.prepareSupplierEnrollmentData(campaignId, undefined, 'ALL');
    this.getSupplierStats();
    if (this.state.appType === EntityType.B2C) {
      this.getB2CEnrollGraph();
    }
  }

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
  onB2BPaymentsChange = (e) => {
    const { selectedView, selectedCurrency, appType } = this.state;
    this.setState(
      { selectedPayeeId: e.target.value },
      () => {
        const { filter } = this.state;
        const payload = {
          ...filter,
          clientID: e.target.value,
          BusinessType: appType,
          year: filter["year"],
          month: filter["month"],
          quarter: filter["quarter"],
          lastDays: filter["lastDays"],
          resultType: selectedView,
          currency: selectedCurrency,
          fromDate: filter["fromDate"] ? moment(filter["fromDate"]).format('MM/DD/YYYY') : undefined,
          toDate: filter["toDate"] ? moment(filter["toDate"]).format('MM/DD/YYYY') : undefined,
        };
        this.prepareDashboardSummary(payload);
        this.prepareDashboardPayments(payload);
        if (this.state.appType === EntityType.B2C) {
          this.getB2CEnrollGraph();
        }
      }
    );
    this.resetGraphStrike();
  };
  handleEntityChange = (event, newAppType) => {
    if (newAppType !== null) {
      this.setState({
        appType: newAppType,
        selectedPayeeId: 0,
        selectedPayeeId2: 0,
        selectedCurrentDateFilter: 2,
        enableDateFilter: false,
        selectedFilter: 2,
        filter: {
          ...this.state.filter,
          year: year,
          month: month,
          quarter: "",
          lastDays: undefined,
          fromDate: undefined,
          toDate: undefined,
        }
      }, () => {
        const { appType } = this.state;
        if (appType !== EntityType.CARDS) {
          this.loadData();
        }
      })
    }
  };

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
        this.setState({
          enrollmentConsumerData: res?.data?.enrollmentData ?? [],
          B2CEnrollDoughnutAPIData: Boolean(res.data.paymentTypeData) ? res.data.paymentTypeData[0] : [],
          payeeEnrollGraphInfo: res?.data?.graphData ?? [],
        }, () => {
          if (Boolean(res.data)) {
            this.createMixedGraph();
            this.loadB2CEnrollDoughnut();
          }
        }
        );
      }
    });
    this.resetGraphStrike();
  };

  createMixedGraph = () => {
    const options = {
      scales: {
        xAxes: [
          {
            stacked: true,
          },
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              beginAtZero: true,
              precision: 0,
            }
          },
        ],
      },
      interaction: {
        mode: 'point'
      },

      tooltips: {
        enabled: true,
        padding: 10,
        footerSpacing: 4,
        mode: 'index',
        backgroundColor: "#f7f7f7",
        bodyFontColor: "#000",
        titleFontColor: "#000",
        bodySpacing: 6,
        titleMarginBottom: 10,
        displayColors: true,
        reverse: false,
        callbacks: {
          label: function (tooltipItem, data) {
            const dataSetIndex = tooltipItem && tooltipItem["datasetIndex"];
            const currObject = data && data["datasets"][dataSetIndex];
            return (
              tooltipItem &&
              ` ${currObject && currObject["label"]}: ${tooltipItem["value"]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              `
            );
          },
        },
      },
      plugins: {
        labels: {
          render: 'percentage',
          fontColor: ['#000', '#000'],
          textMargin: -25,
          precision: 1,
          fontSize: 0,
        },
      },
      legend: {
        display: true,
        position: "bottom",
        reverse: false,
        labels: {
          usePointStyle: true,
          fontColor: "#121212",
          fontSize: 12,
          fontStyle: "normal",
          padding: 10,
          boxWidth: 8,
        },
        title: {
          padding: 6,
        }
      },
      layout: {
        padding: {
          bottom: 120
        }
      },
      responsive: true,
    };

    const { enrollmentConsumerData } = this.state;

    const labels = Boolean(enrollmentConsumerData.dates) && [...new Set(enrollmentConsumerData.dates.map(obj => obj))];
    const graphData = [];
    const legendsList = [];

    Object.keys(enrollmentConsumerData).map((e) => {
      if (e.toLocaleLowerCase() !== "dates") {
        legendsList.push(e);
      }
    });

    legendsList.map((e) => {
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
        })
      }
      else {
        graphData.push({
          type: 'bar',
          label: enrollmentConsumerData[e]?.label ?? '',
          data: enrollmentConsumerData[e]?.data ?? [],
          backgroundColor: enrollmentConsumerData[e]?.colorCode ?? "",
          //order: 2
        })
      }
    });

    const data = {
      labels: labels,
      datasets: graphData,
    };

    this.setState({
      mixedGraphData: data,
      mixedGraphOpt: options,
    });
  };

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

  loadEnrollDoughnut = () => {
    const { B2CEnrollDoughnutAPIData } = this.state;
    const finalData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderWidth: 0,
        },
      ],
    };
    let totalCount = 0;
    B2CEnrollDoughnutAPIData.forEach((item, index) => {
      finalData.labels.push(item.description);
      finalData.datasets[0].data[index] = item.totalcount;
      finalData.datasets[0].backgroundColor[index] = item.colorCode;
      totalCount += item.totalcount;
    });
    this.setState({
      b2cEnrollDonutData: finalData,
      totalPaymentCount: totalCount,
    });
  };
  
  handleAllStatus = (e) => {
    this.setState({
      viewAllStatus: e.target.checked
    }, () => {
      this.getB2CEnrollGraph();
    })
  }

  loadB2CEnrollDoughnut = () => {
    const { B2CEnrollDoughnutAPIData } = this.state;
    this.setState({
      b2cEnrollDonutData: {
        labels: [
          'BANK DEPOSIT (ACH)',
          'PAYPAL',
          'ZELLE',
          'CHECK',
          'INSTANT PAY (P2C)',
        ],
        datasets: [
          {
            //label: "# of Tomatoes",
            data: [
              B2CEnrollDoughnutAPIData.ach || 0,
              B2CEnrollDoughnutAPIData.paypal || 0,
              B2CEnrollDoughnutAPIData.zelle || 0,
              B2CEnrollDoughnutAPIData.check || 0,
              B2CEnrollDoughnutAPIData.pushToCard || 0,
            ],
            backgroundColor: [
              '#3F007D',
              '#C5BBDB',
              '#6F459C',
              '#DADAEB',
              '#9B7FBC',
            ],
            borderWidth: 0,
          },
        ],
      },
    });
  };

  sortPaymentDataFn = (data) => {
    if (Object.keys(data).length > 0) {
      var sortable = [];
      for (var item in data) {
        sortable.push([item, data[item]]);
      }
      return sortable.sort(function (a, b) {
        return b[1] - a[1];
      });
    }
  }

  B2CEnrollGraphRef = (ref) => {
    this.setState({
      B2CEnrollGraphRefData: ref,
    });
  };

  b2cEnrollLegendClick = (e) => {
    const { B2CEnrollGraphRefData } = this.state;
    if (Boolean(B2CEnrollGraphRefData)) {
      const name = e.currentTarget.getAttribute("name");
      const index = B2CEnrollGraphRefData.props.data.labels.indexOf(name);
      const meta = B2CEnrollGraphRefData.chartInstance.getDatasetMeta(0);
      const result = (meta.data[index].hidden == true) ? false : true;
      if (result === true) {
        meta.data[index].hidden = true;
        e.currentTarget.classList.add("strike");
      } else {
        e.currentTarget.classList.remove("strike");
        meta.data[index].hidden = false;
      }
      B2CEnrollGraphRefData.chartInstance.update();
    } else {
      e.currentTarget.classList.toggle('strike');
    }
  }

  B2BGraphRefFn = (data) => {
    if (Boolean(data)) {
      this.setState({
        ChildB2BGraphRef: data
      })
    }
  }

  B2CGraphRefFn = (data) => {
    if (Boolean(data)) {
      this.setState({
        ChildB2CGraphRef: data,
      });
    }
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

  handleFileType = (e) => {
    this.setState({ fileType: e.target.value }, () => {
      this.getB2CEnrollGraph();
    });
  };

  resetGraphStrike = () => {
    const item = document.getElementsByClassName("legendItem");
    for (let i = 0; i < item.length; i++) {
      item[i].classList.remove('strike');
    }

    const { B2CEnrollGraphRefData, ChildB2BGraphRef, ChildB2CGraphRef } =
      this.state;

    if (Boolean(B2CEnrollGraphRefData)) {
      const meta_1 =
        B2CEnrollGraphRefData?.chartInstance?.getDatasetMeta(0) ?? null;
      if (Boolean(meta_1)) {
        for (let a = 0; a < meta_1.data.length; a++) {
          meta_1.data[a].hidden = false;
        }
        B2CEnrollGraphRefData.chartInstance.update();
      }
    }

    if (Boolean(ChildB2BGraphRef)) {
      const meta_2 = ChildB2BGraphRef?.chartInstance?.getDatasetMeta(0) ?? null;
      if (Boolean(meta_2)) {
        for (let b = 0; b < meta_2.data.length; b++) {
          meta_2.data[b].hidden = false;
        }
        ChildB2BGraphRef.chartInstance.update();
      }
    }

    if (Boolean(ChildB2CGraphRef)) {
      const meta_3 = ChildB2CGraphRef?.chartInstance?.getDatasetMeta(0) ?? null;
      if (Boolean(meta_3)) {
        for (let c = 0; c < meta_3.data.length; c++) {
          meta_3.data[c].hidden = false;
        }
        ChildB2CGraphRef.chartInstance.update();
      }
    }
  };

  render() {
    const { classes } = this.props;
    const {
      totalPayments,
      totalCADPayments,
      totalUSDPayments,
      totalCHKPayment,
      totalACHPayment,
      totalPPLPayment,
      totalMSCPayment,
      totalZELPayment,
      totalCADAmount,
      totalUSDAmount,
      selectedCurrency,
      selectedView,
      filters,
      selectedFilter,
      enableDateFilter,
      filter,
      campaignList,
      supplierEnrollmentData,
      selectedCurrentDateFilter,
      achPercent,
      vcaPercent,
      chkPercent,
      pplPercent,
      mscPercent,
      zelPercent,
      payeesList,
      selectedPayeeId,
      selectedPayeeId2,
      selectedCampaignId,
      supplierStats,
      totalVCAPayment,
      paymentsData,
      lineChartOptions,
      selectedPayeeView,
      sankeyData,
      appType,
      doughnutData,
      b2cDonutData,
      doughnutOptions,
      fileType,
      b2cEnrollDonutData,
      b2cEnrolldoughnutOptions,
      B2CEnrollDoughnutAPIData,
      payeeEnrollGraphInfo,
      enrollmentConsumerData,
      viewAllStatus,
      mixedGraphData,
      mixedGraphOpt,
      userType
    } = this.state;
    const clientId = this.props.user.info.portalProfileId;
    const selectedPayee =
      payeesList &&
      payeesList.filter((payee) => payee['clientId'] === selectedPayeeId);

    const payData = {
      "BANK DEPOSIT (ACH)": B2CEnrollDoughnutAPIData.ach || 0,
      "CHECK": B2CEnrollDoughnutAPIData.check || 0,
      "PAYPAL": B2CEnrollDoughnutAPIData.paypal || 0,
      "ZELLE": B2CEnrollDoughnutAPIData.zelle || 0,
      "INSTANT PAY (P2C)": B2CEnrollDoughnutAPIData.pushToCard || 0
    }
    const getPaymentList = this.sortPaymentDataFn(payData);


    return (
      <Grid>
        <Box className={classes.SubHeader}>
          <Typography variant="h1">
            Dashboard
          </Typography>

          <Grid container>
            <Grid item xs>
              <Grid
                container
                item
                xs={12}
                md={12}
                className={classes.gridItem}
              >

                {userType.length > 0 && (
                  <Box display="flex">
                    <Box>
                      <StyledToggleButtonGroup
                        size="small"
                        value={appType}
                        exclusive
                        onChange={this.handleEntityChange}
                      >
                        {/* <ToggleButton value={3}>All</ToggleButton> */}

                        {userType.indexOf(EntityType.B2B) > -1 && (
                          <ToggleButton value={1}>B2B</ToggleButton>
                        )}

                        {userType.indexOf(EntityType.CARDS) > -1 && (
                          <ToggleButton value={4}>Cards</ToggleButton>
                        )}

                        {userType.indexOf(EntityType.B2C) > -1 && (
                          <ToggleButton value={2}>B2C</ToggleButton>
                        )}

                      </StyledToggleButtonGroup>
                    </Box>
                  </Box>
                )}

              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Box my={3} mx={6}>
          <Grid container>
            <Grid item xs={12} sm={12}>
              <Box my={2}>
                <Box>
                  {appType === EntityType.B2B &&
                    <Paper elevation={2}>
                      <B2BPayments
                        selectedPayee={selectedPayee}
                        totalVCAPayment={totalVCAPayment}
                        totalCHKPayment={totalCHKPayment}
                        totalACHPayment={totalACHPayment}
                        doughnutData={doughnutData}
                        doughnutOptions={doughnutOptions}
                        totalPayments={totalPayments}
                        achPercent={achPercent}
                        chkPercent={chkPercent}
                        vcaPercent={vcaPercent}
                        selectedPayeeId={selectedPayeeId}
                        onPaymentsChange={this.onB2BPaymentsChange}
                        payeesList={payeesList}
                        onClickDate={() =>
                          this.setState({ enableDateFilter: true })
                        }
                        onFilterChange={this.returnFilterLabel(
                          selectedCurrentDateFilter
                        )}
                        B2BGraphRef={this.B2BGraphRefFn}
                        onUSDClick={() =>
                          this.setState(
                            { selectedCurrency: "USD" },
                            () => {
                              const {
                                filter,
                                selectedPayeeId,
                              } = this.state;
                              const payload = {
                                ...filter,
                                clientID: selectedPayeeId,
                                BusinessType: appType,
                                year: filter["year"],
                                month: filter["month"],
                                quarter: filter["quarter"],
                                lastDays: filter["lastDays"],
                                resultType: selectedView,
                                currency: "USD",
                                fromDate: filter["fromDate"] ? moment(filter["fromDate"]).format('MM/DD/YYYY') : undefined,
                                toDate: filter["toDate"] ? moment(filter["toDate"]).format('MM/DD/YYYY') : undefined,
                              };
                              this.prepareDashboardSummary(payload);
                              this.prepareDashboardPayments(payload);
                            }
                          )}
                        onCADClick={() =>
                          this.setState(
                            { selectedCurrency: "CAD" },
                            () => {
                              const {
                                filter,
                                selectedPayeeId,
                              } = this.state;
                              const payload = {
                                ...filter,
                                clientID: selectedPayeeId,
                                BusinessType: appType,
                                year: filter["year"],
                                month: filter["month"],
                                quarter: filter["quarter"],
                                lastDays: filter["lastDays"],
                                resultType: selectedView,
                                currency: "CAD",
                                fromDate: filter["fromDate"] ? moment(filter["fromDate"]).format('MM/DD/YYYY') : undefined,
                                toDate: filter["toDate"] ? moment(filter["toDate"]).format('MM/DD/YYYY') : undefined,
                              };
                              this.prepareDashboardSummary(payload);
                              this.prepareDashboardPayments(payload);
                            }
                          )}
                        selectedView={selectedView} totalCADAmount={totalCADAmount} totalCADPayments={totalCADPayments}
                        selectedCurrency={selectedCurrency} totalUSDAmount={totalUSDAmount} totalUSDPayments={totalUSDPayments}
                        paymentsData={paymentsData} lineChartOptions={lineChartOptions}
                        onPaymentsClick={() =>
                          this.setState(
                            { selectedView: "Payment" },
                            () => {
                              const {
                                filter,
                                selectedPayeeId,
                              } = this.state;
                              const payload = {
                                ...filter,
                                clientID: selectedPayeeId,
                                BusinessType: appType,
                                year: filter["year"],
                                month: filter["month"],
                                quarter: filter["quarter"],
                                lastDays: filter["lastDays"],
                                resultType: "Payment",
                                currency: selectedCurrency,
                                fromDate: filter["fromDate"] ? moment(filter["fromDate"]).format('MM/DD/YYYY') : undefined,
                                toDate: filter["toDate"] ? moment(filter["toDate"]).format('MM/DD/YYYY') : undefined,
                              };
                              this.prepareDashboardSummary(payload);
                              this.prepareDashboardPayments(payload);
                            }
                          )}
                        onAmountsClick={
                          () =>
                            this.setState(
                              { selectedView: "Amount" },
                              () => {
                                const {
                                  filter,
                                  selectedPayeeId,
                                } = this.state;
                                const payload = {
                                  ...filter,
                                  clientID: selectedPayeeId,
                                  BusinessType: appType,
                                  year: filter["year"],
                                  month: filter["month"],
                                  quarter: filter["quarter"],
                                  lastDays: filter["lastDays"],
                                  resultType: "Amount",
                                  currency: selectedCurrency,
                                  fromDate: filter["fromDate"] ? moment(filter["fromDate"]).format('MM/DD/YYYY') : undefined,
                                  toDate: filter["toDate"] ? moment(filter["toDate"]).format('MM/DD/YYYY') : undefined,
                                };
                                this.prepareDashboardSummary(payload);
                                this.prepareDashboardPayments(payload);
                              }
                            )
                        }
                      />
                    </Paper>}

                  {appType === EntityType.B2C &&
                    <B2CPayments
                      selectedPayee={selectedPayee} totalPPLPayment={totalPPLPayment}
                      totalMSCPayment={totalMSCPayment} totalZELPayment={totalZELPayment}
                      totalCHKPayment={totalCHKPayment} totalACHPayment={totalACHPayment}
                      doughnutData={b2cDonutData} doughnutOptions={doughnutOptions}
                      totalPayments={totalPayments} achPercent={achPercent} chkPercent={chkPercent}
                      pplPercent={pplPercent} mscPercent={mscPercent} zelPercent={zelPercent}
                      selectedPayeeId={selectedPayeeId}
                      onPaymentsChange={this.onB2BPaymentsChange} payeesList={payeesList}
                      onClickDate={() => this.setState({ enableDateFilter: true })}
                      onFilterChange={this.returnFilterLabel(selectedCurrentDateFilter)}
                      B2CGraphRef={this.B2CGraphRefFn}
                      payeeEnrollGraphInfo={payeeEnrollGraphInfo}
                      enrollmentConsumerData={enrollmentConsumerData}
                      onUSDClick={() =>
                        this.setState(
                          { selectedCurrency: "USD" },
                          () => {
                            const {
                              filter,
                              selectedPayeeId,
                            } = this.state;
                            const payload = {
                              ...filter,
                              clientID: selectedPayeeId,
                              BusinessType: appType,
                              year: filter['year'],
                              month: filter['month'],
                              quarter: filter['quarter'],
                              lastDays: filter['lastDays'],
                              resultType: selectedView,
                              currency: 'USD',
                              fromDate: filter['fromDate']
                                ? moment(filter['fromDate']).format(
                                    'MM/DD/YYYY'
                                  )
                                : undefined,
                              toDate: filter['toDate']
                                ? moment(filter['toDate']).format('MM/DD/YYYY')
                                : undefined,
                            };
                            this.prepareDashboardSummary(payload);
                            this.prepareDashboardPayments(payload);
                          })
                        }
                        onCADClick={() =>
                          this.setState({ selectedCurrency: 'CAD' }, () => {
                            const { filter, selectedPayeeId } = this.state;
                            const payload = {
                              ...filter,
                              clientID: selectedPayeeId,
                              BusinessType: appType,
                              year: filter['year'],
                              month: filter['month'],
                              quarter: filter['quarter'],
                              lastDays: filter['lastDays'],
                              resultType: selectedView,
                              currency: 'CAD',
                              fromDate: filter['fromDate']
                                ? moment(filter['fromDate']).format(
                                    'MM/DD/YYYY'
                                  )
                                : undefined,
                              toDate: filter['toDate']
                                ? moment(filter['toDate']).format('MM/DD/YYYY')
                                : undefined,
                            };
                            this.prepareDashboardSummary(payload);
                            this.prepareDashboardPayments(payload);
                          })
                        }
                        selectedView={selectedView}
                        totalCADAmount={totalCADAmount}
                        totalCADPayments={totalCADPayments}
                        selectedCurrency={selectedCurrency}
                        totalUSDAmount={totalUSDAmount}
                        totalUSDPayments={totalUSDPayments}
                        paymentsData={paymentsData}
                        lineChartOptions={lineChartOptions}
                        onPaymentsClick={() =>
                          this.setState({ selectedView: 'Payment' }, () => {
                            const { filter, selectedPayeeId } = this.state;
                            const payload = {
                              ...filter,
                              clientID: selectedPayeeId,
                              BusinessType: appType,
                              year: filter['year'],
                              month: filter['month'],
                              quarter: filter['quarter'],
                              lastDays: filter['lastDays'],
                              resultType: 'Payment',
                              currency: selectedCurrency,
                              fromDate: filter['fromDate']
                                ? moment(filter['fromDate']).format(
                                    'MM/DD/YYYY'
                                  )
                                : undefined,
                              toDate: filter['toDate']
                                ? moment(filter['toDate']).format('MM/DD/YYYY')
                                : undefined,
                            };
                            this.prepareDashboardSummary(payload);
                            this.prepareDashboardPayments(payload);
                          })
                        }
                        onAmountsClick={() =>
                          this.setState({ selectedView: 'Amount' }, () => {
                            const { filter, selectedPayeeId } = this.state;
                            const payload = {
                              ...filter,
                              clientID: selectedPayeeId,
                              BusinessType: appType,
                              year: filter['year'],
                              month: filter['month'],
                              quarter: filter['quarter'],
                              lastDays: filter['lastDays'],
                              resultType: 'Amount',
                              currency: selectedCurrency,
                              fromDate: filter['fromDate']
                                ? moment(filter['fromDate']).format(
                                    'MM/DD/YYYY'
                                  )
                                : undefined,
                              toDate: filter['toDate']
                                ? moment(filter['toDate']).format('MM/DD/YYYY')
                                : undefined,
                            };
                            this.prepareDashboardSummary(payload);
                            this.prepareDashboardPayments(payload);
                          })
                        }
                      />
                  }
                </Box>
              </Box>
            </Grid>

            {appType === EntityType.B2B && (
              <Grid item xs={12} sm={12}>
                <Box my={3}>
                  <Paper elevation={2}>
                    <Grid item container alignItems='flex-start'>
                      <Grid item container xs={3} md={3}>
                        <h1 className={classes.headingNew}>Payees</h1>
                        <Box textAlign='center' width='100%' p={0} m={0}>
                          <Box color='#4C4C4C' fontSize={16} fontWeight={500}>
                            {' '}
                            Average Payees per Client
                          </Box>
                          <Box
                            color='rgba(0,0,0,0.87)'
                            fontSize={24}
                            fontWeight={500}
                          >
                            {(supplierStats &&
                              supplierStats['averagePayees']) ||
                              0}
                          </Box>
                          <Box color='rgba(18,18,18,0.87)' fontSize={11}>
                            As of Today
                          </Box>
                        </Box>

                        <Box textAlign='center' width='100%' py={3}>
                          <Box color='#4C4C4C' fontSize={16} fontWeight={500}>
                            {' '}
                            Active Campaigns
                          </Box>
                          <Box
                            color='rgba(0,0,0,0.87)'
                            fontSize={24}
                            fontWeight={500}
                          >
                            {' '}
                            {(supplierStats &&
                              supplierStats['totalCampaigns']) ||
                              0}
                          </Box>
                          <Box color='rgba(18,18,18,0.87)' fontSize={11}>
                            {' '}
                            As of Today
                          </Box>
                        </Box>

                        <Box textAlign='center' width='100%'>
                          <Box color='#4C4C4C' fontSize={16} fontWeight={500}>
                            {' '}
                            Payees Approved
                          </Box>
                          <Box
                            color='rgba(0,0,0,0.87)'
                            fontSize={24}
                            fontWeight={500}
                          >
                            {' '}
                            {(supplierStats &&
                              supplierStats['approvedPayees']) ||
                              0}
                          </Box>
                          <Box color='rgba(18,18,18,0.87)' fontSize={11}>
                            {' '}
                            As of Today
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item container xs={9} md={9}>
                        <Box
                          display='flex'
                          width={1}
                          mt={3}
                          justifyContent='flex-end'
                        >
                          <TextField
                            value={selectedPayeeId2}
                            select
                            variant='outlined'
                            size='small'
                            style={{ width: '241px', marginRight: 28 }}
                            onChange={(e) =>
                              this.setState(
                                { selectedPayeeId2: e.target.value },
                                () => {
                                  const { selectedCampaignId } = this.state;
                                  this.fetchCampaigns(e.target.value);
                                  this.prepareSupplierEnrollmentData(
                                    selectedCampaignId,
                                    e.target.value,
                                    selectedCampaignId == -1
                                      ? 'ACTIVE'
                                      : selectedCampaignId == 0
                                      ? 'ALL'
                                      : 'SPECIFIC'
                                  );
                                  this.getSankeyChartData();
                                }
                              )
                            }
                          >
                            <MenuItem
                              selected={selectedPayeeId === 0}
                              value={0}
                            >
                              All Payers
                            </MenuItem>
                            {payeesList &&
                              payeesList.map((payee) => (
                                <MenuItem
                                  selected={selectedPayeeId === payee.clientId}
                                  value={payee.clientId}
                                >
                                  {payee.clientName}
                                </MenuItem>
                              ))}
                          </TextField>

                          <TextField
                            value={selectedCampaignId}
                            select
                            variant='outlined'
                            size='small'
                            style={{ width: '241px', marginRight: 28 }}
                            onChange={(e) => {
                              this.setState(
                                { selectedCampaignId: e.target.value },
                                () => {
                                  this.getSankeyChartData();
                                  if (
                                    e.target.value === 0 ||
                                    e.target.value === -1
                                  ) {
                                    this.prepareSupplierEnrollmentData(
                                      e.target.value,
                                      selectedPayeeId2,
                                      e.target.value === -1 ? 'ACTIVE' : 'ALL'
                                    );
                                  } else {
                                    this.prepareSupplierEnrollmentData(
                                      e.target.value,
                                      selectedPayeeId2,
                                      'SPECIFIC'
                                    );
                                  }
                                }
                              );
                            }}
                          >
                            <MenuItem
                              selected={selectedCampaignId === 0}
                              value={0}
                            >
                              All Campaigns
                            </MenuItem>
                            <MenuItem
                              selected={selectedCampaignId === -1}
                              value={-1}
                            >
                              All Active Campaigns
                            </MenuItem>
                            {campaignList &&
                              campaignList.map((c) => (
                                <MenuItem
                                  selected={selectedCampaignId === c.campaignId}
                                  value={c.campaignId}
                                >
                                  {c.campaignName}
                                </MenuItem>
                              ))}
                          </TextField>
                        </Box>

                        <Box py={3} width='100%'>
                          <Box style={{ borderLeft: `2px solid #e6e6e6` }}>
                            <Box
                              display='flex'
                              justifyContent='flex-start'
                              width={328}
                            ></Box>
                            <Box
                              display='flex'
                              justifyContent='center'
                              width='74%'
                              mx='auto'
                              my={2}
                            >
                              {supplierEnrollmentData &&
                              supplierEnrollmentData.length > 0 ? (
                                <Box>
                                  {selectedPayeeView === "status" ? (
                                    <Box>
                                      {supplierEnrollmentData &&
                                      supplierEnrollmentData.length > 0 ? (
                                        <Line
                                          id={'paymentsChart'}
                                          width={739}
                                          height={190}
                                          data={this.state.payeeEnrollmentData}
                                          options={
                                            this.state.payeeEnrollmentOptions
                                          }
                                          redraW={false}
                                        />
                                      ) : (
                                        <Box
                                          display='block'
                                          textAlign='center'
                                          width={1}
                                          my={6}
                                        >
                                          <img
                                            alt='no-data'
                                            src={require('~/assets/images/nodata.svg')}
                                          />
                                          <Box
                                            py={3}
                                            color='#A1A1A1'
                                            fontSize={14}
                                            display='block'
                                          >
                                            {' '}
                                            No Data to show
                                          </Box>
                                        </Box>
                                      )}
                                    </Box>
                                  ) : (
                                    <Box mx={5}>
                                      {sankeyData &&
                                      sankeyData['length'] > 0 ? (
                                        // <Sankey data={sankeyData} />
                                        <HighchartsReact
                                          highcharts={Highcharts}
                                          options={{
                                            title: {
                                              text: '',
                                            },
                                            accessibility: {
                                              point: {
                                                valueDescriptionFormat:
                                                  '{index}. {point.from} to {point.to}, {point.weight}.',
                                              },
                                            },
                                            credits: {
                                              enabled: false,
                                            },
                                            colors: [
                                              '#B3B3B3',
                                              '#FAE951',
                                              '#264D88',
                                              '#68BBF1',
                                              '#FFA083',
                                              '#269BE7',
                                              '#3DB8B1',
                                              '#497E99',
                                            ],
                                            plotOptions: {},
                                            series: [
                                              {
                                                keys: ['from', 'to', 'weight'],
                                                data: sankeyData,
                                                type: 'sankey',
                                                name: 'Payments Chart',
                                              },
                                            ],
                                          }}
                                          // constructorType="sankyChart"
                                        />
                                      ) : (
                                        <Box
                                          display='block'
                                          textAlign='center'
                                          width={1}
                                          my={6}
                                        >
                                          <img
                                            alt='no-data'
                                            src={require('~/assets/images/nodata.svg')}
                                          />
                                          <Box
                                            py={3}
                                            color='#A1A1A1'
                                            fontSize={14}
                                            display='block'
                                          >
                                            {' '}
                                            No Data to show
                                          </Box>
                                        </Box>
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              ) : (
                                <Box
                                  display='block'
                                  textAlign='center'
                                  width={1}
                                  my={6}
                                >
                                  <img
                                    alt='no-data'
                                    src={require('~/assets/images/nodata.svg')}
                                  />

                                  <Box
                                    py={3}
                                    color='#A1A1A1'
                                    fontSize={14}
                                    display='block'
                                  >
                                    {' '}
                                    No Data to show{' '}
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </Grid>
            )}

            {appType === EntityType.B2C && (
              <Grid item xs={12} sm={12}>
                <Box my={3}>
                  <Paper elevation={2} style={{ float: "left", width: "100%", padding: "20px", boxSizing: "border-box" }}>
                    <Grid item container alignItems="flex-start">
                      <Grid item container className={classes.B2CBottomGraph}>
                        <h1 className={classes.headingNew}>Contacted Payees</h1>

                        <Box className="selectedClientName">
                          <Box
                            title={
                              selectedPayee &&
                              selectedPayee[0] &&
                              selectedPayee[0]['clientName']
                                ? selectedPayee[0]['clientName']
                                : 'All Payers'
                            }
                          >
                            {selectedPayee &&
                            selectedPayee.length > 0 &&
                            selectedPayee[0] &&
                            selectedPayee[0]['clientName']
                              ? selectedPayee[0]['clientName']
                              : 'All Payers'}
                          </Box>
                        </Box>

                        <Grid item xs={4} className='fileType'>
                          <TextField
                            value={fileType}
                            select
                            variant="outlined"
                            size="small"
                            style={{ width: "200px" }}
                            onChange={(e) =>
                              this.setState(
                                { fileType: e.target.value },
                                () => {
                                  this.getB2CEnrollGraph();
                                }
                              )
                            }
                          >
                            <MenuItem value='ALL'>All Files</MenuItem>
                            <MenuItem value='CAMPAIGN'>Campaign Files</MenuItem>
                            <MenuItem value='COMBO'>Combo Files</MenuItem>

                          </TextField>
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs={9}>
                          <Box className={classes.B2CPayeeGraph}>
                            <Grid item xs={12}>
                              <Box className={classes.payeeGraphTitles}>
                                <Typography variant="h3">
                                  Payees Enrollment Status
                                </Typography>

                                {enrollmentConsumerData?.dates?.length > 0
                                  ? <>
                                    <Typography variant="subtitle2">
                                      {payeeEnrollGraphInfo?.currentPeriodText ?? ""}
                                    </Typography>

                                    <Box className="viewAllStatus">
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={viewAllStatus}
                                            onChange={(e) => this.handleAllStatus(e)}
                                            name="viewAllStatus"
                                            color="primary"
                                          />
                                        }
                                        label="View All Status"
                                      />
                                    </Box>
                                  </>
                                  : null
                                }

                              </Box>

                              {enrollmentConsumerData?.dates?.length > 0
                                ? <Box className={classes.mixedGraph}>
                                  <Typography variant="h3">
                                    Number of Payees
                                  </Typography>
                                  <Box className='GraphHolder'>
                                    <Bar
                                      data={mixedGraphData}
                                      options={mixedGraphOpt}
                                      height={220}
                                    />
                                  </Box>
                                </Box>
                                : <Box
                                  py={3}
                                  color='#A1A1A1'
                                  fontSize={14}
                                  display="block"
                                  textAlign="center"
                                  mb={4}
                                >
                                  <img
                                    src={require('~/assets/images/nodata.svg')}
                                    alt=''
                                  />

                                  <Box
                                    py={3}
                                    color='#A1A1A1'
                                    fontSize={14}
                                    display='block'
                                  >
                                    No Data to show
                                  </Box>
                                </Box>
                              }

                            </Grid>
                          </Box>
                        </Grid>

                        <Grid item xs={3}>
                          <Box>
                            <Box
                              display='flex'
                              width={1}
                              mt={3}
                              justifyContent='flex-end'
                            >
                              <Grid container>
                                <Grid item xs={12}>
                                  <Box>
                                    {Boolean(
                                      Number(B2CEnrollDoughnutAPIData.all)
                                    ) ? (
                                      <Box
                                        className={
                                          classes.B2CEnrollDoughnutChrt
                                        }
                                      >
                                        <Doughnut
                                          id="B2CEnrollDoughnutChart"
                                          width={250}
                                          height={100}
                                          data={b2cEnrollDonutData}
                                          options={b2cEnrolldoughnutOptions}
                                          ref={this.B2CEnrollGraphRef}
                                        />
                                      </Box>
                                    ) : (
                                      <Tooltip
                                        title='No Data Available'
                                        aria-label='No Data Available'
                                      >
                                        <img
                                          src={require(`~/assets/images/blankDoughnut.PNG`)}
                                          alt={'No Data Found'}
                                          style={{
                                            height: '95px',
                                            width: '100px',
                                            margin: '0 auto 15px',
                                            float: 'none',
                                            display: 'block',
                                          }}
                                        />
                                      </Tooltip>
                                    )}

                                    <Typography variant="h1" className={classes.B2CtextNum}>
                                      {B2CEnrollDoughnutAPIData?.all?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? 0}
                                    </Typography>

                                    <Typography
                                      variant='h2'
                                      className={classes.B2CTotalPayments}
                                    >
                                      Payment Preference of Enrolled Payees
                                    </Typography>

                                    <Box
                                      style={{ float: "left" }}
                                      className={classes.legendList}
                                    >
                                      {Boolean(getPaymentList)
                                        ? getPaymentList.map((item) => {
                                          return (
                                            <Box
                                              pb={1}
                                              display="flex"
                                              fontWeight={700}
                                              fontSize={11}
                                              alignItems="center"
                                              className="legendItem"
                                              onClick={(e) => this.b2cEnrollLegendClick(e)}
                                              name={item[0]}
                                            >
                                              <span
                                                className={classes.dot}
                                                style={{
                                                  backgroundColor: item[0] === "ACH"
                                                    ? "#3F007D"
                                                    : item[0] === "CHECK"
                                                      ? "#DADAEB"
                                                      : item[0] === "PAYPAL"
                                                        ? "#C5BBDB"
                                                        : item[0] === "PUSH TO CARD"
                                                          ? "#9B7FBC"
                                                          : item[0] === "ZELLE"
                                                            ? "#6F459C"
                                                            : null
                                                }}
                                              >
                                                {" "}
                                              </span>
                                              <span style={{ fontSize: 11, width: 140, fontWeight: 400 }}>{item[0]}</span>
                                              <span style={{ paddingLeft: 60 }}>
                                                {" "}
                                                {Boolean(Number(B2CEnrollDoughnutAPIData.all))
                                                  ? parseFloat(Number(item[1]) / Number(B2CEnrollDoughnutAPIData.all) * 100).toFixed(2)
                                                  : 0
                                                }%
                                              </span>
                                            </Box>
                                          )
                                        })
                                        : null
                                      }
                                    </Box>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      {payeeEnrollGraphInfo?.difference?.length > 0 && enrollmentConsumerData?.dates?.length > 0 && (
                        <Grid container>
                          <Grid item xs={12} className={classes.payeGraphDiffBox}>
                            <Box className={classes.PayeeDetailBox}>
                              <Box className="box">
                                <PayeeDetail
                                  data={payeeEnrollGraphInfo?.difference ?? []}
                                />
                              </Box>

                              <Typography variant="h4" className="bottomTxt">
                                {payeeEnrollGraphInfo?.currentPeriodText && payeeEnrollGraphInfo?.previousPeriodText && (
                                  <>
                                    Change in {payeeEnrollGraphInfo.currentPeriodText} vs Previous Period ({payeeEnrollGraphInfo.previousPeriodText})
                                  </>
                                )}
                              </Typography>

                            </Box>
                          </Grid>
                        </Grid>
                      )}

                    </Grid>
                  </Paper>
                </Box>
              </Grid>
            )}

            {appType === EntityType.CARDS && (
              <Cards {...this.props} userType={userType} />
            )}

            {appType === 4 && <Cards />}
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
            <DashboardDateFilter
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
                      fromDate: filter == 7 ? fromDate : undefined,
                      toDate: filter == 7 ? toDate : undefined,
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
      </Grid>
    );
  }
}

export default connect((state) => ({ ...state.user, ...state.campaign }))(
  withStyles(styles)(Dashboard)
);
