document.addEventListener("DOMContentLoaded", () => {

    const footer = document.getElementById("footer");

    if (!footer) return;

    const isInsidePages = window.location.pathname.includes("/pages/");

    const footerPath = isInsidePages
        ? "../components/footer.html"
        : "components/footer.html";

    fetch(footerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error("Footer not found");
            }
            return response.text();
        })
        .then(data => {

            footer.innerHTML = data;

            // Fix all footer links
            const links = footer.querySelectorAll("a");

            links.forEach(link => {

                let href = link.getAttribute("href");

                if (!href) return;

                // Ignore external links and anchors
                if (href.startsWith("http") || href.startsWith("#"))
                    return;

                if (isInsidePages) {

                    if (href.startsWith("pages/")) {
                        link.setAttribute("href", href.replace("pages/", ""));
                    }

                }

            });

        })
        .catch(error => console.error(error));

});