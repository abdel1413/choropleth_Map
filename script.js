const educationDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const countyDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let educationData, countyData, percentage, tooltip;

const legendJson = [
  { x_axis: "600", y_axis: "30", color: "tomato" },
  { x_axis: "640", y_axis: "30", color: "blue" },
  { x_axis: "680", y_axis: "30", color: "green" },
  { x_axis: "720", y_axis: "30", color: "yellow" },
  { x_axis: "760", y_axis: "30", color: "gray" },
  { x_axis: "800", y_axis: "30", color: "black" },
];

//tooltip

// handle mouse over
const displayCountyDetails = (e, d) => {
  let id = d.id;
  let countyInfo = educationData.find((item) => {
    return item.fips === id;
  });

  console.log(countyInfo);

  const educationLevel = countyInfo["bachelorsOrHigher"];

  tooltip
    .transition()
    .style("visibility", "visible")
    .style("opacity", "0.9")
    .attr("top", e.pageY + 10 + "px")
    .attr("left", e.pageX + 10 + "px")
    .attr("data-education", educationLevel)

    .text(
      countyInfo["area_name"] +
        ", " +
        countyInfo["state"] +
        " - " +
        countyInfo["bachelorsOrHigher"] +
        "%"
    );
};
const hideCountyDetails = () => {
  tooltip.style("visibility", "hidden").style("opacity", "0");
};

const drawMap = () => {
  const canvas = d3.select("#canvas");
  tooltip = d3.select("#tooltip");

  canvas
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (d) => {
      let id = d.id;

      //get county which fips code = id in education data
      county = educationData.find((item) => {
        return item.fips === id;
      });

      // get the corresponding percentage of people with bachelor or higher
      percentage = county.bachelorsOrHigher;

      if (percentage <= 15) {
        // console.log("legn", legendJson[0].color);
        return "tomato";
      } else if (percentage <= 25) {
        return "blue";
      } else if (percentage <= 35) {
        return "green";
      } else if (percentage <= 40) {
        return "yellow";
      } else if (percentage <= 55) {
        return "gray";
      } else {
        return "black";
      }
    })

    .attr("data-fips", (item) => {
      return item["id"];
    })
    .attr("data-education", (countyData) => {
      let id = countyData.id;

      let count = educationData.find((item) => {
        return item.fips === id;
      });
      let perc = count["bachelorsOrHigher"];
      return perc;
    })
    .on("mouseover", displayCountyDetails)
    .on("mouseout", hideCountyDetails);

  let legend = d3.select("#legend-section");
  legend
    .append("g")
    .attr("id", "legend")
    .selectAll("rect")
    .data(legendJson)
    .enter()
    .append("rect")
    .attr("width", "40")
    .attr("height", "40")
    .attr("x", (d) => d.x_axis)
    .attr("y", (d) => d.y_axis)
    .style("fill", (d) => d.color)
    .style("border", "3px solid red")
    .style("background-color", "yellow");

  tooltip
    .style("visibility", "hidden")
    .attr("id", "tooltip")
    .attr("opacity", "0")
    .attr("position", "absolute");
};

//create a json object countyUrl and edicationUrl
d3.json(countyDataUrl).then((data) => {
  //   countyData = data;

  countyData = topojson.feature(data, data.objects.counties).features;

  d3.json(educationDataUrl).then((data) => {
    educationData = data;

    drawMap();
  });
});
