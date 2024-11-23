const fs = require("fs");

function filterDataByCountry(countryName, inputFiles, outputFiles) {
	try {
		const countries = JSON.parse(
			fs.readFileSync(inputFiles.countries, "utf8")
		);
		const states = JSON.parse(fs.readFileSync(inputFiles.states, "utf8"));
		const cities = JSON.parse(fs.readFileSync(inputFiles.cities, "utf8"));

		// Step 1: Find the country in countries.json
		const country = countries.find(
			(c) => c.name.toLowerCase() === countryName.toLowerCase()
		);
		if (!country) {
			console.error(
				`Country "${countryName}" not found in countries.json`
			);
			return;
		}

		// Step 2: Filter states for the country
		const countryStates = states.filter(
			(state) => state.countryId === country.id
		);

		// Step 3: Filter cities for the country's states
		const countryStateIds = countryStates.map((state) => state.id);
		const countryCities = cities.filter((city) =>
			countryStateIds.includes(city.stateId)
		);

		// Step 4: Save filtered data
		fs.writeFileSync(
			outputFiles.countries,
			JSON.stringify([country], null, 2)
		);
		fs.writeFileSync(
			outputFiles.states,
			JSON.stringify(countryStates, null, 2)
		);
		fs.writeFileSync(
			outputFiles.cities,
			JSON.stringify(countryCities, null, 2)
		);

		console.log(`Filtered data saved for ${countryName}`);
	} catch (error) {
		console.error("Error processing data:", error.message);
	}
}

const inputFiles = {
	countries: "countries.json",
	states: "states.json",
	cities: "cities.json",
};

const outputFiles = {
	countries: "filtered_countries.json",
	states: "filtered_states.json",
	cities: "filtered_cities.json",
};

// Example usage
const countryName = process.argv[2] || "India";
filterDataByCountry(countryName, inputFiles, outputFiles);
