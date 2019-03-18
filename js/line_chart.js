// Constructor to create a new visualization
LineChart = function (_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.initVis();
};



// Method to set up static parts of the visualization
LineChart.prototype.initVis = function () {
  var vis = this;

  // Table variables
  vis.margin = { left: 100, right: 50, top: 50, bottom: 100 }
  vis.margin = { left: 100, right: 50, top: 50, bottom: 100 }
  vis.width = 1000 - vis.margin.left - vis.margin.right;
  vis.width = 1000 - vis.margin.left - vis.margin.right;
  vis.height = 500 - vis.margin.top - vis.margin.bottom;
  vis.height = 500 - vis.margin.top - vis.margin.bottom;
  vis.duration = 300;
  vis.duration = 300;

  vis.lineOpacity = "0.25";
  vis.lineOpacityHover = "0.85";
  vis.otherLinesOpacityHover = "0.1";
  vis.lineStroke = "3.5px";
  vis.lineStrokeHover = "4.5px";

  vis.circleOpacity = '0.85';
  vis.circleOpacityOnLineHover = "0.25";
  vis.circleRadius = 3;
  vis.circleRadiusHover = 6;

  /* Add SVG */
  vis.svg = d3.select("#chart-area-line")
    .append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1000 500")
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + ", " + vis.margin.top + ")")

  /* Scale Axis */
  vis.xScale = d3.scaleTime()
    .range([0, vis.width]);

  vis.yScale = d3.scaleLinear()
    .range([vis.height, 0]);

  /* Add Axis into SVG */

  vis.xAxisGroup = vis.svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${vis.height})`)


  vis.yAxisGroup = vis.svg.append("g")
    .attr("class", "y-axis")

  vis.yLabel = vis.svg.append("text")
    .attr("x", - (vis.height / 2))
    .attr("y", -60)
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")

  vis.wrangleData();
};

// Method for filtering/selecting the data to be used
LineChart.prototype.wrangleData = function (filteredData) {
  var vis = this;
  if (filteredData) {
    vis.data = filteredData;
  }

  vis.updateVis();

};

LineChart.prototype.updateVis = function () {
  var vis = this;

  vis.toggle = flag ? "totalSnow" : "totalRain";

  /* Adjust Domain */

  // Determine y domain
  vis.yScaleValue = flag ? maxSnow : maxRain;

  vis.xScale.domain(d3.extent(vis.data[0].values, d => d.month));
  vis.yScale.domain([0, vis.yScaleValue]);

  vis.xAxis = d3.axisBottom(vis.xScale).ticks(12);

  vis.yAxis = d3.axisLeft(vis.yScale)
    .ticks(5)
    .tickFormat((precipAmount) => {
      return precipAmount + "cm";
    });

  vis.xAxisGroup.call(vis.xAxis);

  vis.yAxisGroup.call(vis.yAxis);

  vis.color = d3.scaleOrdinal(d3.schemeCategory10);

  /* Add line into SVG */
  vis.line = d3.line()
    .x(d => vis.xScale(d.month))
    .y(d => vis.yScale(d[vis.toggle]));

  vis.lines = vis.svg.append('g')
    .attr('class', 'lines');

  d3.selectAll("path.line").remove();

  d3.selectAll("g.circle").remove();

  vis.lines.selectAll('.line-group')
    .data(vis.data).enter()
    .append('g')
    .attr('class', 'line-group')
    .on("mouseover", function (d, i) {
      vis.svg.append("text")
        .attr("class", "title-text")
        .style("fill", vis.color(i))
        .text(d.year)
        .attr("text-anchor", "middle")
        .attr("x", vis.width / 2)
        .attr("y", 5);
    })
    .on("mouseout", function (d) {
      vis.svg.select(".title-text").remove();
    })
    .append("path")
    .attr("class", "line")
    .attr("d", d => vis.line(d.values))
    .style('stroke', (d, i) => vis.color(i))
    .style('opacity', vis.lineOpacity)

    .on("mouseover", function (d) {
      d3.selectAll('.line')
        .style('opacity', vis.otherLinesOpacityHover);
      d3.selectAll('.circle')
        .style('opacity', vis.circleOpacityOnLineHover);
      d3.select(this)
        .style('opacity', vis.lineOpacityHover)
        .style("stroke-width", vis.lineStrokeHover)
        .style("cursor", "pointer");
    })
    .on("mouseout", function (d) {
      d3.selectAll(".line")
        .style('opacity', vis.lineOpacity);
      d3.selectAll('.circle')
        .style('opacity', vis.circleOpacity);
      d3.select(this)
        .style("stroke-width", vis.lineStroke)
        .style("cursor", "none");
    });


  /* Add circles in the line */
  vis.lines.selectAll("circle-group")
    .data(vis.data).enter()
    .append("g")
    .style("fill", (d, i) => vis.color(i))
    .selectAll("circle")
    .data(d => d.values).enter()
    .append("g")
    .attr("class", "circle")
    .on("mouseover", function (d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text(`${d[vis.toggle]}`)
        .attr("x", d => vis.xScale(d.month) + 5)
        .attr("y", d => vis.yScale(d[vis.toggle]) - 10);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("cursor", "none")
        .transition()
        .duration(vis.duration)
        .selectAll(".text").remove();
    })
    .append("circle")
    .attr("cx", d => vis.xScale(d.month))
    .attr("cy", d => vis.yScale(d[vis.toggle]))
    .attr("r", vis.circleRadius)
    .style('opacity', vis.circleOpacity)
    .on("mouseover", function (d) {
      d3.select(this)
        .transition()
        .duration(vis.duration)
        .attr("r", vis.circleRadiusHover);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .transition()
        .duration(vis.duration)
        .attr("r", vis.circleRadius);
    });

  vis.label = flag ? "Total Snow Fall" : "Total Rain Fall";
  vis.yLabel.text(vis.label);
};