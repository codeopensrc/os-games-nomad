"use strict";

const itemScale = 1.3;
// const startAmount = 60;

function Game() {
    this.Materials = {
        Wood: {
            Main: "Lumber Mill",
            Level: 1,
            Amount: 10,
            FixedAmount: 4,
            TickAmount: 4,
            Color: "#926738",
            updateTick: function() {
                this.TickAmount = this.FixedAmount * Math.pow(itemScale, this.Level)
            }
        },
        Steel: {
            Main: "Refinery",
            Level: 1,
            Amount: 10,
            FixedAmount: 4,
            TickAmount: 4,
            Color:  "#7d7a7a",
            updateTick: function() {
                this.TickAmount = this.FixedAmount * Math.pow(itemScale, this.Level)
            }
        },
        Stone: {
            Main: "Quarry",
            Level: 1,
            Amount: 10,
            FixedAmount: 4,
            TickAmount: 4,
            Color: "#c5c5c5",
            updateTick: function() {
                this.TickAmount = this.FixedAmount * Math.pow(itemScale, this.Level)
            }
        },
        // Iron: 0,
        // Gold: 0,
        // Platinum: 0,
        // Silver: 0,
        // Mithril: 0,
        // Obsidian: 0,
        // Plastic: 0,
        // Silk: 0,
        // Silicon: 0,
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
        Attack: 1,
        Defense: 1,
        Health: 10,
        Workers: 0,
        Gatherers: 0
    }
};
Game.prototype.formatNum = function (num) {
    let amountShown = num.toFixed(1);
    num > 10000 && (amountShown = (num / 1000).toFixed(1) +"K")
    num > 10000000 && (amountShown = (num / 1000000).toFixed(1) +"M")
    num > 10000000000 && (amountShown = (num / 1000000000).toFixed(1) +"B")
    num > 10000000000000 && (amountShown = (num / 1000000000000).toFixed(1) +"T")
    num > 10000000000000000 && (amountShown = (num / 1000000000000000).toFixed(1) +"Q")
    num > 10000000000000000000 && (amountShown = (num / 1000000000000000000).toFixed(1) +"S")
    return amountShown
};
Game.prototype.upgradeStat = function (stat) {
    this.Player[stat] += 1;
};
// ==========================STRUCTURES==================
// ==========================STRUCTURES==================
Game.prototype.subtractAmount = function(mats) {
    for(let p in mats) {
        this.Materials[p].Amount -= mats[p]
    }
};
Game.prototype.upgradeStructure = function (mat) {
    this.Materials[mat].Level += 1
    this.Materials[mat].updateTick();
};
Game.prototype.calcStructureUpgrade = function (mat) {
    let mats = {};
    let calcAmount = Math.floor(this.Materials[mat].FixedAmount * Math.pow(1.3, this.Materials[mat].Level)) * 10
    mats["Stone"] = calcAmount * 0.60 * (mat === "Stone" ? 1.1 : 1);
    mats["Steel"] = calcAmount * 0.45 * (mat === "Steel" ? 1.1 : 1);
    mats["Wood"] = calcAmount * 0.71 * (mat === "Wood" ? 1.1 : 1);
    return mats;
};
Game.prototype.hasSufficientMats = function (mats) {
    for(let p in mats) {
        if(this.Materials[p].Amount - mats[p] <= 0) { return false; }
    }
    return true
};
Game.prototype.processResources = function () {
    Object.keys(this.Materials).forEach((mat) => {
        this.Materials[mat].Amount += this.Materials[mat].TickAmount;
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
