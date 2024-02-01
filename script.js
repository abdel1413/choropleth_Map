const educationDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const countyDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let educationData, countyData;

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
      const id = d.id;
      const percentage = educationData.find((d) => {
        console.log("ee", d);
      });
    });

  console.log("canvas", canvas);
};

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
