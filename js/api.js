export async function loadSpecies() {

    const response = await fetch("../data/species.json");

    return await response.json();

}