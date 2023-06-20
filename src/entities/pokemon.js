class Pokemon {
  constructor(name, types, sprites, height, weight, id, abilities, stats) {
    this.name = name;
    this.types = types.map((type) => type.type.name);
    this.imgUrl = sprites.other.dream_world.front_default
        || sprites.other['official-artwork'].front_default || sprites.front_default;
    this.height = height;
    this.weight = weight;
    this.id = id;
    this.abilities = abilities.map((ability) => ability.ability.name);
    this.stats = stats.map((stat) => ({
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
