d3.csv("data/ll_monthly_snow.csv").then(function(data){
  
   vis.formattedData = data.map( (month) => {
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
  })

  // console.log(vis.formattedData);
  selectedData = vis.formattedData.filter((d) => {
    return d.Year === 1919;
  })

  barChart = new BarChart("#chart-area-bar");

  // update(selectedData);
})

// Function to switch between snow and rain

let button = document.getElementById("precip-button")
  
button.onclick = () => {
  // console.log(button.innerHTML)
  if (button.innerHTML == "Snow") {
      button.innerHTML = "Rain";
  }
  else {
    button.innerHTML = "Snow";
  }
  vis.flag = !vis.flag
  // console.log(vis.formattedData)

  selectedData = vis.formattedData.filter((d) => {
    return d.Year === vis.year
  })
  update(selectedData);
}

// Slider
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value;
  vis.year = Number(this.value);
}

slider.onchange = function () {
  output.innerHTML = this.value;
  vis.year = Number(this.value);
  let selectedData = vis.formattedData.filter((d) => {
    // console.log(d)
    // console.log(typeof vis.year)
    // console.log(d.Year === vis.year)
    return d.Year === vis.year
  })
  // console.log(vis.formattedData)
  // console.log(vis.year)
  // console.log(selectedData)
  update(selectedData);
};



