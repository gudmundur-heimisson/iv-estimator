import { Pokemon } from './pokemon'
import { Stat } from './stats'

class Interval {
    public lower: number;
    public upper: number;

    constructor(bound1: number, bound2: number) {
        if (bound1 == null || bound2 == null) {
            this.lower = null;
            this.upper = null;
        } else {
            this.lower = bound1 < bound2 ? bound1 : bound2;
            this.upper = bound1 > bound2 ? bound1 : bound2;
        }
    }

    public intersect(other: Interval): Interval {
        let left = this;
        let right = other;
        let join = new Interval(null, null);
        if (!(left.hasNull() || right.hasNull())) {
            if (!(left.upper < right.lower || left.lower > right.upper)) {
                join.lower = left.lower >= right.lower ? left.lower : right.lower;
                join.upper = left.upper >= right.upper ? right.upper : left.upper;
            }
        }
        return join;
    }

    public range(): number {
        return this.upper - this.lower;
    }

    public hasNull(): boolean {
        return (this.lower === null) || (this.upper === null);
    }
}

class IVEstimator {
    private pokemon: Pokemon;

    constructor(pokemon: Pokemon) {
        this.pokemon = pokemon;
    }

    public static computeStat(iv: number, base: number, ev: number,
        level: number, natureMod: number, isHP: boolean) {
        let c = isHP ? level + 10 : 5;
        return Math.floor(natureMod * Math.floor(level * (iv + 2 * base + Math.floor(ev / 4)) / 100 + c));
    }

    public static estimateIV(level: number, base: number, stat: number, ev: number,
        natureMod: number, isHP: boolean) {
        let ivEst = new Interval(null, null);
        let c = isHP ? level + 10 : 5;
        let [s, n] = [stat, natureMod];
        let b = 2 * base;
        let e = Math.floor(ev / 4);
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
                if (s == IVEstimator.computeStat(iv, base, ev, level, n, isHP)) {
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

    public static adjustCharacterInterval(pokemon: Pokemon, Intervals: Array<Interval>): Array<Interval> {
        // Adjust characteristic IV
        let charIVEst = Intervals[pokemon.character.stat];
        // Initialize modified estimate with maximal range allowed by characteristic
        let charVals = pokemon.character.possibleValues;
        let [charValsMin, charValsMax] = [charVals[0], charVals[charVals.length - 1]]
        let boundedEst = new Interval(charValsMin, charValsMax);
        // Find maximal characteristic IV range within naive estimate
        charIVEst = boundedEst.intersect(charIVEst);
        if (!charIVEst.hasNull()) {
            for (let i = 1; i < 6; ++i) {
                // Left bound
                let cLower = charIVEst.lower;
                let bLower = boundedEst.lower;
                if (bLower >= cLower) {
                    charIVEst.lower = bLower;
                } else {
                    boundedEst.lower = charVals[i];
                }
                // Right bound
                let cUpper = charIVEst.upper;
                let bUpper = boundedEst.upper;
                if (bUpper <= cUpper) {
                    charIVEst.upper = bUpper;
                } else {
                    boundedEst.upper = charVals[i];
                }
            }
        }
        Intervals[pokemon.character.stat] = charIVEst;
        return Intervals;
    }

    public estimateIVs(): Array<Interval> {
        let Intervals: Array<Interval> = [null, null, null, null, null, null];
        for (let i = 0; i < 6; ++i) {
            Intervals[i] = this.estimateIV(<Stat>i);
        }
        return IVEstimator.adjustCharacterInterval(this.pokemon, Intervals);
    }

    private computeStat(stat: Stat, iv: number) {
        return IVEstimator.computeStat(
            iv,
            this.pokemon.baseStats[stat],
            this.pokemon.evs[stat],
            this.pokemon.level,
            this.pokemon.nature.modifiers[stat],
            stat == Stat.HP
        );
    }

    private estimateIV(stat: Stat) {
        return IVEstimator.estimateIV(
            this.pokemon.level,
            this.pokemon.baseStats[stat],
            this.pokemon.stats[stat],
            this.pokemon.evs[stat],
            this.pokemon.nature.modifiers[stat],
            stat == Stat.HP
        );
    }
}

export { IVEstimator, Interval }
