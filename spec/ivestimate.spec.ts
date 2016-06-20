import { Pokemon } from '../scripts/pokemon'
import { natures } from '../scripts/nature'
import { characters } from '../scripts/character'
import { Stat } from '../scripts/stats'
import { Interval } from '../scripts/interval'
import { computeStat, adjustForCharacter, estimateIV, estimateIVs } from '../scripts/ivestimate'

describe('IVEstimator', () => {
    let pokemon: { [name: string]: Pokemon };
    let actualIVs: { [name: string]: Array<number> };
    let bestIVEstimates: { [name: string]: Array<Interval> };
    let bestNaiveIVEstimates: { [name: string]: Array<Interval> };
    let bestCharacterAdjustedEstimates: { [name: string]: Interval };

    beforeEach(() => {
        pokemon = {
            'garchomp': new Pokemon(
                [108, 130, 95, 80, 85, 102],
                78,
                natures['Adamant'],
                characters['Highly curious'],
                [289, 279, 192, 135, 171, 171],
                [74, 195, 86, 48, 84, 23])
        };
        actualIVs = { 'garchomp': [24, 12, 30, 16, 23, 5] };
        bestNaiveIVEstimates = {
            'garchomp': [
                new Interval(24, 24),
                new Interval(12, 12),
                new Interval(29, 30),
                new Interval(14, 16),
                new Interval(22, 23),
                new Interval(4, 5)
            ]
        };
        bestCharacterAdjustedEstimates = {
            'garchomp': new Interval(15, 15)
        };
        bestIVEstimates = {};
        for (let name in pokemon) {
            bestIVEstimates[name] = [];
            for (let est of bestNaiveIVEstimates[name]) {
                bestIVEstimates[name].push(est.clone());
            }
            bestIVEstimates[name][pokemon[name].character.stat] = bestCharacterAdjustedEstimates[name];
        }
    });

    describe('computeStat', () => {
        it('computes stats correctly', () => {
            for (let name in pokemon) {
                let poke = pokemon[name];
                let ivs = actualIVs[name];
                for (let i = 0; i < 6; ++i) {
                    expect(computeStat(
                        <Stat>i,
                        ivs[i],
                        poke.baseStats[i],
                        poke.evs[i],
                        poke.level,
                        poke.nature.modifiers[i]
                    )).toEqual(poke.stats[i]);
                }
            }
        });
    });

    describe('estimateIV', () => {
        it('estimates individual IVs correctly', () => {
            for (let name in pokemon) {
                let poke = pokemon[name];
                let ivs = actualIVs[name];
                let ives = bestNaiveIVEstimates[name];
                for (let i = 0; i < 6; ++i) {
                    expect(estimateIV(poke, <Stat>i)).toEqual(ives[i]);
                }
            }
        });
    });

    describe('adjustForCharacter', () => {
        it('adjusts for character correctly', () => {
            for (let name in pokemon) {
                let poke = pokemon[name];
                let ives = bestNaiveIVEstimates[name];
                let cive = ives[poke.character.stat];
                let adjustedIVEst = adjustForCharacter(poke, cive);
                expect(adjustedIVEst).toEqual(new Interval(15, 15));
            }
        });
    });

    describe('estimateIVs', () => {
        it('estimates IVs for a pokemon correctly', () => {
            for (let name in pokemon) {
                let poke = pokemon[name];
                let ives = bestIVEstimates[name];
                expect(estimateIVs(poke)).toEqual(ives);
            }
        });
    });

});
