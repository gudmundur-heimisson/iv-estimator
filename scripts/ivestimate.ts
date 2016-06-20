import { Pokemon } from './pokemon'
import { Stat } from './stats'
import { Interval } from './interval'

function computeStat(stat: Stat, iv: number, base: number, ev: number, level: number, natureMod: number) {
    let c = stat === Stat.HP ? level + 10 : 5;
    return Math.floor(natureMod * Math.floor(level * (iv + 2 * base + Math.floor(ev / 4)) / 100 + c));
}

function estimateIV(pokemon: Pokemon, stat: Stat): Interval {
    // Aliasing for terseness
    let level = pokemon.level;
    let base = pokemon.baseStats[stat];
    let s = pokemon.stats[stat];
    let ev = pokemon.evs[stat];
    let n = pokemon.nature.modifiers[stat];
    // Done aliasing
    let b = 2 * pokemon.baseStats[stat];
    let c = stat === Stat.HP ? level + 10 : 5;
    let e = Math.floor(ev / 4);
    let ivEst = new Interval(null, null);
    let lower = (100 / level) * (s / n - c) - b - e;
    let upper = lower + 99 / level;
    if (n != 1.0) {
        upper += 90 / (level * n);
    }
    let l = Math.max(Math.ceil(lower), 0);
    let u = Math.min(Math.floor(upper), 31);
    if (l <= u && l >= 0 && l <= 31 && u >= 0 && u <= 31) {
        let min = Infinity;
        let max = -Infinity;
        for (let j = 0; j <= u - l; ++j) {
            let iv = l + j;
            if (s == computeStat(stat, iv, base, ev, level, n)) {
                if (iv < min) {
                    min = iv;
                }
                if (iv > max) {
                    max = iv;
                }
            }
        }
        if (!(min == Infinity || max == -Infinity)) {
            [ivEst.lower, ivEst.upper] = [min, max];
        }
    }
    return ivEst;
}

function adjustForCharacter(pokemon: Pokemon, estimate: Interval): Interval {
    // Initialize modified estimate with maximal range allowed by characteristic
    let charVals = pokemon.character.possibleValues;
    let [charValsMin, charValsMax] = [charVals[0], charVals[charVals.length - 1]]
    let boundedEst = new Interval(charValsMin, charValsMax);
    // Find maximal characteristic IV range within naive estimate
    let charIVEst = boundedEst.intersect(estimate);
    if (!charIVEst.hasNull()) {
        for (let i = 1; i < 6; ++i) {
            // Left bound
            let cLower = charIVEst.lower;
            let bLower = boundedEst.lower;
            if (bLower >= cLower) {
                charIVEst.lower = bLower;
            } else {
                let nextLower = charVals[i];
                boundedEst.lower = Math.max(nextLower, boundedEst.lower);
            }
            // Right bound
            let cUpper = charIVEst.upper;
            let bUpper = boundedEst.upper;
            if (bUpper <= cUpper) {
                charIVEst.upper = bUpper;
            } else {
                let nextUpper = charVals[charVals.length - (i + 1)];
                boundedEst.upper = Math.min(nextUpper, boundedEst.upper);
            }
        }
    }
    return boundedEst;
}

function estimateIVs(pokemon: Pokemon): Array<Interval> {
    let intervals: Array<Interval> = [];
    for (let i = 0; i < 6; ++i) {
        intervals[i] = estimateIV(pokemon, <Stat>i);
    }
    if (pokemon.character != null) {
        let charIVStat = pokemon.character.stat;
        let charIVEst = intervals[charIVStat];
        intervals[charIVStat] = adjustForCharacter(pokemon, charIVEst);
    }
    return intervals;
}

export { estimateIVs, computeStat, estimateIV, adjustForCharacter }
