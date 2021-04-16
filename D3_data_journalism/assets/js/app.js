// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from hours-of-tv-watched.csv
d3.csv("assets/data/data.csv").then(function(newsData) {

  // Print the tvData
  console.log(newsData);

  // Cast the hours value to a number for each piece of tvData
  newsData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    console.log(data.poverty);
  });

  //  Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8.5, d3.max(newsData, d => d.poverty*1.2)])
      .range([0, width]);
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(newsData, d => d.healthcare*1.2)])
      .range([height, 0]);

      // create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    chartGroup.append("g")
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle").data(newsData).enter();
        circlesGroup.append("circle")
          .attr("cx", d => xLinearScale(d.poverty))
          .attr("cy", d => yLinearScale(d.healthcare))
          .attr("r", "15")
          .attr("fill", "blue")
          .attr("class","stateCircle")
          .attr("opacity", ".5")
          .on("click", function(data) {     
            toolTip.show(data,this);
          });
          circlesGroup.append("text")
    .text(function(d){
      return d.abbr;
    })
      .attr("dx", d => xLinearScale(d.poverty))
      .attr("dy", d => yLinearScale(d.healthcare)+10/2.5)
      .attr("font-size","9")
      .attr("class","stateText")
      .on("mouseover", function(data, index) {
        toolTip.show(data,this);
      d3.select(this).style("stroke","#323232")
    //   
      })
      .on("mouseout", function(data, index) {
          toolTip.hide(data,this)
    //    
      }); 
          
          chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
        chartGroup.append("g")
          .call(leftAxis);
      
          // Initialize tool tip
    // ==============================

    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -20])
    .html(function(d) {
      return (`${d.state}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
    });

    // Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare(%)");
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty(%)");

  
}).catch(function(error) {
  console.log(error);
});

