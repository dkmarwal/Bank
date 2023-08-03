export const lineChartOptions = {
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
  },
  hover: {
    usePointStyle: true,
    mode: 'y',
  },
};

export const mixedGraphOpt = {
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
        },
      },
    ],
  },
  interaction: {
    mode: 'point',
  },

  tooltips: {
    enabled: true,
    padding: 10,
    footerSpacing: 4,
    mode: 'index',
    backgroundColor: '#f7f7f7',
    bodyFontColor: '#000',
    titleFontColor: '#000',
    bodySpacing: 6,
    titleMarginBottom: 10,
    displayColors: true,
    reverse: false,
    itemSort: function (a, b) {
      //return b.value - a.value;
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
    position: 'bottom',
    reverse: false,
    labels: {
      usePointStyle: true,
      fontColor: '#121212',
      fontSize: 12,
      fontStyle: 'normal',
      padding: 10,
      boxWidth: 8,
    },
    title: {
      padding: 6,
    },
  },
  responsive: true,
};

export const doughnutOptions = {
  aspectRatio: 1,
  clip: { left: 5, top: false, right: -2, bottom: 0 },
  height: 200,
  width: 200,
  cutoutPercentage: 60,
  animation: {
    animateRotate: true,
  },
  responsive: false,
  legend: {
    display: false,
    position: 'right',
    labels: {
      usePointStyle: true,
      //fontColor: "#121212",
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
};

export const barChartOptions = {
  responsive: true,
  maintainAspectRatio:false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        ticks: {
          callback: function (label, index, labels) {
            if (/\s/.test(label)) {
              return label.split(' ');
            } else {
              return label;
            }
          },
          fontSize: 12,
          maxRotation: 0,
          minRotation: 0,
        },
        maxBarThickness: 50,
      },
    ],
  },
  plugins: {
    labels: {
      textAlign: 'left',
      font: {
        size: 10,
      },
    },
  },
};
