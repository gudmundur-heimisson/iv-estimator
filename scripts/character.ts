import { Stat } from './stats'

class Character {
    public stat: Stat;
    public possibleValues: Array<number>;

    constructor(stat: Stat, possibleValues: Array<number>) {
        this.stat = stat;
        this.possibleValues = possibleValues;
    }
}

const descriptions = [
    [
        "Loves to eat", "Proud of its power",
        "Sturdy body", "Highly curious",
        "Strong willed", "Likes to run"
    ],
    [
        "Takes plenty of siestas", "Likes to thrash about",
        "Capable of taking hits", "Mischievous",
        "Somewhat vain", "Alert to sounds"
    ],
    [
        "Nods off a lot", "A little quick tempered",
        "Highly persistent", "Thoroughly cunning",
        "Strongly defiant", "Impetuous and silly"
    ],
    [
        "Scatters things often", "Likes to fight",
        "Good endurance", "Often lost in thought",
        "Hates to lose", "Somewhat of a clown"
    ],
    [
        "Likes to relax", "Quick tempered",
        "Good perseverance", "Very finicky",
        "Somewhat stubborn", "Quick to flee"
    ]
];

let characters: { [description: string]: Character } = {};
for (let row = 0; row < 5; ++row) {
    let possibleValues: Array<number> = [];
    for (let iv = row; iv < 32; iv += 5) {
        possibleValues.push(iv);
    }
    for (let col = 0; col < 6; ++col) {
        let stat = <Stat>col;
        let description = descriptions[row][col];
        characters[description] = new Character(stat, possibleValues);
    }
}

export { Character, characters }