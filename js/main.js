// =========================================
// CUK Biodiversity Portal
// Main Application
// =========================================

const App = {

    species: [],

    observations: [],

    statistics: {},

};


// =========================================
// Load JSON Files
// =========================================

async function loadData() {

    try {

        const [

            species,

            observations,

            statistics

        ] = await Promise.all([

            fetch("data/species.json").then(r => r.json()),

            fetch("data/observations.json").then(r => r.json()),

            fetch("data/statistics.json").then(r => r.json())

        ]);

        App.species = species;

        App.observations = observations;

        App.statistics = statistics;

        console.log("Data Loaded Successfully");

        console.log(App);

    }

    catch (error) {

        console.error(error);

    }

}

document.addEventListener("DOMContentLoaded", loadData);