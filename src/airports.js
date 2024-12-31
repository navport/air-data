const csv = require("csvtojson");
const fs = require("fs");
const axios = require("axios").default;

console.log("Creating airports.json");
axios
  .get(
    "https://github.com/ip2location/ip2location-iata-icao/raw/master/iata-icao.csv",
    {
      responseType: "stream",
    }
  )
  .then((response) => {
    let stream = response.data;

    csv()
      .fromStream(stream)
      .then(function (jsonArrayObj) {
        fs.writeFile(
          __dirname + "/../data/airports.json",
          JSON.stringify(jsonArrayObj),
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
