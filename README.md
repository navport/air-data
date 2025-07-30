# air-data

Collection of aviation data including airline/airport IATA/ICAO conversions, timzeone data, etc.

## Data Sources

- `airports.json` - [davidmegginson/ourairports-data](https://github.com/davidmegginson/ourairports-data), under the [The Unlicense](https://unlicense.org/).
- `airlines.json` - [benct/iata-utils](https://github.com/benct/iata-utils), under the [MIT License](https://opensource.org/licenses/MIT).
- `timezones.json` - [hroptatyr/dateutils](https://github.com/hroptatyr/dateutils/tree/tzmaps)

## Contributing

### Requirements:

- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- [git](https://git-scm.com/)

### Contributing Data:

To contribute data, use the type file (airports, airlines, timezones) in the `src/append` directory. The data should be in JSON format and follow the following examples:

`airlines`:

```json
{
  "iata_code": "DL",
  "icao_code": "DAL",
  "name": "Delta Air Lines",
  "alias": "",
  "by": "iata" // This is only used if replacing an existing string in the airlines.json file (by iata or icao). If adding a new entry, this should be omitted.
}
```

After, run the following command to append the data to the existing JSON file:

```bash
pnpm run-all
```

Open a pull request with the changes and they will be reviewed and merged if they meet the requirements.

## License

The code to fetch the data is licensed under the [MIT License](https://opensource.org/licenses/MIT). The data itself is licensed under the respective licenses of the sources mentioned above.
