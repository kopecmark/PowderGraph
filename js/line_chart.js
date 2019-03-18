// Constructor to create a new visualization
LineChart = function (_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.initVis();
};



// Method to set up static parts of the visualization
LineChart.prototype.initVis = function () {
  var lineVis = this;

  // Table variables
  lineVis.margin = { left: 100, right: 50, top: 50, bottom: 100 }
  lineVis.margin = { left: 100, right: 50, top: 50, bottom: 100 }
  lineVis.width = 1000 - lineVis.margin.left - lineVis.margin.right;
  lineVis.width = 1000 - lineVis.margin.left - lineVis.margin.right;
  lineVis.height = 500 - lineVis.margin.top - lineVis.margin.bottom;
  lineVis.height = 500 - lineVis.margin.top - lineVis.margin.bottom;
  lineVis.duration = 300;
  lineVis.duration = 300;

  lineVis.lineOpacity = "0.25";
  lineVis.lineOpacityHover = "0.85";
  lineVis.otherLinesOpacityHover = "0.1";
  lineVis.lineStroke = "3.5px";
  lineVis.lineStrokeHover = "4.5px";

  lineVis.circleOpacity = '0.85';
  lineVis.circleOpacityOnLineHover = "0.25";
  lineVis.circleRadius = 3;
  lineVis.circleRadiusHover = 6;

  /* Add SVG */
  lineVis.svg = d3.select("#chart-area-line")
    .append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1000 500")
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + lineVis.margin.left + ", " + lineVis.margin.top + ")")

  /* Scale Axis */
  lineVis.xScale = d3.scaleTime()
    .range([0, lineVis.width]);

  lineVis.yScale = d3.scaleLinear()
    .range([lineVis.height, 0]);

  /* Add Axis into SVG */

  lineVis.xAxisGroup = lineVis.svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${lineVis.height})`)


  lineVis.yAxisGroup = lineVis.svg.append("g")
    .attr("class", "y-axis")

  lineVis.yLabel = lineVis.svg.append("text")
    .attr("x", - (lineVis.height / 2))
    .attr("y", -60)
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")

  lineVis.wrangleData();
};

// Method for filtering/selecting the data to be used
LineChart.prototype.wrangleData = function (filteredData) {
  var lineVis = this;
  if (filteredData) {
    lineVis.data = filteredData;
  }

  lineVis.updateVis();

};

LineChart.prototype.updateVis = function () {
  var lineVis = this;

  lineVis.toggle = flag ? "totalSnow" : "totalRain";

  /* Adjust Domain */

  // Determine y domain
  lineVis.yScaleValue = flag ? maxSnow : maxRain;

  lineVis.xScale.domain(d3.extent(lineVis.data[0].values, d => d.month));
  lineVis.yScale.domain([0, lineVis.yScaleValue]);

  lineVis.xAxis = d3.axisBottom(lineVis.xScale).ticks(12);

  lineVis.yAxis = d3.axisLeft(lineVis.yScale)
    .ticks(5)
    .tickFormat((precipAmount) => {
      return precipAmount + "cm";
    });

  lineVis.xAxisGroup.call(lineVis.xAxis);

  lineVis.yAxisGroup.call(lineVis.yAxis);

  lineVis.color = d3.scaleOrdinal(d3.schemeCategory10);

  /* Add line into SVG */
  lineVis.line = d3.line()
    .x(d => lineVis.xScale(d.month))
    .y(d => lineVis.yScale(d[lineVis.toggle]));

  lineVis.lines = lineVis.svg.append('g')
    .attr('class', 'lines');

  d3.selectAll("path.line").remove();

  d3.selectAll("g.circle").remove();

  lineVis.lines.selectAll('.line-group')
    .data(lineVis.data).enter()
    .append('g')
    .attr('class', 'line-group')
    .on("mouseover", function (d, i) {
      lineVis.svg.append("text")
        .attr("class", "title-text")
        .style("fill", lineVis.color(i))
        .text(d.year)
        .attr("text-anchor", "middle")
        .attr("x", lineVis.width / 2)
        .attr("y", 5);
    })
    .on("mouseout", function (d) {
      lineVis.svg.select(".title-text").remove();
    })
    .append("path")
    .attr("class", "line")
    .attr("d", d => lineVis.line(d.values))
    .style('stroke', (d, i) => lineVis.color(i))
    .style('opacity', lineVis.lineOpacity)

    .on("mouseover", function (d) {
      d3.selectAll('.line')
        .style('opacity', lineVis.otherLinesOpacityHover);
      d3.selectAll('.circle')
        .style('opacity', lineVis.circleOpacityOnLineHover);
      d3.select(this)
        .style('opacity', lineVis.lineOpacityHover)
        .style("stroke-width", lineVis.lineStrokeHover)
        .style("cursor", "pointer");
    })
    .on("mouseout", function (d) {
      d3.selectAll(".line")
        .style('opacity', lineVis.lineOpacity);
      d3.selectAll('.circle')
        .style('opacity', lineVis.circleOpacity);
      d3.select(this)
        .style("stroke-width", lineVis.lineStroke)
        .style("cursor", "none");
    });


  /* Add circles in the line */
  lineVis.lines.selectAll("circle-group")
    .data(lineVis.data).enter()
    .append("g")
    .style("fill", (d, i) => lineVis.color(i))
    .selectAll("circle")
    .data(d => d.values).enter()
    .append("g")
    .attr("class", "circle")
    .on("mouseover", function (d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text(`${d[lineVis.toggle]}`)
        .attr("x", d => lineVis.xScale(d.month) + 5)
        .attr("y", d => lineVis.yScale(d[lineVis.toggle]) - 10);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("cursor", "none")
        .transition()
        .duration(lineVis.duration)
        .selectAll(".text").remove();
    })
    .append("circle")
    .attr("cx", d => lineVis.xScale(d.month))
    .attr("cy", d => lineVis.yScale(d[lineVis.toggle]))
    .attr("r", lineVis.circleRadius)
    .style('opacity', lineVis.circleOpacity)
    .on("mouseover", function (d) {
      d3.select(this)
        .transition()
        .duration(lineVis.duration)
        .attr("r", lineVis.circleRadiusHover);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .transition()
        .duration(lineVis.duration)
        .attr("r", lineVis.circleRadius);
    });

  lineVis.label = flag ? "Total Snow Fall" : "Total Rain Fall";
  lineVis.yLabel.text(lineVis.label);
};