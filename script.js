const educationDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const countyDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let educationData, countyData, percentage;

const drawMap = () => {
  const canvas = d3.select("#canvas");

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
        return "tomato";
      } else if (percentage <= 30) {
        return "blue";
      } else if (percentage <= 45) {
        return "green";
      } else if (percentage <= 60) {
        return "yellow";
      } else if (percentage <= 85) {
        return "gray";
      } else {
        return "black";
      }
    })
    .attr("data-fips", (countyData) => countyData["fips"])
    .attr("data-education", (countyData) => {
      let id = countyData.id;

      let count = educationData.find((item) => {
        console.log("fips", item.fips);
        return item.fips === id;
      });
      let perc = count["bachelorsOrHigher"];
      return perc;
    });
};

//create a json object countyUrl and edicationUrl
d3.json(countyDataUrl).then((data) => {
  //   countyData = data;

  countyData = topojson.feature(data, data.objects.counties).features;
  console.log("countd", countyData);

  d3.json(educationDataUrl).then((data) => {
    educationData = data;
    console.log("edc", educationData);
    drawMap();
  });
});
