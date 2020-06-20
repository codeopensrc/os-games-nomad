"use strict";

const itemScale = 1.05;
// const startAmount = 60;


class Mat {
    constructor({main, color, calcCost, active = false, level = 1, amount = 500,
    fixedAmount = 4, tickAmount = 4, perTickReduction = () => {}} = {}) {
        this.Main = main;
        this.Level = level;
        this.Amount = amount;
        this.FixedAmount = fixedAmount;
        this.TickAmount = tickAmount;
        this.Color = color;
        this.Active = active;
        this.CalcCost = calcCost;
        this.PerTickReduction = perTickReduction
        this.Cost = this.CalcCost();
    }

    static calcAmount(fixedAmount, level) { return Math.floor(fixedAmount * Math.pow(1.3, level)) * 10 }
    static calcReduction(fixedAmount, level) { return fixedAmount * Math.pow(1.3, level) }

    updateTick() { this.TickAmount += this.FixedAmount * Math.pow(itemScale, this.Level) }
    processResources() { this.Amount += this.TickAmount; }
    updateCost() { this.Cost = this.CalcCost({level: this.Level}); }

    get main() { return this.Main }
    get level() { return this.Level }
    get amount() { return this.Amount }
    get fixedAmount() { return this.FixedAmount }
    get tickAmount() { return this.TickAmount }
    get color() { return this.Color }
    get active() { return this.Active }
    get cost() { return this.Cost }
    get calcTickReduction() { return this.PerTickReduction({level: this.Level}) || {} }


    set setAmount(amount) { this.Amount = amount;}
    set setLevel(level) { this.Level = level;}
    set setActive(active) { this.Active = active;}
    set setTickAmount(amount) { this.TickAmount = amount;}

    set addAmount(amount) { this.Amount += amount;}
    set addLevel(level) { this.Level += level;}
    set addActive(active) { this.Active += active;}
    set addTickAmount(amount) { this.TickAmount += amount;}

    set reduceAmount(amount) { this.Amount -= amount;}
    set reduceLevel(level) { this.Level -= level;}
    set reduceActive(active) { this.Active -= active;}
    set reduceTickAmount(amount) { this.TickAmount -= amount;}

}

function Game() {
    this.Materials = {
        Wood: new Mat({
            main: "Lumber Mill",
            color: "#926738",
            calcCost: ({fixedAmount = 4, level = 1} = {}) => ({
                "Stone": Mat.calcAmount(fixedAmount, level) * 0.60,
                "Steel": Mat.calcAmount(fixedAmount, level) * 0.45,
                "Wood": Mat.calcAmount(fixedAmount, level) * 0.71 * 1.1
            }),
            active: true
        }),
        Steel: new Mat({
            main: "Refinery",
            color: "#afafaf",
            calcCost: ({fixedAmount = 4, level = 1} = {}) => ({
                "Stone": Mat.calcAmount(fixedAmount, level) * 0.60,
                "Steel": Mat.calcAmount(fixedAmount, level) * 0.45 * 1.1,
                "Wood": Mat.calcAmount(fixedAmount, level) * 0.71
            }),
            active: true,
        }),
        Stone: new Mat({
            main: "Quarry",
            color: "#dad7d7",
            calcCost: ({fixedAmount = 4, level = 1} = {}) => ({
                "Stone": Mat.calcAmount(fixedAmount, level) * 0.60 * 1.1,
                "Steel": Mat.calcAmount(fixedAmount, level) * 0.45,
                "Wood": Mat.calcAmount(fixedAmount, level) * 0.71
            }),
            active: true
        }),
        Silicon: new Mat({
            main: "Silicon Mine",
            color: "#717171",
            calcCost: ({fixedAmount = 4, level = 1} = {}) => ({
                "Stone": Mat.calcAmount(fixedAmount, level) * 0.60,
                "Steel": Mat.calcAmount(fixedAmount, level) * 0.45,
                "Wood": Mat.calcAmount(fixedAmount, level) * 0.71
            }),
            active: true
        }),
        Chip: new Mat({
            main: "Factory",
            color: "aqua",
            calcCost: ({fixedAmount = 4, level = 1} = {}) => ({
                "Stone": Mat.calcAmount(fixedAmount, level) * 0.40,
                "Steel": Mat.calcAmount(fixedAmount, level) * 0.35,
                "Wood": Mat.calcAmount(fixedAmount, level) * 0.51,
                "Silicon": Mat.calcAmount(fixedAmount, level) * 0.41
            }),
            perTickReduction: ({fixedAmount = 4, level = 1} = {}) => ({
                "Stone": +(Mat.calcReduction(fixedAmount, level) * 0.12).toFixed(2),
                "Steel": +(Mat.calcReduction(fixedAmount, level) * 0.12).toFixed(2),
                "Wood": +(Mat.calcReduction(fixedAmount, level) * 0.12).toFixed(2),
                "Silicon": +(Mat.calcReduction(fixedAmount, level) * 0.40).toFixed(2)
            }),
            active: true
        }),
        // Iron: 0,
        // Gold: 0,
        // Platinum: 0,
        // Silver: 0,
        // Mithril: 0,
        // Obsidian: 0,
        // Plastic: 0,
        // Silk: 0,
        // Rubber: 0,
        // Glass: 0,
        // Copper: 0,
        // Dirt: 0,
        // Diamond: 0,
        // Zinc: 0,
        // Emerald: 0,
        // Ruby: 0,
        // Sapphire: 0,
        // Gas: 0,
        // Clay: 0
        // TODO: Food/organics ?
        // Crops
        // Meat
        // Wheat
        // Fruit
        // Veggies
        // Nuts
    }
    this.Player = {
        "Silicon Mine": {
            unlocked: false,
            unlocks: ["Silicon"]
        },
        Schooling: {
            unlocked: false,
            unlocks: [""]
        },
        "Chip Factory": {
            unlocked: false,
            unlocks: ["Chip"],
            requires: ["Silicon Mine"]
        },
        Training: {
            unlocked: false,
            unlocks: [""]
        },
        Logistics: {
            unlocked: false,
            unlocks: [""]
        },
        Financing: {
            unlocked: false,
            unlocks: [""]
        },
        Security: {
            unlocked: false,
            unlocks: [""]
        },
        // Training: false,
        // Logistics: false,
        // Financing: false,
        // Security: false
        // Attack: 1,
        // Defense: 1,
        // Health: 10,
        // Workers: 0,
        // Gatherers: 0,
        // Soldiers: 0,
    }
};
Game.prototype.formatNum = function (num) {
    // TODO: Fix - After B start checking splitting and checking for "1000000a"or "ab" for example
    // Or start using scientific notation with powers and such
    let amountShown = num.toFixed(1);
    num > 10000 && (amountShown = (num / 1000).toFixed(1) +"K")
    num > 10000000 && (amountShown = (num / 1000000).toFixed(1) +"M")
    num > 10000000000 && (amountShown = (num / 1000000000).toFixed(1) +"B")
    num > 10000000000000 && (amountShown = (num / 1000000000000).toFixed(1) +"T")
    num > 10000000000000000 && (amountShown = (num / 1000000000000000).toFixed(1) +"Q")
    num > 10000000000000000000 && (amountShown = (num / 1000000000000000000).toFixed(1) +"S")
    return amountShown
};
Game.prototype.unlockTech = function (tech) {
    let prereqMet = !this.Player[tech].requires || this.Player[tech].requires.every((neededTech) => this.Player[neededTech].unlocked)
    if(!prereqMet) { return console.log("Not all prequsites have been unlocked"); }
    this.Player[tech].unlocked = true;
    this.Player[tech].unlocks.forEach((mat) => {
        this.Materials[mat].setActive = true;
    })

};
Game.prototype.addAmount = function(mats) {
    for(let p in mats) {
        this.Materials[p].setAmount = this.Materials[p].amount + mats[p]
    }
};
// ==========================STRUCTURES==================
// ==========================STRUCTURES==================
Game.prototype.subtractAmount = function(mats) {
    for(let p in mats) {
        this.Materials[p].setAmount = this.Materials[p].amount - mats[p]
    }
};
Game.prototype.reduceTicks = function(mat) {
    let ticksToUpdate = this.Materials[mat].calcTickReduction
    Object.keys(ticksToUpdate).forEach((mat) => {
        this.Materials[mat].reduceTickAmount = ticksToUpdate[mat]
    })
}
Game.prototype.upgradeStructure = function (mat) {
    this.reduceTicks(mat)
    this.Materials[mat].setLevel = this.Materials[mat].level + 1;
    this.Materials[mat].updateCost();
    this.Materials[mat].updateTick();
};
Game.prototype.calcStructureUpgrade = function (mat) {
    return this.Materials[mat].cost
};
Game.prototype.hasSufficientMats = function (mats) {
    for(let p in mats) {
        if(this.Materials[p].amount - mats[p] <= 0) { return false; }
    }
    return true
};
Game.prototype.processResources = function () {
    Object.keys(this.Materials).forEach((mat) => {
        this.Materials[mat].active ? this.Materials[mat].processResources() : "";
    })
};
// ===================================MAIN GAIN==================
// ===================================MAIN GAIN==================
// ===================================MAIN GAIN==================
Game.prototype.Loop = function() {
    this.processResources();
};

// Object.keys(Game.Materials).forEach((mat) => {
//     Game.Materials[mat].Workers = {};
//     Game.Materials[mat].Gatherers = {};
//     Game.Materials[mat].Addons = [];
// })
module.exports = Game;
