// Data variables
var formattedData;
var formattedDataYearly=[];
var allYears = [];
var data = []; 
var flag = true;
var maxSnow = 0;
var maxRain = 0;
var t = d3.transition().duration(750);

// Table variables
var width = 500;
var height = 300;
var margin = 50;
var duration = 250;

var lineOpacity = "0.25";
var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "3.5px";
var lineStrokeHover = "4.5px";

var circleOpacity = '0.85';
var circleOpacityOnLineHover = "0.25";
var circleRadius = 3;
var circleRadiusHover = 6;

/* Add SVG */
  var svg = d3.select("#chart").append("svg")
    .attr("width", (width + margin) + "px")
    .attr("height", (height + margin) + "px")
    .append('g')
    .attr("transform", `translate(${margin}, ${margin})`);

/* Scale Axis */
var xScale = d3.scaleTime()
  .range([0, width - margin]);

var yScale = d3.scaleLinear()
  .range([height - margin, 0]);

/* Add Axis into SVG */

var xAxisGroup = svg.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height - margin})`)
 

var yAxisGroup = svg.append("g")
  .attr("class", "y axis")
 
var yLabel = svg.append("text")
  .attr("x", - (100 / 2))
  .attr("y", -12)
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")

// Data extraction from csv file
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

    if (!allYears.includes(newMonth.Year)){
      allYears.push(newMonth.Year);
    }

    return newMonth;
  });

  
  // format data for use in a line graph
  allYears.forEach(year => {
    var singleYear = {year: year, values: []};

    var allMonths = formattedData.filter(month => {
      return month.Year === year;
    });

    allMonths.forEach(month => {
      singleYear.values.push({month: month.Month, totalSnow: month.totalSnow, totalRain: month.totalRain});
      if (month.totalSnow > maxSnow) maxSnow = month.totalSnow;
      if (month.totalRain > maxRain) maxRain = month.totalRain;
      
    });
    
    formattedDataYearly.push(singleYear);
  });


  // d3.interval(() => {
  //   update(formattedDataYearly);
  // }, 5000);

  update(formattedDataYearly);

});



// Toggle between rain and snow
let button = document.getElementById("precip-button");

button.onclick = () => {
  // console.log(button.innerHTML)
  if (button.innerHTML == "Snow") {
    button.innerHTML = "Rain";
  }
  else {
    button.innerHTML = "Snow";
  }
  flag = !flag;
  // console.log(formattedData)

  update(formattedDataYearly);
};


// Update chart
function update(data){
  var toggle = flag ? "totalSnow" : "totalRain";
  
 
  console.log(toggle);
  console.log(data);
  
  /* Adjust Domain */

  // Determine y domain
  var yScaleValue = flag ? maxSnow : maxRain;

  xScale.domain(d3.extent(data[0].values, d => d.month));
  yScale.domain([0, yScaleValue]);

  var xAxis = d3.axisBottom(xScale).ticks(12);

  var yAxis = d3.axisLeft(yScale)
    .ticks(5)
    .tickFormat((precipAmount) => {
      return precipAmount + "cm"
    });

  xAxisGroup.call(xAxis);

  yAxisGroup.call(yAxis);

 


  var color = d3.scaleOrdinal(d3.schemeCategory10);

  /* Add line into SVG */
  var line = d3.line()
    .x(d => xScale(d.month))
    .y(d => yScale(d[toggle]));  

  let lines = svg.append('g')
    .attr('class', 'lines');



  d3.selectAll("path.line").remove();

  d3.selectAll("g.circle").remove();

  lines.selectAll('.line-group')
    .data(data)
    .enter().append("path")
    .attr("class", "line")
    .attr("d", d => line(d.values))
    .style('stroke', (d, i) => color(i))
    .style('opacity', lineOpacity)
   

    

    .on("mouseover", function (d, i) {
      svg.append("text")
        .attr("class", "title-text")
        .style("fill", color(i))
        .text(d.year)
        .attr("text-anchor", "middle")
        .attr("x", (width - margin) / 2)
        .attr("y", 5);
    })
    .on("mouseout", function (d) {
      svg.select(".title-text").remove();
    })
   
    .on("mouseover", function (d) {
      d3.selectAll('.line')
        .style('opacity', otherLinesOpacityHover);
      d3.selectAll('.circle')
        .style('opacity', circleOpacityOnLineHover);
      d3.select(this)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");
    })
    .on("mouseout", function (d) {
      d3.selectAll(".line")
        .style('opacity', lineOpacity);
      d3.selectAll('.circle')
        .style('opacity', circleOpacity);
      d3.select(this)
        .style("stroke-width", lineStroke)
        .style("cursor", "none");
    });


  /* Add circles in the line */
  lines.selectAll("circle-group")
    .data(data).enter()
    .append("g")
    .style("fill", (d, i) => color(i))
    .selectAll("circle")
    .data(d => d.values).enter()
    .append("g")
    .attr("class", "circle")
    .on("mouseover", function (d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text(`${d[toggle]}`)
        .attr("x", d => xScale(d.month) + 5)
        .attr("y", d => yScale(d[toggle]) - 10);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("cursor", "none")
        .transition()
        .duration(duration)
        .selectAll(".text").remove();
    })
    .append("circle")
    .attr("cx", d => xScale(d.month))
    .attr("cy", d => yScale(d[toggle]))
    .attr("r", circleRadius)
    .style('opacity', circleOpacity)
    .on("mouseover", function (d) {
      d3.select(this)
        .transition()
        .duration(duration)
        .attr("r", circleRadiusHover);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .transition()
        .duration(duration)
        .attr("r", circleRadius);
    });

  var label = flag ? "Snow" : "Rain";
  yLabel.text(label);
}