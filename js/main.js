var flag = true;
var formattedData;
var year = 1919;
var barChart;
var lineChart;
var formattedDataYearly = [];
var allYears = [];
var maxSnow = 0;
var maxRain = 0;

d3.csv("data/ll_monthly_snow.csv").then(function (data) {
  formattedData = data.map((month) => {

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

  // Parse data for a single year
  selectedData = formattedData.filter((d) => {
    return d.Year === 1919;
  });

  console.log(selectedData);
  barChart = new BarChart("#chart-area-bar", selectedData);

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

  lineChart.wrangleData(formattedDataYearly);
  barChart.wrangleData(selectedData);
};


// Slider
let slider = document.getElementById("singleYear");
let output = document.getElementById("year");
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

// Update the line chart using range slider input 

let rangeSliderElement = document.getElementById('range-slider-value');

rangeSlider.noUiSlider.on('change', yearValues => {
  [yearValues[0], yearValues[1]] = [parseInt(yearValues[0]), parseInt(yearValues[1])];

  selectedData = formattedDataYearly.filter((d) => {
    return d.year >= yearValues[0] && d.year <= yearValues[1];
  });

  lineChart.wrangleData(selectedData);
});