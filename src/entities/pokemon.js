class Pokemon {
  constructor(pokemonData) {
    this.name = pokemonData.name;
    this.types = pokemonData.types.map((type) => type.type.name);
    this.imgUrl = pokemonData.sprites.other.dream_world.front_default
        || pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default;
    this.height = pokemonData.height;
    this.weight = pokemonData.weight;
    this.id = pokemonData.id;
    this.abilities = pokemonData.abilities.map((ability) => ability.ability.name);
    this.stats = pokemonData.stats.map((stat) => ({
      name: stat.stat.name,
      base_stat: stat.base_stat,
    }));
  }

  setHabitat(habitat) {
    this.habitat = habitat;
  }

  setEggGroups(eggGroups) {
    this.eggGroups = eggGroups;
  }
}

export { Pokemon };
