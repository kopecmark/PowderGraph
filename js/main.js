// Table Setup
var margin = { left: 100, right: 10, top: 10, bottom: 100 }

var width = 1000 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var flag = true;
var formattedData;
var year = 1919;

var t = d3.transition().duration(750);

var g = d3.select("#chart-area")
  .append("div")
    .classed("svg-container", true) //container class to make it responsive
  .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1000 500")
    .classed("svg-content-responsive", true)
  .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

var xAxisGroup = g.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0, " + height + ")")
  

var yAxisGroup = g.append("g")
  .attr("class", "y-axis")
 
// Tooltip
var tip = d3.tip().attr('class', 'd3-tip')
  .html(function (d) {
    text = "<strong>Year:</strong> <span style='color:red'>" + d.Year + "</span><br>";
    text += "<strong>Month:</strong> <span style='color:red'>" + d.Month + "</span><br>";
    text += "<strong>Snow:</strong> <span style='color:red'>" + d3.format(".1f")(d.totalSnow) + "</span><br>";
    text += "<strong>Rain:</strong> <span style='color:red'>" + d3.format(".1f")(d.totalRain) + "</span><br>";
    return text;
  });
g.call(tip);


// Scale the axises
var x = d3.scaleBand()
  .range([0, width])
  .padding(0.2)

var y = d3.scaleLinear()
  .range([height, 0])


// X Label Name
g.append("text")
  // .attr("class", "x axis-label")
  .attr("x", width / 2)
  .attr("y", height + 80)
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .text("Months");

// Y Label Name
var yLabel = g.append("text")
  .attr("x", - (height / 2))
  .attr("y", -60)
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")

  
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
  })

  // console.log(formattedData);
  selectedData = formattedData.filter((d) => {
    return d.Year === 1919;
  })
  update(selectedData);
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
  flag = !flag
  // console.log(formattedData)

  selectedData = formattedData.filter((d) => {
    return d.Year === year
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
  year = Number(this.value);
}

slider.onchange = function () {
  output.innerHTML = this.value;
  year = Number(this.value);
  let selectedData = formattedData.filter((d) => {
    // console.log(d)
    // console.log(typeof year)
    // console.log(d.Year === year)
    return d.Year === year
  })
  // console.log(formattedData)
  // console.log(year)
  // console.log(selectedData)
  update(selectedData);
}


function update(data) {

  var value = flag ? "totalSnow" : "totalRain";

  var max = d3.max(data, (month) => {
    return month[value];
  })

  x.domain(data.map((month) => {
    return month['Date/Time'];
  }))


  y.domain([0, max]);

  // X axis
  var xAxisCall = d3.axisBottom(x)
    .ticks(5);

  // Y axis
  var yAxisCall = d3.axisLeft(y)
    .ticks(10)
    .tickFormat((snowLevel) => {
      return snowLevel + "cm"
    });

  xAxisGroup.transition(t).call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

  yAxisGroup.transition(y).call(yAxisCall);

  // JOIN new data with old elements
  var rect = g.selectAll("rect")
    .data(data);

  // EXIT old elements not present in new data
  rect.exit().remove()
    .attr("fill", "red")
    .transition(t)
      .attr("y", y(0))
      .remove();

  // UPDATE old elements present in new data
  rect.transition(t)
    .attr("x", (m) => {return x(m['Date/Time'])})
    .attr("y", (m) => { return y(m[value]) })
    .attr("width", x.bandwidth)
    .attr("height", (m) => {return height - y(m[value]); })


  rect.enter()
    .append("rect")
      .attr("x", (m) => {return x(m['Date/Time'])})
      .attr("width", x.bandwidth)
    .attr("fill", d3.rgb("#1C7192"))
      .attr("y", y(0))
      .attr("height", 0)
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
    // AND UPDATE old elements present in new data
    .merge(rect)
    .transition(t)
      .attr("y", (m) => { return y(m[value]) })
      .attr("height", (m) => { return height - y(m[value]); })
  
  var label = flag ? "Snow" : "Rain";
  
  yLabel.text(label);

}
