document.addEventListener("DOMContentLoaded", () => {

    const footer = document.getElementById("footer");

    if (!footer) return;

    fetch("components/footer.html")
        .then(response => response.text())
        .then(data => {

            footer.innerHTML = data;

        });

});