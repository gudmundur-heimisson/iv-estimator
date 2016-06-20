export class Interval {
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

    public in(item: number): boolean {
        return (item <= this.upper) && (item >= this.lower);
    }

    public range(): number {
        return this.upper - this.lower;
    }

    public hasNull(): boolean {
        return (this.lower === null) || (this.upper === null);
    }

    public clone(): Interval {
        return new Interval(this.lower, this.upper);
    }
}