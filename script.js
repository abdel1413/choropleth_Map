const educationDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const countyDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let educationData, countyData, percentage, tooltip;

const colorJson = [
  { x_axis: "600", y_axis: "30", color: "tomato", value: "12%" },
  { x_axis: "640", y_axis: "30", color: "blue", value: "21%" },
  { x_axis: "680", y_axis: "30", color: "green", value: "30%" },
  { x_axis: "720", y_axis: "30", color: "yellow", value: "48%" },
  { x_axis: "760", y_axis: "30", color: "gray", value: "57%" },
  { x_axis: "800", y_axis: "30", color: "black", value: "66%" },
];

//tooltip

// handle mouse over
const displayCountyDetails = (e, d) => {
  let id = d.id;
  let countyInfo = educationData.find((item) => {
    return item.fips === id;
  });

  const educationLevel = countyInfo["bachelorsOrHigher"];

  console.log("d", e.pageY);
  tooltip
    .transition()
    .style("visibility", "visible")
    .style("opacity", "0.9")
    .style("top", e.pageX + "px")
    .style("left", e.pageY + "px")
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
        return colorJson[0].color;
      } else if (percentage <= 25) {
        return colorJson[1].color;
      } else if (percentage <= 35) {
        return colorJson[2].color;
      } else if (percentage <= 40) {
        return colorJson[3].color;
      } else if (percentage <= 55) {
        return colorJson[4].color;
      } else {
        return colorJson[5].color;
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
    .data(colorJson)
    .enter()
    .append("rect")
    .attr("width", "40")
    .attr("height", "20")
    .attr("x", (d) => d.x_axis)
    .attr("y", (d) => d.y_axis)
    .style("fill", (d) => d.color)

    .style("background-color", "yellow");
  let lineStrokes = d3.select("#legend");
  lineStrokes
    .append("g")
    .selectAll("line")
    .data(colorJson)
    .enter()
    .append("line")
    .attr("x1", (d) => {
      console.log("d", d.value);
      let xCord = parseInt(d.x_axis);
      xCord += 40;
      return "" + xCord;
    })
    .attr("y1", (d) => d.y_axis)
    .attr("x2", (d) => {
      let xCoord = parseInt(d.x_axis);

      xCoord += 40;
      xCoord = "" + xCoord;
      return xCoord;
    })
    .attr("y2", (d) => {
      let yCoord = parseInt(d.y_axis);
      yCoord += 30;
      yCoord = "" + yCoord;

      return yCoord;
    })
    .style("stroke", "black")
    .attr("opacity", "1");
  lineStrokes
    .selectAll("text")
    .data(colorJson)
    .enter()
    .append("text")
    // .attr("x", "600")
    // .attr("y", "70")
    .attr("x", (d) => {
      let tx = parseInt(d.x_axis);
      tx += 7;
      tx = "" + tx;
      return tx;
    })
    .attr("y", (d) => {
      let ty = parseInt(d.y_axis);
      ty += 35;
      ty = "" + ty;
      return ty;
    })
    .text((d) => d.value)
    .style("font-size", "0.9rem");

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
