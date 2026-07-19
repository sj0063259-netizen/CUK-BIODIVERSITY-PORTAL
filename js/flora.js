// =======================================
// CUK BioAtlas - Flora Explorer
// =======================================

const DATA_URL = "../data/species.json";

const ITEMS_PER_PAGE = 12;

let allPlants = [];
let filteredPlants = [];
let currentPage = 1;

// DOM Elements

const speciesContainer = document.getElementById("speciesContainer");

const searchInput = document.getElementById("searchInput");

const totalSpecies = document.getElementById("totalSpecies");

const totalObservations = document.getElementById("totalObservations");

const contributors = document.getElementById("contributors");

const pagination = document.getElementById("pagination");

// =======================================
// Initialize
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    loadPlants();

});

// =======================================
// Load JSON
// =======================================

async function loadPlants() {
console.log("Plants:", allPlants.length);
console.log("Filtered:", filteredPlants.length);
console.log("Pages:", Math.ceil(filteredPlants.length / ITEMS_PER_PAGE));
    try {

        speciesContainer.innerHTML = `
            <div class="loading">
                Loading Flora...
            </div>
        `;

        const response = await fetch(DATA_URL);

        const data = await response.json();

        // Filter Plants

        allPlants = data.filter(species =>
            species.category === "Plants"
        );

        filteredPlants = [...allPlants];

        updateStatistics();

        renderPage();

    }

    catch (error) {

        console.error(error);

        speciesContainer.innerHTML = `
            <div class="no-results">
                <h3>Unable to load plant data.</h3>
            </div>
        `;

    }

}

// =======================================
// Statistics
// =======================================

function updateStatistics() {

    totalSpecies.textContent = filteredPlants.length;

    let observations = 0;

    const users = new Set();

    filteredPlants.forEach(species => {

        observations += species.observationCount || 0;

        if (species.contributors) {

            species.contributors.forEach(user => users.add(user));

        }

    });

    totalObservations.textContent = observations;

    contributors.textContent = users.size;

}

// =======================================
// Render Current Page
// =======================================

function renderPage() {

    speciesContainer.innerHTML = "";

    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    const end = start + ITEMS_PER_PAGE;

    const currentPlants = filteredPlants.slice(start, end);

    if (currentPlants.length === 0) {

        speciesContainer.innerHTML = `
            <div class="no-results">

                <i class="fa-solid fa-leaf"></i>

                <h3>No Plants Found</h3>

            </div>
        `;

        return;

    }

    currentPlants.forEach(species => {

        speciesContainer.innerHTML += createCard(species);

    });

    renderPagination();

}

// =======================================
// Species Card
// =======================================

function createCard(species) {

    return `

<div class="col-lg-4 col-md-6">

<div class="species-card">

<img
class="species-image"
src="${species.thumbnail || '../assets/images/no-image.png'}"
alt="${species.commonName}"
>

<div class="species-body">

<div class="species-name">

${species.commonName || "Unknown"}

</div>

<div class="scientific-name">

${species.scientificName}

</div>

<div class="category-badge">

${species.category}

</div>

<div class="species-info">

<span>

<i class="fa-solid fa-camera"></i>

${species.observationCount || 0}

</span>

<span>

<i class="fa-solid fa-user"></i>

${species.contributors ?
species.contributors.length : 0}

</span>

</div>

<button
class="details-btn"
onclick="openSpecies('${species.slug}')">

View Details

</button>

</div>

</div>

</div>

`;

}

// =======================================
// Pagination
// =======================================

function renderPagination() {

    if (!pagination) return;

    pagination.innerHTML = "";

    const totalPages = Math.ceil(filteredPlants.length / ITEMS_PER_PAGE);

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {

        const li = document.createElement("li");

        li.className = `page-item ${i === currentPage ? "active" : ""}`;

        const btn = document.createElement("button");

        btn.className = "page-link";

        btn.textContent = i;

        btn.addEventListener("click", () => {

            changePage(i);

        });

        li.appendChild(btn);

        pagination.appendChild(li);

    }

}
// =======================================
// Change Page
// =======================================

function changePage(page) {

    currentPage = page;

    renderPage();

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// =======================================
// Search
// =======================================

searchInput.addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    filteredPlants = allPlants.filter(species =>

        (species.commonName || "")
        .toLowerCase()
        .includes(keyword)

        ||

        (species.scientificName || "")
        .toLowerCase()
        .includes(keyword)

    );

    currentPage = 1;

    updateStatistics();

    renderPage();

});

// =======================================
// Open Species
// =======================================

function openSpecies(slug) {

    window.location.href =
        `species.html?slug=${slug}`;

}