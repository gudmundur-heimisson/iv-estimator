import { Stat } from '../scripts/stats'
import { Nature, natures } from '../scripts/nature'

describe('Nature', () => {
    it('non-neutral helps/hinders', () => {
        let nat = new Nature(Stat.Atk, Stat.Def);
        expect(nat.neutral).toBe(false);
        expect(nat.helps).toBe(Stat.Atk);
        expect(nat.hinders).toBe(Stat.Def);
    });
    it('neutral nature does not help/hinder', () => {
        let nat = new Nature(Stat.Atk, Stat.Atk);
        expect(nat.neutral).toBe(true);
        expect(nat.helps).toBeNull();
        expect(nat.hinders).toBeNull();
    });
    it('non-neutral modifiers', () => {
        let nat = new Nature(Stat.Atk, Stat.Def);
        expect(nat.modifiers).toEqual([1, 1.1, 0.9, 1, 1, 1]);
    });
    it('neutral modifiers', () => {
        let nat = new Nature(Stat.Atk, Stat.Atk);
        expect(nat.modifiers).toEqual([1, 1, 1, 1, 1, 1]);
    });
});

describe('natures', () => {
    it('neutral nature', () => {
        let nat = natures['Docile'];
        expect(nat.neutral).toBe(true);
        expect(nat.helps).toBeNull();
        expect(nat.hinders).toBeNull();
        expect(nat.modifiers).toEqual([1, 1, 1, 1, 1, 1]);
    });
    it('non-neutral nature', () => {
        let nat = natures['Bold'];
        expect(nat.neutral).toBe(false);
        expect(nat.helps).toBe(Stat.Def);
        expect(nat.hinders).toBe(Stat.Atk);
        expect(nat.modifiers).toEqual([1, 0.9, 1.1, 1, 1, 1]);
    });
});
