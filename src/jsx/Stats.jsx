"use strict";

import React, { useEffect, useState } from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import "../style/Stats.less"


const Stats = function(props) {
    const { G, triggerUpdate, coreFns } = props
    const { item, propCoords, show } = props

    const [coords, setCoords] = useState({x: 0, y: 0});
    const [itemStats, setItemStats] = useState({name: "Test"})
    const [showItemStats, setShowItemStats] = useState(false);

    const [showGearStats, setShowGearStats] = useState(false);
    const [gearStats, setGearStats] = useState({name: "Test", attack: 1, defense: 2})
    const [sockets, setSockets] = useState([]);
    const [affixes, setAffixes] = useState([])
    const [rawAffixes, setRawAffixes] = useState([])
    const [craftedStats, setCraftedStats] = useState([])
    const [craftMats, setCraftMats] = useState([])

    const [enchantedStats, setEnchantedStats] = useState()
    const [socketedStats, setSocketedStats] = useState()
    const [bonusStats, setBonusStats] = useState()
    const [socketBonusVal, setSocketBonusVal] = useState()
    const [highlightedStats, setHighlightedStats] = useState()

    const [enchantmentStats, setEnchantmentStats] = useState()
    const [showEnchantmentStats, setShowEnchantmentStats] = useState(false);
    const [gemStats, setGemStats] = useState()
    const [showGemStats, setShowGemStats] = useState(false);

    useEffect(() => {
        if(item) {
            refreshTooltip()
        }
    }, [G.Screen])

    useEffect(() => {
        if(item) {
            setEnchantedStats()
            setSocketedStats()
            setBonusStats()
            setSocketBonusVal()
            showSlot(item)
        } else {
            refreshTooltip()
        }
    }, [item?.name, item?.enchantedStats, item?.socketedStats, propCoords?.x, propCoords?.y])

    const showSlot = (item) => {
        if(!show) { return }
        if(item instanceof G.Class.Gear) {
            setCoords({ x: propCoords.x, y: propCoords.y});
            setShowGearStats(true)
            let combinedStats = []
            if(Object.keys(item.enchantedStats).length>0) {
                let stat = {
                    [Object.keys(item.enchantedStats.stats)[0]]: Object.values(item.enchantedStats.stats)[0],
                    name: Object.keys(item.enchantedStats.stats)[0],
                    val: Object.values(item.enchantedStats.stats)[0],
                }
                if(stat.name == "Spd") { stat.val = item.enchantedSpeed }
                setEnchantedStats(stat)
                combinedStats.push(stat)
            }
            if(item.socketedStats.length > 0) {
                const stats = {}
                item.socketedStats.forEach((statObj) => {
                    Object.keys(statObj).forEach((statname) => {
                        if(stats[statname]) { stats[statname] += statObj[statname] }
                        else { stats[statname] = statObj[statname] }
                    })
                })
                setSocketedStats(stats)
                combinedStats.push(stats)
            }
            if(item.renderedAffixes.length > 0) {
                const stats = {}
                let compare = false
                item.renderedAffixes.forEach((affix) => {
                    if(affix == "compare") { return compare = true }
                    Object.keys(affix).forEach((statname) => {
                        const stat = G.properName(statname)
                        if(stats[stat]) { stats[stat] += affix[statname] }
                        else { stats[stat] = affix[statname] }
                    })
                })
                setAffixes(item.renderedAffixes)
                let secondaryAffixes = compare ? item.actualAffixes : []
                setRawAffixes(secondaryAffixes)
                combinedStats.push(stats)
            }
            if(Object.keys(item.bonusStats).length>0) {
                let stat = {
                    [Object.keys(item.bonusStats)[0]]: Object.values(item.bonusStats)[0],
                    name: Object.keys(item.bonusStats)[0],
                    val: Object.values(item.bonusStats)[0],
                }
                setBonusStats(stat)
                combinedStats.push(stat)
                if(item.socketBonus) {
                    setSocketBonusVal(item.socketBonus[1])
                }
            }
            if(item.craftedStats.length>0) {
                const stats = {}
                item.craftedStats.forEach((statObj, i) => {
                    Object.entries(statObj).forEach(([stat, value]) => {
                        if(stats[stat]) { stats[stat] += value }
                        else { stats[stat] = value }
                    })
                })
                setCraftedStats(item.craftedStats)
                setCraftMats(item.craftMats)
                combinedStats.push(stats)
            }
            if(item.sockets.length>0) {
                setSockets(item.sockets)
            }
            
            const singleObject = {}
            combinedStats.forEach((statObj) => {
                Object.keys(statObj).forEach((stat) => {
                    if(singleObject[stat]) {
                        singleObject[stat] += statObj[stat]
                    } else {
                        singleObject[stat] = statObj[stat]
                    }
                })
            })
            setHighlightedStats(singleObject)
            setGearStats(item)
        }
        if(item instanceof G.Class.Enchant) {
            setCoords({ x: propCoords.x, y: propCoords.y});
            setShowEnchantmentStats(true)
            setEnchantmentStats(item)
        }
        if(item instanceof G.Class.Gem) {
            setCoords({ x: propCoords.x, y: propCoords.y});
            setShowGemStats(true)
            setGemStats(item)
        }
        if(item instanceof G.Class.Consumable) {
            if(item?.craftedStats.length>0) {
                const stats = {}
                item.craftedStats.forEach((statObj, i) => {
                    Object.entries(statObj).forEach(([stat, value]) => {
                        if(stats[stat]) { stats[stat] += value }
                        else { stats[stat] = value }
                    })
                })
                setCraftedStats(item.craftedStats)
                setCraftMats(item.craftMats)
                setHighlightedStats(stats)
            }
            setCoords({ x: propCoords.x, y: propCoords.y});
            setShowItemStats(true)
            setItemStats(item)
        }
        if(item instanceof G.Class.Tool) {
            setCoords({ x: propCoords.x, y: propCoords.y});
            setShowItemStats(true)
            setItemStats(item)
        }
        if(!(item instanceof G.Class.Gear) && !(item instanceof G.Class.Enhancement) && item instanceof G.Class.Item) {
            setCoords({ x: propCoords.x, y: propCoords.y});
            setShowItemStats(true)
            if(item.teaches) {
                item.tooltip = item.recipeToolTip.map((recipeItem, i) => {
                    return (<div key={recipeItem+i} className={`recipeItem`}>{recipeItem}</div>)
                })
            }
            setItemStats(item)
        }
    }
    const stopShowSlot = () => {
        setShowGearStats(false)
        setShowItemStats(false)
        //Actual enchant
        setShowEnchantmentStats(false)
        setEnchantmentStats()
        //Actual gem
        setShowGemStats(false)
        setGemStats()
        //Sockets stats on item
        setSocketedStats()
        setSockets([])
        setSocketBonusVal()
        setEnchantedStats()
        setBonusStats()
        setAffixes([])
        setRawAffixes([])
        setCraftedStats([])
        setCraftMats([])
        setHighlightedStats()
    }
    const refreshTooltip = () => {
        stopShowSlot()
    }

    const renderedSockets = sockets.map((socket, i) => {
        const color = Object.keys(socket)[0]
        const socketedGem = Object.values(socket)[0]
        const gemColorClass = socketedGem ? `${socketedGem.color}gem` : ""
        const stats = socketedGem ? socketedGem.statNameProper.map((statname, i) => {
            const shortname = statname != "Health" ? statname.slice(0,3) : statname
            return (<div key={statname+i}>{shortname} <span>+{socketedGem.statAmountProper[i]}</span></div>)
        }) : null

        return (
            <div className={`socket ${color}socket`} key={color, i}>
                <div className={`gem ${gemColorClass}`}>
                    {socketedGem ? stats : null }
                    {!socketedGem ? `${G.properName(color)} socket` : null }
                </div>
            </div>
        )
    })

    const rawStats = rawAffixes.map((rawaffix, i) => {
        const stats = Object.keys(rawaffix).map((statname, i2) => {
            if(statname == "spd") { return null }
            const statVal = `${(rawaffix[statname] * 100).toFixed(0)}%`
            return ( <div key={statname+i2} style={{marginRight: "-8px", textAlign: "right"}}><span>+{statVal}</span></div>)
        })
        return stats
    })

    const renderedAffixStats = affixes.map((affix, i) => {
        if(affix == "compare") { return }
        const stats = Object.keys(affix).map((statname, i2) => {
            const properName = G.properName(statname)
            const shortname = properName != "Health" ? properName.slice(0,3) : properName
            const statVal = !Number.isInteger(affix[statname]) || statname == "spd" ? `${(affix[statname] * 100).toFixed(0)}%` : affix[statname]
            const rawAffixVal = rawStats.length > 0 ? rawStats[i][i2] : null
            return (
                <div key={statname+i2} style={{display: "flex", flexFlow: "column"}}>
                    <div>{shortname}<span>+{statVal}</span></div>
                    {rawAffixVal}
                </div>
            )
        })
        //TODO: Thinking about including affix name/using name for color
        let affixName = ""
        return (
            <div className={`affix ${affixName}`} key={i}>
                {stats}
            </div>
        )
    })
    const renderedBonusStats = bonusStats ? (
        <div className={`bonus ${bonusStats.val>0?"active":"inactive"}`}>
            <div>Socket bonus: {bonusStats.name} <span className={bonusStats.val>0?"green":""}>+{socketBonusVal}</span></div>
        </div>
    ) : null

    const renderedCraftedStats = craftedStats.map((crafted, i) => {
        const [opt, enhance] = craftMats
        let craftMat = opt && craftMats[i] == opt ? opt : enhance
        if(/rune_of/i.test(craftMat)) { craftMat = craftMat.replace(/_\d/i, "") }

        const stats = Object.keys(crafted).map((statname, i2) => {
            const properName = G.properName(statname)
            const shouldClipName = !/Health|Potency|Duration|Affixes|Rarity/i.test(properName)
            const shortname = shouldClipName ? properName.slice(0,3) : properName
            const isNum = typeof crafted[statname] == "number"
            const statVal = (isNum && !Number.isInteger(crafted[statname])) || /spd|duration/i.test(statname) ? `${(crafted[statname] * 100).toFixed(0)}%` : crafted[statname]
            return (<div key={statname+i2}>{shortname}<span className={`green`}>{statname == "Rarity"?"":"+"}{statVal}</span></div>)
        })
        return (
            <div className={`crafted ${craftMat} ${/rune/i.test(craftMat)?"rune":""}`} key={i}>
                {stats}
            </div>
        )
    })


    const gearStatScreen = showGearStats ? (
        <div id={`gearStats`} className={gearStats?.rarity} style={{top: coords.y, left: coords.x}}>
            <div className={gearStats.rarity}>{gearStats.nameProper}</div>
            {gearStats?.dropLocation == "runeforged" ? <div className={"runeforged"}>Runeforged</div> : null }
            {gearStats?.slot ? <div className={"slot"}>Slot: {G.properName(gearStats.slot)}</div> : null }
            {gearStats.spd ? <div className={`stat`}><div>DPS: </div><div className={`dps`}>~{(gearStats?.attack/gearStats?.attackSpeed).toFixed(1)||null}</div></div> : null }
            <div className={`stat`}><div>Attack: </div><div className={highlightedStats?.Attack?"green":""}>{gearStats?.attack||null}</div></div>
            {gearStats.spd ? <div className={`stat`}><div>WeaponSpd: </div><div className={highlightedStats?.Spd?"green":""}>{gearStats?.attackSpeed.toFixed(1)||null}</div></div>: null }
            <div className={`stat`}><div>Defense: </div><div className={highlightedStats?.Defense?"green":""}>{gearStats?.defense||null}</div></div>
            <div className={`stat`}><div>Health: </div><div className={highlightedStats?.Health?"green":""}>{gearStats?.health||null}</div></div>
            <div className={`stat`}><div>Str: </div><div className={highlightedStats?.Str?"green":""}>{gearStats?.str||null}</div></div>
            <div className={`stat`}><div>Int: </div><div className={highlightedStats?.Int?"green":""}>{gearStats?.int||null}</div></div>
            <div className={`stat`}><div>Agi: </div><div className={highlightedStats?.Agi?"green":""}>{gearStats?.agi||null}</div></div>
            {renderedAffixStats}
            {renderedCraftedStats}
            {enchantedStats ? <div className={"enchant"}><div> {enchantedStats.name}</div><div className={"green"}>+{enchantedStats.val}</div></div> : null }
            {renderedSockets}
            {renderedBonusStats}
        </div>
    ) : null

    const itemStatScreen = showItemStats ? (
        <div id={`itemStats`} className={itemStats?.rarity} style={{top: coords.y, left: coords.x}}>
            <div className={itemStats?.rarity}>{itemStats.nameProper}</div>
            {itemStats?.rarity == "junk" ? <div className={"slot"}>Junk</div> : null }
            {itemStats?.slot ? <div className={"slot"}>Slot: {G.properName(itemStats.slot)}</div> : null }
            {itemStats?.skill ? <div className={"skill"}>Skill: {G.properName(itemStats.skill)}</div> : null }
            {itemStats?.tier ? <div className={"skill"}>Tier: {itemStats.tier}</div> : null}
            {itemStats.health ? <div><div>Health: </div><div className={highlightedStats?.Potency?"green":""}>{itemStats.health}</div></div> : null }
            {itemStats.maxhealth ? <div><div>MaxHealth: </div><div className={highlightedStats?.Potency?"green":""}>{itemStats.maxhealth}</div></div> : null }
            {itemStats.attack ? <div><div>Attack: </div><div className={highlightedStats?.Potency?"green":""}>{itemStats.attack}</div></div> : null }
            {itemStats.spd ? <div><div>AtkSpd: </div><div className={highlightedStats?.Potency?"green":""}>{(itemStats.spd * 100).toFixed(0)}%</div></div> : null }
            {itemStats.defense ? <div><div>Defense: </div><div className={highlightedStats?.Potency?"green":""}>{itemStats.defense}</div></div> : null }
            {itemStats.str ? <div><div>Str: </div><div className={highlightedStats?.Potency?"green":""}>{itemStats.str}</div></div> : null }
            {itemStats.agi ? <div><div>Agi: </div><div className={highlightedStats?.Potency?"green":""}>{itemStats.agi}</div></div> : null }
            {itemStats.int ? <div><div>Int: </div><div className={highlightedStats?.Potency?"green":""}>{itemStats.int}</div></div> : null }
            {itemStats.extraSpeed ? <div><div>Speed increase: </div><div className={``}>{itemStats.speedProper}</div></div> : null }
            {itemStats.extraYield ? <div><div>Extra drop % gain: </div><div className={``}>{itemStats.yieldProper}</div></div> : null }
            {itemStats.extraExp ? <div><div>Exp boost: </div><div className={``}>{itemStats.expProper}</div></div> : null }
            {itemStats.exp ? <div><div>Exp boost: </div><div className={``}>{itemStats.exp * 100}%</div></div> : null }
            {itemStats.tooltip ? <div><div>{/rune/i.test(item.name)?"Either":"Teaches"}: </div><div className={`recipe`}>{itemStats.tooltip}</div></div> : null }
            {itemStats.description ? <div className={`description`}><div>{itemStats.description}</div></div> : null }
            {renderedCraftedStats}
        </div>
    ) : null

    const enchantStatScreen = enchantmentStats && showEnchantmentStats ? (
        <div id={`itemStats`} style={{top: coords.y, left: coords.x}}>
            <div>{enchantmentStats.nameProper}</div>
            {enchantmentStats?.slot ? <div className={"slot"}>Slot: {G.properName(enchantmentStats.slot)}</div> : null }
            {enchantmentStats.statName == "spd"
                ? <div><div>AtkSpd: </div><div>{enchantmentStats.statAmount * 100}%</div></div>
                : <div><div>{enchantmentStats.statNameProper}: </div><div>{enchantmentStats.statAmount}</div></div>
            }
        </div>
    ) : null

    const gemStatScreen = gemStats && showGemStats ? (
        <div id={`itemStats`} style={{top: coords.y, left: coords.x}}>
            <div>{gemStats.nameProper}</div>
            {
                Array.isArray(gemStats.statNameProper) && gemStats.statNameProper.map((name, i) => {
                    return /spd/.test(name)
                        ? <div key={name+i}><div>AtkSpd: </div><div>{gemStats.statAmountProper[i]}</div></div>
                        : <div key={name+i}><div>{name}: </div><div>{gemStats.statAmountProper[i]}</div></div>
                })
            }
        </div>
    ) : null

    return (
        <div id="component-stats">
            {gearStatScreen}
            {itemStatScreen}
            {enchantStatScreen}
            {gemStatScreen}
        </div>
    );
};

export { Stats as default };
