const _ = require('lodash');
const {ipcRenderer} = require('electron');
const Chart = require('chart.js');
const config = require('./config');

Chart.defaults.global.defaultFontSize = 40

let items = {};

// Generate item configuration
config.forEach(function(item){
  items[item.name] = item;
});

// Listen for update from touchbar
ipcRenderer.on('update', function(e, item, value){
  items[item].value = value;
  updateChart();
});

// Update chart dataset
let updateChart = function(){
  myChart.data.datasets[0].data = getData();
  myChart.update();
}

// Return all the item values
let getData = function(){
  return _.map(items, 'value');
}

// Create the chart
let ctx = document.getElementById('chart');
let myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: _.map(items, 'label'),
    datasets: [{
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)', // red
        'rgba(255, 159, 64, 0.6)', // orange
        'rgba(255, 206, 86, 0.6)', // yellow
        'rgba(75, 192, 192, 0.6)', // green
        'rgba(54, 162, 235, 0.6)', // blue
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)', // red
        'rgba(255, 159, 64, 1)', // orange
        'rgba(255, 206, 86, 1)', // yellow
        'rgba(75, 192, 192, 1)', // green
        'rgba(54, 162, 235, 1)', // blue
      ],
      borderWidth: 1,
      data: getData()
    }]
  },
  options: {
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontSize: 12
        }
      }]
    },
    tooltips: {
      enabled: false
    }
  }
});
