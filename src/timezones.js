const fs = require("fs");
const axios = require("axios").default;

axios
  .get(
    "https://raw.githubusercontent.com/hroptatyr/dateutils/tzmaps/icao.tzmap"
  )
  .then(function (response) {
    let timezones = [];
    response.data.split("\n").forEach((line) => {
      const [icao, tz] = line.split("\t");
      if (icao == undefined) return;
      if (tz == undefined) return;
      timezones.push({ icao, tz });
    });
    
    fs.writeFileSync(
      __dirname + "/../data/timezones.json",
      JSON.stringify(timezones)
    );
  });
