// Constructor to create a new visualization?
BarChart = function(_parentElement){
  this.parentElement = _parentElement;

  this.initVis();
}

// Method to set up static parts of the visualization
BarChart.prototype.initVis = function(){
  var vis = this;

  // Table Setup
  vis.margin = { left: 100, right: 10, top: 10, bottom: 100 };

  vis.width = 1000 - vis.margin.left - vis.margin.right;
  vis.height = 500 - vis.margin.top - vis.margin.bottom;

  vis.flag = true;
  vis.formattedData;
  vis.year = 1919;

  vis.t = d3.transition().duration(750);

  var g = d3.select(vis.parentElement)
    .append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1000 500")
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + ", " + vis.margin.top + ")")

  vis.xAxisGroup = vis.g.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0, " + vis.height + ")")


  vis.yAxisGroup = vis.g.append("g")
    .attr("class", "y-axis")

  // Tooltip
  vis.tip = d3.tip().attr('class', 'd3-tip')
    .html(function (d) {
      text = "<strong>Year:</strong> <span style='color:red'>" + d.Year + "</span><br>";
      text += "<strong>Month:</strong> <span style='color:red'>" + d.Month + "</span><br>";
      text += "<strong>Snow:</strong> <span style='color:red'>" + d3.format(".1f")(d.totalSnow) + "</span><br>";
      text += "<strong>Rain:</strong> <span style='color:red'>" + d3.format(".1f")(d.totalRain) + "</span><br>";
      return text;
    });
  g.call(vis.tip);


  // Scale the axis
  vis.x = d3.scaleBand()
    .range([0, vis.width])
    .padding(0.2)

  vis.y = d3.scaleLinear()
    .range([vis.height, 0])


  // X Label Name
  vis.g.append("text")
    // .attr("class", "x axis-label")
    .attr("x", vis.width / 2)
    .attr("y", vis.height + 80)
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .text("Months");

  // Y Label Name
  vis.yLabel = vis.g.append("text")
    .attr("x", - (vis.height / 2))
    .attr("y", -60)
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)");

  vis.wrangleData();
}

// Method for filtering/selecting the data to be used
BarChart.prototype.wrangleData = function(){
  var vis = this;

  vis.updateVis();

}

// Method to update elements to match the new data
BarChart.prototype.updateVis = function(){
  var vis = this;

  vis.value = vis.flag ? "totalSnow" : "totalRain";

  vis.max = d3.max(data, (month) => {
    return month[value];
  })

  vis.x.domain(data.map((month) => {
    return month['Date/Time'];
  }))


  vis.y.domain([0, max]);

  // X axis
  vis.xAxisCall = d3.axisBottom(vis.x)
    .ticks(5);

  // Y axis
  vis.yAxisCall = d3.axisLeft(vis.y)
    .ticks(10)
    .tickFormat((snowLevel) => {
      return snowLevel + "cm"
    });

  vis.xAxisGroup.transition(vis.t).call(vis.xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

  vis.yAxisGroup.transition(y).call(yAxisCall);

  // JOIN new data with old elements
  vis.rect = g.selectAll("rect")
    .data(data);

  // EXIT old elements not present in new data
  vis.rect.exit().remove()
    .attr("fill", "red")
    .transition(vis.t)
    .attr("y", y(0))
    .remove();

  // UPDATE old elements present in new data
  vis.rect.transition(vis.t)
    .attr("x", (m) => { return x(m['Date/Time']) })
    .attr("y", (m) => { return y(m[value]) })
    .attr("width", vis.x.bandwidth)
    .attr("height", (m) => { return vis.height - y(m[value]); })


  rect.enter()
    .append("rect")
    .attr("x", (m) => { return x(m['Date/Time']) })
    .attr("width", vis.x.bandwidth)
    .attr("fill", d3.rgb("#1C7192"))
    .attr("y", y(0))
    .attr("height", 0)
    .on("mouseover", vis.tip.show)
    .on("mouseout", vis.tip.hide)
    // AND UPDATE old elements present in new data
    .merge(vis.rect)
    .transition(vis.t)
    .attr("y", (m) => { return y(m[value]) })
    .attr("height", (m) => { return vis.height - y(m[value]); })

  vis.label = vis.flag ? "Snow" : "Rain";

  vis.yLabel.text(vis.label);

}




  
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
}



