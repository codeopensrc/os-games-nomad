"use strict";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import Stats from './Stats.jsx';

import "../style/Inventory.less"


const Inventory = function(props) {
    const { G, triggerUpdate, coreFns, filters } = props

    const refs = useRef([]);

    const [statItem, setItem] = useState(null);
    const [coords, setCoords] = useState({x: 0, y: 0});
    const [rawStatItem, setRawStatItem] = useState(null);

    const [secondItem, setSecondItem] = useState(null);
    const [secondCoords, setSecondCoords] = useState({x: 0, y: 0});

    const [itemInvIndex, setItemInvIndex] = useState(-1)
    const [showExtra, setShowExtra] = useState(false);
    const [extraItem, setExtraItem] = useState({name: "Test"})
    const [canDisenchant, setCanDisenchant] = useState(false)
    const [canLearn, setCanLearn] = useState(false)

    const [quickDisenchant, setQuickDisenchant] = useState(false)

    const [showFilters, setShowFilters] = useState(false)
    const [sort, setSort] = useState("none")

    const typeFilterList = ["Materials", "Gear", "Food", "Potion", "Scrolls", "Recipes"]
    const [activeTypeFilters, setActiveTypeFilters] = useState(filters.data.type || typeFilterList)

    const rarityFilterList = ["Epic", "Rare", "Uncommon", "Normal", "Junk"]
    const [activeRarityFilters, setActiveRarityFilters] = useState(filters.data.rarity || [])

    const slotFilterList = ["Head", "Chest", "Feet", "Weapon", "Ring", "Neck"]
    const [activeSlotFilters, setActiveSlotFilters] = useState(filters.data.slot || [])


    const Gear = useMemo(() => ({
        helm: G.Player.Gear.Helm,
        chest: G.Player.Gear.Chest,
        boots: G.Player.Gear.Boots,
        weapon: G.Player.Gear.Weapon,
        ring: G.Player.Gear.Ring,
        neck: G.Player.Gear.Necklace,
        food: G.Player.Gear.Food,
        prayer: G.Player.Gear.Prayer,
        potions: [G.Player.Gear.Potion1, G.Player.Gear.Potion2, G.Player.Gear.Potion3],
    }), [G.Player.Gear.Helm, G.Player.Gear.Chest, G.Player.Gear.Boots, G.Player.Gear.Ring, G.Player.Gear.Necklace, G.Player.Gear.Weapon,
        G.Player.Gear.Food, G.Player.Gear.Prayer,
        G.Player.Gear.Potion1, G.Player.Gear.Potion2, G.Player.Gear.Potion3,
    ])
    const { helm, chest, boots, weapon, ring, neck, food, prayer, potions } = Gear

    const activateItem = (item, i) => {
        if(item.slot) {
            if(item.canEquip(G.Player)) {
                G.Player.equipItem(item)
                G.stopBattling()
                G.Inventory = G.Inventory.filter((invItem, ind) => i !== ind)
                refreshTooltip()
            } else {
                //TODO: Req stats/level info when that comes around
                G.addAlert(`Can't equip ${item.nameProper}`)
                console.log("Cant equip")
            }
        }
    }

    const extraMenu = (e, item, i) => {
        e.preventDefault()
        e.stopPropagation()
        if(!item) { return }
        const isEquipped = Object.entries(Gear).some(([slot, gearitem]) => {
            return item == gearitem
        })
        if(!isEquipped && quickDisenchant) {
            return disenchant(item)
        }
        const x = e.clientX - 265
        const y = e.clientY - 35
        setCoords({ x: x, y: y});
        setShowExtra(true)
        setExtraItem(item)
        setItemInvIndex(isEquipped ? -1 : i)
        stopShowSlot()
        const catalogItem = G.findInCatalog(item)
        const disenchantable = catalogItem.stats.slot != "" && /head|chest|feet|neck|ring|weapon/.test(catalogItem.stats.slot)
        !isEquipped && setCanDisenchant(disenchantable)
        if(catalogItem.stats.teaches) {
            let foundRecipe = G.Recipes.filter((recipeitem, i) => recipeitem.name == catalogItem.name)
            if(!foundRecipe.length) { setCanLearn(true) }
        }
    }
    const learnRecipe = (item) => {
        if(item.teaches) {
            G.learnRecipe(item)
            refreshTooltip()
        }
    }
    const deleteItem = (item) => {
        G.Inventory = G.Inventory.filter((invItem, ind) => invItem != item)
        refreshTooltip()
    }
    const disenchant = (item) => {
        let disenchanted = G.disenchantItem(item)
        if(disenchanted) {
            G.Inventory = G.Inventory.filter((invItem, ind) => invItem != item)
            refreshTooltip()
        }
    }
    const bury = (item, num) => {
        G.buryItem(item, num)
        refreshTooltip()
    }
    const use = (item) => {
        if(item instanceof G.Class.Scroll) {
            var usedItem = G.Player.addMiscBuff(item)
        }
        if(item instanceof G.Class.Key) {
            var usedItem = G.addKey(item)
        }
        if(usedItem) {
            item.reduceAmount(1)
            G.Inventory = G.Inventory.filter((invItem, ind) => invItem.amount !== 0)
        }
        refreshTooltip()
    }
    const prospect = (item, num) => {
        const prospected = G.prospectItem(item, num)
        if(prospected) {
            refreshTooltip()
        }
    }
    const unequipSlot = (item) => {
        stopShowSlot()
        if(item?.slot) {
            G.Player.unequipItem(item)
            G.stopBattling()
            if(item.amount > 0) {
                G.Inventory.push(item)
            }
            refreshTooltip()
        }
    }
    const removeBuff = (e, buff, i) => {
        e.preventDefault()
        if(buff.slot == "prayer") {
            G.Player.unequipItem(buff)
        }
        if(/potion|flask/.test(buff.slot)) {
            G.Player.removePotionBuff(buff)
        }
        if(!buff.slot) {
            G.Player.removeMiscBuff(buff)
        }
        if(G.Player.WorldBuffs.filter((b) => b.name==buff.name).length) {
            G.Player.removeWorldBuff(buff)
        }
        stopShowSlot()
    }

    const compareSlot = (item, e) => {
        if(e.key == "Shift" && item?.slot && !/potion|flask|food/i.test(item.slot)) {
            const equippedItem = Object.entries(Gear).map(([slot, gear]) => gear).find((gear) => gear?.slot == item.slot)
            if(equippedItem) {
                setSecondItem(equippedItem)
            }
        }
        if(e.key == "Control" && item?.slot && !/potion|flask|food/i.test(item.slot)) {
            const equippedItem = Object.entries(Gear).map(([slot, gear]) => gear).find((gear) => gear?.slot == item.slot)
            if(equippedItem) {
                let clone = G.createItem(equippedItem)
                clone.clearBonuses()
                clone.craftedStats = equippedItem?.craftedStats ?? []
                setSecondItem(clone)

                let rawItem = G.createItem(item)
                rawItem.clearBonuses()
                rawItem.craftedStats = item?.craftedStats ?? []
                setRawStatItem(rawItem)
            }
        }
    }

    const showSlot = (item, e, offset = {x: 0, y: 0}) => {
        if(showExtra) { return }
        if(!rawStatItem) { setItem(item) }
        let y = e.clientY-65 + offset.y
        //Min y value
        if(y < 20) { y = 20 }
        setCoords({x: e.clientX-245 + offset.x, y: y})
        setSecondCoords({x: e.clientX-23 + offset.x, y: y})
    }
    const stopShowSlot = () => {
        setItem(null)
        setSecondItem(null)
        setRawStatItem(null)
    }
    const refreshTooltip = () => {
        stopShowSlot()
        setShowExtra(false)
        setCanDisenchant(false)
        setCanLearn(false)
        setItemInvIndex(-1)
    }

    const updateFilters = (type, filter) => {
        if(type == "all") {
            setActiveTypeFilters(typeFilterList)
            setActiveRarityFilters([])
            setActiveSlotFilters([])
            setShowFilters(false)
            const savedFilters = { type: typeFilterList, rarity: [], slot: [] }
            filters.update(savedFilters)
            localStorage.setItem("filters", JSON.stringify(savedFilters));
            return
        }
        let currentFilters = []
        if(filter == "type") { currentFilters = [...activeTypeFilters] }
        if(filter == "rarity") { currentFilters = [...activeRarityFilters] }
        if(filter == "slot") { currentFilters = [...activeSlotFilters] }
        if(currentFilters.includes(type)) {
            currentFilters = currentFilters.filter((t) => t != type) 
        } else if(Array.isArray(type) && type.length == 0) {
            currentFilters = []
        } else {
            currentFilters.push(type)
        }
        if(filter == "type") { setActiveTypeFilters(currentFilters) }
        if(filter == "rarity") { setActiveRarityFilters(currentFilters) }
        if(filter == "slot") { setActiveSlotFilters(currentFilters) }
        setQuickDisenchant(false)

        let savedFilters = { type: activeTypeFilters, rarity: activeRarityFilters, slot: activeSlotFilters }
        savedFilters[filter] = currentFilters
        filters.update(savedFilters)
        localStorage.setItem("filters", JSON.stringify(savedFilters));
    }

    const extractBuffInfo = (buff, stat) => {
        const statkey = stat ? stat : Object.keys(buff.stats).filter((key, ind) => buff.stats[key] > 0)[0]
        const statval = statkey == "Spd" || statkey == "Exp" ? `${buff.stats[statkey] * 100}%` : buff.stats[statkey]
        const strippedKey = statkey.toLowerCase()
        const img = <img src={`./images/bufficons/${strippedKey}.png`} />
        let buffTimer = "Prayer"
        if(!buff?.slot || /potion|flask/.test(buff?.slot)) {
            const future = G.TimeNow.add({seconds: buff.duration})
            buffTimer = G.TimeNow.until(future).round({largestUnit: "minutes", smallestUnit: "seconds"}).toLocaleString("en", { style: "narrow", secondsDisplay: "always"})
        }
        return { statval, img, buffTimer }
    }

    const sortBag = (e) => {
        setSort(e.target.value)
    }

    const inv = sort == "none" ? G.Inventory : G.Inventory.toSorted((a, b) => {
        if(!a[sort]) { return true }
        if(!b[sort]) { return false }
        if(sort == "amount") { return a[sort] < b[sort] }
        if(sort == "rarity") {
            const rarityMatrix = { epic: 4, rare: 3, uncommon: 2, normal: 1, junk: 0 }
            return rarityMatrix[a[sort]] < rarityMatrix[b[sort]]
        }
        return a[sort] > b[sort]
    })
    
    const inventory = inv.map((item, i) => {
        let inActiveTypeFilters = false
        if(activeTypeFilters.includes("Materials") && !item?.slot) { inActiveTypeFilters = true }
        if(activeTypeFilters.includes("Gear") && /head|chest|feet|neck|ring|weapon/.test(item?.slot)) { inActiveTypeFilters = true }
        if(activeTypeFilters.includes("Food") && item?.slot == "food") { inActiveTypeFilters = true }
        if(activeTypeFilters.includes("Potion") && /potion|flask/i.test(item?.slot)) { inActiveTypeFilters = true }
        if(activeTypeFilters.includes("Scrolls") && (item instanceof G.Class.Scroll)) { inActiveTypeFilters = true }
        if(activeTypeFilters.includes("Recipes") && (item instanceof G.Class.Recipe)) { inActiveTypeFilters = true }
        //If no active type filter, do not filter out based on type
        if(activeTypeFilters.every((f) => !/Materials|Gear|Food|Potion|Scrolls|Recipes/i.test(f))) { inActiveTypeFilters = true }

        let inActiveRarityFilters = false
        if(activeRarityFilters.includes(G.properName(item?.rarity))) { inActiveRarityFilters = true }
        //If no active rarity filter, do not filter out based on rarity
        if(activeRarityFilters.every((f) => !/Epic|Rare|Uncommon|Normal|Junk/i.test(f))) { inActiveRarityFilters = true }

        let inActiveSlotFilters = false
        if(item?.slot && activeSlotFilters.includes(G.properName(item?.slot))) { inActiveSlotFilters = true }
        //If no active slot filter, do not filter out based on slot
        if(activeSlotFilters.every((f) => !/Head|Chest|Feet|Weapon|Ring|Neck/i.test(f))) { inActiveSlotFilters = true }

        if(!inActiveTypeFilters || !inActiveRarityFilters || !inActiveSlotFilters) { return }

        let row = (i+1) / 6
        //Cap y offset (dont push to far up from mouse)
        if(row > 6) { row = 6 }
        let yOffset = row * -35
        return (
            <div key={item.name+i} className={`invItem ${item?.rarity} ${quickDisenchant?"quick":""}`}
                ref={(r) => refs.current[i] = r}
                onClick={()=>activateItem(item, i)} 
                onContextMenu={(e)=>extraMenu(e, item, i)} 
                tabIndex={-1}
                onKeyDown={(e)=>compareSlot(item, e)}
                onKeyUp={(e)=>{setSecondItem(null); setRawStatItem(null)}}
                onMouseEnter={(e)=>{refs.current[i].focus(); refreshTooltip()}}
                onMouseMove={(e)=>{refs.current[i].focus(); showSlot(item, e, {x: 0, y: item?.slot&&!/potion|food/.test(item?.slot)?yOffset:0})}}
                onMouseLeave={()=>{refs.current[i].blur(); stopShowSlot()}}>
                <div className={`itemCount`}>{item.stackable?`x${item.amount}`:""}</div>
                <img className={`invImage`} src={`./images/items/${item.icon}.png`} alt={"Item"}/>
                <div className={item?.rarity}>{item.nameShort}</div>
            </div>
        )
    })

    const helmIcon = helm ? <img src={`./images/items/${helm.icon}.png`} /> : null
    const chestIcon = chest ? <img src={`./images/items/${chest.icon}.png`} /> : null
    const bootsIcon = boots ? <img src={`./images/items/${boots.icon}.png`} /> : null
    const weaponIcon = weapon ? <img src={`./images/items/${weapon.icon}.png`} /> : null
    const ringIcon = ring ? <img src={`./images/items/${ring.icon}.png`} /> : null
    const neckIcon = neck ? <img src={`./images/items/${neck.icon}.png`} /> : null
    const foodIcon = food ? <img src={`./images/items/${food.icon}.png`} /> : null
    const prayerIcon = prayer ? <img src={`./images/items/${prayer.icon}.png`} /> : null

    const potionBelt = potions.map((potion, i) => {
        let potionIcon = potions[i] ? <img src={`./images/items/${potions[i].icon}.png`} /> : null
        return (
            <div key={i} className={`equipSlot`}
                onClick={()=>unequipSlot(potions[i])}
                onContextMenu={(e)=>extraMenu(e, potions[i])} 
                onMouseEnter={(e)=>refreshTooltip()}
                onMouseMove={(e)=>showSlot(potions[i], e)}
                onMouseLeave={()=>stopShowSlot()}>
                <div className={`itemCount`}>{potions[i]?.stackable?`x${potions[i]?.amount}`:""}</div>
                <div>{potions[i]?.name?potions[i].nameShort:`Potion/Flask`}{potionIcon}</div>
            </div>
        )
    })


    const canProspect = /(?:copper|tin|iron|mithril)$/.test(extraItem.name)
    const canBury = /bone$/i.test(extraItem.name)
    const canUse = /(?:scroll_|_key$)/i.test(extraItem.name)
    const extraScreen = showExtra ? (
        <div id={`extraItem`} style={{top: coords.y - 15, left: coords.x - 15}}>
            <div>{extraItem.nameProper}</div>
            <div className={`extraItemButtons`}>
                {extraItem?.teaches ? <button className={`commonButton ${canLearn?"":"disabled"}`} disabled={!canLearn} onClick={()=>learnRecipe(extraItem)}>Learn</button> : null }
                {extraItem?.slot && itemInvIndex >= 0 ? <button className={`commonButton`} onClick={()=>activateItem(extraItem, itemInvIndex)}>Equip</button> : null }
                {extraItem?.slot && itemInvIndex == -1 ? <button className={`commonButton`} onClick={()=>unequipSlot(extraItem)}>Unequip</button> : null }
                {canDisenchant ? <button className={`commonButton`} onClick={()=>disenchant(extraItem)}>Disenchant</button> : null }
                {canBury && extraItem.amount >= 10 ? <button className={`commonButton`} onClick={()=>bury(extraItem, 10)}>Bury (Consume 10)</button> : null }
                {canBury && extraItem.amount >= 5 ? <button className={`commonButton`} onClick={()=>bury(extraItem, 5)}>Bury (Consume 5)</button> : null }
                {canBury ? <button className={`commonButton`} onClick={()=>bury(extraItem)}>Bury</button> : null }
                {canUse ? <button className={`commonButton`} onClick={()=>use(extraItem)}>Use</button> : null }
                {canProspect && extraItem.amount >= 100 ? <button className={`commonButton`} onClick={()=>prospect(extraItem, 100)}>Prospect (Consume 100)</button> : null }
                {canProspect && extraItem.amount >= 20 ? <button className={`commonButton`} onClick={()=>prospect(extraItem, 20)}>Prospect (Consume 20)</button> : null }
                {canProspect && extraItem.amount >= 10 ? <button className={`commonButton`} onClick={()=>prospect(extraItem, 10)}>Prospect (Consume 10)</button> : null }
                {canProspect ? <button className={`commonButton ${extraItem.amount<5?"disabled":""}`} disabled={extraItem.amount<5} onClick={()=>prospect(extraItem, 5)}>Prospect (Consume 5)</button> : null }
                {itemInvIndex >= 0 ? <button className={`commonButton`} onClick={()=>deleteItem(extraItem)}>Delete</button> : null }
            </div>
        </div>
    ) : null


    const buffs = G.Player.PotionBuffs.concat(G.Player.Buffs).concat(G.Player.WorldBuffs).map((buff, i) => {
        const statkeys = Object.keys(buff.stats).filter((key, ind) => buff.stats[key] > 0)
        return statkeys.map((statkey, ind) => {
            const { statval, img, buffTimer } = extractBuffInfo(buff, statkey)
            return (
                <div key={buff.name+statkey} className={`buff ${!/_\d/i.test(buff.name)?"worldbuff":buff?.slot??""}`}
                    onContextMenu={(e)=>removeBuff(e, buff, i)} 
                    onMouseMove={(e)=>showSlot(G.createItem(buff), e)}
                    onMouseLeave={()=>stopShowSlot()}>
                <div>{img}: <span>+{statval}</span></div>
                <div>{buffTimer}</div>
            </div>)
        })
    })


    const keys = G.Keyring.map((key) => {
        const keyname = G.properName(key)
        const keyitem = G.createItem(key)
        return (
            <div key={key} className={`equipSlot small key`}
                onMouseMove={(e)=>showSlot(keyitem, e, {x: 0, y: -70})}
                onMouseLeave={()=>stopShowSlot()}>
                <img src={`./images/items/${keyitem.icon}.png`} />
            </div>
        )
    })

    const tools = G.Toolbelt.map((tool) => {
        return (
            <div key={tool.name} className={`equipSlot small tool`}
                onMouseMove={(e)=>showSlot(tool, e, {x: 0, y: -70})}
                onMouseLeave={()=>stopShowSlot()}>
                <img src={`./images/items/${tool.icon}.png`} />
            </div>
        )
    })

    const typeFilters = showFilters ? typeFilterList.map((type, i) => {
        let checked = activeTypeFilters.includes(type)
        return (
            <div key={type} className={`filter`}>
                <input type={"checkbox"} value={type} checked={checked} onChange={()=>updateFilters(type, "type")}/>
                <label htmlFor={type}>{type}</label>
            </div>
        )
    }) : null
    const rarityFilters = showFilters ? rarityFilterList.map((type, i) => {
        let checked = activeRarityFilters.includes(type)
        return (
            <div key={type} className={`filter`}>
                <input type={"checkbox"} value={type} checked={checked} onChange={()=>updateFilters(type, "rarity")}/>
                <label htmlFor={type}>{type}</label>
            </div>
        )
    }) : null
    const slotFilters = showFilters ? slotFilterList.map((type, i) => {
        let checked = activeSlotFilters.includes(type)
        return (
            <div key={type} className={`filter`}>
                <input type={"checkbox"} value={type} checked={checked} onChange={()=>updateFilters(type, "slot")}/>
                <label htmlFor={type}>{type}</label>
            </div>
        )
    }) : null

    const isFilterActive = !Object.entries({
        type: (activeTypeFilters.length == 0 || activeTypeFilters.length == typeFilterList.length),
        rarity: (activeRarityFilters.length == 0 || activeRarityFilters.length == rarityFilterList.length),
        slot: activeSlotFilters.length == 0
    }).every(([f, bool])=>bool)

    showFilters && typeFilters.unshift((<button key={0} className={`commonButton filter`} onClick={()=>updateFilters([], "type")}>Uncheck All</button>))
    showFilters && rarityFilters.unshift((<button key={0} className={`commonButton filter`} onClick={()=>updateFilters([], "rarity")}>Uncheck All</button>))
    showFilters && slotFilters.unshift((<button key={0} className={`commonButton filter`} onClick={()=>updateFilters([], "slot")}>Uncheck All</button>))

    return (
        <div id={`inventoryPage`}>
            {rawStatItem?.name || statItem?.name ? 
                <Stats G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} item={rawStatItem || statItem} show={!showExtra} propCoords={coords} />
                : null }
            {secondItem?.name ? 
                <Stats G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} item={secondItem} show={!showExtra} propCoords={secondCoords} />
                : null }
            {extraScreen}
            <div id={"title"}>
                Inventory
            </div>
            <div id={`invContainer`}>
                <div id={`bag`}>
                    <div style={{display: "flex", width: "100%", height: "8%", alignItems: "start"}}>
                        <div id={`currency`}>
                            <div className={`price`}><img src={`./images/items/coin.png`} className={`coin`}/>{G.Silver.toLocaleString()}</div>
                        </div>
                        <div id={`quickBox`}>
                            <select defaultValue={`sort`} onChange={(e)=>sortBag(e)}>
                                <option value={`sort`} disabled hidden>Sort</option>
                                <option value={`name`}>Name</option>
                                <option value={`amount`}>Amount</option>
                                <option value={`rarity`}>Rarity</option>
                                <option value={`slot`}>Slot</option>
                                <option value={`none`}>None</option>
                            </select>
                            <button id={`quickButton`} 
                                className={`commonButton ${quickDisenchant?"on":"off"}`} 
                                onClick={()=>setQuickDisenchant(!quickDisenchant)}>
                                Quick Disenchant: {quickDisenchant?"On":"Off"}
                            </button>
                            {quickDisenchant ? <div id={`quickWarning`}>ENABLED</div> : null}
                        </div>
                        <div id={`filters`}>
                            <div style={{display: "flex", flexFlow: "row", justifyContent: "end"}}>
                                <button className={`commonButton`} onClick={()=>updateFilters("all")}>Reset</button>
                                <button className={`commonButton ${isFilterActive?"on":"off"}`} onClick={()=>setShowFilters(!showFilters)}>Set Filters</button>
                            </div>
                            <div style={{display: "flex", flexFlow: "row", alignContent: "start", justifyContent: "end"}}>
                                <div style={{display: "flex", flexFlow: "column", background: "#00000094"}}>
                                    {slotFilters}
                                </div>
                                <div style={{display: "flex", flexFlow: "column", background: "#00000094"}}>
                                    {rarityFilters}
                                </div>
                                <div style={{display: "flex", flexFlow: "column", background: "#00000094"}}>
                                    {typeFilters}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id={`itemContainer`}>
                        {inventory}
                    </div>
                </div>
                <div id={`equipmentContainer`}>
                    <div id={`equipment`}>
                        <div style={{display: "flex", flexFlow: "column"}}>
                            <div id={`playerStats`}>
                                <div className={`statIcon attack`}>{G.Player.attackPower}</div>
                                <div className={`statIcon defend`}>{G.Player.defense}</div>
                                <div className={`statIcon health`}>{G.Player.maxhealth}</div>
                                <div className={`statIcon str`}>{G.Player.str}</div>
                                <div className={`statIcon int`}>{G.Player.int}</div>
                                <div className={`statIcon agi`}>{G.Player.agi}</div>
                                <div className={`statIcon spd`}>{G.Player.attackSpeed}s</div>
                            </div>
                            <div id={`keyring`}>
                                <span>Keyring</span>
                                {keys}
                            </div>
                            <div id={`toolbelt`}>
                                <span>Toolbelt</span>
                                {tools}
                            </div>
                        </div>
                        <div id={`gear`} className={`gearColumn`}>
                            <div className={`equipSlot ${helm?.rarity}`} id={`head`}
                                onClick={()=>unequipSlot(helm)}
                                onContextMenu={(e)=>extraMenu(e, helm)} 
                                onMouseEnter={(e)=>refreshTooltip()}
                                onMouseMove={(e)=>showSlot(helm, e)}
                                onMouseLeave={()=>stopShowSlot()}>
                                {helm?.name?helm.nameProper:"Helm"}{helmIcon}
                            </div>
                            <div className={`equipSlot ${chest?.rarity}`} id={`chest`}
                                onClick={()=>unequipSlot(chest)}
                                onContextMenu={(e)=>extraMenu(e, chest)} 
                                onMouseEnter={(e)=>refreshTooltip()}
                                onMouseMove={(e)=>showSlot(chest, e, {x: 0, y: -70})}
                                onMouseLeave={()=>stopShowSlot()}>
                                {chest?.name?chest.nameProper:"Chest"}{chestIcon}
                            </div>
                            <div className={`equipSlot ${boots?.rarity}`} id={`feet`}
                                onClick={()=>unequipSlot(boots)}
                                onContextMenu={(e)=>extraMenu(e, boots)} 
                                onMouseEnter={(e)=>refreshTooltip()}
                                onMouseMove={(e)=>showSlot(boots, e, {x: 0, y: -120})}
                                onMouseLeave={()=>stopShowSlot()}>
                                {boots?.name?boots.nameProper:"Boots"}{bootsIcon}
                            </div>
                            <div className={`equipSlot ${weapon?.rarity}`} id={`weapon`}
                                onClick={()=>unequipSlot(weapon)}
                                onContextMenu={(e)=>extraMenu(e, weapon)} 
                                onMouseEnter={(e)=>refreshTooltip()}
                                onMouseMove={(e)=>showSlot(weapon, e, {x: 0, y: -140})}
                                onMouseLeave={()=>stopShowSlot()}>
                                {weapon?.name?weapon.nameProper:"Weapon"}{weaponIcon}
                            </div>
                            <div style={{display: "flex", flexFlow: "row"}}>
                                <div className={`equipSlot small ${neck?.rarity}`} id={`neck`}
                                    onClick={()=>unequipSlot(neck)}
                                    onContextMenu={(e)=>extraMenu(e, neck)} 
                                    onMouseEnter={(e)=>refreshTooltip()}
                                    onMouseMove={(e)=>showSlot(neck, e, {x: 0, y: -160})}
                                    onMouseLeave={()=>stopShowSlot()}>
                                    {neck?.name?"Neck":"Neck"}{neckIcon}
                                </div>
                                <div className={`equipSlot small ${ring?.rarity}`} id={`ring`}
                                    onClick={()=>unequipSlot(ring)}
                                    onContextMenu={(e)=>extraMenu(e, ring)} 
                                    onMouseEnter={(e)=>refreshTooltip()}
                                    onMouseMove={(e)=>showSlot(ring, e, {x: 0, y: -160})}
                                    onMouseLeave={()=>stopShowSlot()}>
                                    {ring?.name?"Ring":"Ring"}{ringIcon}
                                </div>
                            </div>
                        </div>
                        <div id={`consumes`} className={`gearColumn`}>
                            {potionBelt}
                            <div className={`equipSlot`}
                                onClick={()=>unequipSlot(food)}
                                onContextMenu={(e)=>extraMenu(e, food)} 
                                onMouseEnter={(e)=>refreshTooltip()}
                                onMouseMove={(e)=>showSlot(food, e)}
                                onMouseLeave={()=>stopShowSlot()}>
                                <div className={`itemCount`}>{food?.stackable?`x${food?.amount}`:""}</div>
                                <div>{food?.name?food.nameShort:`Food`}{foodIcon}</div>
                            </div>
                            <div className={`equipSlot`}
                                onClick={()=>unequipSlot(prayer)}
                                onContextMenu={(e)=>extraMenu(e, prayer)} 
                                onMouseEnter={(e)=>refreshTooltip()}
                                onMouseMove={(e)=>showSlot(prayer, e)}
                                onMouseLeave={()=>stopShowSlot()}>
                                <div>{prayer?.name?prayer.nameShort:`Prayer`}{prayerIcon}</div>
                            </div>
                        </div>
                    </div>
                    <div id={`buffs`}>
                        {buffs}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Inventory as default };
