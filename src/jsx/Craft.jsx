"use strict";

import React, { useRef, useEffect, useState } from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import Bar from "./Bar.jsx"
import Stats from './Stats.jsx';

import "../style/Craft.less"


const Craft = function(props) {
    const { G, triggerUpdate, coreFns } = props

    const refs = useRef(null);

    const [recipes, setRecipes] = useState([])
    const [recipe, setRecipe] = useState(null)
    const [itemDescription, setItemDescription] = useState("")
    const [itemName, setItemName] = useState("")
    const [itemExp, setItemExp] = useState(null)
    const [itemCraftTime, setCraftTime] = useState(null)
    const [itemIcon, setItemIcon] = useState("")
    const [craftNum, setCraftNum] = useState(0)
    const [maxCraftNum, setMaxCraftNum] = useState(0)
    const [neededMaterials, setNeededMaterials] = useState()
    const [optionalCraftMaterials, setOptionalCraftMaterials] = useState()

    const [selectedOptionalItem, setSelectedOptionalItem] = useState()
    const [selectedEnhanceItem, setSelectedEnhanceItem] = useState()

    const [statItem, setItem] = useState(null);
    const [coords, setCoords] = useState({x: 0, y: 0});
    const [rawStatItem, setRawStatItem] = useState(null);

    const [secondItem, setSecondItem] = useState(null);
    const [secondCoords, setSecondCoords] = useState({x: 0, y: 0});

    const [itemSlot, setItemSlot] = useState()
    const [showExtra, setShowExtra] = useState(false);
    const [extraItem, setExtraItem] = useState({name: "Test"})
    const [canEnchant, setCanEnchant] = useState(false)
    const [canSocket, setCanSocket] = useState(false)

    const [expandedCategories, setExpandedCategories] = useState([])

    const title = G.Screen

    const socketTax = [ 1, 2, 4 ]

    useEffect(() => {
        fetchRecipeNames(G.Drops)
        setRecipe(null)
        setItemName("")
        setItemExp(null)
        setCraftTime(null)
        setItemIcon("")
        setItemDescription("")
        setMaxCraftNum(0)
        setCraftNum(1)

        setItemSlot()
        setExtraItem({})
        setShowExtra(false)
        setCanEnchant(false)
        setNeededMaterials(null)
        setOptionalCraftMaterials(null)
        setSelectedOptionalItem()
        setSelectedEnhanceItem()
        const foundCategories = localStorage.getItem("categories");
        if(foundCategories) {
            let parsedCategories = JSON.parse(foundCategories)
            if(parsedCategories.hasOwnProperty(G.Screen)) {
                setExpandedCategories(parsedCategories[G.Screen])
            } else {
                updateSavedCategories([])
            }
        }
    }, [G.Screen])

    const fetchRecipeNames = (itemCatalog) => {
        const skillname = G.Screen.toLowerCase()
        const validRecipes = itemCatalog.filter((item, i) => {
            if(item.recipe && item.skill == skillname) {
                return G.Recipes.filter((r) =>
                    r.teaches.some((recipeitem) => recipeitem == item.name)
                ).length > 0
            }
        })
        let recipeList = {"non-categorized": []}
        const addItemToCategory = (item, category) => {
            if(!recipeList[category]) {
                recipeList[category] = [item]
            } else {
                recipeList[category].push(item)
            }
        }
        validRecipes.forEach((item) => {
            if(item.recipe.category) {
                addItemToCategory(item, item.recipe.category)
            } else if(item.stats.color) {
                addItemToCategory(item, item.stats.color)
            } else if(item.skill == "prayer" || item.skill == "inscription") {
                let statname = Object.keys(item.stats).find((key) => {
                    if(key == "price") { return false }
                    return typeof item.stats[key] == "number"
                })
                addItemToCategory(item, statname)
            } else if(item.stats.slot) {
                addItemToCategory(item, item.stats.slot)
            } else {
                recipeList["non-categorized"].push(item)
            }
        })
        const sortedRecipeList = {}
        Object.keys(recipeList).sort().forEach((category) => {
            recipeList[category].sort((a,b)=>{
                //return a.name>=b.name
                return a.recipe.lvl>=b.recipe.lvl
            })
            sortedRecipeList[category] = recipeList[category]
        })
        if(skillname == "prayer" || skillname == "inscription") {
            setRecipes(sortedRecipeList)
        } else {
            setRecipes(recipeList)
        }
    }

    const updateCraftNum = (val) => {
        if(val > maxCraftNum) {
            val = maxCraftNum
        }
        if(val <= 0) {
            val = 0
        }
        setCraftNum(parseInt(val))
    }
    const selectItem = (item) => {
        setRecipe(item.recipe)
        setItemName(G.properName(item.name))
        setItemExp(item.recipe.exp)
        setItemIcon(item.stats.icon ?? "item")
        setItemDescription(item.stats.description)
        setMaxCraftNum(0)
        setCraftNum(1)
        setSelectedOptionalItem()
        setSelectedEnhanceItem()
        if(G.Screen == "Enchanting") {
            setItemSlot(item.stats.slot)
        }
        if(item.recipe?.craftTime || !/enchanting|prayer|jewelcrafting/i.test(G.Screen)) {
            setCraftTime(`${item.recipe.craftTime?item.recipe.craftTime:"3"}s craft`)
        } else {
            setCraftTime(null)
        }

        let materials = {}
        let optMaterials = {}
        Object.keys(item.recipe.ingredients).forEach((mat) => {
            if(mat == "craftOptions" || mat == "craftEnhancements") {
                Object.keys(item.recipe.ingredients[mat]).forEach((optMatName) => {
                    optMaterials[optMatName] = item.recipe.ingredients[mat][optMatName]
                })
            } else {
                materials[mat] = 0
            }

        })
        setNeededMaterials(materials)
        setOptionalCraftMaterials(optMaterials)
    }

    //TODO: xSupport multiple selections
    //At least for now, 1 optional and 1 enhance
    const selectOptionalItem = (matName, matType, e) => {
        let newSelected = matName
        //TODO: Maybe make actual items
        if(matType == "optional") {
            if(selectedOptionalItem == matName) { newSelected = "" }
            setSelectedOptionalItem(newSelected)
        }
        if(matType == "enhancement") {
            if(selectedEnhanceItem == matName) { newSelected = "" }
            setSelectedEnhanceItem(newSelected)
        }
        setCraftNum(1)
        setMaxCraftNum()
    }

    const craftItem = (numToCraft = 0) => {
        if(!itemName || numToCraft == 0) { return }

        //TODO: Maybe make actual items
        const optionalIngredients = [selectedOptionalItem, selectedEnhanceItem].filter(n=>n)
        const craftable = G.craftItem(itemName, numToCraft, optionalIngredients)
        if(!craftable) {
            console.log("Insufficient ingredients or duplicate tool")
        }
    }
    const stopCrafting = () => {
        G.resetActivity()
    }
    const extraMenu = (e, item, i) => {
        e.preventDefault()
        const x = e.clientX - 265
        const y = e.clientY - 35
        setCoords({ x: x, y: y });
        setShowExtra(true)
        setExtraItem(item)
        stopShowSlot()
        const haveMats = Object.entries(recipe.ingredients).every((kv, i) => {
            let [ materialName, numMaterialNeeded ] = kv
            if(/^socket/i.test(itemName) && item.sockets.length >= 1) {
                numMaterialNeeded *= socketTax[item.sockets.length]
            }
            let numMaterialOwned = 0
            const foundExisting = G.findFirstItem(materialName)
            if(foundExisting.amount) {
                numMaterialOwned = foundExisting.amount
            }
            const craftable = Math.floor(numMaterialOwned/numMaterialNeeded)
            return craftable > 0
        })
        const hasExp = G.Skills[G.Screen].level >= recipe?.lvl
        setCanEnchant(haveMats && hasExp)
        setCanSocket(haveMats && hasExp)
    }
    const enchantItem = (item, slot) => {
        const enchantment = G.createItem(itemName)
        const enchanted = item.enchant(enchantment)
        if(enchanted) {
            Object.entries(recipe.ingredients).forEach((kv) => {
                const [ ingredient, amount ] = kv
                const invitem = G.findFirstItem(ingredient)
                invitem.reduceAmount(amount)
            })
            G.stopBattling()
            G.addExp(recipe.exp, "Enchanting")
            G.Inventory = G.Inventory.filter((invItem, ind) => invItem.amount !== 0)
            refreshTooltip()
            //Easiest solution to recalculate attackspeed
            if(G.Player.Gear.Weapon == item) { G.Player.equipItem(item) }
        }
    }
    const rerollItem = (item, slotNum) => {
        const rerolled = item.rerollAffix(slotNum)
        if(rerolled) {
            Object.entries(recipe.ingredients).forEach((kv) => {
                const [ ingredient, amount ] = kv
                const invitem = G.findFirstItem(ingredient)
                invitem.reduceAmount(amount)
            })
            G.stopBattling()
            G.addExp(recipe.exp, "Enchanting")
            G.Inventory = G.Inventory.filter((invItem, ind) => invItem.amount !== 0)
            refreshTooltip()
            //Easiest solution to recalculate attackspeed
            if(G.Player.Gear.Weapon == item) { G.Player.equipItem(item) }
        }
    }
    const rerollSockets = (item) => {
        const socketed = item.rerollSockets()
        if(socketed) {
            Object.entries(recipe.ingredients).forEach((kv) => {
                const [ ingredient, amount ] = kv
                const invitem = G.findFirstItem(ingredient)
                invitem.reduceAmount(amount)
            })
            G.stopBattling()
            G.addExp(recipe.exp, "Jewelcrafting")
            G.Inventory = G.Inventory.filter((invItem, ind) => invItem.amount !== 0)
            refreshTooltip()
            //Easiest solution to recalculate attackspeed
            if(G.Player.Gear.Weapon == item) { G.Player.equipItem(item) }
        }
    }
    const socketItem = (item, slotNum) => {
        const gem = G.createItem(itemName)
        const socketed = item.socket(gem, slotNum)
        let exp = recipe.exp
        if(socketed) {
            Object.entries(recipe.ingredients).forEach((kv) => {
                let [ ingredient, amount ] = kv
                const invitem = G.findFirstItem(ingredient)
                if(gem.color == "grey" && item.sockets.length >= 1) {
                    amount *= socketTax[item.sockets.length-1]
                }
                invitem.reduceAmount(amount)
            })
            exp *= socketTax[item.sockets.length-1]
            G.stopBattling()
            G.addExp(exp, "Jewelcrafting")
            G.Inventory = G.Inventory.filter((invItem, ind) => invItem.amount !== 0)
            refreshTooltip()
            //Easiest solution to recalculate attackspeed
            if(G.Player.Gear.Weapon == item) { G.Player.equipItem(item) }
        }
    }
    const pray = () => {
        const prayer = G.createItem(itemName)
        const prayed = G.Player.setPrayer(prayer)
        if(prayed) {
            Object.entries(recipe.ingredients).forEach((kv) => {
                const [ ingredient, amount ] = kv
                const invitem = G.findFirstItem(ingredient)
                invitem.reduceAmount(amount)
            })
            G.stopBattling()
            G.addExp(recipe.exp, "Prayer")
            G.Inventory = G.Inventory.filter((invItem, ind) => invItem.amount !== 0)
            refreshTooltip()
        }
    }

    const toggleCategory = (categoryname) => {
        let currentExpanded = [...expandedCategories]
        if(expandedCategories.includes(categoryname)) {
            currentExpanded = currentExpanded.filter((cat) => cat != categoryname)
        } else {
            currentExpanded.push(categoryname)
        }
        setExpandedCategories(currentExpanded)
        updateSavedCategories(currentExpanded)
    }
    const expandAll = () => {
        setExpandedCategories(Object.keys(recipes))
        updateSavedCategories(Object.keys(recipes))
    }
    const collapseAll = () => {
        setExpandedCategories([])
        updateSavedCategories([])
    }

    const updateSavedCategories = (newCategories) => {
        const foundCategories = localStorage.getItem("categories");
        let categories = {}
        if(foundCategories) {
            categories = JSON.parse(foundCategories)
        }
        categories[G.Screen] = newCategories
        localStorage.setItem("categories", JSON.stringify(categories));
    }

    const compareSlot = (item, e, craftMats) => {
        if(typeof(item) == "string") {
            item = {name: item}
            if(craftMats) { item.craftMats = craftMats }
            item = G.createItem(item)
        }
        if(!(item instanceof G.Class.Gear)) { return }
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

    const showSlot = (item, e, offset = {x: 0, y: 0}, craftMats) => {
        if(!item || showExtra) { return }
        if(typeof(item) == "string") {
            item = {name: item}
            if(craftMats) { item.craftMats = craftMats }
            item = G.createItem(item)
        }
        if(!rawStatItem) { setItem(item) }

        if(item instanceof G.Class.Gear) { offset.y -= 100 }
        let y = e.clientY-65 + offset.y
        //Min y value
        if(y < 20) { y = 20 }

        setCoords({x: e.clientX-245 + offset.x, y: y})
        setSecondCoords({x: e.clientX-26 + offset.x, y: y})
    }
    const stopShowSlot = () => {
        setItem(null)
        setSecondItem(null)
        setRawStatItem(null)
    }
    const refreshTooltip = () => {
        setShowExtra(false)
        setCanEnchant(false)
        setExtraItem(null)
        stopShowSlot()
    }

    const disabled = recipe?.lvl > G.Skills[G.Screen].level  ? "disabled" : ""
    const disableCraft = maxCraftNum == 0 || maxCraftNum == null || disabled ? "disabled" : ""

    const recipeList = Object.keys(recipes).map((categoryname, i) => {
        const items = recipes[categoryname].map((item, i) => {
            const itemname = G.properName(item.name)
            const hasMaterials = G.hasSufficientIngredients(item.recipe.ingredients) ? "" : "disabled"
            const hasExp = G.Skills[G.Screen].level >= item.recipe?.lvl ? "" : "inexperienced"
            return (
                <div key={itemname} className={`itemname ${hasMaterials} ${hasExp}`} onClick={()=>selectItem(item)}>
                    {itemname}
                </div>
            )
        })
        if(!items.length) { return null }
        if(categoryname == "food") { return items }
        const isExpanded = expandedCategories.includes(categoryname)
        return (
            <div className={`category`} key={categoryname}>
                <div className={`categoryname`} onClick={()=>toggleCategory(categoryname)}>
                    <i className={`arrow ${isExpanded ? "down" : "right"}`}></i>{G.properName(categoryname)}
                </div>
                {isExpanded ? items : null}
            </div>
        )
    })

    //TODO: Optimize/memoize materials
    const getMaterials = (kv, matType) => {
        const [ materialName, numMaterialNeeded ] = kv
        if(materialName == "craftOptions" || materialName == "craftEnhancements") { return }

        let numMaterialOwned = 0
        const foundExisting = G.findFirstItem(materialName)
        if(foundExisting.amount) {
            numMaterialOwned = foundExisting.amount
        }

        const craftable = Math.floor(numMaterialOwned/numMaterialNeeded)
        const materialSelected = selectedOptionalItem == materialName || selectedEnhanceItem == materialName

        if(Object.hasOwn(neededMaterials, materialName) && neededMaterials[materialName] != numMaterialOwned) {
            setNeededMaterials({...neededMaterials, [materialName]: numMaterialOwned})
            setMaxCraftNum(null)
        }
        if(materialSelected && Object.hasOwn(optionalCraftMaterials, materialName) && optionalCraftMaterials[materialName] != numMaterialOwned) {
            setOptionalCraftMaterials({...optionalCraftMaterials, [materialName]: numMaterialOwned})
            setMaxCraftNum(null)
        }
        if(!matType && (maxCraftNum == null || craftable < maxCraftNum)) {
            setMaxCraftNum((max) => max == null || craftable < max ? craftable : max)
        }
        if(matType != "" && materialSelected && (maxCraftNum == null || craftable < maxCraftNum)) {
            setMaxCraftNum((max) => max == null || craftable < max ? craftable : max)
        }
        if(matType == "optional" && !selectedOptionalItem && maxCraftNum != 0) {
            setMaxCraftNum(0)
        }

        const matname = G.properName(materialName)
        const maticon = G.findInCatalog(materialName).stats?.icon ?? "item"
        const selected = matType != "" && materialSelected ? "selected" : ""
        return (
            <div key={materialName} className={`materialIcon ${selected} ${craftable>0?"sufficient":"insufficient"}`} 
                onMouseEnter={(e)=>refreshTooltip()}
                onClick={(e)=>matType != "" && selectOptionalItem(materialName, matType, e)}
                onMouseMove={(e)=>showSlot(materialName, e)}
                onMouseLeave={()=>stopShowSlot()}>
                <div className={`itemCount`}>
                    {numMaterialOwned}/{numMaterialNeeded}
                </div>
                <img className={`invImage`} src={`./images/items/${maticon}.png`} alt={"Item"}/>
                <div>{G.toShortProper(matname)}</div>
            </div>
        )
    }

    const materials = recipe && Object.entries(recipe.ingredients).map((kv, i) => {
        return getMaterials(kv)
    })
    const optMaterials = recipe?.ingredients["craftOptions"] && Object.entries(recipe.ingredients["craftOptions"]).map((kv, i) => {
        return getMaterials(kv, "optional")
    })
    const enhanceMaterials = recipe?.ingredients["craftEnhancements"] && Object.entries(recipe.ingredients["craftEnhancements"]).map((kv, i) => {
        return getMaterials(kv, "enhancement")
    })

    const skillData = {barType: "craft", barTextType: "timer", timer: G.TimeNow}
    const skillProgressBar = <Bar id={"craft"} G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} data={skillData}/>

    const craftSetNumberButton = !G.Crafting
        ? <button className={`craftInput commonButton ${disableCraft}`} disabled={disableCraft} onClick={()=>craftItem(craftNum)}>Start Crafting</button>
        : <button className={`craftInput commonButton`} onClick={()=>stopCrafting()}>Stop Crafting</button>

    const craftMaxNumberButton = !G.Crafting && maxCraftNum != null
        ? <button className={`craftInput commonButton ${disableCraft}`} disabled={disableCraft} onClick={()=>craftItem(maxCraftNum)}>Craft Max ({maxCraftNum})</button>
        : null

    const currentCraftText = G.Crafting && G.Craft?.item
        ? <div style={{fontSize: 14, width: "20%"}}>Crafting x{G.Craft.numToCraft} {G.properName(G.Craft.item.name)}</div>
        : null

    const craftInputContainer = !G.Crafting
        ? (<div id={"craftInputContainer"}>
            <button className={`commonButton`} onClick={()=>updateCraftNum(craftNum-20)}>-20</button>
            <button className={`commonButton`} onClick={()=>updateCraftNum(craftNum-5)}>-5</button>
            <button className={`commonButton`} onClick={()=>updateCraftNum(craftNum-1)}>-</button>
            <input id={`craftNum`} className={`commonInput`} type="number" value={craftNum} onChange={(e)=>updateCraftNum(e.target.value)}></input>
            <button className={"commonButton"} onClick={()=>updateCraftNum(craftNum+1)}>+</button>
            <button className={`commonButton`} onClick={()=>updateCraftNum(craftNum+5)}>+5</button>
            <button className={`commonButton`} onClick={()=>updateCraftNum(craftNum+20)}>+20</button>
           </div>)
        : null

    const showInv = G.Screen === "Enchanting" || (G.Screen === "Jewelcrafting" && /socket|gem/i.test(itemName))
    const showCraftedButton = G.Screen !== "Prayer" && !showInv

    const craftedItemAction = showCraftedButton
        ? (<div id={`craftedItemAction`}>
              {currentCraftText}
              {craftMaxNumberButton}
              {craftSetNumberButton}
              {craftInputContainer}
              {G.Crafting ? skillProgressBar : null}
           </div>
        ) : null 

    const prayButton = G.Screen == "Prayer"
        ? <button className={`commonButton ${disableCraft}`} disabled={disableCraft} onClick={()=>pray()}>Sacrifice and Pray</button>
        : null

    const filterItems = (item) => {
        if(G.Screen === "Jewelcrafting" && item?.sockets) {
            if(/spd|resolute|quick/i.test(itemName)) {
                return item?.slot == "weapon" && item?.sockets.length > 0
            }
            if(/reroll/i.test(itemName)) {
                return item?.sockets.length > 0
            }
            if(/socket/i.test(itemName)) {
                return !/potion|flask/.test(item?.slot) && item?.sockets.length < item?.maxSockets
            }
            return itemName && item?.sockets.length > 0
        }
        if(G.Screen === "Enchanting" && itemSlot == "any") {
            return item.affixes?.actual.length > 0
        }
        if(G.Screen === "Enchanting") {
            return itemSlot && item.slot == itemSlot
        }
    }

    const filteredInv = showInv
        ? G.Inventory.filter((item, i) => filterItems(item))
        : null

    const filteredEquip = showInv ? Object.entries(G.Player.Gear).filter(([slot, item]) => {
        if(item == null) { return }
        return filterItems(item)
    }).map(([slot, item]) => item) : []

    const modifiableItems = filteredInv ? filteredEquip.concat(filteredInv).map((item, i) => {
        const equipped = Object.entries(G.Player.Gear).find(([slot, gearitem]) => gearitem == item) ? "Equipped" : ""
        let row = (i+1) / 6
        //Cap y offset (dont push to far up from mouse)
        if(row > 2) { row = 2 }
        let yOffset = row * -25
        return (
            <div key={item.name+i} className={`invItem ${item?.rarity} ${equipped}`}
                //Maybe compare here
                onContextMenu={(e)=>extraMenu(e, item, i)} 
                onMouseEnter={(e)=>refreshTooltip()}
                onMouseMove={(e)=>showSlot(item, e, {x: -10, y:yOffset-50})}
                onMouseLeave={()=>stopShowSlot()}>
                <div className={`equippedText`}>{equipped}</div>
                <div className={`itemCount`}>{item.stackable?`x${item.amount}`:""}</div>
                <img className={`invImage`} src={`./images/items/${item.icon}.png`} alt={"Item"}/>
                <div className={item?.rarity}>{item.nameProper}</div>
            </div>
        )
    }) : null


    const extraScreen = showExtra ? (
        <div id={`extraItem`} style={{top: coords.y - 15, left: coords.x - 15}}>
            <div>{extraItem.nameProper}</div>
            <div className={`extraItemButtons`}>
                {G.Screen == "Jewelcrafting" && /^socket/i.test(itemName)
                    ? <button className={`commonButton ${canSocket?"":"disabled"}`} disabled={!canSocket}
                        onClick={()=>socketItem(extraItem, extraItem.sockets.length)}>Add Socket {extraItem.sockets.length>0?`(${socketTax[extraItem.sockets.length]}x cost)`:""}</button>
                    : null }
                {G.Screen == "Jewelcrafting" && extraItem.sockets.length >= 1 && /gem/i.test(itemName)
                    ? <button className={`commonButton ${canSocket?"":"disabled"}`} disabled={!canSocket} onClick={()=>socketItem(extraItem, 0)}>Socket 1st slot</button>
                    : null }
                {G.Screen == "Jewelcrafting" && extraItem.sockets.length >= 2 && /gem/i.test(itemName)
                    ? <button className={`commonButton ${canSocket?"":"disabled"}`} disabled={!canSocket} onClick={()=>socketItem(extraItem, 1)}>Socket 2nd slot</button>
                    : null }
                {G.Screen == "Jewelcrafting" && extraItem.sockets.length == 3 && /gem/i.test(itemName)
                    ? <button className={`commonButton ${canSocket?"":"disabled"}`} disabled={!canSocket} onClick={()=>socketItem(extraItem, 2)}>Socket 3rd slot</button>
                    : null }

                {G.Screen == "Jewelcrafting" && extraItem.sockets.length >= 1 && /reroll/i.test(itemName)
                    ? <button className={`commonButton ${canSocket?"":"disabled"}`} disabled={!canSocket} onClick={()=>rerollSockets(extraItem)}>Reroll sockets</button>
                    : null }

                {G.Screen == "Enchanting" && !/reroll/i.test(itemName)
                    ? <button className={`commonButton ${canEnchant?"":"disabled"}`} disabled={!canEnchant} onClick={()=>enchantItem(extraItem)}>Enchant</button>
                    : null }
                {G.Screen == "Enchanting" && extraItem.affixes.actual.length >= 1 && /reroll.all/i.test(itemName)
                    ? <button className={`commonButton ${canEnchant?"":"disabled"}`} disabled={!canEnchant} onClick={()=>rerollItem(extraItem, "all")}>Reroll all affixes</button>
                    : null }
                {G.Screen == "Enchanting" && extraItem.affixes.actual.length >= 1 && /reroll.one/i.test(itemName)
                    ? <button className={`commonButton ${canEnchant?"":"disabled"}`} disabled={!canEnchant} onClick={()=>rerollItem(extraItem, 0)}>Reroll 1st affix</button>
                    : null }
                {G.Screen == "Enchanting" && extraItem.affixes.actual.length >= 2 && /reroll.one/i.test(itemName)
                    ? <button className={`commonButton ${canEnchant?"":"disabled"}`} disabled={!canEnchant} onClick={()=>rerollItem(extraItem, 1)}>Reroll 2nd affix</button>
                    : null }
                {G.Screen == "Enchanting" && extraItem.affixes.actual.length >= 3 && /reroll.one/i.test(itemName)
                    ? <button className={`commonButton ${canEnchant?"":"disabled"}`} disabled={!canEnchant} onClick={()=>rerollItem(extraItem, 2)}>Reroll 3rd affix</button>
                    : null }
            </div>
        </div>
    ) : null

    const reqLevel = recipe?.lvl ?  (
        <div className={disabled} style={{flex: 1, alignContent: "center"}}>
            Required level: {recipe.lvl}
        </div>
    ) : null

    const expData = {barType: "exp", barTextType: "value", skill: G.Skills[G.Screen]}
    return (
        <div id={`craftPage`}>
            {rawStatItem?.name || statItem?.name ? 
                <Stats G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} item={rawStatItem || statItem} show={!showExtra} propCoords={coords} />
                : null }
            {secondItem?.name ? 
                <Stats G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} item={secondItem} show={!showExtra} propCoords={secondCoords} />
                : null }
            {extraScreen}
            <div id={"title"}>
                {title}
            </div>
            <Bar id={"exp"} G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} data={expData}/>
            <div id={`mainCraft`}>
                <div id={`recipeList`}>
                    <div style={{display: G.Screen != "Cooking" ? "flex" : "none", flexFlow: "row", justifyContent: "center"}}>
                        <div className={`commonButton`} onClick={()=> expandAll()}>Expand all</div>
                        <div className={`commonButton`} onClick={()=> collapseAll()}>Collapse all</div>
                    </div>
                    {recipeList}
                </div>
                <div id={`selectedRecipe`}>
                    <div id={`materialsContainer`}>
                        {reqLevel}
                        <div id={`recipeMaterials`}>
                            <div style={{display: "flex", flexFlow: "row wrap", justifyContent: "center"}}>
                                {materials}
                            </div>
                            <div style={{display: "flex", flexFlow: "column"}}>
                                <div className={`additionalRecipeMaterials`} style={{display: optMaterials?"flex":"none"}}>
                                    <div>Select 1</div>
                                    <div>
                                        {optMaterials}
                                    </div>
                                </div>
                                <div className={`additionalRecipeMaterials`} style={{display: enhanceMaterials?"flex":"none"}}>
                                    <div>Enhance</div>
                                    <div>
                                        {enhanceMaterials}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id={`craftedItem`}>
                        <div>
                            <div id={`craftedItemIcon`} 
                                ref={(r) => refs.current = r}
                                tabIndex={-1}
                                onKeyDown={(e)=>compareSlot(itemName, e, [selectedOptionalItem, selectedEnhanceItem])}
                                onKeyUp={(e)=>{setSecondItem(null); setRawStatItem(null)}}
                                onMouseEnter={(e)=>{refs.current.focus(); refreshTooltip()}}
                                onMouseMove={(e)=>{refs.current.focus(); showSlot(itemName, e, {x:0,y:0}, [selectedOptionalItem, selectedEnhanceItem])}}
                                onMouseLeave={()=>{refs.current.blur(); stopShowSlot()}}>
                                <div className={`itemCount`}>{maxCraftNum?`(${maxCraftNum})`:null}</div>
                                {itemIcon ? <img className={`invImage`} src={`./images/items/${itemIcon}.png`}/> : null}
                                <div>{itemName}</div>
                            </div>
                            <div className={`craftInfo exp`}>{itemExp?`+${itemExp} exp`:""}</div>
                            <div className={`craftInfo craftTime`}>{itemCraftTime?itemCraftTime:""}</div>
                        </div>
                        <div id={`craftedItemText`}>{itemDescription}</div>
                        {craftedItemAction}
                        {modifiableItems ? (<div id={`modifiableInventory`}> {modifiableItems} </div>) : null}
                        {prayButton}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Craft as default };
