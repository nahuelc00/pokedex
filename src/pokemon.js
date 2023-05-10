const infoUrl = {
    urlInitial: `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20`,
    url: `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20`,
    page: ""
};

function getPokemons() {
    return fetch(infoUrl.url)
        .catch("Failed to fetch pokemons")
        .then((data) => {
            return data.json();
        })
        .then((data) => {
            infoUrl.page === "next" ? (infoUrl.url = data.next) : "";

            if (infoUrl.page === "previous" && infoUrl.url === infoUrl.urlInitial) {
                infoUrl.url = infoUrl.urlInitial;
            } else if (infoUrl.page === "previous") {
                infoUrl.url = data.previous;
            }

        }).then(() => {
            return fetch(infoUrl.url).then((data) => {
                return data.json();
            }).then((data) => {
                return {
                    pokemons: data.results,
                }
            })
        });
}

function getInfoPokemon(urlOfPokemon) {
    return fetch(urlOfPokemon)
        .catch("Failed to fetch info of pokemon")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return data;
        });
}

function getHabitatPokemon(pokemonName) {
    return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
        .catch("Failed to fetch habitat of pokemon")
        .then((response) => {
            return response.json()
        }).then((data) => {
            return { habitat: data.habitat.name };
        })
}

function getEggGroupsPokemon(pokemonName) {
    return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
        .catch("Failed to fetch egg group of pokemon")
        .then((response) => {
            return response.json()
        }).then((data) => {
            const eggGroups = [];
            data.egg_groups.map((eggGroup) => {
                eggGroups.push(eggGroup.name);
            })
            return { eggGroups: eggGroups };
        })
}

export { getPokemons, getInfoPokemon, getHabitatPokemon, getEggGroupsPokemon }
export { infoUrl }