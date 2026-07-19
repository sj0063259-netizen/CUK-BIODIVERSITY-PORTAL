// =========================================
// CUK BioAtlas
// Dynamic Navbar Loader
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.getElementById("navbar");

    if (!navbar) return;

    // Detect current folder
    const isInsidePages = window.location.pathname.includes("/pages/");

    // Correct path to navbar.html
    const navbarPath = isInsidePages
        ? "../components/navbar.html"
        : "components/navbar.html";

    fetch(navbarPath)

        .then(response => {

            if (!response.ok)
                throw new Error("Navbar could not be loaded.");

            return response.text();

        })

        .then(data => {

            navbar.innerHTML = data;

            fixNavigationLinks(isInsidePages);

            highlightCurrentPage();

        })

        .catch(error => console.error(error));

});

// =========================================
// Fix Navigation Links
// =========================================

function fixNavigationLinks(isInsidePages) {

    document.querySelectorAll(".nav-link").forEach(link => {

        let href = link.getAttribute("href");

        if (!href) return;

        if (isInsidePages) {

            // Home
            if (href === "index.html") {

                link.setAttribute("href", "../index.html");

            }

            // Pages
            else if (href.startsWith("pages/")) {

                link.setAttribute(
                    "href",
                    href.replace("pages/", "")
                );

            }

        }

    });

}

// =========================================
// Highlight Active Link
// =========================================

function highlightCurrentPage() {

    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-link").forEach(link => {

        let href = link.getAttribute("href");

        href = href.split("/").pop();

        if (href === currentPage) {

            link.classList.add("active");

        }

    });

}