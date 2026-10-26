const csv = require("csvtojson");
const fs = require("fs");
const axios = require("axios").default;

const append = require("./append/airlines.json");
const details = require("./append/airlines-details.json");

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
            append[i].by = undefined;
            jsonArrayObj.push(append[i]);
          }
        }

        // Attach manually entered details (website, phone, socials, etc.) as a "details" object by IATA code
        for (const [iata, extra] of Object.entries(details)) {
          const airline = jsonArrayObj.find(
            (element) => element.iata_code == iata
          );

          if (airline) airline.details = extra;
          else console.log(`airlines-details.json: no airline with IATA code ${iata}`);
        }

        fs.writeFile(
          __dirname + "/../data/airlines.json",
          JSON.stringify(jsonArrayObj, null, 2),
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
