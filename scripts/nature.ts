import { Stat } from './stats'

class Nature {
    public modifiers: Array<number>;
    public helps: Stat;
    public hinders: Stat;
    public neutral: boolean;

    constructor(helps: Stat, hinders: Stat) {
        this.neutral = helps == hinders;
        this.modifiers = [1, 1, 1, 1, 1, 1]
        this.modifiers[helps] += 0.1;
        this.modifiers[hinders] -= 0.1;
        if (this.neutral) {
            this.helps = null;
            this.hinders = null;
        } else {
            this.helps = helps;
            this.hinders = hinders;
        }
    }
}

const names = [
    ["Hardy", "Lonely", "Adamant", "Naughty", "Brave"],
    ["Bold", "Docile", "Impish", "Lax", "Relaxed"],
    ["Modest", "Mild", "Bashful", "Rash", "Quiet"],
    ["Calm", "Gentle", "Careful", "Quirky", "Sassy"],
    ["Timid", "Hasty", "Jolly", "Naive", "Serious"]
];

let natures: { [name: string]: Nature } = {};
for (let row = 0; row < 5; ++row) {
    for (let col = 0; col < 5; ++col) {
        let helps = <Stat>(row + 1);
        let hinders = <Stat>(col + 1);
        let name = names[row][col];
        natures[name] = new Nature(helps, hinders);
    }
}

export { natures, Nature }
