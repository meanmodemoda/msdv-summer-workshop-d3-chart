async function drawBarChart() {
  // 1. Access data
  const data = await d3.json("https://ghibliapi.herokuapp.com/films");
  data.sort((a, b) => a.rt_score - b.rt_score);
  //   console.log(data);
  const yAccessor = (d) => d.title;
  const xAccessor = (d) => d.rt_score;
  //   console.log(yAccessor(data[0]));
  const titles = data.map(yAccessor);
  //   console.log(titles);
  // 2. Create dimenisons
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 20,
      bottom: 40,
      left: 150,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // 3. Draw Canvas
  const wrapper = d3
    .select("#barchart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
    );

  // 4. Create Scale

  const xScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleBand()
    .domain(titles)
    .range([dimensions.boundedHeight, 0])
    .padding(0.1);

  colorScale = d3.scaleLinear().domain([0, 100]).range(["#99f542", "#eb7d34"]);

  // 5. Create Chart
  const barGroup = bounds
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", 0)
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("width", (d) => xScale(xAccessor(d)))
    .attr("height", (d) => yScale.bandwidth())
    .attr("fill", (d) => colorScale(xAccessor(d)));

  // 6. Create Peripherals
  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);
}
drawBarChart();
