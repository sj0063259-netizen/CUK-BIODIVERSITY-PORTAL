// =======================================
// CUK BioAtlas - Fauna Explorer
// =======================================

const DATA_URL = "../data/species.json";
const ITEMS_PER_PAGE = 12;

let allFauna = [];
let filteredFauna = [];
let currentPage = 1;
let currentCategory = "All";

// DOM Elements
const speciesContainer = document.getElementById("speciesContainer");
const searchInput = document.getElementById("searchInput");

const totalSpecies = document.getElementById("totalSpecies");
const totalObservations = document.getElementById("totalObservations");
const contributors = document.getElementById("contributors");

const pagination = document.getElementById("pagination");

const filterButtons = document.querySelectorAll(".filter-buttons button");

// =======================================
// Initialize
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    loadFauna();

});

// =======================================
// Load JSON
// =======================================

async function loadFauna() {

    try {

        speciesContainer.innerHTML = `
        <div class="loading">
            Loading Fauna...
        </div>
        `;

        const response = await fetch(DATA_URL);

        const data = await response.json();

        // Remove Plants

        allFauna = data.filter(species => species.category !== "Plants");

        filteredFauna = [...allFauna];

        updateStatistics();

        renderPage();

    } catch (error) {

        console.error(error);

        speciesContainer.innerHTML = `
        <div class="no-results">
            <h3>Unable to load fauna data.</h3>
        </div>
        `;

    }

}

// =======================================
// Statistics
// =======================================

function updateStatistics() {

    totalSpecies.textContent = filteredFauna.length;

    let observationTotal = 0;

    const users = new Set();

    filteredFauna.forEach(species => {

        observationTotal += species.observationCount || 0;

        if (species.contributors) {

            species.contributors.forEach(user => users.add(user));

        }

    });

    totalObservations.textContent = observationTotal;

    contributors.textContent = users.size;

}

// =======================================
// Render Cards
// =======================================

function renderPage() {

    speciesContainer.innerHTML = "";

    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    const end = start + ITEMS_PER_PAGE;

    const pageItems = filteredFauna.slice(start, end);

    if (pageItems.length === 0) {

        speciesContainer.innerHTML = `
        <div class="no-results">

            <i class="fa-solid fa-paw"></i>

            <h3>No Species Found</h3>

        </div>
        `;

        renderPagination();

        return;

    }

    pageItems.forEach(species => {

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
src="${species.thumbnail || "../assets/images/no-image.png"}"
alt="${species.commonName || "Unknown"}">

<div class="species-body">

<div class="species-name">

${species.commonName || "Unknown"}

</div>

<div class="scientific-name">

${species.scientificName || ""}

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

${species.contributors ? species.contributors.length : 0}

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

    const totalPages = Math.ceil(filteredFauna.length / ITEMS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `

<li class="page-item ${i === currentPage ? "active" : ""}">

<a href="#"

class="page-link"

onclick="changePage(${i})">

${i}

</a>

</li>

`;

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

searchInput.addEventListener("keyup", applyFilters);

// =======================================
// Category Filters
// =======================================

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentCategory = button.dataset.filter;

        currentPage = 1;

        applyFilters();

    });

});

// =======================================
// Apply Search + Category
// =======================================

function applyFilters() {

    const keyword = searchInput.value.toLowerCase();

    filteredFauna = allFauna.filter(species => {

        const matchesCategory =

            currentCategory === "All"

            ||

            species.category === currentCategory;

        const matchesSearch =

            (species.commonName || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (species.scientificName || "")
            .toLowerCase()
            .includes(keyword);

        return matchesCategory && matchesSearch;

    });

    updateStatistics();

    renderPage();

}

// =======================================
// Open Species
// =======================================

function openSpecies(slug) {

    window.location.href = `species.html?slug=${slug}`;

}