// =========================================================
// CUK BioAtlas Data Engine v3.0
// Author : ChatGPT + Satyam
// =========================================================

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const config = require("./config");
const helper = require("./helpers");
const logger = require("./logger");

// =========================================================
// Utility Functions
// =========================================================

function excelDateToJS(excelDate) {

    if (!excelDate) return "";

    if (typeof excelDate === "string") {

        if (isNaN(Number(excelDate)))
            return excelDate;

        excelDate = Number(excelDate);

    }

    const utc_days = Math.floor(excelDate - 25569);
    const utc_value = utc_days * 86400;

    const date_info = new Date(utc_value * 1000);

    const fractional_day = excelDate - Math.floor(excelDate);

    let totalSeconds = Math.round(fractional_day * 86400);

    const seconds = totalSeconds % 60;

    totalSeconds = Math.floor(totalSeconds / 60);

    const minutes = totalSeconds % 60;

    const hours = Math.floor(totalSeconds / 60);

    date_info.setHours(hours);
    date_info.setMinutes(minutes);
    date_info.setSeconds(seconds);

    return date_info.toISOString();

}

function ensureFolder(folder) {

    if (!fs.existsSync(folder))
        fs.mkdirSync(folder);

}

function saveJSON(filename, data) {

    fs.writeFileSync(

        path.join(config.outputFolder, filename),

        JSON.stringify(data, null, 4)

    );

}

function getCategory(taxon) {

    taxon = String(taxon || "").toLowerCase();

    if (taxon.includes("planta"))
        return "Plants";

    if (taxon.includes("aves"))
        return "Birds";

    if (taxon.includes("mamm"))
        return "Mammals";

    if (taxon.includes("rept"))
        return "Reptiles";

    if (taxon.includes("amph"))
        return "Amphibians";

    if (taxon.includes("arach"))
        return "Arachnids";

    if (taxon.includes("fung"))
        return "Fungi";

    if (taxon.includes("moll"))
        return "Molluscs";

    if (taxon.includes("insect"))
        return "Insects";

    return "Others";

}

// =========================================================
// Banner
// =========================================================

logger.title("CUK BioAtlas Data Engine");

// =========================================================
// Excel File
// =========================================================

const excelPath = path.join(

    __dirname,

    "..",

    config.excelFile

);

if (!fs.existsSync(excelPath)) {

    logger.error("Excel file not found.");

    process.exit(1);

}

logger.success("Excel File Found");

// =========================================================
// Read Workbook
// =========================================================

const workbook = XLSX.readFile(excelPath);

let sheetName = config.sheetName;

if (!workbook.SheetNames.includes(sheetName)) {

    logger.warning(

        "Configured sheet not found."

    );

    sheetName = workbook.SheetNames[0];

}

logger.success("Using Sheet : " + sheetName);

const worksheet = workbook.Sheets[sheetName];

const rows = XLSX.utils.sheet_to_json(

    worksheet,

    {

        defval: ""

    }

);

if (!rows.length) {

    logger.error("No rows found.");

    process.exit(1);

}

logger.success(rows.length + " observations loaded");

// =========================================================
// Validate Columns
// =========================================================

logger.title("Validating Columns");

const firstRow = rows[0];

Object.values(config.columns).forEach(col => {

    if (firstRow.hasOwnProperty(col))

        logger.success(col);

    else

        logger.warning(col + " missing");

});

// =========================================================
// Collections
// =========================================================

const observations = [];

const speciesMap = new Map();

const categoryMap = new Map();

const searchIndex = [];

const statistics = {

    totalSpecies: 0,

    totalObservations: 0,

    totalCategories: 0,

    plants: 0,

    birds: 0,

    insects: 0,

    mammals: 0,

    reptiles: 0,

    amphibians: 0,

    arachnids: 0,

    fungi: 0,

    others: 0

};

logger.title("Loading Observations");

rows.forEach(row => {

    observations.push({

        id: helper.safe(

            row[config.columns.id]

        ),

        scientificName:

            helper.safe(

                row[config.columns.scientificName]

            ),

        commonName:

            helper.safe(

                row[config.columns.commonName]

            ),

        speciesGuess:

            helper.safe(

                row[config.columns.speciesGuess]

            ),

        taxon:

            helper.safe(

                row[config.columns.taxon]

            ),

        image:

            helper.safe(

                row[config.columns.image]

            ),

        latitude:

            helper.number(

                row[config.columns.latitude]

            ),

        longitude:

            helper.number(

                row[config.columns.longitude]

            ),

        observer:

            helper.safe(

                row[config.columns.observer]

            ),

        date:

            excelDateToJS(

                row[config.columns.date]

            ),

        location:

            helper.safe(

                row[config.columns.location]

            ),

        iNaturalist:

            helper.safe(

                row[config.columns.inaturalist]

            )

    });

});

logger.success(

    observations.length +

    " observations processed"

);

// =========================================================
// Next Part Starts Here
// =========================================================// =========================================================
// Build Species Database
// =========================================================

logger.title("Building Species Database");

observations.forEach(obs => {

    const key = obs.scientificName.trim();

    if (!key) return;

    // -------------------------------------------------
    // Create New Species
    // -------------------------------------------------

    if (!speciesMap.has(key)) {

        speciesMap.set(key, {

            id: speciesMap.size + 1,

            slug: helper.slugify(key),

            scientificName: key,

            commonName:
                obs.commonName ||
                obs.speciesGuess,

            speciesGuess:
                obs.speciesGuess,

            taxon:
                obs.taxon,

            category:
                getCategory(obs.taxon),

            description: "",

            thumbnail:
                obs.image,

            gallery: [],

            observations: [],

            observationCount: 0,

            contributors: new Set(),

            locations: [],

            coordinates: [],

            firstObserved:
                obs.date,

            lastObserved:
                obs.date,

            iNaturalist:
                obs.iNaturalist

        });

    }

    // -------------------------------------------------
    // Current Species Object
    // -------------------------------------------------

    const current = speciesMap.get(key);

    // -------------------------------------------------
    // Gallery
    // -------------------------------------------------

    if (
        obs.image &&
        !current.gallery.includes(obs.image)
    ) {

        current.gallery.push(obs.image);

    }

    // -------------------------------------------------
    // Observation IDs
    // -------------------------------------------------

    current.observations.push(obs.id);

    current.observationCount++;

    // -------------------------------------------------
    // Contributors
    // -------------------------------------------------

    if (obs.observer)
        current.contributors.add(
            obs.observer
        );

    // -------------------------------------------------
    // Locations
    // -------------------------------------------------

    if (
        obs.location &&
        !current.locations.includes(
            obs.location
        )
    ) {

        current.locations.push(
            obs.location
        );

    }

    // -------------------------------------------------
    // Coordinates
    // -------------------------------------------------

    if (
        obs.latitude !== null &&
        obs.longitude !== null
    ) {

        current.coordinates.push({

            latitude:
                obs.latitude,

            longitude:
                obs.longitude

        });

    }

    // -------------------------------------------------
    // Observation Dates
    // -------------------------------------------------

    if (
        obs.date &&
        obs.date < current.firstObserved
    ) {

        current.firstObserved =
            obs.date;

    }

    if (
        obs.date &&
        obs.date > current.lastObserved
    ) {

        current.lastObserved =
            obs.date;

    }

});

// =========================================================
// Convert Map → Array
// =========================================================

logger.success(
    speciesMap.size +
    " unique species found."
);

const species =
    [...speciesMap.values()]
    .map(item => {

        item.contributors =
            [...item.contributors];

        item.gallery =
            helper.unique(item.gallery);

        item.locations =
            helper.unique(item.locations);

        item.coordinates =
            helper.unique(

                item.coordinates.map(

                    c =>
                        JSON.stringify(c)

                )

            ).map(

                c =>
                    JSON.parse(c)

            );

        return item;

    });

// =========================================================
// Build Search Index
// =========================================================

logger.title(
    "Generating Search Index"
);

species.forEach(item => {

    searchIndex.push({

        id:
            item.id,

        slug:
            item.slug,

        scientificName:
            item.scientificName,

        commonName:
            item.commonName,

        category:
            item.category

    });

});

logger.success(
    searchIndex.length +
    " search records created."
);

// =========================================================
// Build Category Counts
// =========================================================

logger.title(
    "Generating Categories"
);

species.forEach(item => {

    const category =
        item.category;

    categoryMap.set(

        category,

        (
            categoryMap.get(category)
            || 0
        ) + 1

    );

});

const categories =

    [...categoryMap.entries()]
    .map(

        ([name, count]) => ({

            name,

            count

        })

    )
    .sort(

        (a, b) =>
            b.count - a.count

    );

logger.success(
    categories.length +
    " categories generated."
);

// =========================================================
// Statistics
// =========================================================

statistics.totalSpecies =
    species.length;

statistics.totalObservations =
    observations.length;

statistics.totalCategories =
    categories.length;

categories.forEach(cat => {

    switch (cat.name) {

        case "Plants":
            statistics.plants =
                cat.count;
            break;

        case "Birds":
            statistics.birds =
                cat.count;
            break;

        case "Insects":
            statistics.insects =
                cat.count;
            break;

        case "Mammals":
            statistics.mammals =
                cat.count;
            break;

        case "Reptiles":
            statistics.reptiles =
                cat.count;
            break;

        case "Amphibians":
            statistics.amphibians =
                cat.count;
            break;

        case "Arachnids":
            statistics.arachnids =
                cat.count;
            break;

        case "Fungi":
            statistics.fungi =
                cat.count;
            break;

        default:
            statistics.others +=
                cat.count;

    }

});

logger.success(
    "Statistics generated."
);

// =========================================================
// PART 3 STARTS HERE
// =========================================================
// =========================================================
// Create Output Folder
// =========================================================

logger.title("Creating Output Folder");

ensureFolder(config.outputFolder);

logger.success(
    "Output folder ready."
);

// =========================================================
// Export JSON Files
// =========================================================

logger.title("Exporting JSON Files");

saveJSON("species.json", species);

saveJSON("observations.json", observations);

saveJSON("categories.json", categories);

saveJSON("statistics.json", statistics);

saveJSON("search-index.json", searchIndex);

logger.success("species.json");

logger.success("observations.json");

logger.success("categories.json");

logger.success("statistics.json");

logger.success("search-index.json");

// =========================================================
// Create Report
// =========================================================

const report = [

"============================================",

"CUK BioAtlas Data Conversion Report",

"============================================",

"",

"Excel File",

config.excelFile,

"",

"Sheet",

sheetName,

"",

"Total Observations",

String(observations.length),

"",

"Unique Species",

String(species.length),

"",

"Categories",

String(categories.length),

"",

"Category Summary",

"--------------------------"

];

categories.forEach(cat=>{

    report.push(

        cat.name +

        " : " +

        cat.count

    );

});

report.push("");

report.push("Statistics");

report.push("--------------------------");

report.push(

"Plants : " +

statistics.plants

);

report.push(

"Birds : " +

statistics.birds

);

report.push(

"Insects : " +

statistics.insects

);

report.push(

"Mammals : " +

statistics.mammals

);

report.push(

"Reptiles : " +

statistics.reptiles

);

report.push(

"Amphibians : " +

statistics.amphibians

);

report.push(

"Arachnids : " +

statistics.arachnids

);

report.push(

"Fungi : " +

statistics.fungi

);

report.push(

"Others : " +

statistics.others

);

report.push("");

report.push(

"Generated On"

);

report.push(

new Date().toLocaleString()

);

// =========================================================
// logs Folder
// =========================================================

ensureFolder("logs");

fs.writeFileSync(

path.join(

"logs",

"conversion-report.txt"

),

report.join("\n")

);

logger.success(

"conversion-report.txt"

);

// =========================================================
// Console Summary
// =========================================================

logger.title("Conversion Summary");

console.log();

console.log(

"Species        :",

species.length

);

console.log(

"Observations   :",

observations.length

);

console.log(

"Categories     :",

categories.length

);

console.log();

console.table(categories);

console.log();

logger.success(

"Data Engine Finished Successfully."

);

logger.success(

"Website data generated."

);

logger.success(

"Ready for Frontend."

);

// =========================================================
// End
// =========================================================