const educationDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const countyDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

console.log("d3", d3);
console.log("topo", topojson);
let educationData, countyData;

d3.json(countyDataUrl).then((data) => {
  //   countyData = data;
  console.log("d", data);
  countyData = topojson.feature(data, data.objects.counties).features;
  console.log("ctd", countyData);

  d3.json(educationDataUrl).then((data) => {
    // convert to geoJson()

    educationData = data;
    console.log("eddata", data);
  });
});
