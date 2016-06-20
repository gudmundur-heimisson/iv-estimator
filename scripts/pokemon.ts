import { Nature } from './nature'
import { Character } from './character'

class Pokemon {
    public baseStats: Array<number>;
    public level: number;
    public nature: Nature;
    public character: Character;
    public stats: Array<number>;
    public evs: Array<number>;

    constructor(baseStats: Array<number>, level: number, nature: Nature,
        character: Character, stats: Array<number>, evs: Array<number>) {
        this.baseStats = baseStats;
        this.level = level;
        this.nature = nature;
        this.character = character;
        this.stats = stats;
        this.evs = evs;
    }
}

export { Pokemon }