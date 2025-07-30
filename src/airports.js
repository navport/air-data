const csv = require("csvtojson");
const fs = require("fs");
const axios = require("axios").default;

console.log("Creating airports.json");
axios
  .get("https://davidmegginson.github.io/ourairports-data/airports.csv", {
    responseType: "stream",
  })
  .then((response) => {
    let stream = response.data;

    csv()
      .fromStream(stream)
      .then(function (jsonArrayObj) {
        const filteredAirports = jsonArrayObj
          .filter((row) => {
            return (
              row.iso_country &&
              row.municipality &&
              row.iata_code &&
              row.icao_code &&
              row.name &&
              row.latitude_deg &&
              row.longitude_deg
            );
          })
          .map((row) => ({
            country_code: row.iso_country,
            region_name: row.municipality,
            iata: row.iata_code,
            icao: row.icao_code,
            airport: row.name,
            latitude: row.latitude_deg,
            longitude: row.longitude_deg,
          }));

        console.log(
          `Filtered ${filteredAirports.length} airports from ${jsonArrayObj.length} total records`
        );

        fs.writeFile(
          __dirname + "/../data/airports.json",
          JSON.stringify(filteredAirports, null, 2),
          function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("airports.json was created");
            }
          }
        );
      });
  });
