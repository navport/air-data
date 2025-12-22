const fs = require("fs");
const axios = require("axios").default;
const airports = require("../data/airports.json");

axios
  .get(
    "https://raw.githubusercontent.com/hroptatyr/dateutils/tzmaps/iata.tzmap"
  )
  .then(function (response) {
    let timezones = [];
    response.data.split("\n").forEach((line) => {
      const [iata, tz] = line.split("\t");
      if (iata == undefined) return;
      if (tz == undefined) return;
      timezones.push({ iata, tz });
    });

    let convertedAirports = [];
    for (let i = 0; i < timezones.length; i++) {
      let timezoneAirport = timezones[i];

      const airport = airports.find((airport) => {
        return airport.iata.toUpperCase() === timezoneAirport.iata;
      });
      if (!airport) continue;

      convertedAirports.push({
        iata: timezoneAirport.iata,
        icao: airport.icao,
        tz: timezoneAirport.tz,
      });
    }

    fs.writeFileSync(
      __dirname + "/../data/timezones.json",
      JSON.stringify(convertedAirports)
    );
  });
