// ======================================================
// CUK Biodiversity Portal
// species.js
// Part 1 - Foundation
// ======================================================

// -------------------------------
// Global Variables
// -------------------------------

let allSpecies = [];
let allObservations = [];
let currentSpecies = null;
let map = null;

// -------------------------------
// Start Application
// -------------------------------

document.addEventListener("DOMContentLoaded", init);

async function init() {

    showLoader();

    try {

        await loadData();

        const slug = getSlug();

        if (!slug) {
            throw new Error("No species selected.");
        }

        currentSpecies = allSpecies.find(
            species => species.slug === slug
        );

        if (!currentSpecies) {
            throw new Error("Species not found.");
        }

    renderHero();

await loadSpeciesInformation();

renderGallery();
renderStatsChart(); // <-- Add this new call here
initializeMap();

renderObservationTable();

renderSimilarSpecies();

hideLoader();

    } catch (error) {

        console.error(error);

        hideLoader();

        showError(error.message);

    }

}

// ======================================================
// Gallery
// ======================================================

function renderGallery() {

    const gallery = document.getElementById("gallery");

    if (!gallery) return;

    gallery.innerHTML = "";

    const images = currentSpecies.gallery || [];

    if (images.length === 0) {

        gallery.innerHTML = `
            <div class="col-12">

                <div class="alert alert-warning">

                    No photos available.

                </div>

            </div>
        `;

        return;
    }

    images.forEach(image => {

        gallery.innerHTML += `

        <div class="col-lg-3 col-md-4 col-sm-6">

            <img
                src="${image}"
                alt="${currentSpecies.commonName}"
                loading="lazy"
                class="gallery-image img-fluid"
                onclick="openImage('${image}')">

        </div>

        `;

    });

}
// ======================================================
// Image Viewer
// ======================================================

function openImage(image) {

    const modalImage =
        document.getElementById("modalImage");

    if (!modalImage) return;

    modalImage.src = image;

    const modal =
        new bootstrap.Modal(
            document.getElementById("imageModal")
        );

    modal.show();

}
// ======================================================
// Leaflet Map
// ======================================================

function initializeMap() {

    const mapContainer = document.getElementById("map");

    if (!mapContainer) return;

    // Destroy previous map
    if (map !== null) {

        map.remove();

        map = null;

    }

    map = L.map("map");

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            attribution:
                "&copy; OpenStreetMap contributors",

            maxZoom:19

        }

    ).addTo(map);

    const coordinates =
        currentSpecies.coordinates || [];

    if (coordinates.length === 0) {

        map.setView([17.458,76.868],16);

        return;

    }

    const bounds = [];

    coordinates.forEach(location=>{

        if(
            location.latitude==null ||
            location.longitude==null
        ) return;

        L.marker([

            location.latitude,
            location.longitude

        ])

        .addTo(map)

        .bindPopup(

            `<strong>${currentSpecies.commonName}</strong><br>

            <em>${currentSpecies.scientificName}</em>`

        );

        bounds.push([

            location.latitude,
            location.longitude

        ]);

    });

    if(bounds.length===1){

        map.setView(bounds[0],18);

    }

    else if(bounds.length>1){

        map.fitBounds(bounds,{
            padding:[40,40]
        });

    }

}
// ======================================================
// Observation History
// ======================================================

function renderObservationTable() {

    const table = document.getElementById("observationTable");

    if (!table) return;

    table.innerHTML = "";

    const observationIds = currentSpecies.observations || [];

    if (observationIds.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="5" class="text-center">

                No observations available.

            </td>

        </tr>

        `;

        return;

    }

    const observations = allObservations.filter(observation =>

        observationIds.includes(observation.id)

    );

    if (observations.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="5" class="text-center">

                No observation data found.

            </td>

        </tr>

        `;

        return;

    }

    observations.forEach(observation => {

        table.innerHTML += `

        <tr>

            <td>

                ${formatDate(observation.date)}

            </td>

            <td>

                ${observation.observer || "-"}

            </td>

            <td>

                ${observation.latitude ?? "-"}

            </td>

            <td>

                ${observation.longitude ?? "-"}

            </td>

            <td>

                <a

                    href="${observation.iNaturalist || "#"}"

                    target="_blank"

                    class="btn btn-success btn-sm">

                    View

                </a>

            </td>

        </tr>

        `;

    });

}
// ======================================================
// Similar Species
// ======================================================

function renderSimilarSpecies() {

    const container = document.getElementById("similarSpecies");

    if (!container) return;

    container.innerHTML = "";

    const similar = allSpecies.filter(species => {

        return (
            species.category === currentSpecies.category &&
            species.slug !== currentSpecies.slug
        );

    }).slice(0, 4);

    if (similar.length === 0) {

        container.innerHTML = `

        <div class="col-12">

            <div class="alert alert-secondary text-center">

                No similar species found.

            </div>

        </div>

        `;

        return;

    }

    similar.forEach(species => {

        container.innerHTML += `

        <div class="col-lg-3 col-md-6">

            <div class="card similar-card h-100 shadow-sm">

                <img
                    src="${species.thumbnail}"
                    class="card-img-top"
                    loading="lazy"
                    alt="${species.commonName}">

                <div class="card-body">

                    <span class="badge bg-success mb-2">

                        ${species.category}

                    </span>

                    <h5>

                        ${species.commonName}

                    </h5>

                    <p class="text-muted">

                        <i>${species.scientificName}</i>

                    </p>

                    <a

                        href="species.html?slug=${species.slug}"

                        class="btn btn-success btn-sm mt-2">

                        View Details

                    </a>

                </div>

            </div>

        </div>

        `;

    });

}
// -------------------------------
// Load JSON Files
// -------------------------------

async function loadData() {

    const [speciesResponse, observationResponse] =
        await Promise.all([

            fetch("../data/species.json"),
            fetch("../data/observations.json")

        ]);

    if (!speciesResponse.ok) {
        throw new Error("Unable to load species.json");
    }

    if (!observationResponse.ok) {
        throw new Error("Unable to load observations.json");
    }

    allSpecies = await speciesResponse.json();
    allObservations = await observationResponse.json();

}

// -------------------------------
// Get URL Slug
// Example:
// species.html?slug=delonix-regia
// -------------------------------

function getSlug() {

    const params = new URLSearchParams(window.location.search);

    return params.get("slug");

}

// -------------------------------
// Render Hero Section
// -------------------------------

function renderHero() {

    document.title =
        `${currentSpecies.commonName} | CUK Biodiversity Portal`;

    document.getElementById("speciesImage").src =
        currentSpecies.thumbnail || "";

    document.getElementById("speciesImage").alt =
        currentSpecies.commonName || "";

    document.getElementById("commonName").textContent =
        currentSpecies.commonName || "Unknown Species";

    document.getElementById("scientificName").textContent =
        currentSpecies.scientificName || "";

    document.getElementById("categoryBadge").textContent =
        currentSpecies.category || "Unknown";

    document.getElementById("observationCount").textContent =
        currentSpecies.observationCount || 0;

    document.getElementById("contributorsCount").textContent =
        currentSpecies.contributors?.length || 0;

    document.getElementById("galleryCount").textContent =
        currentSpecies.gallery?.length || 0;

    document.getElementById("description").textContent =
        currentSpecies.description ||
        "No description available for this species.";

    document.getElementById("firstObserved").textContent =
        formatDate(currentSpecies.firstObserved);

    document.getElementById("lastObserved").textContent =
        formatDate(currentSpecies.lastObserved);

    document.getElementById("inatLink").href =
        currentSpecies.iNaturalist || "#";

}

// -------------------------------
// Format Date
// -------------------------------

function formatDate(dateString) {

    if (!dateString) return "-";

    const date = new Date(dateString);

    if (isNaN(date)) return dateString;

    return date.toLocaleDateString("en-IN", {

        day: "numeric",
        month: "long",
        year: "numeric"

    });

}

// -------------------------------
// Loader
// -------------------------------

function showLoader() {

    if (document.getElementById("pageLoader")) return;

    document.body.insertAdjacentHTML(

        "afterbegin",

        `
        <div id="pageLoader"
             class="d-flex justify-content-center align-items-center"
             style="
                position:fixed;
                inset:0;
                background:white;
                z-index:99999;">

            <div class="loader"></div>

        </div>
        `

    );

}

function hideLoader() {

    document.getElementById("pageLoader")?.remove();

}

// -------------------------------
// Error Screen
// -------------------------------

function showError(message) {

    document.body.innerHTML = `

    <div class="container py-5 text-center">

        <h1 class="display-4 text-danger">
            Species Not Found
        </h1>

        <p class="lead mt-3">
            ${message}
        </p>

        <a href="../index.html"
           class="btn btn-success mt-4">
            Return Home
        </a>

    </div>

    `;

}
// =======================================================
// Load Species Information
// =======================================================

async function loadSpeciesInformation() {

    const scientificName =
        currentSpecies.scientificName;

    if (!scientificName) return;

    const pageName =
        scientificName.replace(/\s+/g, "_");

    try {

        const response =
            await fetch(

`https://en.wikipedia.org/api/rest_v1/page/summary/${pageName}`

            );

        if (!response.ok)
            throw new Error();

        const wiki =
            await response.json();
            

        if (wiki.extract) {

            document.getElementById(
                "description"
            ).textContent = wiki.extract;

        }

        document.getElementById(
            "wikiLink"
        ).href = wiki.content_urls.desktop.page;
        await loadGBIFTaxonomy(scientificName);

    }

    catch {

        document.getElementById(
            "description"
        ).textContent =

        "No description available.";

    }

}
// =======================================================
// Load Taxonomy from GBIF
// =======================================================

async function loadGBIFTaxonomy(scientificName) {

    try {

        const response = await fetch(

            `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}`

        );

        if (!response.ok)
            throw new Error();

        const data = await response.json();

        document.getElementById("kingdom").textContent =
            data.kingdom || "-";

        document.getElementById("family").textContent =
            data.family || "-";

        document.getElementById("genus").textContent =
            data.genus || "-";

    }

    catch (error) {

        console.error("GBIF Error:", error);

    }

}
// ======================================================
// Observation Charts (Chart.js)
// ======================================================

let statsPieChart = null; // Global instance to track chart resets

function renderStatsChart() {
    const canvas = document.getElementById("observationPieChart");
    if (!canvas) return;

    // Destroy old instance if it exists to avoid hover glitches
    if (statsPieChart !== null) {
        statsPieChart.destroy();
    }

    const observationIds = currentSpecies.observations || [];
    const observations = allObservations.filter(obs => observationIds.includes(obs.id));

    if (observations.length === 0) {
        // If no data, show text fallback instead of an empty space
        canvas.parentNode.innerHTML = `<p class="text-muted small">No chart data available</p>`;
        return;
    }

    // Process data logic: Count occurrences per Observer
    const observerCounts = {};
    observations.forEach(obs => {
        const name = obs.observer || "Anonymous";
        observerCounts[name] = (observerCounts[name] || 0) + 1;
    });

    const labels = Object.keys(observerCounts);
    const dataValues = Object.values(observerCounts);

    // Beautiful iNaturalist-inspired earthy palette colors
    const backgroundColors = [
        '#198754', // Success green
        '#20c997', // Teal
        '#ffc107', // Warning yellow
        '#0d6efd', // Primary blue
        '#6c757d', // Muted gray
        '#fd7e14'  // Orange
    ];

    // Initialize Chart.js configuration
    statsPieChart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return ` ${label}: ${value} obs.`;
                        }
                    }
                }
            }
        }
    });
}