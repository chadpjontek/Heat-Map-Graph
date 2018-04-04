import * as d3 from "d3"
// graph function
const makeGraph = data => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
    colors = [
      "#3772FF",
      "#8FB339",
      "#C0DA74",
      "#F2F3AE",
      "#EDD382",
      "#FFC53A",
      "#FF853A",
      "#E24E1B",
      "#BF211E",
      "#780116"
    ],
    baseTemperature = 8.66,
    w = 1280,
    h = 500,
    padding = 60,
    maxYear = d3.max(data, d => d.year),
    minYear = d3.min(data, d => d.year),
    rectW = (w - padding) / (maxYear - minYear + 1),
    rectH = (h - padding) / 12;
  const f = d3.format(".2f");
  const div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  const xScale = d3
    .scaleLinear()
    .domain([minYear, maxYear])
    .range([padding, w]);
  const yScale = d3
    .scaleBand()
    .domain(months)
    .range([0, h - padding]);
  const svg = d3
    .select(".svg-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale).ticks(20);
  const colorScale = d3
    .scaleQuantile()
    .domain([d3.min(data, d => d.variance), d3.max(data, d => d.variance)])
    .range(colors);
  const rects = svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => (d.year - 1753) * rectW + padding)
    .attr("y", d => (d.month - 1) * rectH)
    .attr("width", rectW)
    .attr("height", rectH)
    .style("fill", d => "" + colorScale(d.variance));
  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);
  // text label for the x axis
  svg
    .append("text")
    .attr("transform", "translate(" + w / 2 + " ," + (h - 10) + ")")
    .style("text-anchor", "middle")
    .text("Year");
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", padding / 2 - 5)
    .attr("x", 10 - h / 2)
    .style("text-anchor", "middle")
    .text("Month");
  // add mouse tooltip
  svg
    .selectAll("rect")
    .data(data)
    .on("mouseover", function (d) {
      div
        .transition()
        .duration(100)
        .style("opacity", 1);
      div
        .html(
          `<span>${months[d.month - 1]} ${d.year}<br/>${f(
            d.variance + baseTemperature
          )}&#8451</span>`
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    });
  makeResponsive(svg);
};
// response status
const status = response => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
};
// json response
const json = response => {
  return response.json();
};
// make SVG responsive
const makeResponsive = svg => {
  const container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width"), 10),
    height = parseInt(svg.style("height"), 10),
    aspect = width / height,
    resize = () => {
      const targetWidth = parseInt(container.style("width"), 10);
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
    };
  svg
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMid")
    .call(resize);
  d3.select(window).on("resize." + container.attr("id"), resize);
};
export { status, json, makeGraph }