// Table Setup
var margin = { left: 100, right: 10, top: 10, bottom: 100 }

var width = 1500 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var flag = true;

var t = d3.transition().duration(750);

var g = d3.select("#chart-area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
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
    return d;
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
  // .attr("class", "y axis-label")
  .attr("x", - (height / 2))
  .attr("y", -60)
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Monthly Snow Accumilation (cm)");

  
d3.csv("data/ll_monthly_snow.csv").then(function(data){
  data.forEach( (month) =>{
    month.totalSnow = Number(month['Total Snow (cm)']);
    month.Month = +month.Month;
    month.Year = +month.Year;
    month.meanTemp = Number(month['Mean Temp (°C)']);
    month.meanMaxTemp = Number(month['Mean Max Temp (°C)']);
    month.meanMinTemp = Number(month['Mean Min Temp (°C)']);
    month.totalRain = Math.round(Number(month['Total Rain (mm)'])/10);
    var parseTime = d3.timeParse("%Y-%m");
    var formatTime = d3.timeFormat("%Y-%m");
    month['Date/Time'] = formatTime(parseTime(month['Date/Time']));
  })

  console.log(data);

  d3.interval(function(){
    update(data)
    flag = !flag
  }, 1000);

  // Run the vis for the first time
  update(data);
})

function update(data) {
  // Update the domain of each axis
  // var min = d3.min(data, (month) => {
  //   return month.totalSnow
  // })

  var value = flag ? "totalSnow" : "totalRain";

  var max = d3.max(data, (month) => {
    return month[value]
  })

  x.domain(data.map((month) => {
    return month['Date/Time']
  }))

  y.domain([0, max])

  // X axis
  var xAxisCall = d3.axisBottom(x);

  
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

  // console.log('min y axis val ' + min)
  // console.log('max y axis val ' + max)

  rect.enter()
    .append("rect")
      .attr("x", (m) => {return x(m['Date/Time'])})
      .attr("width", x.bandwidth)
      .attr("fill", "green")
      .attr("y", y(0))
      .attr("height", 0)
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
    // AND UPDATE old elements present in new data
    .merge(rect)
    .transition(t)
      .attr("y", (m) => { return y(m[value]) })
      .attr("height", (m) => { return height - y(m[value]); })
  
  var label = flag ? "Snow" : "Rain"
  
  yLabel.text(label);
}