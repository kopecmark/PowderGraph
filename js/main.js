var flag = true;
var formattedData;
var formattedData2;
var year = 1919;
var barChart;
var lineChart;
var formattedDataYearly = [];
var allYears = [];
var maxSnow = 0;
var maxRain = 0;


d3.csv("data/ll_monthly_snow.csv").then(function(data){
   formattedData = data.map( (month) => {
    const newMonth = {}
    newMonth.totalSnow = Number(month['Total Snow (cm)']);
    newMonth.Month = +month.Month;
    newMonth.Year = +month.Year;
    newMonth.meanTemp = Number(month['Mean Temp (°C)']);
    newMonth.meanMaxTemp = Number(month['Mean Max Temp (°C)']);
    newMonth.meanMinTemp = Number(month['Mean Min Temp (°C)']);
    newMonth.totalRain = Math.round(Number(month['Total Rain (mm)'])/10);
    var parseTime = d3.timeParse("%Y-%m");
    var formatTime = d3.timeFormat("%b-%Y");
    newMonth['Date/Time'] = formatTime(parseTime(month['Date/Time']));
    return newMonth;
  });

  selectedData = formattedData.filter((d) => {
    return d.Year === 1919;
  });

  barChart = new BarChart("#chart-area-bar", selectedData);
});


d3.csv("data/ll_monthly_snow.csv").then(function (data) {
  formattedData2 = data.map((month) => {

    const newMonth = {};
    newMonth.totalSnow = Number(month['Total Snow (cm)']);
    newMonth.Month = +month.Month;
    newMonth.Year = +month.Year;
    newMonth.totalRain = Math.round(Number(month['Total Rain (mm)']) / 10);
    var parseTime = d3.timeParse("%Y-%m");
    var formatTime = d3.timeFormat("%b");
    newMonth['MonthText'] = formatTime(parseTime(month['Date/Time']));

    if (!allYears.includes(newMonth.Year)) {
      allYears.push(newMonth.Year);
    }

    return newMonth;
  });


  // format data for use in a line graph
  allYears.forEach(year => {
    var singleYear = { year: year, values: [] };

    var allMonths = formattedData.filter(month => {
      return month.Year === year;
    });

    allMonths.forEach(month => {
      singleYear.values.push({ month: month.Month, totalSnow: month.totalSnow, totalRain: month.totalRain });
      if (month.totalSnow > maxSnow) maxSnow = month.totalSnow;
      if (month.totalRain > maxRain) maxRain = month.totalRain;

    });

    formattedDataYearly.push(singleYear);
  });

  lineChart = new LineChart("#chart-area-line", formattedDataYearly);

});


// Function to switch between snow and rain
let button = document.getElementById("precip-button");
  
button.onclick = () => {
  if (button.innerHTML == "Snow") {
      button.innerHTML = "Rain";
  }
  else {
    button.innerHTML = "Snow";
  }
  flag = !flag;

  selectedData = formattedData.filter((d) => {
    return d.Year === year;
  });

  barChart.wrangleData(selectedData);
  lineChart.wrangleData(formattedDataYearly);
};


// Slider
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value;
  year = Number(this.value);
};

slider.onchange = function () {
  output.innerHTML = this.value;
  year = Number(this.value);
  let selectedData = formattedData.filter((d) => {
    return d.Year === year;
  });
  barChart.wrangleData(selectedData);
};



