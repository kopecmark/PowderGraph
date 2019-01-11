d3.csv("data/ll_monthly_snow.csv").then(function(data){
  data.forEach(month=>{
    month.totalSnow = Number(month['Total Snow (cm)']);
    month.Month = +month.Month;
    month.Year = +month.Year;
  })
  console.log(data);

    var svg = d3.select("#chart-area").append("svg")
      .attr("width", 5000 )
      .attr("height", 500)


    var y = d3.scaleLinear()
      .domain([0,400])
      .range([0,500])

    // var x = d3.scaleTime()
    //   .domain([new Date(1915,1,1), 
    //     new Date(2007,11,1)])
    //   .range([0, 1500])

    var rect = svg.selectAll("rect")
      .data(data);

    rect.enter()
      .append("rect")
      .attr("x", (b, i) => {
        return (i * 10) + 10;
      })
      .attr("y", 10)
      .attr("width", 5)
      .attr("height", (m, i) => {
        return y(m.totalSnow);
      })
  
})