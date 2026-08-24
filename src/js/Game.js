"use strict";

const { Temporal, Intl, toTemporalInstant } = require('@js-temporal/polyfill');

const weekendBuffs = ["warrior", "scholar"]
const hourlyBuffs = ["warrior", "scholar"]

const worldBuffs = {
    scholar: {stats: {exp: 0.1}, },
    //warrior: {stats: {attack: 0.1, defense: 0.1, health: 0.1} }
    warrior: {stats: {attack: 5, defense: 5, health: 40} }
}

const rarities = ["uncommon", "rare", "epic"]

const slotDisenchantChance = {
    head: { essence: 90, crystal: 65 }, // mat, chance
    chest: { essence: 95, crystal: 70 },
    feet: { essence: 90, crystal: 55 },
    ring: { essence: 95, crystal: 80 },
    neck: { essence: 95, crystal: 80 },
    weapon: { essence: 100, crystal: 80 },
}
const gearDisenchantMatrix = {
    "bone": ["minor", 2],
    "hide": ["minor", 2],
    "copper": ["minor", 10], //[tier, exp]
    "bronze": ["lesser", 30],
    "iron": ["major", 70],
    "steel": ["superior", 145],
    "mithril": ["glorious", 200],

    "simple": ["minor", 10],
    "nice": ["lesser", 30],
    "fancy": ["major", 70],
    "exquisite": ["superior", 145],
}

const runePerSlot = {
    "striking": { head: 2, chest: 3, feet: 1, weapon: 3, ring: 1, neck: 1 },
    "protection": { head: 2, chest: 3, feet: 1, weapon: 1, ring: 1, neck: 1 },
    "fortitude": { head: 15, chest: 20, feet: 10, weapon: 15, ring: 25, neck: 25 },
    "strength": { head: 2, chest: 3, feet: 1, weapon: 1, ring: 1, neck: 1 },
    "agility": { head: 2, chest: 3, feet: 1, weapon: 1, ring: 1, neck: 1 },
    "intellect": { head: 2, chest: 3, feet: 1, weapon: 1, ring: 1, neck: 1 },
}

//TODO: How to do flat ranges. Need ilvl of item crafted type deal
//TODO: Regen stat
const gearAffixes = {
    //% ranges
    //TODO: Maybe drop half a tier not sure yet
    "runeforged": {
        "stalwart": { "defense": [0.20, 0.50], "health": [0.90, 1.40], },
        "resolute": { "defense": [0.20, 0.50], "spd": [0.09, 0.14], },
        "stout": { "defense": [0.20, 0.50], "attack": [0.20, 0.50], },
        "deadly": { "attack": [0.20, 0.50], "spd": [0.09, 0.14], },
        "savagery": { "attack": [0.20, 0.50], "health": [0.90, 1.40], },
        "swift": { "health": [0.90, 1.40], "spd": [0.09, 0.14], },
        "fortitude": { "health": [1.80, 2.80], },
        "protection": { "defense": [0.40, 1.00], },
        "crushing": { "attack": [0.40, 1.00], },
        "quick": { "spd": [0.18, 0.28], },
    },
    "npc": {
        "stalwart": { "defense": [0.15, 0.40], "health": [0.75, 1.20], },
        "resolute": { "defense": [0.15, 0.40], "spd": [0.07, 0.12], },
        "stout": { "defense": [0.15, 0.40], "attack": [0.15, 0.40], },
        "deadly": { "attack": [0.15, 0.40], "spd": [0.07, 0.12], },
        "savagery": { "attack": [0.15, 0.40], "health": [0.75, 1.20], },
        "swift": { "health": [0.75, 1.20], "spd": [0.07, 0.12], },
        "fortitude": { "health": [1.50, 2.40], },
        "protection": { "defense": [0.30, 0.80], },
        "crushing": { "attack": [0.30, 0.80], },
        "quick": { "spd": [0.14, 0.24], },
    },
    "craft": {
        "stalwart": { "defense": [0.10, 0.30], "health": [0.60, 1.00], },
        "resolute": { "defense": [0.10, 0.30], "spd": [0.05, 0.10], },
        "stout": { "defense": [0.10, 0.30], "attack": [0.10, 0.30], },
        "deadly": { "attack": [0.10, 0.30], "spd": [0.05, 0.10], },
        "savagery": { "attack": [0.10, 0.30], "health": [0.60, 1.00], },
        "swift": { "health": [0.60, 1.00], "spd": [0.05, 0.10], },
        "fortitude": { "health": [1.20, 2.00], },
        "protection": { "defense": [0.20, 0.60], },
        "crushing": { "attack": [0.20, 0.60], },
        "quick": { "spd": [0.10, 0.20], },
    },
    "shop": {
        "stalwart": { "defense": [0.05, 0.20], "health": [0.45, 0.80], },
        "resolute": { "defense": [0.05, 0.20], "spd": [0.03, 0.08], },
        "stout": { "defense": [0.05, 0.20], "attack": [0.05, 0.20], },
        "deadly": { "attack": [0.05, 0.20], "spd": [0.03, 0.08], },
        "savagery": { "attack": [0.05, 0.20], "health": [0.45, 0.80], },
        "swift": { "health": [0.45, 0.80], "spd": [0.03, 0.08], },
        "fortitude": { "health": [0.90, 1.60], },
        "protection": { "defense": [0.10, 0.40], },
        "crushing": { "attack": [0.10, 0.40], },
        "quick": { "spd": [0.06, 0.16], },
    },
     //NOTE: Mirror shop
    "gamble": {
        "stalwart": { "defense": [0.05, 0.20], "health": [0.45, 0.80], },
        "resolute": { "defense": [0.05, 0.20], "spd": [0.03, 0.08], },
        "stout": { "defense": [0.05, 0.20], "attack": [0.05, 0.20], },
        "deadly": { "attack": [0.05, 0.20], "spd": [0.03, 0.08], },
        "savagery": { "attack": [0.05, 0.20], "health": [0.45, 0.80], },
        "swift": { "health": [0.45, 0.80], "spd": [0.03, 0.08], },
        "fortitude": { "health": [0.90, 1.60], },
        "protection": { "defense": [0.10, 0.40], },
        "crushing": { "attack": [0.10, 0.40], },
        "quick": { "spd": [0.06, 0.16], },
    }
}

const affixSlots = {
    "head": ["stalwart", "stout", "savagery", "fortitude", "protection", "crushing"],
    "chest": ["stalwart", "stout", "savagery", "fortitude", "protection", "crushing" ],
    "feet": [ "stalwart", "stout", "savagery", "fortitude", "protection", "crushing"],
    "weapon": [ "resolute", "stout", "deadly", "savagery", "swift", "fortitude", "crushing", "quick"],
    "ring": [ "stalwart", "stout", "savagery", "fortitude", "protection", "crushing" ],
    "neck": [ "stalwart", "stout", "savagery", "fortitude", "protection", "crushing" ],
}
const weaponAttackSpeeds = {
    "dagger": 3,
    "sword": 3.5,
    "mace": 3.5,
    "claymore": 5,
    "warhammer": 5.5,
    "spear": 3.5,
}
const numerals = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X" }
const numbers = { "I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8, "IX": 9, "X": 10 }
const stackableGear = {
    "head": false,
    "chest": false,
    "feet": false,
    "weapon": false,
    "ring": false,
    "neck": false,
    "prayer": false,
    "potion": true,
    "flask": true,
    "food": true,
}
const DefaultAttackSpeed = 5 //seconds
const DefaultPotionDuration = 900  //seconds
const DefaultFlaskDuration = 1800  //seconds
const DefaultScrollDuration = 900  //seconds
const DefaultWorldBuffDuration = 600  //seconds
const DefaultCraftTime = 3  //seconds

const determineSocketBonus = (stat, name) => {
    const tierBonus = {
        copper: 1,
        bronze: 1,
        iron: 2,
        steel: 2,
        mithril: 3,

        simple: 1,
        nice: 1,
        fancy: 2,
        exquisite: 2,
    }
    const socketBonusValues = {
        Health: 20,
        Attack: 1,
        Defense: 1,
    }
    const foundBonus = Object.entries(tierBonus).find(([gearType, bonusMultiple]) => {
        return new RegExp(`${gearType}`).test(name)
    })
    if(foundBonus) {
        return socketBonusValues[stat] * foundBonus[1]
    }
    return socketBonusValues[stat]
}

const determineRune = (runeType) => {
    const tier = runeType.replace(/.*_rune_/i, "") 
    const type = runeType.replace(/_rune(?:_\d)?/i, "") 

    const miscRuneChances = {
        rune_of_rarity: 30,
        rune_of_chance: 35,
        rune_of_enhancement: 35,
    }
    const statRuneChances = {
        rune_of_striking: 20,
        rune_of_protection: 20,
        rune_of_fortitude: 18,
        rune_of_strength: 14,
        //TODO: Remove these from pool for now
        //rune_of_agility: 14,
        //rune_of_intellect: 14,
    }

    const runeList = type == "stat" ? statRuneChances : miscRuneChances
    let rune = rollOneFromDistribution(runeList)

    if(tier) {
        rune += `_${tier}`
    }
    return rune
}

const rollMultipleFromDistribution = (distributionList, {...opts}) => {
    const { skillLevel = 0, chanceBoost = 0, extraDropChance = 15, maxExtra = 2, dropLocation = "" } = {...opts}

    const foundItems = Object.keys(distributionList).filter((item) => {
        const levelDropChanceBoost = (0.005 * distributionList[item]) * skillLevel
        const rng = parseFloat((Math.random() * 100).toFixed(2)) 
        return rng <= distributionList[item]+levelDropChanceBoost+chanceBoost
    })
    if(!foundItems.length) { return }
    //console.log("l", distributionList, foundItems)
    const items = foundItems.map((itemname) => {
        if(/rune/i.test(itemname)) { itemname = determineRune(itemname) }
        const extraDrop = Math.random() * 100 <= extraDropChance
        let extraAmount = extraDrop ? Math.floor(Math.random()*maxExtra)+1 : 0
        if(/_key$/i.test(itemname)) { extraAmount = 0 }
        return {name: itemname, amount: 1 + extraAmount, dropLocation: dropLocation }
    }).filter(l => l)
    return items
}

const rollOneFromDistribution = (distributionList) => {
    let ranges = {}
    const totalRange = Object.keys(distributionList).reduce((accum, key) => {  
        const lowerRange = accum == 0 ? 0 : accum+0.001
        const upperRange = accum + distributionList[key] 
        ranges[key] = [lowerRange, upperRange]
        return upperRange
    }, 0)

    const rng = parseFloat((Math.random() * totalRange).toFixed(3))
    const matchingKey = Object.keys(ranges).find((key) => {
        const [lower, upper] = ranges[key]
        if(lower <= rng && rng <= upper) { return key }
    })
    //console.log(rng, matchingKey, totalRange, ranges)
    return matchingKey
}

const determineRarity = (dropLocation) => {
    const dropRates = {
        runeforged: { normal: 3,  uncommon: 27, rare: 40, epic: 30, },
        npc:        { normal: 5,  uncommon: 43, rare: 36, epic: 16, }, //npc normal basically doesnt matter
        craft:      { normal: 10, uncommon: 35, rare: 37, epic: 18, },
        shop:       { normal: 30, uncommon: 47, rare: 20, epic: 3, },
        gamble:     { normal: 15, uncommon: 45, rare: 32, epic: 8, },
    }
    const dropRatesToUse = dropRates[dropLocation]
    const rarity = rollOneFromDistribution(dropRatesToUse)
    return rarity
}

const increaseAtkSpeed = (origSpeed, allSpeedIncreases, decreaseValue) => {
    decreaseValue = decreaseValue * 100
    const foundValIndex = allSpeedIncreases.indexOf(decreaseValue)
    foundValIndex != -1 && allSpeedIncreases.splice(foundValIndex, 1)

    let newSpeed = origSpeed
    allSpeedIncreases.forEach((spdIncrease) => {
        newSpeed = newSpeed * (100 - spdIncrease) / 100
    })
    return parseFloat( newSpeed.toFixed(2) )
}

const decreaseAtkSpeed = (origSpeed, allSpeedIncreases, additionalIncrease) => {
    additionalIncrease = additionalIncrease * 100
    allSpeedIncreases.push(additionalIncrease)

    let newSpeed = origSpeed
    allSpeedIncreases.forEach((spdIncrease) => {
        newSpeed = newSpeed * (100 - spdIncrease) / 100
    })
    const finalNewSpeed = parseFloat( newSpeed.toFixed(2) )
    return finalNewSpeed
}

const getItemRank = (string) => {
    return string.replace(/[^IVX]*([IVX]+)$|.*(\d)$/g, (word, c1, c2) => {
        if(c1) { return numbers[c1] }
        if(c2) { return c2 }
        return 0
    })
}
const replaceNumerals = (string) => {
    return string.replace(/[IVX]*$/, "")
}
const replaceRank = (string) => {
    return string.replace(/[IVX]*$|(\d)$/, "")
}
//TODO: For now if num then % otherwise return value
const toPercent = (num) => {
    if(typeof(num) == "number") {
        return `${parseFloat(num) * 100}%`
    }
    return num
}
const toProper = (string) => {
    return string.replace(/\b[a-z]|_[a-z]/g, x => x.toUpperCase()).replace(/_/g, " ")
        .replace(/\d/, n => numerals[n])
}
const toShort = (string) => {
    return string.replace(/(?:recipe |flask|potion| prayer|scroll |rune of)/gi, "")
}
const toCatalogName = (string) => {
    return string.replace(/ /g, "_").replace(/([IV]+)$|(\d)$/g, (word, c1, c2) => {
        if(c1) { return numbers[c1] }
        if(c2) { return c2 }
    }).toLowerCase()
}
const getWeaponType = (name) => {
    const weptypes = Object.keys(weaponAttackSpeeds)
    const wepregex = weptypes.join("|")
    const regex = new RegExp(`${wepregex}`, "i")
    return name.match(regex) ? name.match(regex)[0] : ""
}

// Private properties in js
// https://stackoverflow.com/a/68557478
// https://www.xjavascript.com/blog/defining-read-only-properties-in-javascript/#example-private-field-getter

class Player {
    constructor({name, level = 1, health = 50, attack = 10, attackSpeed = DefaultAttackSpeed, defense = 0, str = 0, agi = 0, int = 0,
    lootTable = {}, exp = 0, isPlayer = true}) {
        this.Name = name
        this.Level = level;
        this.MaxHealth = health;
        this.Health = health;
        this.Attack = attack;
        this.AttackSpeed = Temporal.Duration.from({ milliseconds: attackSpeed * 1000 })
            .round({largestUnit: "seconds", smallestUnit: "milliseconds"})
        this.AttackSpeedIncrease = []
        this.BaseAttackSpeed = attackSpeed
        this.Defense = defense;
        this.Alive = true;
        this.LootTable = lootTable;
        this.Experience = exp
        this.IsPlayer = isPlayer;
        this.LastHit = -1;
        this.LastAttack = -1;
        this.SwingTimer = Temporal.Duration.from({ seconds: 0 });
        this.Buffs = [];
        this.WorldBuffs = [];
        this.Gear = {
            Helm: null,
            Chest: null,
            Boots: null,
            Weapon: null,
            Ring: null,
            Necklace: null,
            Food: null,
            Prayer: null,
            Potion1: null,
            Potion2: null,
            Potion3: null,
        };
        this.Stats = {
            Str: str,
            Int: int,
            Agi: agi,
        }
        this.PotionBuffs = []
    }

    get name() { return this.Name }
    get nameProper() { 
        return toProper(this.Name)
    } 
    get health() { return this.Health }
    get attack() { return this.calcAttack() }
    get defense() {  
        return Object.keys(this.Gear).reduce((accum, slot)=>accum + (!/potion/i.test(slot) ? this.Gear[slot]?.defense || 0 : 0), this.Defense)
    }
    get attackSpeed() { return this.AttackSpeed.total("seconds") }
    get attackPower() { return this.calcAttackPower() }
    get str() { return Object.keys(this.Gear).reduce((accum, slot)=>accum + (!/potion/i.test(slot) ? this.Gear[slot]?.str || 0 : 0), this.Stats.Str) }
    get agi() { return Object.keys(this.Gear).reduce((accum, slot)=>accum + (!/potion/i.test(slot) ? this.Gear[slot]?.agi || 0 : 0), this.Stats.Agi) }
    get int() { return Object.keys(this.Gear).reduce((accum, slot)=>accum + (!/potion/i.test(slot) ? this.Gear[slot]?.int || 0 : 0), this.Stats.Int) }
    get maxhealth() { return Object.keys(this.Gear).reduce((accum, slot)=>accum + (!/potion|food/i.test(slot) ? this.Gear[slot]?.health || 0 : 0), this.MaxHealth) }
    get exp() { return this.Experience }

    set str(amount) { this.Stats.Str = amount }
    set agi(amount) { this.Stats.Agi = amount }
    set int(amount) { this.Stats.Int = amount }
    set maxhealth(health) { this.MaxHealth = health }
    set health(amount) { this.Health = amount }
    set defense(amount) { this.Defense = amount }
    set attack(amount) { this.Attack = amount }
    set attackSpeed(speed) {
        const singlePointFloat = parseFloat(speed.toFixed(1))
        this.AttackSpeed = Temporal.Duration.from({ milliseconds: singlePointFloat * 1000 })
            .round({largestUnit: "seconds", smallestUnit: "milliseconds"})
    }

    save() { }
    load() { }

    //Potion
    usePotion(potion) {
        //ATM we're not allowing multiple of same potion type to be equiped, but potion+flask is ok
        const foundBuff = this.PotionBuffs.find((buff) => buff.name == potion.name)
        const foundFlask = this.PotionBuffs.find((buff) => potion.slot == "flask" && buff.slot == "flask")
        if(potion.amount > 0 && foundBuff) {
            let duration = potion.slot == "potion" ? DefaultPotionDuration : DefaultFlaskDuration
            const foundDurationStat = potion.craftedStats.find((statObj) => statObj.hasOwnProperty("Duration"))
            if(foundDurationStat) {
                duration += (duration * foundDurationStat?.Duration)
            }
            if(foundBuff.duration <= 60) {
                foundBuff.duration = duration
                potion.reduceAmount(1)
                return true
            }
        }
        if(!foundBuff && !foundFlask && potion.amount > 0) {
            let used = false
            Object.entries(potion.stats).forEach((kv, i) => {
                let [ statkey, statvalue ] = kv
                if(statvalue == 0) { return }

                if(Object.hasOwn(this.Stats, statkey)) {
                    this.Stats[statkey] += statvalue
                    return used = true
                }
                if(statkey == "Health") {
                    let healed = this.heal(statvalue)
                    return used = used || healed
                } else if(statkey == "MaxHealth") {
                    this[statkey] += statvalue
                    return used = true
                } else if(statkey == "Spd") {
                    this.attackSpeed = decreaseAtkSpeed(this.BaseAttackSpeed, this.AttackSpeedIncrease, statvalue)
                    return used = true
                } else {
                    if(Object.hasOwn(this, statkey)) {
                        this[statkey] += statvalue
                        return used = true
                    }
                }
            })
            used && this.applyPotionBuff(potion)
            used && potion.reduceAmount(1)
            return used
        }
        return false
    }
    applyPotionBuff(potion) {
        if(potion.health > 0) { return }
        let duration = potion.slot == "potion" ? DefaultPotionDuration : DefaultFlaskDuration
        const foundDurationStat = potion.craftedStats.find((statObj) => statObj.hasOwnProperty("Duration"))
        if(foundDurationStat) { duration += (duration * foundDurationStat?.Duration) }
        const buff = {name: potion.name, slot: potion.slot, stats: potion.stats, duration: duration, craftMats: potion.craftMats }
        this.PotionBuffs.push(buff)
        this.PotionBuffs.sort((a,b)=>b.slot=="flask")
    }
    removePotionBuff(potion) {
        if(potion.health > 0) { return }
        const hasBuff = this.PotionBuffs.filter((potionbuff) => potion.name == potionbuff.name).length > 0
        if(!hasBuff) { return }
        Object.entries(potion.stats).forEach((kv, i) => {
            let [ statkey, statvalue ] = kv
            if(statvalue == 0) { return }
            //Str, Agi, Int
            if(Object.hasOwn(this.Stats, statkey)) {
                this.Stats[statkey] -= statvalue
            }
            //Attack, Defense, MaxHealth
            this[statkey] -= statvalue
            if(statkey == "MaxHealth" && this.health > this.maxhealth) {
                this.health = this.maxhealth
            }
            if(statkey == "Spd") {
                this.attackSpeed = increaseAtkSpeed(this.BaseAttackSpeed, this.AttackSpeedIncrease, statvalue)
            }
        })
        this.PotionBuffs = this.PotionBuffs.filter((potionbuff) => potionbuff.name !== potion.name)
    }
    
    //Prayer
    setPrayer(prayer) {
        //TODO: Check if prayer level high enough to use
        this.removePrayerBuff()
        Object.entries(prayer.stats).forEach((kv, i) => {
            let [ statkey, statvalue ] = kv
            if(statvalue == 0) { return }
            //TODO: Other things besides stats
            if(Object.hasOwn(this.Stats, statkey)) {
                this.Stats[statkey] += statvalue
            }
            if(statkey == "MaxHealth") {
                this[statkey] += statvalue
            } else if(statkey == "Spd") {
                this.attackSpeed = decreaseAtkSpeed(this.BaseAttackSpeed, this.AttackSpeedIncrease, statvalue)

            } else {
                if(Object.hasOwn(this, statkey)) {
                    this[statkey] += statvalue
                }
            }
        })
        this.applyPrayerBuff(prayer)
        return true
    }
    applyPrayerBuff(prayer) {
        const buff = {name: prayer.name, slot: "prayer", stats: prayer.stats }
        this.Buffs.push(buff)
        this.Buffs.sort((a,b)=>b?.slot=="prayer")
        this.Gear.Prayer = prayer
    }
    removePrayerBuff() {
        const foundPrayer = this.Buffs.filter((buff) => buff?.slot == "prayer")
        const hasBuff = foundPrayer.length > 0
        if(!hasBuff) { return }
        Object.entries(foundPrayer[0].stats).forEach((kv, i) => {
            let [ statkey, statvalue ] = kv
            if(statvalue == 0) { return }
            //Str, Agi, Int
            if(Object.hasOwn(this.Stats, statkey)) {
                this.Stats[statkey] -= statvalue
            }
            //Attack, Defense, MaxHealth
            this[statkey] -= statvalue
            if(statkey == "MaxHealth" && this.health > this.maxhealth) {
                this.health = this.maxhealth
            }
            if(statkey == "Spd") {
                this.attackSpeed = increaseAtkSpeed(this.BaseAttackSpeed, this.AttackSpeedIncrease, statvalue)
            }
        })
        this.Buffs = this.Buffs.filter((buff) => buff?.slot !== "prayer")
        this.Gear.Prayer = null
    }

    //Misc/Scroll
    addMiscBuff(buff) {
        const foundBuff = this.Buffs.find((existingbuff) => {
            if(replaceRank(existingbuff.name) == replaceRank(buff.name)) {
                const currentRank = getItemRank(existingbuff.name)
                const newRank = getItemRank(buff.name)
                if(currentRank >= newRank) { return true }
            }
        })
        if(foundBuff) {
            let duration = DefaultScrollDuration
            if(foundBuff.duration <= 60) {
                foundBuff.duration = duration
                return true
            }
            return false
        }
        this.removeMiscBuff(buff)
        Object.entries(buff.stats).forEach((kv, i) => {
            let [ statkey, statvalue ] = kv
            if(statvalue == 0) { return }

            if(Object.hasOwn(this.Stats, statkey)) {
                this.Stats[statkey] += statvalue
            }
            if(statkey == "MaxHealth") {
                this[statkey] += statvalue
            } else if(statkey == "Spd") {
                this.attackSpeed = decreaseAtkSpeed(this.BaseAttackSpeed, this.AttackSpeedIncrease, statvalue)
            } else {
                if(Object.hasOwn(this, statkey)) {
                    this[statkey] += statvalue
                }
            }
        })
        this.applyMiscBuff(buff)
        return true
    }
    applyMiscBuff(buff) {
        let duration = DefaultScrollDuration
        //if(buff instanceof Scroll) {
        //    duration = DefaultScrollDuration
        //}
        let miscbuff = {name: buff.name, stats: buff.stats, duration: duration }
        this.Buffs.push(miscbuff)
        this.Buffs.sort((a,b)=>b?.slot=="prayer")
    }
    removeMiscBuff(buff) {
        const foundMiscBuff = this.Buffs.find((existingbuff) => {
            return existingbuff.name.includes(replaceRank(buff.name))
        })
        if(!foundMiscBuff) { return }
        Object.entries(foundMiscBuff.stats).forEach((kv, i) => {
            let [ statkey, statvalue ] = kv
            if(statvalue == 0) { return }
            //Str, Agi, Int
            if(Object.hasOwn(this.Stats, statkey)) {
                this.Stats[statkey] -= statvalue
            }
            //Attack, Defense, MaxHealth
            this[statkey] -= statvalue
            if(statkey == "MaxHealth" && this.health > this.maxhealth) {
                this.health = this.maxhealth
            }
            if(statkey == "Spd") {
                this.attackSpeed = increaseAtkSpeed(this.BaseAttackSpeed, this.AttackSpeedIncrease, statvalue)
            }
        })
        this.Buffs = this.Buffs.filter((existingbuff) => {
            return !existingbuff.name.includes(replaceRank(buff.name))
        })
    }

    //TODO: % based values instead of only flat values
    addWorldBuff(buff) {
        const alreadyBuffed = this.WorldBuffs.find((existingbuff) => {
            if(replaceRank(existingbuff.name) == replaceRank(buff.name)) {
                const currentRank = getItemRank(existingbuff.name)
                const newRank = getItemRank(buff.name)
                if(currentRank >= newRank) { return true }
            }
        })
        if(alreadyBuffed) { return false }
        Object.entries(buff.stats).forEach((kv, i) => {
            let [ statkey, statvalue ] = kv
            if(statvalue == 0) { return }

            if(Object.hasOwn(this.Stats, statkey)) {
                this.Stats[statkey] += statvalue
            }
            if(statkey == "MaxHealth") {
                this[statkey] += statvalue
            } else if(statkey == "Spd") {
                this.attackSpeed = decreaseAtkSpeed(this.BaseAttackSpeed, this.AttackSpeedIncrease, statvalue)
            } else {
                if(Object.hasOwn(this, statkey)) {
                    this[statkey] += statvalue
                }
            }
        })
        this.applyWorldBuff(buff)
        return true
    }
    applyWorldBuff(buff) {
        let duration = buff.duration ? buff.duration : DefaultWorldBuffDuration
        let worldbuff = {name: buff.name, stats: buff.stats, duration: duration }
        this.WorldBuffs.push(worldbuff)
    }

    removeWorldBuff(buff) {
        const foundWorldBuff = this.WorldBuffs.find((existingbuff) => {
            return existingbuff.name.includes(replaceRank(buff.name))
        })
        if(!foundWorldBuff) { return }
        Object.entries(foundWorldBuff.stats).forEach((kv, i) => {
            let [ statkey, statvalue ] = kv
            if(statvalue == 0) { return }
            //Str, Agi, Int
            if(Object.hasOwn(this.Stats, statkey)) {
                this.Stats[statkey] -= statvalue
            }
            //Attack, Defense, MaxHealth
            this[statkey] -= statvalue
            if(statkey == "MaxHealth" && this.health > this.maxhealth) {
                this.health = this.maxhealth
            }
            if(statkey == "Spd") {
                this.attackSpeed = increaseAtkSpeed(this.BaseAttackSpeed, this.AttackSpeedIncrease, statvalue)
            }
        })
        this.WorldBuffs = this.WorldBuffs.filter((existingbuff) => {
            return !existingbuff.name.includes(replaceRank(buff.name))
        })
    }


    heal(healAmount) {
        if(this.health == this.maxhealth) { return false }
        if(this.health + healAmount >= this.maxhealth) {
            this.health = this.maxhealth
        } else {
            this.health += healAmount
        }
        return true
    }

    calcDefense() {
        const defense = this.defense
        const lowEndMultiplier = 0.85
        const highEndMultiplier = 1.1
        const minDefense = Math.round(defense * lowEndMultiplier)
        const maxDefense = Math.round(defense * highEndMultiplier)
        const finalDefense = Math.round(Math.random() * (maxDefense - minDefense) + minDefense)
        return finalDefense
    }
    calcAttackPower() {
        let attack = Object.keys(this.Gear).reduce((accum, slot)=>accum + (!/potion/i.test(slot) ? this.Gear[slot]?.attack || 0 : 0), this.Attack)
        attack += this.Gear.Weapon?.str ? this.str : 0
        attack += this.Gear.Weapon?.int ? this.int : 0
        attack += this.Gear.Weapon?.agi ? this.agi : 0
        return attack
    }
    calcAttack() {
        //Range can be smaller or larger based on attack speed
        //TODO Calc low/top end base on weapon/attack speed
        const attack = this.calcAttackPower()
        const lowEndMultiplier = 0.85
        const highEndMultiplier = 1.2
        const minAttack = Math.round(attack * lowEndMultiplier)
        const maxAttack = Math.round(attack * highEndMultiplier)
        const finalAttack = Math.round(Math.random() * (maxAttack - minAttack) + minAttack)
        return finalAttack
    }

    //calcRange() {
    //    let range = this.Range
    //    range += this.Gear.Weapon?.range || 0
    //    return range
    //}
    //calcMagic() {
    //    let magic = this.Magic
    //    magic += this.Gear.Weapon?.magic || 0
    //    return magic
    //}

    takeHit(damage) {
        this.health -= damage
        if(this.health <= 0 && this.IsPlayer) {
            //Player dead
            this.die()
            console.log("Died")
            return
        }
        if(this.IsPlayer) {
            const healthThreshold = this.maxhealth * 0.4; //TODO: Adjustable by player
            while(this.health <= healthThreshold && this.Gear.Food && this.Gear.Food.amount > 0) {
                this.heal(this.Gear.Food.health)
                this.Gear.Food.reduceAmount(1)
            }
        }
        if(this.IsPlayer) {
            const healthThreshold = this.maxhealth * 0.15; //TODO: Adjustable by player
            const healingPotion = [this.Gear.Potion1, this.Gear.Potion2, this.Gear.Potion3].find(p => p && p.amount > 0 && p.health > 0)
            while(this.health <= healthThreshold && healingPotion && healingPotion.amount > 0) {
                this.usePotion(healingPotion)
            }
        }
    }
    die() {
        this.health = 0
        this.Gear.Potion1 && this.Gear.Potion1.slot != "flask" && this.removePotionBuff(this.Gear.Potion1)
        this.Gear.Potion2 && this.Gear.Potion2.slot != "flask" && this.removePotionBuff(this.Gear.Potion2)
        this.Gear.Potion3 && this.Gear.Potion3.slot != "flask" && this.removePotionBuff(this.Gear.Potion3)
        this.removePrayerBuff()
        this.Buffs.forEach((buff)=>this.removeMiscBuff(buff))
        this.WorldBuffs.forEach((buff)=>this.removeWorldBuff(buff))
        this.resetLastAttack()
        this.resetSwingTimer()
    }
    resetLastAttack() {
        this.LastAttack = -1
    }

    equipItem(item) {
        if(item.slot == "head") {
            this.Gear.Helm = item instanceof Helm ? item : new Helm(item)
        }
        if(item.slot == "chest") {
            this.Gear.Chest = item instanceof Chest ? item : new Chest(item)
        }
        if(item.slot == "feet") {
            this.Gear.Boots = item instanceof Boots ? item : new Boots(item)
        }
        if(item.slot == "ring") {
            this.Gear.Ring = item instanceof Ring ? item : new Ring(item)
        }
        if(item.slot == "neck") {
            this.Gear.Necklace = item instanceof Necklace ? item : new Necklace(item)
        }
        if(item.slot == "weapon") {
            this.Gear.Weapon = item instanceof Weapon ? item : new Weapon(item)
            this.BaseAttackSpeed = this.Gear.Weapon.attackSpeed
            this.attackSpeed = decreaseAtkSpeed(this.BaseAttackSpeed, this.AttackSpeedIncrease, 0)
        }

        if(item.slot == "potion" || item.slot == "flask") {
            if(this.Gear.Potion1?.slot == item.slot && replaceRank(this.Gear.Potion1?.name) == replaceRank(item.name)) {
                return this.Gear.Potion1.name == item.name && this.Gear.Potion1.craftedStatsMatch(item) && this.Gear.Potion1.addAmount(item.amount)
            }
            if(this.Gear.Potion2?.slot == item.slot && replaceRank(this.Gear.Potion2?.name) == replaceRank(item.name)) {
                return this.Gear.Potion2.name == item.name && this.Gear.Potion2.craftedStatsMatch(item) && this.Gear.Potion2.addAmount(item.amount)
            }
            if(this.Gear.Potion3?.slot == item.slot && replaceRank(this.Gear.Potion3?.name) == replaceRank(item.name)) {
                return this.Gear.Potion3.name == item.name && this.Gear.Potion3.craftedStatsMatch(item) && this.Gear.Potion3.addAmount(item.amount)
            }
            //TODO: createPotion and potion vs flask logic there
            const PotionType = item.slot == "potion" ? Potion : Flask
            if(!this.Gear.Potion1) {
                return this.Gear.Potion1 = item instanceof Potion ? item : new PotionType(item)
            }
            if(!this.Gear.Potion2) {
                return this.Gear.Potion2 = item instanceof Potion ? item : new PotionType(item)
            }
            if(!this.Gear.Potion3) {
                return this.Gear.Potion3 = item instanceof Potion ? item : new PotionType(item)
            }
        }
        if(item.slot == "food") {
            if(this.Gear.Food && this.Gear.Food.name == item.name) {
                return this.Gear.Food.addAmount(item.amount)
            }
            if(!this.Gear.Food) { return this.Gear.Food = item instanceof Food ? item : new Food(item) }
        }
        if(item.slot == "prayer") {
            this.Gear.Prayer = new Prayer(item)
        }
    }

    unequipItem(item) {
        if(item.slot == "head") {
            this.Gear.Helm = null
            this.updateCurrentHealth()
        }
        if(item.slot == "chest") {
            this.Gear.Chest = null
            this.updateCurrentHealth()
        }
        if(item.slot == "feet") {
            this.Gear.Boots = null
            this.updateCurrentHealth()
        }
        if(item.slot == "ring") {
            this.Gear.Ring = null
            this.updateCurrentHealth()
        }
        if(item.slot == "neck") {
            this.Gear.Necklace = null
            this.updateCurrentHealth()
        }
        if(item.slot == "weapon") {
            this.Gear.Weapon = null
            this.BaseAttackSpeed = DefaultAttackSpeed
            this.attackSpeed = increaseAtkSpeed(this.BaseAttackSpeed, this.AttackSpeedIncrease, 0)
            this.updateCurrentHealth()
        }
        if(item.slot == "potion" || item.slot == "flask") {
            if(this.Gear.Potion1 && this.Gear.Potion1.name == item.name) {
                this.removePotionBuff(this.Gear.Potion1)
                this.Gear.Potion1 = null
            }
            if(this.Gear.Potion2 && this.Gear.Potion2.name == item.name) {
                this.removePotionBuff(this.Gear.Potion2)
                this.Gear.Potion2 = null
            }
            if(this.Gear.Potion3 && this.Gear.Potion3.name == item.name) {
                this.removePotionBuff(this.Gear.Potion3)
                this.Gear.Potion3 = null
            }
        }
        if(item.slot == "food") {
            this.Gear.Food = null
        }
        if(item.slot == "prayer") {
            this.removePrayerBuff()
        }
    }
    updateCurrentHealth() {
        if(this.health > this.maxhealth) {
            this.health = this.maxhealth
        }
    }
    resetSwingTimer() {
        this.SwingTimer = Temporal.Duration.from({ seconds: 0 });
    }
    addGameDuration(timeDuration) {
        this.SwingTimer = this.SwingTimer.add(timeDuration)
    }
    attackEnemy(G, enemy) {
        let damage = this.attack - enemy.calcDefense()
        //Do at least 1-3 dmg no matter what
        //TODO: Maybe change 1-5% overall dmg
        if(damage <= 1) {
            const [minDmgLow, minDmgHigh] = [1, 3]
            damage = Math.round(Math.random() * (minDmgHigh - minDmgLow) + minDmgLow)
        }
        this.LastAttack = damage
        let killedEnemy = false

        enemy.takeHit(damage)
        if(enemy.health <= 0) {
            if(enemy.IsPlayer) {
                //Player dead
                G.addAlert("Died!")
                G.Battling = false
                G.removeSilver(Math.floor(G.Silver * G.SilverDeathPenalty))
                G.resetLastRegenTick()
                G.resetActivity()
                return
            }

            killedEnemy = true
            enemy.die()
            G.PauseBattle = true
            setTimeout(() => {G.PauseBattle = false}, 1000)

            if(G.Dungeon) {
                //TODO: Talents/leveling
                //G.addExp(Math.round(enemy.Experience * 1.5), "Training")
                G.advanceDungeon()
            } else {
                let droppedItems = enemy.dropItem()
                //TODO: Talents/leveling
                //G.addExp(enemy.Experience, "Training")
                if(droppedItems) { G.addItems(droppedItems) }
                enemy.health = enemy.maxhealth
            }
        }
        this.resetSwingTimer()
        return killedEnemy
    }
}

class NPC extends Player {
    #IsElite;
    #IsBoss;
    #StartingStats;
    constructor({name, level, attack, defense, str, agi, int, lootTable, exp, attackSpeed = 7, health, isPlayer = false, isElite}) {
        super({name, level, health, attack, defense, str, agi, int, lootTable, exp, attackSpeed, isPlayer})
        this.Gear.Helm = new Helm({})
        this.Gear.Chest = new Chest({})
        this.Gear.Boots = new Boots({})
        this.Gear.Weapon = new Weapon({})
        this.#StartingStats = {
            MaxHealth: health,
            Attack: attack,
            Defense: defense,
        }
        if(isElite) {
            this.makeElite()
        }
    }
    get lootTable() { return this.LootTable }
    get isElite() { return this.#IsElite }
    get isBoss() { return this.#IsBoss }

    set isElite(newEliteStatus) { this.#IsElite = newEliteStatus }
    set isBoss(newBossStatus) { this.#IsBoss = newBossStatus }

    get randomItem() {
        return rollMultipleFromDistribution(this.LootTable, {dropLocation: "npc"})
    }
    dropItem() {
        return this.randomItem
    }
    removeFromLootTable(itemname) {
        this.LootTable = Object.fromEntries(
            Object.entries(this.LootTable).filter(([lootname, chance]) => lootname != itemname)
        )
    }

    eliteMobStatAdjustment = {
        MaxHealth: 2.5,
        Attack: 1.8,
        Defense: 1.6,
    }
    bossMobStatAdjustment = {
        MaxHealth: 3.5,
        Attack: 2.5,
        Defense: 2.2,
    }

    makeElite({boss = false} = {}) {
        if((this.isElite && boss == false) || this.isBoss) { return }
        //When getting use uppercase
        const statAdjustment = boss ? this.bossMobStatAdjustment : this.eliteMobStatAdjustment
        Object.keys(statAdjustment).forEach((stat) => {
            const additionalValue = Math.round(this.#StartingStats[stat] * statAdjustment[stat])
            //When setting, use lowercase
            this[stat.toLowerCase()] = this.#StartingStats[stat] + additionalValue
            if(stat == "MaxHealth") { this.health = this.MaxHealth }
        })
        this.isElite = true
        this.isBoss = boss
    }
}

class Plot {
    #Tool;
    #Cleartime;
    constructor({name, lvl, baseExp = 2, cleartime, lootTable = {}, skillname, tool}) {
        this.Name = name;
        this.ReqLevel = lvl;
        this.BaseExp = baseExp;
        this.LootTable = lootTable;
        this.Skillname = skillname;
        this.#Tool = tool ?? null;
        this.#Cleartime = cleartime;
    }

    get name() { return this.Name }
    get nameLower() { return this.Name.toLowerCase() }
    get nameProper() { 
        return toProper(this.Name)
    }
    get baseExp() { return this.BaseExp }
    get reqLevel() { return this.ReqLevel }
    get cleartime() {
        if(this.toolEquipped) {
            const timeImprovement = this.#Cleartime * this.tool.extraSpeed
            return parseFloat((this.#Cleartime - timeImprovement).toFixed(2))
        } else {
            return this.#Cleartime
        }
    }
    get lootTable() { return this.LootTable }
    get skillname() { return this.Skillname }
    get tool() { return this.#Tool }

    set cleartime(cleartime) { this.Cleartime = cleartime }
    set setLootTable(lootTable) { this.LootTable = lootTable }

    get toolEquipped() {
        return this.#Tool != null
    }

    //TODO: Much later, increase chance if tier above item "tier"
    // ie. Mithril hoe gives a bigger bonus than a copper hoe for carrots
    randomItem(skillLevel) {
        let toolDropChanceBoost, toolExtraDropChanceBoost = 0
        if(this.toolEquipped) {
            toolDropChanceBoost = this.tool.extraYield * 100
            toolExtraDropChanceBoost = parseFloat((toolDropChanceBoost * 0.50).toFixed(2))
        }
        const extraDropChance = 15 + toolExtraDropChanceBoost
        const opts = {chanceBoost: toolDropChanceBoost, skillLevel: skillLevel, extraDropChance: extraDropChance}
        return rollMultipleFromDistribution(this.LootTable, opts)
    }

    dropItem(skillLevel) {
        return this.randomItem(skillLevel)
    }
}

class Item {
    #Name;
    #Stackable;
    #Amount;
    #Icon;
    #Description;
    #Price;
    #Rarity;
    constructor({ name, stackable, amount, icon, description, price, rarity, junk}) {
        this.#Name = name || "Item";
        this.#Stackable = stackable ?? true;
        this.#Amount = parseInt(amount) ?? 1;
        this.#Icon = icon || "item";
        this.#Description = description;
        this.#Price = price;
        this.#Rarity = junk ? "junk" : rarity || "normal";
    }
    
    get name() { return this.#Name }
    get nameLower() { return this.name.toLowerCase() }
    get nameProper() {
        return toProper(this.name)
    }
    get nameShort() {
        return toShort(this.nameProper)
    }
    get catalogName() {
        return toCatalogName(this.name)
    }
    get stackable() { return this.#Stackable }
    get amount() { return this.#Amount }
    get icon() { return this.#Icon }
    get description() { return this.#Description }
    get price() { return this.#Price }
    get rarity() { return this.#Rarity }

    set stackable(stackable) { this.#Stackable = stackable }
    set amount(amount) { this.#Amount = parseInt(amount) }
    set price(price) { this.#Price = price }
    set rarity(rarity) { this.#Rarity = rarity }

    addAmount(amount) { this.#Amount += parseInt(amount) }
    reduceAmount(amount) { 
        if(this.#Amount < amount) {
            return false //Insufficient amount
        }
        this.#Amount -= amount
        return true
    }
}

class Recipe extends Item {
    #Teaches;
    #Skill;
    constructor(props) {
        super(props)
        this.#Teaches = props.teaches
        this.#Skill = props.skill
    }
    get teaches() { return this.#Teaches }
    get skill() { return this.#Skill }
    get recipeToolTip() {
        return this.teaches.map((catalogName, i) => {
            return toProper(catalogName)
        })
    }
}
class Key extends Item {
    constructor(props) {
        super(props)
    }
}
//TODO: Treat tool as a regular item to equip/unequip, able to equip all at once but only 1 each skill
// Each "Skill" has a slot
// Rarity/random stats on crafted
//   - Mixture of more exp, more drop, or more speed
//   - Possibly unique effects depending on tool
class Tool {
    #Name;
    #ExtraSpeed;
    #ExtraYield;
    #ExtraExp;
    #Icon;
    #Description;
    #Skill;
    #Tier;
    #Unlocks;
    #UniqueEffect;
    constructor({name, extraSpeed, extraYield, extraExp, icon, description, skill, tier, unlocks, uniqueEffect}) {
        this.#Name = name;
        this.#ExtraSpeed = extraSpeed;
        this.#ExtraYield = extraYield;
        this.#ExtraExp = extraExp;
        this.#Icon = icon ?? "item";
        this.#Description = description;
        this.#Skill = skill;
        this.#Tier = tier;
        this.#Unlocks = unlocks;
        this.#UniqueEffect = uniqueEffect ?? null; //Reduced flask craft time, refund/reduce ingredients, better craft bonus etc
    }
    get name() { return this.#Name }
    get extraSpeed() { return this.#ExtraSpeed }
    get extraYield() { return this.#ExtraYield }
    get extraExp() { return this.#ExtraExp }
    get icon() { return this.#Icon }
    get description() { return this.#Description }
    get skill() { return this.#Skill }
    get tier() { return this.#Tier }
    get unlocks() { return this.#Unlocks }
    get uniqueEffect() { return this.#UniqueEffect }
    get nameProper() { return toProper(this.#Name) }
    get speedProper() { return `${this.#ExtraSpeed * 100}%` }
    get yieldProper() { return `${this.#ExtraYield * 100}%` }
    get expProper() { return `${this.#ExtraExp * 100}%` }
    get skillProper() { return toProper(this.#Skill) }
}

class Enhancement extends Item {
    #Name;
    #StatName;
    #StatAmount;
    constructor({ name, stackable, amount, icon, description, price, statName, statAmount}) {
        super({ name, stackable, amount, icon, description, price, statName, statAmount})
        this.#Name = name;
        this.#StatName = statName;
        this.#StatAmount = statAmount;
    }
    get name() { return this.#Name }

    get nameProper() {
        return toProper(this.name)
    }
    get statName() { return this.#StatName }
    get statNameProper() { 
        if(Array.isArray(this.statName)) {
            return this.statName.map((name) => toProper(name))
        }
        return toProper(this.statName)
    } 
    get statAmount() { return this.#StatAmount }
    get statAmountProper() {
        if(Array.isArray(this.statName)) {
            return this.statName.map((name, i) => {
                if(/spd/i.test(name)) {
                    return `${this.#StatAmount[i] * 100}%`
                }
                return this.#StatAmount[i]
            })
        }
        if(/spd/i.test(this.statName)) {
            return `${this.#StatAmount * 100}%`
        }
        return this.#StatAmount
    }
}
class Enchant extends Enhancement {
    #Slot;
    constructor({name, slot, statName, statAmount}) {
        super({name, statName, statAmount})
        this.#Slot = slot;
    }
    get slot() { return this.#Slot }
}
class Gem extends Enhancement {
    #Color;
    constructor(props) {
        super(props)
        this.#Color = props.color
    }
    get color() { return this.#Color }
}

class Consumable extends Item {
    #Attack;
    #Defense;
    #Health;
    #MaxHealth;
    #Str;
    #Agi;
    #Int;
    #Spd;
    #Exp;
    //#ExtraSpeed;
    //#ExtraYield;
    #BuffName;
    #Slot;
    #CraftedStats;
    constructor({ name, amount, price, stackable, icon, attack, defense, health, maxhealth, str, agi, int, spd, exp, description, slot, craftedStats }) {
        super({ name, amount, price, stackable, icon: icon ?? "item", description })
        this.#Attack = attack ?? 0;
        this.#Defense = defense ?? 0;
        this.#Health = health ?? 0;
        this.#MaxHealth = maxhealth ?? 0;
        this.#Str = str ?? 0;
        this.#Agi = agi ?? 0;
        this.#Int = int ?? 0;
        this.#Spd = spd ?? 0;
        this.#Exp = exp ?? 0;
        //this.#ExtraSpeed = extraSpeed ?? 0;
        //this.#ExtraYield = extraYield ?? 0;
        this.#BuffName = name;
        this.#CraftedStats = Array.isArray(craftedStats) ? craftedStats : [];
        this.#Slot = slot ?? null;
    }
    get attack() { return this.#Attack }
    get defense() { return this.#Defense }
    get health() { return this.#Health }
    get maxhealth() { return this.#MaxHealth }
    get str() { return this.#Str }
    get agi() { return this.#Agi }
    get int() { return this.#Int }
    get spd() { return this.#Spd }
    get exp() { return this.#Exp }
    //get extraSpeed() { return this.#ExtraSpeed }
    //get speedProper() { return `${this.#ExtraSpeed * 100}%` }
    //get extraYield() { return this.#ExtraYield }
    //get yieldProper() { return `${this.#ExtraYield * 100}%` }
    get buff() { return this.#BuffName }
    get slot() { return this.#Slot }
    get craftedStats() { return this.#CraftedStats }
    get stats() { 
        return {
            Health: this.health,
            MaxHealth: this.maxhealth,
            Attack: this.attack,
            Defense: this.defense,
            Str: this.str,
            Agi: this.agi,
            Int: this.int,
            Spd: this.spd,
            Exp: this.exp,
            //ExtraSpeed: this.extraSpeed,
            //ExtraYield: this.extraYield,
        }
    }
    set slot(slot) { this.#Slot = slot }

    increaseStat(stat, value) {
        if(/attack/i.test(stat)) { this.#Attack += value }
        if(/defense/i.test(stat)) { this.#Defense += value }
        if(/maxhealth/i.test(stat)) { this.#MaxHealth += value }
        if(/\bhealth/i.test(stat)) { this.#Health += value }
        if(/str/i.test(stat)) { this.#Str += value }
        if(/agi/i.test(stat)) { this.#Agi += value }
        if(/int/i.test(stat)) { this.#Int += value }
        if(/spd/i.test(stat)) { this.#Spd += value }
        if(/exp/i.test(stat)) { this.#Exp += value }
    }

    craftWithMats(craftMats, craftEffects) {
        let craftedStats = []
        craftMats.map((mat) => {
            const bonus = Object.hasOwn(craftEffects, mat)
            const craftedStat = bonus ? Object.keys(craftEffects[mat])[0] : null
            const stat = Object.entries(this.stats).flatMap(([stat, val]) => val > 0 ? [stat] : [])[0]

            if(craftedStat) {
                const statBonus = craftEffects[mat][craftedStat]
                let craftedStatVal = statBonus

                if(craftedStat == "Potency") {
                    const value = this.stats[stat]
                    const additionalStatVal = Math.round(value * statBonus)
                    craftedStatVal = additionalStatVal >= 1 ? additionalStatVal : 1 //Min add 1
                    if(/spd/i.test(stat)) {
                        const additionalStatVal = parseFloat((value * statBonus).toFixed(2))
                        craftedStatVal = additionalStatVal
                    }
                    this.increaseStat(stat, craftedStatVal)
                }

                craftedStats.push({[craftedStat]: craftedStatVal})
            }
        })
        this.#CraftedStats = craftedStats
    }
}
class Potion extends Consumable {
    #CraftMats;
    #AutoRefresh;
    constructor(props) {
        super(props)
        this.slot = "potion"
        this.stackable = true
        this.#AutoRefresh = true;
        const craftEffects = {
            "lingering_elixir_1": { Duration: 1.0 },
            "potent_elixir_1": { Potency: 0.5 },
            "lingering_elixir_2": { Duration: 1.0 },
            "potent_elixir_2": { Potency: 0.5 },
        }
        if(props?.craftMats && props.craftMats.length > 0 && props.slot != "flask") {
            this.craftWithMats(props.craftMats, craftEffects)
            this.#CraftMats = props.craftMats
        }
    }
    get craftMats() { return this.#CraftMats }
    get autoRefresh() { return this.#AutoRefresh }
    set autoRefresh(refresh) { this.#AutoRefresh = refresh }

    craftedStatsMatch(potion) {
        if(potion?.craftedStats.length != this.craftedStats?.length) { return false }
        if(potion?.craftedStats.length == this.craftedStats?.length) {
            //Check potion craftedStats
            const potionMatches = potion.craftedStats.every((statObj, i) => {
                let stat = Object.keys(statObj)[0]
                return Object.hasOwn(this.craftedStats[i], stat) && potion.craftedStats[i][stat] == this.craftedStats[i][stat]
            })
            //Check item craftedStats
            const itemMatches = this.craftedStats.every((statObj, i) => {
                let stat = Object.keys(statObj)[0]
                return Object.hasOwn(potion.craftedStats[i], stat) && potion.craftedStats[i][stat] == this.craftedStats[i][stat]
            })
            return potionMatches && itemMatches
        }
        return true
    }
    canEquip(player) {
        if(player.Gear.Potion1 && replaceRank(player.Gear.Potion1.name) == replaceRank(this.name)) {
            return this.craftedStatsMatch(player.Gear.Potion1) && player.Gear.Potion1.name == this.name
        }
        if(player.Gear.Potion2 && replaceRank(player.Gear.Potion2.name) == replaceRank(this.name)) {
            return this.craftedStatsMatch(player.Gear.Potion2) && player.Gear.Potion2.name == this.name
        }
        if(player.Gear.Potion3 && replaceRank(player.Gear.Potion3.name) == replaceRank(this.name)) {
            return this.craftedStatsMatch(player.Gear.Potion3) && player.Gear.Potion3.name == this.name
        }
        return !player.Gear.Potion1 || !player.Gear.Potion2 || !player.Gear.Potion3
    }
}
class Flask extends Potion {
    #CraftMats;
    constructor(props) {
        super(props)
        this.slot = "flask"
        const craftEffects = {
            "lingering_elixir_1": { Duration: 1.0 },
            "potent_elixir_1": { Potency: 0.5 },
            "lingering_elixir_2": { Duration: 1.0 },
            "potent_elixir_2": { Potency: 0.5 },
        }
        if(props?.craftMats && props.craftMats.length > 0) {
            this.craftWithMats(props.craftMats, craftEffects)
            this.#CraftMats = props.craftMats
        }
    }
    get craftMats() { return this.#CraftMats }
}
class Prayer extends Consumable {
    constructor(props) {
        super(props)
        this.slot = "prayer"
        this.stackable = false
        this.amount = 0
    }
    canEquip(player) {
        return !player.Gear.Prayer
    }
}
class Scroll extends Consumable {
    constructor(props) {
        super(props)
    }

}
class WorldBuff extends Consumable {
    constructor(props) {
        super(props)
    }
    get nameProper() { 
        let name = this.name
        if(!name.includes("worldbuff")) {
            name += "_worldbuff"
        }
        return toProper(name)
    } 
}

class Food extends Item {
    #Health;
    #Slot;
    constructor(props) {
        super(props)
        this.#Health = props.health ?? 0;
        this.#Slot = "food"
    }
    get health() { return this.#Health }
    get slot() { return this.#Slot }
    canEquip(player) {
        if(player.Gear.Food && player.Gear.Food.name == this.name) { return true }
        return !player.Gear.Food
    }
}

class Gear extends Item {
    #Slot;
    #AttackSpeed;
    #BaseAttackSpeed;
    #ReqLevel;
    #Attack;
    #Defense;
    #Health;
    #Str;
    #Agi;
    #Int;
    #StartingStats;
    #ReqStats;
    #EnchantedStats;
    #SocketedStats;
    #BonusStats;
    #CraftedStats;
    #Sockets;
    #SocketBonus;
    #MaxSockets;
    #AttackSpeedIncrease;
    #Affixes;
    #DropLocation;
    constructor({ name, amount, price, icon, slot, attackSpeed, reqLevel, attack, defense, health, str, agi, int, reqStats, description, enchantedStats, sockets, craftedStats, affixes, rarity, dropLocation }) {
        super({name, amount: 1, price, icon: icon ?? "item", stackable: false, description, rarity})
        this.#Attack = attack ?? 0;
        this.#Defense = defense ?? 0;
        this.#Health = health ?? 0; // maxhealth
        this.#Str = str ?? 0;
        this.#Agi = agi ?? 0;
        this.#Int = int ?? 0;
        this.#Slot = slot;
        //If custom attack speed, use that, otherwise weapontype speed, fallback to default
        const weapontype = name ? getWeaponType(name) : name
        const atkspeed = weaponAttackSpeeds[weapontype]
        const defaultSpeed = slot == "weapon" ? DefaultAttackSpeed : null
        this.#AttackSpeed = attackSpeed ? attackSpeed : atkspeed ?? defaultSpeed;
        this.#BaseAttackSpeed = attackSpeed ? attackSpeed : atkspeed ?? defaultSpeed;
        this.#AttackSpeedIncrease = []
        this.#ReqLevel = reqLevel ?? 0;
        this.#ReqStats = reqStats ?? {};
        this.#EnchantedStats = enchantedStats ?? {};
        this.#SocketedStats = [];
        this.#CraftedStats = Array.isArray(craftedStats) ? craftedStats : [];
        this.#BonusStats = {};
        this.#Sockets = sockets ?? [];
        this.#DropLocation = dropLocation ?? "shop" // Used for affixes, fallback to worst affixes
        //TODO: Array of objects with [{name: "", actual: {}, rendered: {}, original: {}}]
        this.#Affixes = affixes
            ? {actual: affixes.actual, rendered: [], original: affixes.original, rarity: affixes.rarity} //We clear/reapply rendered when comparing
            : {actual: [], rendered: [], original: [], rarity: rarity};
        const maxSockets = {
            "head": 3,
            "chest": 3,
            "feet": 2,
            "weapon": 3,
            "ring": 2,
            "neck": 2,
        }
        this.#MaxSockets = maxSockets[slot] ?? 0
        this.#StartingStats = {
            attack: attack,
            defense: defense,
            health: health,
            str: str,
            agi: agi,
            int: int,
        }
    }

    get attack() { return this.#Attack }
    get defense() { return this.#Defense }
    get health() { return this.#Health }
    get str() { return this.#Str }
    get int() { return this.#Int }
    get agi() { return this.#Agi }
    get spd() { return this.#AttackSpeed }
    get slot() { return this.#Slot }
    get attackSpeed() { return this.#AttackSpeed }
    get baseAttackSpeed() { return this.#BaseAttackSpeed }
    get reqLevel() { return this.#ReqLevel }
    get reqStats() { return this.#ReqStats }
    get isEnchanted() { return Object.keys(this.#EnchantedStats).length > 0 }
    get enchantedStats() { return this.#EnchantedStats }
    get socketedStats() { return this.#SocketedStats }
    get socketBonus() { return this.#SocketBonus }
    get craftedStats() { return this.#CraftedStats }
    get bonusStats() { return this.#BonusStats }
    get affixes() { return this.#Affixes }
    get actualAffixes() { return this.#Affixes.actual }
    get renderedAffixes() { return this.#Affixes.rendered }
    get originalAffixes() { return this.#Affixes.original }
    get dropLocation() { return this.#DropLocation }
    get enchantedSpeed() {
        if(this.#EnchantedStats && this.#EnchantedStats.stats["Spd"]) {
            return `${this.#EnchantedStats.stats["Spd"] * 100}%`
        }
    }
    get maxSockets() { return this.#MaxSockets }
    get sockets() { return this.#Sockets }
    set slot(slot) { this.#Slot = slot }

    set sockets(socket) {
        let numSockets = this.#Sockets.length
        if(numSockets < this.maxSockets) {
            this.#Sockets[numSockets] = socket
        }
        if(this.#Sockets.length == this.maxSockets) {
            this.setSocketBonus()
            this.updateBonusStats()
        }
    }

    //Some runes apply randomness on craft and this allows us to re-assign
    //  those stats back on raw gear compare
    set craftedStats(craftedStats) {
        //remove old then add new
        this.#CraftedStats.forEach((statObj) => {
            Object.entries(statObj).forEach(([stat, value]) => {
                this.decreaseStat(stat, value)
            })
        })
        this.applyCraftedStats(craftedStats)
        this.#CraftedStats = craftedStats
    }

    applyCraftedStats(craftedStats) {
        craftedStats.forEach((statObj) => {
            Object.entries(statObj).forEach(([stat, value]) => {
                this.increaseStat(stat, value)
            })
        })
    }

    clearBonuses() {
        if(this.isEnchanted) {
            //Remove enchant
            let stat = Object.keys(this.enchantedStats)[0]
            let value = Object.values(this.enchantedStats)[0]
            this.decreaseStat(stat, value)
            this.#EnchantedStats = {}
        }
        let socketColors = []
        this.#Sockets.forEach((socketSlot, slotNum) => {
            const socketColor = Object.keys(socketSlot)[0]
            //NOTE: Important. Setting socketSlot[socketColor] = null deletes original gem
            // Overriding the slot with an empty socket does not delete the socketedGem for original item
            socketColors.push({[socketColor]: null})

            if(socketSlot[socketColor] != null && this.#SocketedStats[slotNum]) {
                //Remove old gem
                const socketedGem = socketSlot[socketColor]
                //TODO: statName/statAmount array
                //TODO: Done but cleanup how its done
                socketedGem.statName.forEach((statname, i) => {
                    const stat = statname
                    const value = socketedGem.statAmount[i]
                    this.decreaseStat(stat, value)
                })
                this.#SocketedStats[slotNum] = {}
            }
        })
        this.#Sockets = socketColors
        if(this.#SocketBonus && this.#BonusStats[this.#SocketBonus[0]] != 0) {
            const bonusStatVal = Object.values(this.#BonusStats)[0]
            if(bonusStatVal > 0 && this.#SocketBonus[0] == "Attack") { this.#Attack -= bonusStatVal }
            if(bonusStatVal > 0 && this.#SocketBonus[0] == "Defense") { this.#Defense -= bonusStatVal }
            if(bonusStatVal > 0 && this.#SocketBonus[0] == "Health") { this.#Health -= bonusStatVal }
        }
        this.#BonusStats = {}
        this.#Affixes.rendered[this.#Affixes.rendered.length] = "compare"
    }

    applyPostCraftBonuses() {
        //We use Affixes.rarity so when we load normal items it doesnt use a random new rarity from addItems since they have no affixes
        if(rarities.includes(this.#Affixes.rarity) && this.#Affixes.actual.length == 0) {
            this.generateAffixes()
            this.generateRandomNumSockets()
        }
        if(this.#Affixes.actual.length > 0) {
            this.verifyAffixes()
            this.applyAffixes()
            const rarity = rarities[this.#Affixes.actual.length-1]
            this.#Affixes.rarity = rarity
        }
        if(this.#Sockets.length > 0 && this.#Sockets.length == this.#MaxSockets) {
            this.setSocketBonus()
            this.updateBonusStats()
        }
        this.rarity = this.#Affixes.rarity
    }

    verifyAffixes() {
        this.#Affixes.original.forEach((affixObj, i) => {
            let original = affixObj
            let actual = this.#Affixes.actual[i]
            Object.entries(original).forEach(([statname, info]) => {
                let {name, rolled, min, max} = { ...info }

                if(!gearAffixes[this.dropLocation][name]) {
                    console.log(`Affix '${name}' no longer available for ${this.slot} slot`)
                    console.log(`Rerolling`)
                    this.removeAffix(i)
                    this.rollAffix(i)
                    statname = Object.entries(this.#Affixes.original[i])[0][0]
                    ({name, rolled, min, max} = this.#Affixes.original[i][statname]);
                }
                const gameAffixMin = gearAffixes[this.dropLocation][name][statname][0]
                const gameAffixMax = gearAffixes[this.dropLocation][name][statname][1]

                //Update original and actual if affix min/max changes
                if(min != gameAffixMin || max != gameAffixMax) {
                    const currentOfRange = rolled / (max + min)
                    rolled = parseFloat(currentOfRange * (gameAffixMax + gameAffixMin))
                    original[statname]["min"] = gameAffixMin
                    original[statname]["max"] = gameAffixMax
                    original[statname]["rolled"] = rolled
                    actual[statname] = rolled
                }

                const foundAffixStat = this.craftedStats.find((statObj) => statObj.hasOwnProperty("Affixes"))
                if(foundAffixStat) {
                    const affixPercent = foundAffixStat?.Affixes
                    const enhancedPercent = parseFloat((rolled * affixPercent).toFixed(2))
                    const enhanced = rolled + enhancedPercent
                    const current = actual[statname]
                    //If original + enhance != actual, update actual
                    if(enhanced != current) {
                        actual[statname] = enhanced
                    }
                }
            })
        })
    }
    rerollAffix(slotNum) {
        if(slotNum == "all") {
            let numAffixes = this.#Affixes.original.length
            this.removeAffixes()
            for(let i=0; i<numAffixes; i++) {
                this.rollAffix(i)
            }
            this.applyAffixes()
        } else {
            this.removeAffix(slotNum)
            this.rollAffix(slotNum)
            this.applyAffix(slotNum)
        }
        return true
    }

    rollAffix(slotNum) {
        // Be allowed to reroll the same affix, but NOT other ones still on item
        let currentAffixes = this.#Affixes.original.map((affix) => affix ? Object.entries(affix)[0][1].name : null).filter((name, i) => name && i != slotNum)
        let allowedAffixes = affixSlots[this.slot].filter((affixname) => !currentAffixes.includes(affixname))

        let affixStats = {}
        let unModdedAffixStats = {}

        const affixNum = Math.floor(Math.random() * allowedAffixes.length)
        const affixName = allowedAffixes[affixNum]

        //DropLocation determines ranges. npc, craft, shop
        const affixObj = gearAffixes[this.dropLocation][affixName]
        Object.keys(affixObj).forEach((statname) => {
            const minval = affixObj[statname][0] * 100
            const maxval = affixObj[statname][1] * 100
            let percent = (Math.floor(Math.random() * (maxval - minval))+minval) / 100
            unModdedAffixStats[statname] = {
                name: affixName,
                rolled: percent,
                min: affixObj[statname][0],
                max: affixObj[statname][1],
            }
            //Add crafted affix enhancements
            let foundAffixStat = this.craftedStats.find((statObj) => statObj.hasOwnProperty("Affixes"))
            if(foundAffixStat) {
                const affixPercent = foundAffixStat?.Affixes
                const enhancedPercent = parseFloat((percent * affixPercent).toFixed(2))
                percent += enhancedPercent
            }
            affixStats[statname] = percent
        })

        this.#Affixes.actual[slotNum] = affixStats
        this.#Affixes.original[slotNum] = unModdedAffixStats
    }

    generateAffixes() {
        if(this.#Affixes.actual.length > 0) { return }
        let numAffixes = 0
        if(this.rarity == "uncommon"){ numAffixes = 1 }
        if(this.rarity == "rare"){ numAffixes = 2 }
        if(this.rarity == "epic"){ numAffixes = 3 }

        let affixesToAdd = []
        let allowedAffixes = affixSlots[this.slot]
        let affixStats = []
        let unModdedAffixStats = []
        for(let i=0; i<numAffixes; i++) {
            //TODO: this.rollAffix()
            let added = false
            while(!added) {
                const affixNum = Math.floor(Math.random() * allowedAffixes.length)
                const affixName = allowedAffixes[affixNum]
                if(affixesToAdd.includes(affixName)) { continue; }

                affixesToAdd.push(affixName)
                affixStats[i] = {}
                unModdedAffixStats[i] = {}

                //DropLocation determines ranges. npc, craft, shop
                const affixObj = gearAffixes[this.dropLocation][affixName]
                Object.keys(affixObj).forEach((statname) => {
                    const minval = affixObj[statname][0] * 100
                    const maxval = affixObj[statname][1] * 100
                    let percent = (Math.floor(Math.random() * (maxval - minval))+minval) / 100
                    unModdedAffixStats[i][statname] = {
                        name: affixName,
                        rolled: percent,
                        min: affixObj[statname][0],
                        max: affixObj[statname][1],
                        //rerolled: false,   // ?
                    }
                    //Add crafted affix enhancements
                    let foundAffixStat = this.craftedStats.find((statObj) => statObj.hasOwnProperty("Affixes"))
                    if(foundAffixStat) {
                        const affixPercent = foundAffixStat?.Affixes
                        const enhancedPercent = parseFloat((percent * affixPercent).toFixed(2))
                        percent += enhancedPercent
                    }
                    affixStats[i][statname] = percent
                })
                added = true
            }
        }
        this.#Affixes.actual = affixStats
        this.#Affixes.original = unModdedAffixStats
    }

    generateRandomNumSockets() {
        const chanceForSocket = {
            default: {
                //uncommon 15% chance for 1 socket, 2 percent for 2
                uncommon: { one: 83, two: 98 },
                //rare 20% chance for 1 socket, 5 percent for 2
                rare: { one: 75, two: 95 },
                //epic 25% chance for 1 socket, 10 percent for 2
                epic: { one: 65, two: 90 },
            },
            // Default 1 socket for crafted items and better % for 2, increasing value from crafts
            craft: {
                uncommon: { one: 0, two: 90 },
                rare: { one: 0, two: 85 },
                epic: { one: 0, two: 80 },
            }
        }

        let numToSocket = 0
        let socketChances = chanceForSocket["default"]
        if(/craft|runeforged/i.test(this.dropLocation)) {
            socketChances = chanceForSocket["craft"]
        }
        let singleSocketRng = socketChances[this.rarity]["one"]
        let doubleSocketRng = socketChances[this.rarity]["two"]

        const rng = Math.floor(Math.random() * 100)
        if(rng >= singleSocketRng) { numToSocket = 1 }
        if(rng >= doubleSocketRng) { numToSocket = 2 }
        for(let i=0; i<numToSocket; i++) {
            this.socket({color: "grey"})
        }
    }

    removeAffixes() {
        this.#Affixes.actual.forEach((affixObj, slotNum) => {
            this.removeAffix(slotNum)
        })
    }

    removeAffix(slotNum) {
        const affixObj = this.#Affixes.actual[slotNum]
        Object.keys(affixObj).forEach((statname, ind) => {
            const percent = affixObj[statname]
            const startingVal = this.#StartingStats[statname]
            const statVal = Math.round(startingVal * percent)
            let val = statVal >= 1 ? statVal : 1 //Min add 1
            if(statname == "spd") { val = percent }
            this.decreaseStat(statname, val)
        })
        this.#Affixes.actual[slotNum] = null
        this.#Affixes.rendered[slotNum] = null
        this.#Affixes.original[slotNum] = null
    }

    applyAffixes() {
        this.#Affixes.actual.forEach((affixObj, slotNum) => {
            this.applyAffix(slotNum)
        })
    }

    applyAffix(slotNum) {
        let affixObj = this.#Affixes.actual[slotNum]
        this.#Affixes.rendered[slotNum] = {}

        Object.keys(affixObj).forEach((statname, ind) => {
            const percent = affixObj[statname]
            let startingVal = this.#StartingStats[statname]

            let foundCraftedStat = this.craftedStats.find((statObj) => statObj.hasOwnProperty(toProper(statname)))
            if(foundCraftedStat) {
                startingVal += foundCraftedStat[toProper(statname)]
            }
            //TODO: Later. If affix % based bonus, apply sockets and enchants
            //NOTE: Enchants/sockets are after item is created in .createItem

            const statVal = Math.round(startingVal * percent)
            let val = statVal >= 1 ? statVal : 1 //Min add 1
            if(statname == "spd") { val = percent }
            this.increaseStat(statname, val)
            this.#Affixes.rendered[slotNum][statname] = val
        })
    }

    setSocketBonus() {
        const bonuses = {
            head: "Attack",
            chest: "Defense",
            feet: "Health",
            weapon: "Attack",
            ring: "Attack",
            neck: "Health",
        }
        let bonus = ""
        let numRedSockets = this.#Sockets.filter((socket) => Object.keys(socket)[0] == "red").length
        let numYellowSockets = this.#Sockets.filter((socket) => Object.keys(socket)[0] == "yellow").length
        let numBlueSockets = this.#Sockets.filter((socket) => Object.keys(socket)[0] == "blue").length
        if(numRedSockets >= 2) { bonus = "Attack" }
        if(numYellowSockets >= 2) { bonus = "Health" }
        if(numBlueSockets >= 2) { bonus = "Defense" }
        const bonusStat = bonus ? bonus : bonuses[this.slot] ?? "Health"
        const bonusVal = determineSocketBonus(bonusStat, this.name)
        this.#SocketBonus = [bonusStat, bonusVal]
    }
    increaseStat(stat, value) {
        if(/attack/i.test(stat)) { this.#Attack += value }
        if(/defense/i.test(stat)) { this.#Defense += value }
        if(/health/i.test(stat)) { this.#Health += value }
        if(/str/i.test(stat)) { this.#Str += value }
        if(/agi/i.test(stat)) { this.#Agi += value }
        if(/int/i.test(stat)) { this.#Int += value }
        if(/spd/i.test(stat)) {
            this.#AttackSpeed = decreaseAtkSpeed(this.#BaseAttackSpeed, this.#AttackSpeedIncrease, value)
        }
    }
    decreaseStat(stat, value) {
        if(/attack/i.test(stat)) { this.#Attack -= value }
        if(/defense/i.test(stat)) { this.#Defense -= value }
        if(/health/i.test(stat)) { this.#Health -= value }
        if(/str/i.test(stat)) { this.#Str -= value }
        if(/agi/i.test(stat)) { this.#Agi -= value }
        if(/int/i.test(stat)) { this.#Int -= value }
        if(/spd/i.test(stat)) {
            this.#AttackSpeed = increaseAtkSpeed(this.#BaseAttackSpeed, this.#AttackSpeedIncrease, value)
        }
    }

    craftWithMats(craftMats, craftEffects) {
        let craftedStats = []
        craftMats.map((mat, i) => {
            if(!mat) { return }

            //Extract rune tier from mat
            const tier = mat.replace(/rune_of_[a-z]*_?/i, "") 
            if(tier) {
                mat = mat.replace(/_\d/i, "") 
            }

            const bonus = Object.hasOwn(craftEffects, mat)
            let stat = bonus ? Object.keys(craftEffects[mat])[0] : null

            if(stat == "Rarity") {
                if(!/craft|runeforged/i.test(this.dropLocation)) {
                    return craftedStats.push({[stat]: "TBD"})
                }
                if(this.#Affixes.actual.length == 0) {
                    if(this.rarity == "rare") { this.rarity = "epic" }
                    if(this.rarity == "uncommon") { this.rarity = "rare" }
                    if(this.rarity == "normal") { this.rarity = "uncommon" }
                    this.#Affixes.rarity = this.rarity
                } else {
                    this.rarity = rarities[this.#Affixes.actual.length-1]
                }
                return craftedStats.push({[stat]: toProper(this.rarity)})
            }

            if(stat) {
                let valIncrease = craftEffects[mat][stat]

                //Multiply effect depending on tier
                //Probably change depending on type of rune, any being 4x and affixes 100%+ kinda crazy
                if(/rune/i.test(mat)) {
                    valIncrease = tier ? parseFloat(valIncrease * tier) : valIncrease
                    if(/affixes/i.test(stat)) { valIncrease += 0.0001 } //force float/percent when 1 
                }

                if(!/affixes|any/i.test(stat) && !Number.isInteger(valIncrease)) {
                    const currentVal = this.#StartingStats[stat.toLowerCase()]
                    const additionalStatVal = Math.round(currentVal * valIncrease)
                    valIncrease = additionalStatVal >= 1 ? additionalStatVal : 1 //Min add 1
                }

                if(stat == "Any") {
                    if(!/craft|runeforged/i.test(this.dropLocation)) {
                        return craftedStats.push({[stat]: "Random x2"})
                    }
                    const rng = Math.floor(Math.random() * Object.keys(this.#StartingStats).length)
                    let randomStat = toProper(Object.keys(this.#StartingStats)[rng])
                    //Use previous randomStat found but apply new values
                    if(this.#CraftedStats.length > 0) {
                        randomStat = Object.keys(this.#CraftedStats[i])[0]
                    }
                    const randomStatCraftEffect = Object.values(craftEffects).find((effectObj) => {
                        let stat = Object.keys(effectObj)[0]
                        return randomStat == stat
                    })[randomStat]

                    let additionalStatVal = Math.round(randomStatCraftEffect * valIncrease)

                    //If randomStatCraftEffect is a percent
                    if(!Number.isInteger(randomStatCraftEffect)) {
                        const currentVal = this.#StartingStats[randomStat.toLowerCase()]
                        const bonusCraftEffect = randomStatCraftEffect * valIncrease
                        additionalStatVal = Math.round(currentVal * bonusCraftEffect)
                    }

                    valIncrease = additionalStatVal >= 2 ? additionalStatVal : 2 //Min add 2 for random
                    stat = randomStat
                }

                craftedStats.push({[stat]: valIncrease})
                this.increaseStat(stat, valIncrease)
            }
        })
        this.#CraftedStats = craftedStats
    }

    enchant(enchantment) {
        if(enchantment.slot !== this.slot) {
            //TODO: Error popup maybe but this also shouldnt really happen how its setup currently
            console.log("Wrong slot")
            return false
        }
        if(this.isEnchanted) {
            //Remove old enchant
            let stat = Object.keys(this.#EnchantedStats.stats)[0]
            let value = Object.values(this.#EnchantedStats.stats)[0]
            this.decreaseStat(stat, value)
            this.#EnchantedStats = {}
        }
        let stat = enchantment.statNameProper
        let value = enchantment.statAmount
        this.increaseStat(stat, value)
        this.#EnchantedStats.stats = {[stat]: value}
        this.#EnchantedStats.name = enchantment.name
        return true
    }

    rerollSockets() {
        let numSockets = this.sockets.length
        this.sockets.forEach((socketSlot, slotNum) => {
            const socketColor = Object.keys(socketSlot)[0]
            if(socketSlot[socketColor] != null && this.#SocketedStats[slotNum]) {
                //Remove old gem
                const socketedGem = socketSlot[socketColor]
                //TODO: statName/statAmount array
                //TODO: Done but cleanup how its done
                socketedGem.statName.forEach((statname, i) => {
                    const stat = statname
                    const value = socketedGem.statAmount[i]
                    this.decreaseStat(stat, value)
                })
            }
            this.#SocketedStats[slotNum] = {}
        })
        if(this.#SocketBonus && this.#BonusStats[this.#SocketBonus[0]] != 0) {
            const bonusStatVal = Object.values(this.#BonusStats)[0]
            if(bonusStatVal > 0 && this.#SocketBonus[0] == "Attack") { this.#Attack -= bonusStatVal }
            if(bonusStatVal > 0 && this.#SocketBonus[0] == "Defense") { this.#Defense -= bonusStatVal }
            if(bonusStatVal > 0 && this.#SocketBonus[0] == "Health") { this.#Health -= bonusStatVal }
        }
        this.#BonusStats = {}
        this.#Sockets = []
        for(let i=0; i<numSockets; i++) {
            this.socket({color: "grey"})
        }
        return true
    }

    socket(gem, slotNum) {
        if(gem.color == "grey") {
            if(this.sockets.length >= this.maxSockets) { return false }
            const colors = ["red", "yellow", "blue"]
            const rngColor = Math.floor(Math.random() * colors.length)
            const color = colors[rngColor]
            this.sockets = { [color]: null }
            return true
        }

        const socketSlot = this.sockets[slotNum]
        const socketColor = Object.keys(socketSlot)[0]

        if(socketSlot[socketColor] != null && this.#SocketedStats[slotNum]) {
            //Remove old gem
            const socketedGem = socketSlot[socketColor]
            //TODO: statName/statAmount array
            //TODO: Done but cleanup how its done
            socketedGem.statName.forEach((statname, i) => {
                const stat = statname
                const value = socketedGem.statAmount[i]
                this.decreaseStat(stat, value)
            })
            this.#SocketedStats[slotNum] = {}
        }

        this.#SocketedStats[slotNum] = {}
        //TODO: statName/statAmount array
        //TODO: Done but cleanup how its done
        gem.statName.forEach((statname, i) => {
            const stat = toProper(statname)
            const value = gem.statAmount[i]
            this.increaseStat(stat, value)

            this.#SocketedStats[slotNum][stat] = value
        })

        socketSlot[socketColor] = gem
        
        if(this.sockets.length >= this.maxSockets) {
            this.updateBonusStats()
        }
        return true
    }
    updateBonusStats() {
        const addBonusStat = this.sockets.every((socket, i) => {
            const socketColor = Object.keys(socket)[0]
            const socketedGem = socket[socketColor]
            if(socketedGem && socketedGem.color == "green") {
                return socketColor == "blue" || socketColor == "yellow"
            }
            if(socketedGem && socketedGem.color == "purple") {
                return socketColor == "blue" || socketColor == "red"
            }
            return socketedGem && socketColor == socketedGem.color
        })
        if(this.#SocketBonus && this.#BonusStats[this.#SocketBonus[0]] != 0) {
            const bonusStatVal = Object.values(this.#BonusStats)[0]
            if(bonusStatVal > 0) { this.decreaseStat(this.#SocketBonus[0], bonusStatVal) }
            this.#BonusStats[this.#SocketBonus[0]] = 0
        }
        if(addBonusStat && this.#SocketBonus && this.#BonusStats[this.#SocketBonus[0]] == 0) {
            const bonusStatVal = this.#SocketBonus[1]
            this.increaseStat(this.#SocketBonus[0], bonusStatVal)
            this.#BonusStats[this.#SocketBonus[0]] = bonusStatVal
        }
    }
    canEquip(player) {
        if(player.Gear.Helm && this.slot == "head") { return false }
        if(player.Gear.Chest && this.slot == "chest") { return false }
        if(player.Gear.Boots && this.slot == "feet") { return false }
        if(player.Gear.Weapon && this.slot == "weapon") { return false }
        if(player.Gear.Ring && this.slot == "ring") { return false }
        if(player.Gear.Necklace && this.slot == "neck") { return false }
        return Object.keys(this.#ReqStats).every((stat, i) => player.stats[stat] > stat)
    }
}

class Weapon extends Gear {
    #CraftMats;
    constructor(props) {
        super(props)
        this.slot = "weapon"
        const craftEffects = {
            "rune_of_chance": { Any: 2 },
            "rune_of_rarity": { Rarity: 1 },
            "rune_of_enhancement": { Affixes: 0.50 },
            "rune_of_striking": { Attack: runePerSlot["striking"][this.slot] },
            "rune_of_protection": { Defense: runePerSlot["protection"][this.slot] },
            "rune_of_fortitude": { Health: runePerSlot["fortitude"][this.slot] },
            "rune_of_strength": { Str: runePerSlot["strength"][this.slot] },
            "rune_of_agility": { Agi: runePerSlot["agility"][this.slot] },
            "rune_of_intellect": { Int: runePerSlot["intellect"][this.slot] },
        }
        if(props?.craftMats && props.craftMats.length > 0) {
            this.craftWithMats(props.craftMats, craftEffects)
            this.#CraftMats = props.craftMats
        }
        this.applyPostCraftBonuses()
    }
    get craftMats() { return this.#CraftMats }
}

class Armor extends Gear { }
class Helm extends Armor {
    #CraftMats;
    constructor(props) {
        super(props)
        this.slot = "head"
        const craftEffects = {
            "rune_of_chance": { Any: 2 },
            "rune_of_rarity": { Rarity: 1 },
            "rune_of_enhancement": { Affixes: 0.50 },
            "rune_of_striking": { Attack: runePerSlot["striking"][this.slot] },
            "rune_of_protection": { Defense: runePerSlot["protection"][this.slot] },
            "rune_of_fortitude": { Health: runePerSlot["fortitude"][this.slot] },
            "rune_of_strength": { Str: runePerSlot["strength"][this.slot] },
            "rune_of_agility": { Agi: runePerSlot["agility"][this.slot] },
            "rune_of_intellect": { Int: runePerSlot["intellect"][this.slot] },
        }
        if(props?.craftMats && props.craftMats.length > 0) {
            this.craftWithMats(props.craftMats, craftEffects)
            this.#CraftMats = props.craftMats
        }
        this.applyPostCraftBonuses()
    }
    get craftMats() { return this.#CraftMats }
}
class Chest extends Armor {
    #CraftMats;
    constructor(props) {
        super(props)
        this.slot = "chest"
        const craftEffects = {
            "rune_of_chance": { Any: 2 },
            "rune_of_rarity": { Rarity: 1 },
            "rune_of_enhancement": { Affixes: 0.50 },
            "rune_of_striking": { Attack: runePerSlot["striking"][this.slot] },
            "rune_of_protection": { Defense: runePerSlot["protection"][this.slot] },
            "rune_of_fortitude": { Health: runePerSlot["fortitude"][this.slot] },
            "rune_of_strength": { Str: runePerSlot["strength"][this.slot] },
            "rune_of_agility": { Agi: runePerSlot["agility"][this.slot] },
            "rune_of_intellect": { Int: runePerSlot["intellect"][this.slot] },
        }
        if(props?.craftMats && props.craftMats.length > 0) {
            this.craftWithMats(props.craftMats, craftEffects)
            this.#CraftMats = props.craftMats
        }
        this.applyPostCraftBonuses()
    }
    get craftMats() { return this.#CraftMats }
}
class Boots extends Armor {
    #CraftMats;
    constructor(props) {
        super(props)
        this.slot = "feet"
        const craftEffects = {
            "rune_of_chance": { Any: 2 },
            "rune_of_rarity": { Rarity: 1 },
            "rune_of_enhancement": { Affixes: 0.50 },
            "rune_of_striking": { Attack: runePerSlot["striking"][this.slot] },
            "rune_of_protection": { Defense: runePerSlot["protection"][this.slot] },
            "rune_of_fortitude": { Health: runePerSlot["fortitude"][this.slot] },
            "rune_of_strength": { Str: runePerSlot["strength"][this.slot] },
            "rune_of_agility": { Agi: runePerSlot["agility"][this.slot] },
            "rune_of_intellect": { Int: runePerSlot["intellect"][this.slot] },
        }
        if(props?.craftMats && props.craftMats.length > 0) {
            this.craftWithMats(props.craftMats, craftEffects)
            this.#CraftMats = props.craftMats
        }
        this.applyPostCraftBonuses()
    }
    get craftMats() { return this.#CraftMats }
}
class Ring extends Armor {
    #CraftMats;
    constructor(props) {
        super(props)
        this.slot = "ring"
        const craftEffects = {
            "red_crystal": { Attack: 1 },
            "blue_crystal": { Defense: 1 },
            "yellow_crystal": { Health: 20 },

            "rune_of_chance": { Any: 2 },
            "rune_of_rarity": { Rarity: 1 },
            "rune_of_enhancement": { Affixes: 0.50 },
            "rune_of_striking": { Attack: runePerSlot["striking"][this.slot] },
            "rune_of_protection": { Defense: runePerSlot["protection"][this.slot] },
            "rune_of_fortitude": { Health: runePerSlot["fortitude"][this.slot] },
            "rune_of_strength": { Str: runePerSlot["strength"][this.slot] },
            "rune_of_agility": { Agi: runePerSlot["agility"][this.slot] },
            "rune_of_intellect": { Int: runePerSlot["intellect"][this.slot] },
        }
        if(props?.craftMats && props.craftMats.length > 0) {
            this.craftWithMats(props.craftMats, craftEffects)
            this.#CraftMats = props.craftMats
        }
        this.applyPostCraftBonuses()
    }
    get craftMats() { return this.#CraftMats }
}
class Necklace extends Armor {
    #CraftMats;
    constructor(props) {
        super(props)
        this.slot = "neck"
        const craftEffects = {
            "red_crystal": { Attack: 1 },
            "blue_crystal": { Defense: 1 },
            "yellow_crystal": { Health: 20 },

            "rune_of_chance": { Any: 2 },
            "rune_of_rarity": { Rarity: 1 },
            "rune_of_enhancement": { Affixes: 0.50 },
            "rune_of_striking": { Attack: runePerSlot["striking"][this.slot] },
            "rune_of_protection": { Defense: runePerSlot["protection"][this.slot] },
            "rune_of_fortitude": { Health: runePerSlot["fortitude"][this.slot] },
            "rune_of_strength": { Str: runePerSlot["strength"][this.slot] },
            "rune_of_agility": { Agi: runePerSlot["agility"][this.slot] },
            "rune_of_intellect": { Int: runePerSlot["intellect"][this.slot] },
        }
        if(props?.craftMats && props.craftMats.length > 0) {
            this.craftWithMats(props.craftMats, craftEffects)
            this.#CraftMats = props.craftMats
        }
        this.applyPostCraftBonuses()
    }
    get craftMats() { return this.#CraftMats }
}


function Game(itemData, mobData) {
    this.Class = {
        Item: Item,
        Consumable: Consumable,
        Scroll: Scroll,
        Enhancement: Enhancement,
        Enchant: Enchant,
        Gem: Gem,
        Gear: Gear,
        Armor: Armor,
        Weapon: Weapon,
        Potion: Potion,
        Flask: Flask,
        Prayer: Prayer,
        Food: Food,
        Recipe: Recipe,
        Key: Key,
        Tool: Tool,
    }

    this.Player = new Player({name: "Player", health: 50, attack: 10, attackSpeed: 5})
    this.Items = itemData.skills
    this.Drops = itemData.item_catalog
    this.Mobs = mobData
    this.Silver = 0
    this.SilverDeathPenalty = 0.05 // %

    this.Battling = false
    this.Crafting = false
    this.PauseBattle = false
    this.Plot = null
    this.ActiveSkill = ""
    this.Screen = ""
    this.RecentActivity = {}
    this.RecentDrops = []
    this.PopupInfo = []
    this.Rarites = rarities

    //Load game clock from some type of state for now
    this.GameClocks = {
        LastBuffCheck: null,
        LastShopRefresh: null,
        LastHealthRegenTick: null,
    };

    this.healthLostOnRun = 0.15 //Percent of maxhealth
    this.healthRegenTickAmount = 0.05 //Percent of maxhealth
    this.healthRegenTickInterval = 5 // seconds
    this.ShopRefreshTime = 180  //seconds
    this.DefaultPotionDuration = DefaultPotionDuration //seconds
    this.DefaultFlaskDuration = DefaultFlaskDuration //seconds
    this.DefaultScrollDuration = DefaultScrollDuration //seconds
    this.TimeNow = Temporal.Now.instant()
    // TODO: Activity started
    this.TimePlotSelected = null

    this.SkillTree = Object.keys(itemData.skills).map((tech, i) => {
        return {name: toProper(tech), level: 1, experience: 0, baseExp: 10, multi: 1.2}
    })
    this.Skills = Object.fromEntries(
        this.SkillTree.map((skill, index) => [skill.name, skill])
    )

    this.Inventory = [];
    this.Shop = [];
    this.GamblingDen = [];

    this.Recipes = []
    const allIntroRecipes = this.Drops.filter((item) => /recipe_.*_intro/.test(item.name))
    allIntroRecipes.forEach((recipe) => this.unlockRecipe(recipe))

    this.Keyring = [];
    //TODO: Map instead of array, 1 slot for each skill
    this.Toolbelt = [];
    this.Dungeon = null
    this.Enemy = null
    this.DisplayEnemy = null
};

Game.prototype.resetDungeon = function() {
    this.Dungeon.mobs.forEach((enemy) => {
        enemy.resetSwingTimer()
        enemy.resetLastAttack()
        enemy.health = enemy.maxhealth
    })
    this.Enemy = this.Dungeon.mobs[0]
}

Game.prototype.advanceDungeon = function() {
    const nextMob = this.Dungeon.mobs.find((enemy) => enemy.health > 0)
    if(nextMob) {
        this.Enemy = nextMob
    } else {
        const droppedItems = this.dropDungeonLoot()
        if(droppedItems) { this.addItems(droppedItems) }
        this.resetDungeon()
        this.Battling = this.Dungeon.autoRestart && !this.Dungeon.restAfter
        if(!this.Battling) {
            this.resetLastRegenTick()
        }
    }
}

Game.prototype.dropDungeonLoot = function() {
    const numItemDropChances = { 1: 77, 2: 19, 3: 4 }
    const numItemsDropped = rollOneFromDistribution(numItemDropChances)

    //Make sure duplicate recipes dont drop if in dungeon loot pool
    if(Object.entries(this.Dungeon.lootTable).find(([name, chance]) => /recipe/i.test(name))) {
        this.Dungeon.lootTable = Object.fromEntries(
            Object.entries(this.Dungeon.lootTable).filter(([name, chance]) => {
                if(/recipe/i.test(name)) {
                    if(this.Recipes.find(recipe => recipe.name == name)) { return false }
                    if(this.Inventory.find(item => item.name == name)) { return false }
                }
                return true
            })
        )
    }

    const dungeonitems = Array.from({length: numItemsDropped}, (empty, i) => {
        let itemname = rollOneFromDistribution(this.Dungeon.lootTable)
        if(/rune/i.test(itemname)) {
            itemname = determineRune(itemname)
        }
        return {name: itemname, amount: 1, dropLocation: "npc" }
    }).filter((item) => item.name)

    const numMobItemDropChances = { 1: 30, 2: 42.3, 3: 27.7 }
    const numMobItemsDropped = rollOneFromDistribution(numMobItemDropChances)
    const mobLootTable = {}
    let nextZoneKey = { unlocked: false, name: "" }
    this.Dungeon.mobs.forEach((mob) => {
        Object.entries(mob.lootTable).forEach(([name, chance]) => {
            if(/_key/.test(name)) {
                //Ignore current dungeon
                const dungeonName = new RegExp(`${toCatalogName(this.Dungeon.name)}`)
                if(dungeonName.test(name)) { return }
                //Check if we have next zone key
                nextZoneKey.name = name
                if(this.Inventory.find(item => item.name == name)) { return nextZoneKey.unlocked = true }
                if(this.Keyring.find(key => key == name)) { return nextZoneKey.unlocked = true }
            }
            if(/recipe/i.test(name)) {
                //Prevent dup recipe from showing in mob loot table
                if(this.Recipes.find(recipe => recipe.name == name)) { return }
                if(this.Inventory.find(item => item.name == name)) { return }
                //Increase chance of unlearned
                chance *= 7
            }
            if(!mobLootTable[name]) { mobLootTable[name] = chance }
            else { mobLootTable[name] += chance }
        })
    })

    const mobitems = Array.from({length: numMobItemsDropped}, (empty, i) => {
        //If next zone not unlocked, first mob item always key
        if(i == 0 && !nextZoneKey.unlocked) {
            nextZoneKey.unlocked = true
            return {name: nextZoneKey.name, amount: 1, dropLocation: "npc" }
        }
        const itemname = rollOneFromDistribution(mobLootTable)
        const [extraDropChance, maxExtra] = [15, 2]
        const extraDrop = Math.random() * 100 <= extraDropChance
        const extraAmount = extraDrop ? Math.floor(Math.random()*maxExtra)+1 : 0
        return {name: itemname, amount: 1 + extraAmount, dropLocation: "npc" }
    }).filter((item) => item.name)
    
    const items = dungeonitems.concat(mobitems)

    const baseCoinDrop = 30
    const coinDropTiers = [1, 2, 3, 4, 5, 6]
    const coinDropMin = baseCoinDrop * coinDropTiers[this.Dungeon.tier]
    const coinDropMax = coinDropMin * 2
    const coinamount = Math.floor(Math.random() * (coinDropMax-coinDropMin))+coinDropMin
    const coin = {name: "coin", amount: coinamount}
    items.unshift(coin)
    return items
}

Game.prototype.addAlert = function(info) {
    const id = Math.random().toString(16).slice(2)
    let alert = {id: id, text: info, status: "open"}
    this.PopupInfo.push(alert)
    setTimeout(() => {
        alert.status = "close"
    }, 2500)
    setTimeout(() => {
        this.PopupInfo = this.PopupInfo.filter((d) => d.id != id)
    }, 3000)
}

Game.prototype.addTool = function(item) {
    let toolname = ""
    if(typeof item == "string") {
        toolname = item
    }
    if(typeof item == "object") {
        toolname = item?.name
    }
    //TODO: Once a map, replace key instead of push
    this.Toolbelt = this.Toolbelt.filter((tool) => tool) //cleans up bad tools
    const catalogItem = this.findInCatalog(toolname)
    if(!catalogItem) { return false }

    //TODO: For now simple replace of current tool if any
    this.Toolbelt = this.Toolbelt.filter((tool) => tool.skill != catalogItem.stats.skill)
    const tool = this.createItem(catalogItem)
    this.Toolbelt.push(tool)
    return true
}

Game.prototype.hasKey = function(dungeon) {
    let dungeonname = ""
    if(typeof dungeon == "string") {
        dungeonname = dungeon
    }
    if(typeof dungeon == "object") {
        dungeonname = dungeon?.name
    }
    const foundKey = this.Keyring.filter((key) => `${dungeonname}_key` == key)
    return foundKey.length > 0 || dungeonname == "fields"
}

Game.prototype.addKey = function(item) {
    let keyname = ""
    if(typeof item == "string") {
        keyname = item
    }
    if(typeof item == "object") {
        keyname = item?.name
    }
    this.Keyring = this.Keyring.filter((key) => key) //cleans up bad keys
    const foundKey = this.Keyring.filter((key) => keyname == key)
    if(foundKey.length == 0) {
        this.Keyring.push(keyname)
        this.populateGamblingDen()
        return true
    }
    return false
}

Game.prototype.populateGamblingDen = function() {
    const tier1items = [
        "copper_dagger", "copper_sword", "copper_mace", "copper_helm",
        "copper_chest", "copper_boots", "simple_ring", "simple_necklace",
    ]
    let items = tier1items

    if(this.Keyring.find(k => /^cave/i.test(k))) {
        const tier2items = [
            "bronze_dagger", "bronze_sword", "bronze_mace", "bronze_helm",
            "bronze_chest", "bronze_boots", "nice_ring", "nice_necklace",
        ]
        items = items.concat(tier2items)
    }
    if(this.Keyring.find(k => /^bandit_camp/i.test(k))) {
        const tier3items = [
            "iron_dagger", "iron_sword", "iron_mace", "iron_helm",
            "iron_chest", "iron_boots", "fancy_ring", "fancy_necklace",
        ]
        items = items.concat(tier3items)
    }
    if(this.Keyring.find(k => /^temple/i.test(k))) {
        const tier4items = [
            "steel_dagger", "steel_sword", "steel_mace", "steel_helm",
            "steel_chest", "steel_boots", "exquisite_ring", "exquisite_necklace",
        ]
        items = items.concat(tier4items)
    }
    if(this.Keyring.find(k => /^graveyard/i.test(k))) {
        const tier5items = [
            "mithril_dagger", "mithril_sword", "mithril_mace", "mithril_helm",
            "mithril_chest", "mithril_boots",
        ]
        items = items.concat(tier5items)
    }
    items.flat()
    let gamblingDen = [];
    items.forEach((itemname) => {
        //NOTE: These are common placeholders with price, we dont really care about them
        //Logic for random rarity will be on purchase
        let item = this.createItem(itemname)
        item.price *= 10
        gamblingDen.push(item)
    })
    this.GamblingDen = gamblingDen
}

Game.prototype.prospectItem = function(item, num) {
    let exp = 0
    item.name == "copper" && (exp = 5)
    item.name == "tin" && (exp = 15)
    item.name == "iron" && (exp = 25)
    item.name == "mithril" && (exp = 40)

    const prospectRates = {
        copper: 17,
        tin: 26,
        iron: 35,
        mithril: 45,
    }
    const reqLevelToProspect = {
        copper: 1,
        tin: 5,
        iron: 15,
        mithril: 30,
    }
    const dropRate = prospectRates[item.name]
    const skillLevel = this.Skills["Jewelcrafting"].level
    const levelDropChanceBoost = (0.005 * dropRate) * skillLevel
    const numTimesProspect = num / 5
    let addedItems = []
    let expToAdd = 0
    let amountToReduce = 0

    if(skillLevel < reqLevelToProspect[item.name]) {
        this.addAlert(`Required Jewelcrafting skill to prospect ${toProper(item.name)}: ${reqLevelToProspect[item.name]}`)
        return false
    }

    const tool = this.findToolInBelt("Jewelcrafting")

    for(let i=0; i<numTimesProspect; i++) {
        const rng = parseFloat((Math.random() * 100).toFixed(2)) 
        if(rng <= dropRate+levelDropChanceBoost) {
            const gems = ["green_crystal", "red_crystal", "blue_crystal", "yellow_crystal", "purple_crystal"]
            const rngGems = Math.floor(Math.random() * gems.length)
            let extraDropChance = 20
            if(tool && tool.extraYield) {
                extraDropChance += tool.extraYield * 100
            }
            const maxExtra = 1
            const extraDrop = Math.random() * 100 <= extraDropChance
            const extraAmount = extraDrop ? Math.floor(Math.random()*maxExtra)+1 : 0
            const alreadyAdded = addedItems.find((item)=> item.name == gems[rngGems])
            if(alreadyAdded) {
                alreadyAdded.amount += 1+extraAmount
            } else {
                addedItems.push({name: gems[rngGems], amount: 1+extraAmount})
            }
        }
        expToAdd += exp
        amountToReduce += 5
    }

    this.addExp(expToAdd, "Jewelcrafting")
    this.addItems(addedItems)
    item.reduceAmount(amountToReduce)
    this.Inventory = this.Inventory.filter((invItem, ind) => invItem.amount !== 0)
    return true
}

Game.prototype.buryItem = function(item, num = 1) {
    let exp = 0
    item.name == "bone" && (exp = 1)
    item.name == "large_bone" && (exp = 5)
    item.name == "thick_bone" && (exp = 20)
    item.name == "hardened_bone" && (exp = 80)
    item.name == "unholy_bone" && (exp = 200)

    const reqLevelToBury = {
        bone: 1,
        large_bone: 5,
        thick_bone: 15,
        hardened_bone: 25,
        unholy_bone: 30,
    }
    const skillLevel = this.Skills["Prayer"].level
    if(skillLevel < reqLevelToBury[item.name]) {
        this.addAlert(`Required Prayer skill to bury ${toProper(item.name)}: ${reqLevelToBury[item.name]}`)
        return false
    }

    let expToAdd = 0
    let amountToReduce = 0
    for(let i=0; i<num; i++) {
        expToAdd += exp
        amountToReduce += 1
    }
    this.addExp(expToAdd, "Prayer")
    item.reduceAmount(amountToReduce)
    this.Inventory = this.Inventory.filter((invItem, ind) => invItem.amount !== 0)
}

Game.prototype.refreshShop = function(existingShop) {
    let newShop = []

    if(existingShop) {
        existingShop.forEach((item) => this.addShopItemToArray(item, newShop))
    } else {
        const categoryDropRates = {
            potion: 35,
            crop: 30,
            smithing: 25,
            gem: 7,
            recipe: 3,
        }
        //TODO: Unlock different higher tiers like gambling
        const categories = {
            potion: ["healing_potion_1", "def_potion_1"],
            crop: ["carrot", "pumpkin", "berry"],
            smithing: ["copper_dagger", "copper_sword"],
            gem: ["green_crystal", "blue_crystal", "red_crystal"],
            recipe: ["recipe_alchemy_vol1", "recipe_smithing_vol1", "recipe_cooking_vol1", "recipe_enchanting_vol1",
                "recipe_prayer_vol1", "recipe_inscription_vol1", "recipe_jewelcrafting_vol1"],
        }

        const defaultShopItems = [{name: "meat", amount: 3}, {name: "healing_potion_1", amount: 1}]
        defaultShopItems.forEach((item) => this.addShopItemToArray(item, newShop))

        const maxNumRngItems = 4
        const maxRngAmount = 2

        const rngNumShopItems = Math.floor(Math.random() * (maxNumRngItems-1))+2
        for(let i=0; i<rngNumShopItems; i++) {
            const categoryPool = rollOneFromDistribution(categoryDropRates)
            const rngItem = Math.floor(Math.random() * categories[categoryPool].length)
            const item = categories[categoryPool][rngItem]
            let rngAmount = Math.floor(Math.random() * maxRngAmount) + 1
            //TODO: categoryPool simple bandaid for multiple non-stackable items for now
            if(/(?:\brecipe_|_crystal$)/.test(item) || categoryPool == "smithing") { rngAmount = 1 }
            this.addShopItemToArray({name: item, amount: rngAmount}, newShop)
        }
    }
    this.Shop = newShop
}

Game.prototype.addShopItemToArray = function(item, arr) {
    let shopitem = this.createShopItem(item)
    let foundExisting = arr.find((arritem, i) => arritem.name == shopitem.name)

    if(foundExisting && shopitem.stackable) {
        foundExisting.addAmount(shopitem.amount)
    } else {
        arr.push(shopitem)
    }
}

Game.prototype.loadGameClocks = function(clocks) {
    for(let clockname in this.GameClocks) {
        if(clocks && clocks[clockname] != null) {
            let formattedTime = Temporal.Instant.from(clocks[clockname])
            this.GameClocks[clockname] = formattedTime
        } else {
            this.GameClocks[clockname] = Temporal.Now.instant()
        }
    }
}

Game.prototype.resetLastRegenTick = function() {
    this.GameClocks.LastHealthRegenTick = this.TimeNow
}

Game.prototype.disenchantItem = function(item) {
    const catalogItem = this.findInCatalog(item)
    const canDisenchant = catalogItem.stats.slot != "" && /head|chest|feet|neck|ring|weapon/.test(catalogItem.stats.slot)
    if(canDisenchant) {
        const [gearType, disenchantStats] = Object.entries(gearDisenchantMatrix).find(([gearType, disenchantStats]) => {
            return new RegExp(`${gearType}`).test(catalogItem.name)
        })
        let [materialType, exp] = disenchantStats
        const skillLevel = this.Skills["Enchanting"].level
        const foundItems = Object.entries(slotDisenchantChance[catalogItem.stats.slot]).filter(([enchantMat, chance]) => {
            const levelDropChanceBoost = (0.005 * chance) * skillLevel
            const rng = parseFloat((Math.random() * 100).toFixed(2)) 
            return rng <= chance+levelDropChanceBoost
        })
        let extraDropChance = 15
        let maxExtra = 2
        if(item?.rarity == "uncommon") {
            extraDropChance = 25
            exp = Math.round(exp * 1.2)
        }
        if(item?.rarity == "rare") {
            extraDropChance = 40
            maxExtra = 3
            exp = Math.round(exp * 1.5)
        }
        if(item?.rarity == "epic") {
            extraDropChance = 65
            maxExtra = 4
            exp = Math.round(exp * 1.8)
        }
        const tool = this.findToolInBelt("Enchanting")
        if(tool && tool.extraYield) {
            extraDropChance += tool.extraYield * 100
        }
        const items = foundItems.map(([enchantMat, chance]) => {
            const fullitemname = `${materialType}_${enchantMat}`
            const extraRoll = Math.random() * 100
            const extraDrop = extraRoll <= extraDropChance
            const extraAmount = extraDrop ? Math.floor(Math.random()*maxExtra)+1 : 0
            return {name: fullitemname, amount: 1 + extraAmount}
        })

        this.addExp(exp, "Enchanting")
        this.addItems(items)
        return true
    } else {
        return false
    }
}

Game.prototype.learnRecipe = function(recipe) {
    let unlocked = this.unlockRecipe(recipe)
    if(unlocked) {
        let invitem = this.findFirstItem(recipe.name)
        if(invitem?.amount) {
            invitem.reduceAmount(1)
            this.Inventory = this.Inventory.filter((invItem, ind) => invItem.amount !== 0)
        }
    }
}

Game.prototype.unlockRecipe = function(recipe) {
    let foundRecipe = this.Recipes.find((recipeitem, i) => recipeitem.name == recipe.name)
    if(!foundRecipe) {
        let unlockedRecipe = this.createItem(recipe)
        if(!unlockedRecipe) { return }
        unlockedRecipe.amount = 1
        this.Recipes.push(unlockedRecipe)
        return true
    }
    return false
}

Game.prototype.findMob = function(mobname) {
    let name = ""
    if(typeof mobname == "string") {
        name = mobname.toLowerCase().replace(/ /g, "_")
    }
    if(typeof mobname == "object") {
        name = mobname.name.toLowerCase().replace(/ /g, "_")
    }
    const enemy = this.Mobs.mobs.find((mob) => name == mob.name)
    if(enemy) {
        return enemy
    } else {
        return false
    }
}

Game.prototype.findInCatalog = function(itemToFind) {
    let name = ""
    if(typeof itemToFind == "string") {
        name = toCatalogName(itemToFind)
    }
    if(typeof itemToFind == "object") {
        name = toCatalogName(itemToFind.name)
    }
    const item = this.Drops.find((item) => name == item.name)
    if(item) {
        return structuredClone(item)
    } else {
        console.log("ERROR: Not found in catalog!", name)
        return false
    }
}

Game.prototype.toCatalogName = function(name) {
    return toCatalogName(name)
}
Game.prototype.properName = function(name) {
    return toProper(name)
}
Game.prototype.toShort = function(name) {
    return toShort(name)
}
Game.prototype.toShortProper = function(name) {
    return toShort(toProper(name))
}
Game.prototype.toPercent = function(num) {
    if(typeof(num) == "number" && num < 1) {
        return toPercent(num)
    }
    if(typeof(num) == "string" && num.includes(".")) {
        return toPercent(parseFloat(num))
    }
    return num
}


Game.prototype.loadSkills = function(skills) {
    Object.entries(skills).forEach(([skillname, stats]) => {
        if(this.Skills[skillname]) {
            this.Skills[skillname].level = stats.level
            this.Skills[skillname].experience = stats.experience
        }
    })
}

Game.prototype.createNPC = function(npc) {
    npc.lootTable = Object.fromEntries(
        Object.entries(npc.lootTable).filter(([itemname, chance]) => {
            if(/recipe/i.test(itemname)) {
                if(this.Recipes.find(recipe => recipe.name == itemname)) { return false }
                if(this.Inventory.find(item => item.name == itemname)) { return false }
            }
            if(/_key$/i.test(itemname)) {
                if(this.Keyring.find(key => key == itemname)) { return false }
                if(this.Inventory.find(item => item.name == itemname)) { return false }
            }
            return true
        })
    )
    let newNpc = Object.create({name: npc.name, ...npc.stats, lootTable: npc.lootTable, isElite: npc.isElite})
    return new NPC(newNpc)
}


Game.prototype.hasSufficientIngredients = function(ingredients, optIngredients = []) {
    return Object.entries(ingredients).every((kv, i) => {
        let [ ingredientname, amount ] = kv

        if(ingredientname == "craftOptions") {
            return Object.entries(ingredients[ingredientname]).some((kv, i) => {
                [ ingredientname, amount ] = kv

                //Do we have the selected ingredient
                if(optIngredients && optIngredients.length > 0) {
                    if(!optIngredients.includes(ingredientname)) { return false }
                }
                //Do we have _any_ mandatory ingredient in inv to highlight in recipe list
                return this.Inventory.some((invitem, i) => {
                    return invitem.name == ingredientname && invitem.amount >= amount
                })
            })
        }
        if(ingredientname == "craftEnhancements") {
            return Object.entries(ingredients[ingredientname]).some((kv, i) => {
                [ ingredientname, amount ] = kv

                //optIngredients can include mandatory and/or enhance
                if(optIngredients && optIngredients.length > 0) {
                    //If enhance selected, do we have enough
                    if(optIngredients.includes(ingredientname)) {
                        return this.Inventory.some((invitem, i) => {
                            return invitem.name == ingredientname && invitem.amount >= amount
                        })
                    }
                    return true
                } else {
                    // Otherwise none selected which is fine
                    return true
                }
            })
        }
        return this.Inventory.some((invitem, i) => invitem.name == ingredientname && invitem.amount >= amount)
    })
}

Game.prototype.createItem = function(json) {
    const foundItem = this.findInCatalog(json)
    if(!foundItem) { return false }

    const item = {
        name: foundItem.name, 
        amount: json?.amount ?? 1,
        skill: foundItem?.skill ?? null,
        affixes: json?.affixes ?? null,
        sockets: json?.sockets ?? null,
        craftMats: json?.craftMats ?? null,
        dropLocation: json?.dropLocation ?? null,
        craftedStats: json?.craftedStats ?? null,
        rarity: json?.rarity ?? null,

        ...foundItem?.stats
    }

    let newItem = new Item(item)

    //Create item of appropriate class
    if(Object.keys(worldBuffs).includes(item?.name)) {
        newItem = new WorldBuff(item)
    }
    if(item?.name.includes("_key")) {
        newItem = new Key(item)
    }
    if(item?.extraSpeed || item?.extraYield || item?.extraExp) {
        newItem = new Tool(item)
    }
    if(item?.name.includes("scroll_")) {
        newItem = new Scroll(item)
    }
    if(item?.teaches) {
        newItem = new Recipe(item)
    }
    if(item?.slot == "food" || item?.slot == "Food") {
        newItem = new Food(item)
    }
    if(item?.slot == "prayer" || item?.slot == "Prayer") {
        newItem = new Prayer(item)
    }
    if(item?.slot == "potion" || item?.slot == "Potion") {
        newItem = new Potion(item)
    }
    if(item?.slot == "flask" || item?.slot == "Flask") {
        newItem = new Flask(item)
    }
    if(item?.slot == "head" || item?.slot == "Helm") {
        newItem = new Helm(item)
    }
    if(item?.slot == "chest" || item?.slot == "Chest") {
        newItem = new Chest(item)
    }
    if(item?.slot == "feet" || item?.slot == "Boots") {
        newItem = new Boots(item)
    }
    if(item?.slot == "weapon" || item?.slot == "Weapon") {
        newItem = new Weapon(item)
    }
    if(item?.slot == "neck" || item?.slot == "Neck") {
        newItem = new Necklace(item)
    }
    if(item?.slot == "ring" || item?.slot == "Ring") {
        newItem = new Ring(item)
    }
    if(item?.statName && !item?.color) {
        newItem = new Enchant(item)
    }
    if(item?.color) {
        newItem = new Gem(item)
    }

    //If enchanted/socketed (gear) apply
    if(json?.enchantedStats && Object.keys(json?.enchantedStats).length>0) {
        const newEnchant = this.createItem(json?.enchantedStats.name)
        newItem.enchant(newEnchant)
    }
    if(json?.sockets && json?.sockets.length>0) {
        json.sockets.forEach((socket, slotNum) => {
            const socketColor = Object.keys(socket)[0]
            const foundGem = socket[socketColor]?.name ? socket[socketColor] : null
            if(foundGem) {
                const newGem = this.createItem(foundGem.name)
                newItem.socket(newGem, slotNum)
            } else {
                newItem.sockets[slotNum] = {[socketColor]: null}
            }
        })
    }
    
    return newItem
}

Game.prototype.createGear = function(player, gear) {
    return Object.fromEntries(
        Object.entries(player.Gear).map(([slot, item]) => {
            if(gear[slot]) {
                let newItem = this.createItem(gear[slot])
                //NOTE: For setting attack speed when loading weapon
                if(newItem.slot == "weapon") { player.equipItem(newItem) }
                if(newItem.slot) { return [slot, newItem] }
            }
            return [slot, null]
        })
    )
}


//TODO: Expand to other stats besides craftedStats
// Expands usefulness of function later on
//Affixes
//EnchantedStats
//Sockets
//SocketedStats
Game.prototype.findItems = function(item) {
    let itemname = ""
    let craftedStats = []
    if(typeof item == "string") {
        itemname = item
    }
    if(typeof item == "object") {
        itemname = item.name
        craftedStats = item?.craftedStats ?? []
    }
    let equippedConsumables = [this.Player.Gear.Food, this.Player.Gear.Potion1, this.Player.Gear.Potion2, this.Player.Gear.Potion3]
    return equippedConsumables.concat(this.Inventory).filter((invitem, i) => {
        if(!invitem) { return false }
        let invitemCraftedStats = invitem?.craftedStats ?? []
        let craftedMatch = craftedStats.length == 0 && invitemCraftedStats.length == 0
        if(craftedStats.length > 0) {
            if(invitemCraftedStats.length == 0) {
                return false
            }
            craftedMatch = craftedStats.every((statObj, ind) => {
                return Object.entries(statObj).every(([stat, val]) => {
                    return invitemCraftedStats[ind] && invitemCraftedStats[ind][stat] == val
                })
            })
        }
        return invitem.name == itemname && craftedMatch
    })
}

Game.prototype.findFirstItem = function(item) {
    let found = this.findItems(item)
    return found.length > 0 ? found[0] : {}
}

Game.prototype.addItems = function(newitems) {
    if(!Array.isArray(newitems)) {
        newitems = [newitems]
    }
    let recentItems = []
    let nonCommonDrops = 0
    const minNonCommonDungeonDrops = 1
    newitems.forEach((item, itemind) => {
        if(/recipe/i.test(item.name)) {
            if(this.Recipes.find(recipeitem => recipeitem.name == item.name)) { return }
            if(this.Inventory.find(invitem => invitem.name == item.name)) { return }
        }
        if(/_key$/i.test(item.name)) {
            if(this.Keyring.find(key => key == item.name)) { return }
            if(this.Inventory.find(invitem => invitem.name == item.name)) { return }
        }
        if(item.name == "coin") {
            let recentitem = new Item({name: "Silver", icon: "coin", amount: item.amount})
            recentItems.push(recentitem)
            return this.addSilver(item.amount)
        }
        const foundItem = this.findInCatalog(item.name)
        const isStackable = foundItem.stats?.slot ? stackableGear[foundItem.stats.slot] : true
        const numItems = parseInt(item.amount) || 0
        if(isStackable) {
            if(foundItem.stats?.tier) {
                return this.addTool(foundItem)
            }
            const recentitem = this.addItem({...item, amount: numItems, craftMats: item?.craftMats})
            recentitem && recentItems.push(recentitem)
        } else {
            //TODO Only unstackable/gear should use rarity. Maybe gems later and figure that out
            for(let i=0; i<numItems; i++) {
                let rarity = item?.dropLocation ? determineRarity(item?.dropLocation) : ""
                //NOTE: Reroll rarity for dungeon loot until min noncommon found
                while(item?.dropLocation == "npc" && rarity == "normal" && nonCommonDrops < minNonCommonDungeonDrops) {
                    rarity = determineRarity(item?.dropLocation)
                    if(rarity != "normal") { break }
                }
                if(rarity != "normal") { nonCommonDrops += 1 }
                const recentitem = this.addItem({...item, amount: 1, craftMats: item?.craftMats, rarity: rarity })
                recentitem && recentItems.push(recentitem)
            }
        }
    })
    //We load items before screen and should always have an active screen
    if(this.Screen && recentItems.length > 0) {
        this.RecentActivity.loot = recentItems
        this.RecentActivity.updatedAt = this.TimeNow.epochMilliseconds

        if(this.Battling && newitems.some((loot) => loot?.dropLocation == "npc")) {
            this.RecentDrops.unshift(recentItems)
            this.RecentDrops.splice(15, this.RecentDrops.length)
        }
    }
}

Game.prototype.addItem = function(newitem) {
    let item = this.createItem(newitem)
    if(!item) { return }

    const numItems = newitem?.amount ?? item.amount

    let foundExisting = this.findFirstItem(item)
    if(foundExisting?.amount >= 0 && item.stackable) {
        foundExisting.addAmount(item.amount)
    } else {
        this.Inventory.push(item)
    }
    let jsonItem = {...newitem, icon: item.icon, amount: numItems }
    item?.rarity && (jsonItem.rarity = item?.rarity)
    let recentitem = new Item(jsonItem)
    return recentitem
}

Game.prototype.createShopItem = function(newitem) {
    const foundItem = this.findInCatalog(newitem.name)
    const isStackable = foundItem.stats?.slot ? stackableGear[foundItem.stats.slot] : true
    newitem.dropLocation = "shop"
    newitem.rarity = isStackable ? "normal" : determineRarity(newitem.dropLocation)
    let item = this.createItem(newitem)
    if(!item) { return }

    const shopPremiumMarkup = 6
    const rarityMarkupTiers = {
        normal: 1,
        uncommon: 3,
        rare: 6,
        epic: 12,
    }
    let rarityMarkup = item.rarity ? rarityMarkupTiers[item.rarity] : 1
    item.price += Math.round(item.price * shopPremiumMarkup * rarityMarkup)
    return item
}

Game.prototype.addSilver = function(amount) {
    this.Silver += parseInt(amount)
}
Game.prototype.removeSilver = function(amount) {
    amount = parseInt(amount)
    if (this.Silver < amount) {
        return false //Insufficient amount
    }
    this.Silver -= amount
    return true
}

Game.prototype.addExp = function(expToAdd, skillToLvl) {
    if(!skillToLvl) {
        skillToLvl = this.ActiveSkill
    }
    if(!this.Skills[skillToLvl]) { return; }
    let skill = this.Skills[skillToLvl]
    // Next level formula:  baseExp * (levelMultiplier ^ level)
    const xpToLevel = (skill.baseExp * (skill.multi ** skill.level)).toFixed(0)

    const baseExp = expToAdd
    let xpBoost = 0.0

    const buffs = this.Player.Buffs.concat(this.Player.PotionBuffs, this.Player.WorldBuffs)
    buffs.forEach((buff) => {
        if(buff.stats.Exp) {
            xpBoost += buff.stats.Exp
        }
    })

    const tool = this.findToolInBelt(skillToLvl)
    if(tool && tool.extraExp) {
        xpBoost += tool.extraExp
    }

    const expImprovement = baseExp * xpBoost
    expToAdd += Math.round(expImprovement.toFixed(0))

    skill.experience += expToAdd

    if (skill.experience >= xpToLevel) {
        let incLevel = parseInt(skill.experience / xpToLevel)
        skill.experience = parseInt(skill.experience % xpToLevel)
        skill.level += incLevel
        this.addAlert(`Leveled ${skillToLvl} to ${skill.level}!`)
    }

    if(skillToLvl == "Training") { return }

    this.RecentActivity.loot = []
    this.RecentActivity.expSkill = skillToLvl
    this.RecentActivity.exp = expToAdd
    this.RecentActivity.updatedAt = this.TimeNow.epochMilliseconds
}

Game.prototype.findToolInBelt = function(skill) {
    if(!skill) {
        skill  = this.ActiveSkill
    }
    const tool = this.Toolbelt.find((tool) => tool.skill == skill)
    return tool ? tool : null
}

Game.prototype.selectPlot = function(plot) {
    this.resetActivity()
    this.ActiveSkill = this.Screen
    plot.tool = this.findToolInBelt(this.ActiveSkill)
    this.Plot = new Plot(plot)
    this.TimeNow = Temporal.Now.instant()
    this.TimePlotSelected = this.TimeNow
}

Game.prototype.displayMob = function(mob) {
    this.DisplayEnemy = mob
}
Game.prototype.hideMob = function() {
    this.DisplayEnemy = null
}
Game.prototype.selectMob = function(mob) {
    this.Dungeon = null
    this.hideMob()
    this.Enemy = mob
    this.stopBattling()
}
Game.prototype.startDungeon = function(dungeon, mobs, dungeonTier) {
    //TODO: Create NPC, makeElite, and make boss here IF not already/fallback
    //mobs.forEach((mob) => mob.makeElite())
    this.Dungeon = {
        name: dungeon.name,
        mobs: mobs,
        tier: dungeonTier,
        lootTable: Object.fromEntries(
            Object.entries(dungeon.lootTable).filter(([name, chance]) => {
                if(/recipe/i.test(name)) {
                    if(this.Recipes.find(recipe => recipe.name == name)) { return false }
                    if(this.Inventory.find(item => item.name == name)) { return false }
                }
                return true
            })
        ),
    }
    this.Enemy = this.Dungeon.mobs[0]
    this.stopBattling()
}

Game.prototype.startAttack = function(autoRestart, restAfter) {
    this.resetActivity()
    this.ActiveSkill = "Training"
    this.Battling = true
    this.PauseBattle = false
    if(this.Dungeon) {
        this.Dungeon.autoRestart = autoRestart
        this.Dungeon.restAfter = restAfter
    }
    this.TimeNow = Temporal.Now.instant()
}

Game.prototype.craftItem = function(itemname, numToCraft = 0, optIngredients = []) {
    let item = this.findInCatalog(itemname)
    let hasSufficient = this.hasSufficientIngredients(item.recipe.ingredients, optIngredients)
    if(!hasSufficient) { return false }

    //If crafting a tool
    if(item.stats.skill) {
        const existingTool = this.findToolInBelt(item.stats.skill)
        if(existingTool && existingTool.tier >= item.stats.tier) {
            this.addAlert(`Similar or more powerful tool equipped: ${existingTool.nameProper}`)
            return false
        }
    }

    item.recipe.craftTime = item.recipe?.craftTime ?? DefaultCraftTime
    const tool = this.findToolInBelt(this.Screen)
    if(tool && tool.extraSpeed) {
        const timeImprovement = item.recipe.craftTime * tool.extraSpeed
        item.recipe.craftTime = parseFloat((item.recipe.craftTime - timeImprovement).toFixed(2))
    }

    this.resetActivity()
    this.ActiveSkill = this.Screen
    this.Crafting = true

    this.Craft = {
        skillname: this.Screen,
        item: item,
        numToCraft: numToCraft,
        craftMats: optIngredients ?? [], 
    }

    this.TimeNow = Temporal.Now.instant()
    this.TimeCraftStarted = this.TimeNow
    return true
}

Game.prototype.applyOrRefreshWorldBuff = function(buffname) {
    const foundBuff = this.Player.WorldBuffs.find((b) => b.name==buffname)
    if(!foundBuff) {
        const worldbuff = worldBuffs[buffname]
        const buff = {name: buffname, stats: worldbuff.stats, duration: DefaultWorldBuffDuration}
        const newworldbuff = this.createItem(buff)
        this.Player.addWorldBuff(newworldbuff)
    } else {
        if(foundBuff.duration < 60) {
            foundBuff.duration = DefaultWorldBuffDuration
        }
    }
}

Game.prototype.stopBattling = function () {
    if(this.Battling) {
        const runDamage = Math.floor(this.Player.maxhealth * this.healthLostOnRun)
        this.Player.takeHit(runDamage)
        if(this.Player.health <= 0) {
            this.removeSilver(Math.floor(this.Silver * this.SilverDeathPenalty))
            this.addAlert("Died!")
        }
        this.resetLastRegenTick()
    }
    this.Battling = false
    this.PauseBattle = false
    if(this.GameClocks.LastHealthRegenTick == null) {
        this.resetLastRegenTick()
    }
    this.Player.resetSwingTimer()
    if(this.Dungeon) {
        this.Dungeon.mobs.forEach((enemy) => {
            enemy.resetSwingTimer()
            enemy.health = enemy.maxhealth
        })
        this.Enemy = this.Dungeon.mobs[0]
    }
    if(this.Enemy) {
        this.Enemy.resetSwingTimer()
        this.Enemy.health = this.Enemy.maxhealth
    }
}

// Stop battling implemented to allow us to switch mob/dungeons to check loottables etc. while doing other things
Game.prototype.resetActivity = function () {
    this.stopBattling()
    this.Crafting = false
    this.Plot = null
    this.Craft = null
    this.ActiveSkill = null
    this.RecentActivity = {}

    this.TimeCraftStarted = null
    this.TimePlotSelected = null
}

// ===================================MAIN LOOP==================
// ===================================MAIN LOOP==================
// ===================================MAIN LOOP==================
Game.prototype.Loop = function() {
    let lastTick = this.TimeNow
    let timeNow = Temporal.Now
    this.TimeNow = timeNow.instant()

    if(this.GameClocks.LastShopRefresh != null) {
        let secSinceShopRefresh = this.TimeNow.since(this.GameClocks.LastShopRefresh).total("seconds")
        if(secSinceShopRefresh >= this.ShopRefreshTime) {
            this.refreshShop()
            this.GameClocks.LastShopRefresh = this.TimeNow
        }
    }

    if(this.GameClocks.LastBuffCheck != null) {
        let secSinceBuffCheck = this.TimeNow.since(this.GameClocks.LastBuffCheck).total("seconds")
        if(secSinceBuffCheck >= 1) {
            this.GameClocks.LastBuffCheck = this.TimeNow

            if(timeNow.plainDateISO().dayOfWeek == 6 || timeNow.plainDateISO().dayOfWeek == 7) {
                weekendBuffs.forEach((buffname) => this.applyOrRefreshWorldBuff(buffname))
            }
            if(timeNow.plainTimeISO().minute == 0 || timeNow.plainTimeISO().minute == 30) {
                hourlyBuffs.forEach((buffname) => this.applyOrRefreshWorldBuff(buffname))
            }

            this.Player.Buffs.forEach((buff) => {
                buff.duration && (buff.duration -= 1)
                buff.duration <= 0 && this.Player.removeMiscBuff(buff)
            })
            this.Player.PotionBuffs.forEach((buff) => {
                buff.duration && (buff.duration -= 1)
                if(buff.duration < 30) {
                    const potions = [this.Player.Gear.Potion1, this.Player.Gear.Potion2, this.Player.Gear.Potion3]
                    potions.forEach((potion) => {
                        if(potion.autoRefresh && potion.name == buff.name) {
                            this.Player.usePotion(potion)
                        }
                    })
                }
                buff.duration <= 0 && this.Player.removePotionBuff(buff)
            })
            this.Player.WorldBuffs.forEach((buff) => {
                buff.duration && (buff.duration -= 1)
                buff.duration <= 0 && this.Player.removeWorldBuff(buff)
            })
        }
    }


    if(this.Plot) {
        if(this.TimeNow.since(this.TimePlotSelected).total("seconds") >= this.Plot.cleartime) {
            this.addExp(this.Plot.baseExp, this.Plot.skillname)
            let droppedItem = this.Plot.dropItem(this.Skills[this.Plot.skillname].level)
            if(droppedItem) { this.addItems(droppedItem) }
            this.TimePlotSelected = this.TimeNow
        }
    }

    if(this.Crafting) {
        const seconds = this.TimeNow.since(this.TimeCraftStarted).total("seconds")
        const recipe = this.Craft.item.recipe
        if(seconds >= recipe.craftTime && this.Craft.numToCraft > 0) {
            const hasSufficient = this.hasSufficientIngredients(recipe.ingredients, this.Craft.craftMats)
            if(hasSufficient) {
                let isRuneforged = false
                Object.entries(recipe.ingredients).forEach((kv) => {
                    let [ ingredient, amount ] = kv
                    if(ingredient == "craftOptions" || ingredient == "craftEnhancements") {
                        Object.entries(recipe.ingredients[ingredient]).forEach((kv, i) => {
                            [ ingredient, amount ] = kv
                            if(this.Craft.craftMats.includes(ingredient)) {
                                let invitem = this.findFirstItem(ingredient)
                                invitem.reduceAmount(amount)
                                if(/rune_/i.test(ingredient)) { isRuneforged = true }
                            }
                        })
                    } else {
                        const invitem = this.findFirstItem(ingredient)
                        invitem.reduceAmount(amount)
                    }
                })
                this.Inventory = this.Inventory.filter((invItem, ind) => invItem.amount !== 0)
                let extraDrop = 0
                const tool = this.findToolInBelt(this.Craft.skillname)
                if(tool && tool.extraYield) {
                    extraDrop = Math.random() <= tool.extraYield ? 1 : 0
                }
                const craftType = isRuneforged ? "runeforged" : "craft"
                const itemToAdd = {name: this.Craft.item.name, amount: 1+extraDrop, craftMats: this.Craft.craftMats, dropLocation: craftType}
                this.addExp(this.Craft.item.recipe.exp, this.Craft.skillname)
                this.addItems(itemToAdd)
                this.Craft.numToCraft -= 1;

                const canCraftAgain = this.hasSufficientIngredients(recipe.ingredients, this.Craft.craftMats)
                if(canCraftAgain && this.Craft.numToCraft > 0) {
                    this.TimeCraftStarted = this.TimeNow
                } else {
                    this.Crafting = false
                    this.TimeCraftStarted = null
                    this.addAlert(`Finished crafting!`)
                    this.Craft = null
                    this.ActiveSkill = null
                }
            } else {
                this.Crafting = false
                this.TimeCraftStarted = null
                this.Craft = null
            }
        }
    }


    if(this.Battling && !this.PauseBattle) {
        let killedEnemy = false
        let timeDiff = this.TimeNow.since(lastTick)
        this.Player.addGameDuration(timeDiff)
        if(Temporal.Duration.compare(this.Player.SwingTimer, this.Player.AttackSpeed) > 0) {
            killedEnemy = this.Player.attackEnemy(this, this.Enemy)
        }
        if(!killedEnemy) {
            this.Enemy.addGameDuration(timeDiff)
            if(Temporal.Duration.compare(this.Enemy.SwingTimer, this.Enemy.AttackSpeed) > 0) {
                this.Enemy.attackEnemy(this, this.Player)
            }
        }
    }
    if(!this.Battling) {
        if(this.Player.health < this.Player.maxhealth && this.GameClocks.LastHealthRegenTick != null) {
            let secSinceHealthTick = this.TimeNow.since(this.GameClocks.LastHealthRegenTick).total("seconds")
            if(secSinceHealthTick >= this.healthRegenTickInterval) {
                let healAmount = Math.round(this.Player.maxhealth * this.healthRegenTickAmount)
                this.Player.heal(healAmount)
                this.resetLastRegenTick()
            }
            //Only after we've received a rested health tick
            if(this.ActiveSkill == "Training" && this.Player.health == this.Player.maxhealth) {
                if(this.Dungeon?.restAfter && this.Dungeon?.autoRestart) {
                    this.Battling = true
                }
            }
        }
    }
};


module.exports = Game;
