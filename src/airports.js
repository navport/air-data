const csv = require("csvtojson");
const fs = require("fs");
const axios = require("axios").default;

const append = require("./append/airports.json");

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
        let filteredAirports = [];
        for (let n = 0; n < jsonArrayObj.length; n++) {
          let row = jsonArrayObj[n];

          let country_code = row.iso_country;
          let region_name = row.municipality;
          let iata = row.iata_code;
          let icao = row.icao_code;
          let airport = row.name;
          let latitude = row.latitude_deg;
          let longitude = row.longitude_deg;

          for (let i = 0; i < append.length; i++) {
            let appendElement = append[i];

            if (appendElement.by === "iata") {
              if (
                appendElement.iata_code.toUpperCase() === iata.toUpperCase()
              ) {
                icao = appendElement.icao_code;
                break;
              }
            } else if (appendElement.by === "icao") {
              if (
                appendElement.icao_code.toUpperCase() === icao.toUpperCase()
              ) {
                iata = appendElement.iata_code;
                break;
              }
            }
          }

          if (
            !country_code ||
            !region_name ||
            !iata ||
            !icao ||
            !airport ||
            !latitude ||
            !longitude
          )
            continue;

          filteredAirports.push({
            country_code,
            region_name,
            iata,
            icao,
            airport,
            latitude,
            longitude,
          });
        }

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
