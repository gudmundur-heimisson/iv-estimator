import { Stat } from '../scripts/stats'
import { Character, characters } from '../scripts/character'

describe('Character', () => {
    it('Assigns the right stat', () => {
        expect(characters['Loves to eat'].stat).toBe(Stat.HP);
        expect(characters['A little quick tempered'].stat).toBe(Stat.Atk);
        expect(characters['Quick to flee'].stat).toBe(Stat.Spd);
    });
    it('Assigns the right possible values', () => {
        expect(characters['Loves to eat'].possibleValues)
            .toEqual([0, 5, 10, 15, 20, 25, 30]);
        expect(characters['A little quick tempered'].possibleValues)
            .toEqual([2, 7, 12, 17, 22, 27]);
        expect(characters['Quick to flee'].possibleValues)
            .toEqual([4, 9, 14, 19, 24, 29]);
    });
});