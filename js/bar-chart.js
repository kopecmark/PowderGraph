// Constructor to create a new visualization
BarChart = function(_parentElement, _data){
  this.parentElement = _parentElement;
  this.data = _data;
  this.initVis();
};

// Method to set up static parts of the visualization
BarChart.prototype.initVis = function(){
  var vis = this;

  // Table Setup
  vis.margin = { left: 100, right: 10, top: 10, bottom: 100 };

  vis.width = 1000 - vis.margin.left - vis.margin.right;
  vis.height = 500 - vis.margin.top - vis.margin.bottom;

  vis.t = d3.transition().duration(750);

  vis.g = d3.select(vis.parentElement)
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
    .attr("transform", "translate(0, " + vis.height + ")");


  vis.yAxisGroup = vis.g.append("g")
    .attr("class", "y-axis");

  // Tooltip
  vis.tip = d3.tip().attr('class', 'd3-tip')
    .html(function (d) {
      text = "<strong>Year:</strong> <span style='color:red'>" + d.Year + "</span><br>";
      text += "<strong>Month:</strong> <span style='color:red'>" + d.Month + "</span><br>";
      text += "<strong>Snow:</strong> <span style='color:red'>" + d3.format(".1f")(d.totalSnow) + "</span><br>";
      text += "<strong>Rain:</strong> <span style='color:red'>" + d3.format(".1f")(d.totalRain) + "</span><br>";
      return text;
    });
  vis.g.call(vis.tip);


  // Scale the axis
  vis.x = d3.scaleBand()
    .range([0, vis.width])
    .padding(0.2);

  vis.y = d3.scaleLinear()
    .range([vis.height, 0]);

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
BarChart.prototype.wrangleData = function(filteredData){
  var vis = this;
  if (filteredData){
    vis.data = filteredData;
  }

  vis.updateVis();

}

// Method to update elements to match the new data
BarChart.prototype.updateVis = function(){
  var vis = this;
  vis.value = flag ? "totalSnow" : "totalRain";

  vis.max = d3.max(vis.data, (month) => {
    return month[vis.value];
  });

  vis.x.domain(vis.data.map((month) => {
    return month.monthText;
  }));


  vis.y.domain([0, vis.max]);

  // X axis
  var formatTime = d3.timeFormat("%b");
  vis.xAxisCall = d3.axisBottom(vis.x)
    .ticks(5)
    .tickFormat((month) => {
      return formatTime(month);
    });

  // Y axis
  vis.yAxisCall = d3.axisLeft(vis.y)
    .ticks(10)
    .tickFormat((snowLevel) => {
      return snowLevel + "cm";
    });

  vis.xAxisGroup.transition(vis.t).call(vis.xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

  vis.yAxisGroup.transition(vis.t).call(vis.yAxisCall);

  // JOIN new data with old elements
  vis.rect = vis.g.selectAll("rect")
    .data(vis.data);

  // EXIT old elements not present in new data
  vis.rect.exit().remove()
    .attr("fill", "red")
    .transition(vis.t)
    .attr("y", vis.y(0)) 
    .remove();

  // UPDATE old elements present in new data
  vis.rect.transition(vis.t)
    .attr("x", (m) => { return vis.x(m.monthText) })
    .attr("y", (m) => { return vis.y(m[vis.value]) })
    .attr("width", vis.x.bandwidth)
    .attr("height", (m) => { return vis.height - vis.y(m[vis.value]); })


  vis.rect.enter()
    .append("rect")
    .attr("x", (m) => { return vis.x(m.monthText) })
    .attr("width", vis.x.bandwidth)
    .attr("fill", d3.rgb("#1C7192"))
    .attr("y", vis.y(0))
    .attr("height", 0)
    .on("mouseover", vis.tip.show)
    .on("mouseout", vis.tip.hide)
    // AND UPDATE old elements present in new data
    .merge(vis.rect)
    .transition(vis.t)
    .attr("y", (m) => { return vis.y(m[vis.value]) })
    .attr("height", (m) => { return vis.height - vis.y(m[vis.value]); })

  vis.label = flag ? "Total Snow Fall" : "Total Rain Fall";

  vis.yLabel.text(vis.label);

}

