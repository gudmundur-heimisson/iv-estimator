import { Interval } from '../scripts/interval'

describe('Interval', () => {
    let ive0: Interval, ive1: Interval, ive2: Interval, ive3: Interval, ive4: Interval;

    beforeEach(() => {
        ive0 = new Interval(null, null);
        ive1 = new Interval(0.5, 1);
        ive2 = new Interval(-1, -0.5);
        ive3 = new Interval(-0.75, 0.75);
        ive4 = new Interval(-1, 1);
    });

    it('is entirely contained', () => {
        expect(ive3.intersect(ive4)).toEqual(ive3);
        expect(ive4.intersect(ive3)).toEqual(ive3);
    });

    it('is entirely disjunct', () => {
        expect(ive1.intersect(ive2)).toEqual(ive0);
        expect(ive2.intersect(ive1)).toEqual(ive0);
    });

    it('intersects on the left', () => {
        expect(ive2.intersect(ive4)).toEqual(ive2);
        expect(ive4.intersect(ive2)).toEqual(ive2);
    });

    it('intersects on the right', () => {
        expect(ive1.intersect(ive4)).toEqual(ive1);
        expect(ive4.intersect(ive1)).toEqual(ive1);
    });
});
