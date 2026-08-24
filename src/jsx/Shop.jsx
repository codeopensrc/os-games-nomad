"use strict";

import React, { useRef, useEffect, useState } from 'react';
import DOM from 'react-dom';
import { Temporal, Intl, toTemporalInstant } from '@js-temporal/polyfill';
// var PropTypes = React.PropTypes;

import Stats from './Stats.jsx';

import "../style/Shop.less"


const Shop = function(props) {
    const { G, triggerUpdate, coreFns, filters } = props

    const refs = useRef([]);

    const [statItem, setItem] = useState(null);
    const [coords, setCoords] = useState({x: 0, y: 0});
    const [rawStatItem, setRawStatItem] = useState(null);

    const [secondItem, setSecondItem] = useState(null);
    const [secondCoords, setSecondCoords] = useState({x: 0, y: 0});

    const [showBarter, setShowBarter] = useState(false);
    const [barterItem, setBarterItem] = useState({name: "Test"})
    const [barterNum, setBarterNum] = useState(1)
    const [barterType, setBarterType] = useState()

    const [quickSell, setQuickSell] = useState(false)

    const [showFilters, setShowFilters] = useState(false)
    const [sort, setSort] = useState("none")

    const typeFilterList = ["Materials", "Gear", "Food", "Potion", "Scrolls", "Recipes"]
    const [activeTypeFilters, setActiveTypeFilters] = useState(filters.data.type || typeFilterList)

    const rarityFilterList = ["Epic", "Rare", "Uncommon", "Normal", "Junk"]
    const [activeRarityFilters, setActiveRarityFilters] = useState(filters.data.rarity || [])

    const slotFilterList = ["Head", "Chest", "Feet", "Weapon", "Ring", "Neck"]
    const [activeSlotFilters, setActiveSlotFilters] = useState(filters.data.slot || [])


    const healCost = 100

    const rarityMarkup = {
        junk: 1,
        normal: 1,
        uncommon: 2,
        rare: 4,
        epic: 8,
    }


    const barterPopup = (item, e, i, actionType) => {
        e.preventDefault()
        e.stopPropagation()
        if(quickSell && actionType == "sell") {
            return quickSellItem(item)
        }
        const x = e.clientX - 265
        const y = e.clientY - 35
        setCoords({ x: x, y: y});
        setShowBarter(true)
        setBarterItem(item)
        setBarterType(actionType)
        stopShowSlot()
    }
    const updateBarterNum = (val) => {
        if(val > barterItem.amount) {
            val = barterItem.amount
        }
        if(!barterItem.amount) {
            val = 1
        }
        if(val <= 0) {
            val = 0
        }
        setBarterNum(parseInt(val))
    }
    const buyItem = () => {
        if(/recipe/i.test(barterItem.name) && G.Recipes.find(recipe => recipe.name == barterItem.name)) {
            return G.addAlert("Recipe already known")
        }
        const totalAmount = barterItem.price * barterNum
        const hasSufficient = G.removeSilver(totalAmount)
        if(!hasSufficient) {
            return G.addAlert("Insufficient coin to purchase.")
        }
        const foundExisting = G.Shop.filter((invitem, i) => invitem.name == barterItem.name)
        if(foundExisting.length > 0 && foundExisting[0].amount < barterNum) { return }
        if(foundExisting.length > 0 && foundExisting[0].stackable) {
            foundExisting[0].reduceAmount(barterNum)
            G.Shop = G.Shop.filter((invItem, ind) => invItem.amount !== 0)
        } else {
            G.Shop = G.Shop.filter((invitem, ind) => invitem != barterItem)
        }
        G.addItems({name: barterItem.name, amount: barterNum,
            affixes: barterItem?.affixes, 
            sockets: barterItem?.sockets,
            enchantedStats: barterItem?.enchantedStats,
        })
        setQuickSell(false)
        refreshTooltip()
    }
    const gambleItem = () => {
        const hasSufficient = G.removeSilver(barterItem.price)
        if(!hasSufficient) {
            return G.addAlert("Insufficient coin to purchase.")
        }
        G.addItems({name: barterItem.name, amount: 1, dropLocation: "gamble"})
        setQuickSell(false)
        refreshTooltip()
    }

    const quickSellItem = (item) => {
        const sellPrice = rarityMarkup[item.rarity] * (item.price ?? 0)
        G.Inventory = G.Inventory.filter((invItem, ind) => invItem !== item)
        const totalAmount = sellPrice * item.amount
        if(sellPrice) {
            G.addSilver(totalAmount)
        }
        refreshTooltip()
    }
    const sellItem = () => {
        const sellPrice = rarityMarkup[barterItem.rarity] * (barterItem.price ?? 0)
        if(!barterItem.stackable) {
            G.Inventory = G.Inventory.filter((invItem, ind) => invItem !== barterItem)
            const totalAmount = sellPrice * 1
            if(sellPrice) {
                G.addSilver(totalAmount)
            }
        } else {
            //TODO: Maybe deeper check for item, so far only craftedStats
            const foundItem = G.findFirstItem(barterItem)
            //NOTE: Have guardrail to not allow barterNum to be greater than item amount too
            if(foundItem.amount < barterNum) {
                return false
            }
            foundItem.reduceAmount(barterNum)
            if(foundItem.amount <= 0) {
                G.Inventory = G.Inventory.filter((invItem, ind) => invItem !== barterItem)
            }
            const totalAmount = sellPrice * barterNum
            if(sellPrice) {
                G.addSilver(totalAmount)
            }
        }
        refreshTooltip()
    }

    const compareSlot = (item, e, i, offset = {x: 0, y: 0}) => {
        if(e.key == "Shift" && item?.slot && !/potion|flask|food/i.test(item.slot)) {
            const equippedItem = Object.entries(G.Player.Gear).map(([slot, gear]) => gear).find((gear) => gear?.slot == item.slot)
            if(equippedItem) {
                setSecondItem(equippedItem)
            }
        }
        if(e.key == "Control" && item?.slot && !/potion|flask|food/i.test(item.slot)) {
            const equippedItem = Object.entries(G.Player.Gear).map(([slot, gear]) => gear).find((gear) => gear?.slot == item.slot)
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

    const fullHeal = () => {
        const totalAmount = healCost
        const hasSufficient = G.removeSilver(totalAmount)
        if(!hasSufficient) {
            return G.addAlert("Insufficient coin to purchase.")
        }
        if(G.Battling) {
            G.stopBattling()
        }
        const healed = G.Player.heal(G.Player.maxhealth)
        if(!healed) {
            G.addSilver(totalAmount)
            return G.addAlert("Already full health")
        }
        G.addAlert("Healed to full!")
    }

    const showSlot = (item, e, offset = {x: 0, y: 0}) => {
        if(showBarter) { return }
        if(!rawStatItem) { setItem(item) }
        let y = e.clientY-65 + offset.y
        //Min y value
        if(y < 20) { y = 20 }
        setCoords({x: e.clientX - 245+offset.x, y: y})
        setSecondCoords({x: e.clientX-23 + offset.x, y: y})
    }
    const stopShowSlot = () => {
        setItem(null)
        setSecondItem(null)
        setRawStatItem(null)
    }
    const refreshTooltip = () => {
        stopShowSlot()
        setShowBarter(false)
        setBarterNum(1)
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
        setQuickSell(false)

        let savedFilters = { type: activeTypeFilters, rarity: activeRarityFilters, slot: activeSlotFilters }
        savedFilters[filter] = currentFilters
        filters.update(savedFilters)
        localStorage.setItem("filters", JSON.stringify(savedFilters));
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
        const yOffset = row * -35
        return (
            <div key={item.name+i} className={`invItem ${item?.rarity} ${quickSell?`quick`:""}`}
                ref={(r) => refs.current[i] = r}
                onContextMenu={(e)=>barterPopup(item, e, i, "sell")} 
                tabIndex={-1}
                onKeyDown={(e)=>compareSlot(item, e, i)}
                onKeyUp={(e)=>{setSecondItem(null); setRawStatItem(null)}}
                onMouseEnter={(e)=>{refs.current[i].focus(); refreshTooltip()}}
                onMouseMove={(e)=>{refs.current[i].focus(); showSlot(item, e, {x: 0, y: item?.slot&&!/potion|food/.test(item?.slot)?yOffset:0})}}
                onMouseLeave={()=>{refs.current[i].blur(); stopShowSlot()}}>
                <div className={`itemCount`}>{item.stackable?`x${item.amount}`:""}</div>
                <img className={`invImage`} src={`./images/items/${item.icon}.png`} alt={"Item"}/>
                <div className={item?.rarity}>{item.nameShort}</div>
                <div className={`price`}><img src={`./images/items/coin.png`} className={`coin`}/>{rarityMarkup[item.rarity] * (item.price ?? 0)}</div>
            </div>
        )
    })
    const shop = G.Shop.map((item, i) => {
        return (
            <div key={item.name+i} className={`invItem ${item?.rarity}`}
                onContextMenu={(e)=>barterPopup(item, e, i, "buy")} 
                onMouseEnter={(e)=>refreshTooltip()}
                onMouseMove={(e)=>showSlot(item, e)}
                onMouseLeave={()=>stopShowSlot()}>
                <div className={`itemCount`}>{item.stackable?`x${item.amount}`:""}</div>
                <img className={`invImage`} src={`./images/items/${item.icon}.png`} alt={"Item"}/>
                <div className={item?.rarity}>{item.nameShort}</div>
                <div className={`price`}><img src={`./images/items/coin.png`} className={`coin`}/>{item.price}</div>
            </div>
        )
    })

    const den = G.GamblingDen.map((item, i) => {
        let row = (i+1) / 3
        //Cap y offset (dont push to far up from mouse)
        if(row > 5) { row = 5 }
        const yOffset = row * -35

        return (
            <div key={item.name+i} className={`invItem`}
                onContextMenu={(e)=>barterPopup(item, e, i, "gamble")} 
                onMouseEnter={(e)=>refreshTooltip()}
                onMouseMove={(e)=>showSlot(item, e, {x: 0, y: item?.slot?yOffset:0})}
                onMouseLeave={()=>stopShowSlot()}>
                <div className={`itemCount`}>{item.stackable?`x${item.amount}`:""}</div>
                <img className={`invImage`} src={`./images/items/${item.icon}.png`} alt={"Item"}/>
                <div>{item.nameShort}</div>
                <div className={`price`}><img src={`./images/items/coin.png`} className={`coin`}/>{item.price?`${item.price}`:""}</div>
            </div>
        )
    })

    const barterScreen = showBarter ? (
        <div id={`barterScreen`} style={{top: coords.y - 15, left: coords.x - 15}}>
            <div>{barterItem.nameProper}</div>
            {barterItem.description ? <div className={`description`}><div>Description: </div><div>{barterItem.description}</div></div> : null }
            {barterItem.price && barterItem.stackable ? <div><div>Price Per: </div><div>{barterItem.price}</div></div> : null }
            {barterItem.stackable ?
                <div id={`barterInputContainer`}>
                    <button className={`barterInput commonButton`} onClick={()=>updateBarterNum(barterNum-20)}>-20</button>
                    <button className={`barterInput commonButton`} onClick={()=>updateBarterNum(barterNum-5)}>-5</button>
                    <button className={`barterInput commonButton`} onClick={()=>updateBarterNum(barterNum-1)}>-</button>
                    <input id={`barterNum`} className={`commonInput`} type="number" value={barterNum} onChange={(e)=>updateBarterNum(e.target.value)}></input>
                    <button className={"barterInput commonButton"} onClick={()=>updateBarterNum(barterNum+1)}>+</button>
                    <button className={`barterInput commonButton`} onClick={()=>updateBarterNum(barterNum+5)}>+5</button>
                    <button className={`barterInput commonButton`} onClick={()=>updateBarterNum(barterNum+20)}>+20</button>
                </div>
                : null }
            <div id={`barterPrice`}>
                Total Barter Price:
                <div style={{display: "flex", flexFlow: "row"}}>
                    {/buy|gamble/i.test(barterType) ? <div className={barterType}>-{((barterItem.price ?? 0) * barterNum).toLocaleString()}</div> : null }
                    {!/buy|gamble/i.test(barterType) ? <div className={barterType}>+{(rarityMarkup[barterItem.rarity] * (barterItem.price ?? 0) * barterNum).toLocaleString()}</div> : null }
                    <img src={`./images/items/coin.png`} className={`coin`}/>
                </div>
            </div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                {barterType=="buy" ? <button className={`barterButton commonButton`} onClick={()=>buyItem()}>Buy</button> : null }
                {barterType=="sell" ?<button className={`barterButton commonButton`} onClick={()=>sellItem()}>Sell</button> : null }
                {barterType=="gamble" ?<button className={`barterButton commonButton`} onClick={()=>gambleItem()}>Gamble</button> : null }
                <button className={`barterButton commonButton`} onClick={()=>refreshTooltip()}>X</button>
            </div>
        </div>
    ) : null


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

    const future = G.GameClocks.LastShopRefresh.add({seconds: G.ShopRefreshTime})
    const minutes = G.TimeNow.until(future).round({largestUnit: "minutes", smallestUnit: "seconds"}).toLocaleString("en", { style: "narrow", secondsDisplay: "always" })

    return (
        <div id={`shopPage`}>
            {rawStatItem?.name || statItem?.name ? 
                <Stats G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} item={rawStatItem || statItem} show={!showBarter} propCoords={coords} />
                : null }
            {secondItem?.name ? 
                <Stats G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} item={secondItem} show={!showBarter} propCoords={secondCoords} />
                : null }
            {barterScreen}
            <div id={"title"}>
                Shop
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
                                className={`commonButton ${quickSell?"on":"off"}`}
                                onClick={()=>setQuickSell(!quickSell)}>
                                Quick Sell: {quickSell?"On":"Off"}
                            </button>
                            {quickSell ? <div id={`quickWarning`}>ENABLED</div> : null}
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
                <div id={`shopContainer`}>
                    <button id={`fullheal`} className={`commonButton`} onClick={()=>fullHeal()}>
                        <div id={"fullhealCost"}><img src={`./images/items/coin.png`} className={`coin`}/>{healCost}</div>
                        <div id={"fullhealText"}><div className={`icon`}></div>Full Heal</div>
                    </button>
                    <div id={`shop`}>
                        <div className={`refreshTimer`}>Shop Restock: {minutes}</div>
                        {shop}
                    </div>
                    <div id={`den`}>
                        <div className={`denTitle`}>Gamble</div>
                        {den}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Shop as default };
