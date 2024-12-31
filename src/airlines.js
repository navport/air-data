const csv = require("csvtojson");
const fs = require("fs");
const axios = require("axios").default;

const append = require("./append/airlines.json");

console.log("Creating airlines.json");
axios
  .get(
    "https://raw.githubusercontent.com/benct/iata-utils/master/generated/iata_airlines.csv",
    {
      responseType: "stream",
    }
  )
  .then((response) => {
    let stream = response.data;

    csv({
      delimiter: "^",
    })
      .fromStream(stream)
      .then(function (jsonArrayObj) {
        for (let i = 0; i < append.length; i++) {
          if (append[i].by == "iata") {
            let indexReplace = jsonArrayObj.findIndex((element) => {
              if (element.iata_code == append[i].iata_code) return element;
              return null;
            });

            append[i].by = undefined;
            jsonArrayObj[indexReplace] = append[i];
          } else if (append[i].by == "icao") {
            let indexReplace = jsonArrayObj.findIndex((element) => {
              if (element.icao_code == append[i].icao_code) return element;
              return null;
            });

            append[i].by = undefined;
            jsonArrayObj[indexReplace] = append[i];
          } else {
            jsonArrayObj.push(append[i]);
          }
        }

        fs.writeFile(
          __dirname + "/../data/airlines.json",
          JSON.stringify(jsonArrayObj),
          function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("airlines.json was created");
            }
          }
        );
      });
  });
