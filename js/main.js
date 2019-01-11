d3.csv("data/ll_monthly_snow.csv").then(function(data){
  data.forEach(month=>{
    month.totalSnow = Number(month['Total Snow (cm)']);
    month.Month = +month.Month;
    month.Year = +month.Year;
  })
  console.log(data);
    var margin = { left:100, right: 10, top:10, bottom: 100}

    var width = 1500 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#chart-area").append("svg")
      .attr("width", width + margin.left + margin.right )
      .attr("height", height + margin.top + margin.bottom)

      var min = d3.min(data, (month) => {
        return month.totalSnow
      })
      
      var max = d3.max(data, (month) => {
        return month.totalSnow
      })
      
    var y = d3.scaleLinear()
      .domain([min, max])
      .range([0, height])

    console.log('min y axis val ' + min)
    console.log('max y axis val ' + max)

    var x = d3.scaleBand()
      .domain(data.map((month) => { 
        return month['Date/Time']
      }))
      .range([0,width])
      .paddingInner(1)
      .paddingOuter(1)

    // var x = d3.scaleTime()
    //   .domain([new Date(1915,1,1), 
    //     new Date(2007,11,1)])
    //   .range([0, 1500])

    var rect = svg.selectAll("rect")
      .data(data);
  
 
    rect.enter()
      .append("rect")
      .attr("x", (m) => {
        return x(m['Date/Time'])
      })
      .attr("y", 10)
      .attr("width", 2)
      .attr("height", (m) => {
        return y(m.totalSnow);
      })
      .attr("fill", "green");
  
})

