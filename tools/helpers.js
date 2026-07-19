// =========================================
// Helper Functions
// =========================================

function slugify(text) {
    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function unique(array) {
    return [...new Set(array)];
}

function safe(value, fallback = "") {
    if (value === undefined || value === null)
        return fallback;

    return String(value).trim();
}

function number(value) {
    const n = Number(value);
    return isNaN(n) ? null : n;
}

module.exports = {
    slugify,
    unique,
    safe,
    number
};