"use strict";

import React, { useMemo, useEffect, useState } from 'react';
import DOM from 'react-dom';

// var PropTypes = React.PropTypes;

import Bar from "./Bar.jsx"
import Stats from './Stats.jsx';

import "../style/RightMenu.less"

const RightMenu = function(props) {
    const { G, triggerUpdate, coreFns } = props

    const [adminPopup, setAdminPopup] = useState(false)
    const [adminItemName, setAdminItemName] = useState("")
    const [adminSkillName, setAdminSkillName] = useState("")
    const [adminItemAmount, setAdminItemAmount] = useState(50)

    const [popupStatus, setPopupStatus] = useState(false)
    const [activityLoot, setActivityLoot] = useState([])
    const [activityExp, setActivityExp] = useState(0)
    const [debugPopup, setDebugPopup] = useState(false)

    const [activityData, setActivityData] = useState({barType: "activity", barTextType: "activity"})

    const [currentMobLootTable, setCurrentMobLootTable] = useState([])
    const [mobLootTable, setMobLootTable] = useState([])
    const [dungeonLootTable, setDungeonLootTable] = useState([])

    const [item, setItem] = useState(null);
    const [coords, setCoords] = useState({x: 0, y: 0});

    const [showEquipment, setShowEquipment] = useState(true);

    useEffect(() => {
        if(Object.keys(G.RecentActivity).length > 0) {
            setActivityExp(G.RecentActivity?.exp)
            setActivityLoot(G.RecentActivity?.loot ?? [])
            const show = G.RecentActivity?.exp > 0 || G.RecentActivity?.loot.length > 0
            setPopupStatus(show)
            setActivityData({...activityData, skill: G.Skills[G.RecentActivity.expSkill]})
            var timer = setTimeout(()=>{
                setPopupStatus(false)
            }, 2000)
        } else {
            setPopupStatus(false)
            setActivityData({...activityData, skill: null})
        }
        return () => clearTimeout(timer)
    }, [G.RecentActivity.updatedAt, G.RecentActivity.exp])

    useEffect(() => {
        if(G.Enemy && !G.Dungeon) {
            const loot = Object.keys(G.Enemy.lootTable).map((itemname) => {
                if(/_key$/i.test(itemname)) {
                    if(G.Keyring.find(key => key == itemname)) { return }
                    if(G.Inventory.find(item => item.name == itemname)) { return }
                }
                if(/recipe/i.test(itemname)) {
                    if(G.Recipes.find(recipe => recipe.name == itemname)) { return }
                    if(G.Inventory.find(item => item.name == itemname)) { return }
                }
                const chance = G.Enemy.lootTable[itemname]
                return {item: G.createItem({name: itemname}), chance: chance}
            }).filter(l => l)
            setCurrentMobLootTable(loot)
        } else {
            setCurrentMobLootTable([])
        }
    }, [G.Enemy?.name, G.Screen])

    useEffect(() => {
        if(G.Dungeon) {
            const dungeonMobLootTable = {}
            let totalRange = 0
            G.Dungeon.mobs.forEach((mob) => {
                Object.entries(mob.lootTable).forEach(([name, chance]) => {
                    if(/_key/.test(name)) {
                        const dungeonName = new RegExp(`${G.toCatalogName(G.Dungeon.name)}`)
                        if(dungeonName.test(name)) { return }
                    }
                    if(/recipe/i.test(name)) {
                        if(G.Recipes.find(recipe => recipe.name == name)) { return }
                        if(G.Inventory.find(item => item.name == name)) { return }
                        chance *= 7
                    }
                    totalRange += chance
                    if(!dungeonMobLootTable[name]) { dungeonMobLootTable[name] = chance }
                    else { dungeonMobLootTable[name] += chance }
                })
            })
            const dungeonLootTable  = {}
            let dungeonChance  = 0
            Object.entries(G.Dungeon.lootTable).forEach(([name, chance]) => {
                dungeonChance += chance
                if(!dungeonLootTable[name]) { dungeonLootTable[name] = chance }
                else { dungeonLootTable[name] += chance }
            })

            const loot = Object.keys(dungeonMobLootTable).map((itemname) => {
                const lotNumbers = dungeonMobLootTable[itemname]
                let chance = parseFloat((lotNumbers / totalRange * 100).toFixed(1))
                if(/_key/i.test(itemname)) { chance = 100 }
                return {item: G.createItem({name: itemname}), chance: chance, type: "mob"}
            })
            const dungeonLoot = Object.keys(dungeonLootTable).map((itemname) => {
                const lotNumbers = dungeonLootTable[itemname]
                const chance = parseFloat((lotNumbers / dungeonChance * 100).toFixed(1))
                return {item: G.createItem({name: itemname}), chance: chance, type: "dungeon"}
            })
            setDungeonLootTable(dungeonLoot.concat(loot))
        } else {
            setDungeonLootTable([])
        }
    }, [G.Dungeon, G.Screen])

    useEffect(() => {
        if(G.DisplayEnemy) {
            const loot = Object.keys(G.DisplayEnemy.lootTable).map((itemname) => {
                const chance = G.DisplayEnemy.lootTable[itemname]
                return {item: G.createItem({name: itemname}), chance: chance}
            })
            setMobLootTable(loot)
        } else {
            setMobLootTable([])
        }
    }, [G.DisplayEnemy?.name, G.Screen])


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


    const save = () => {
        coreFns.save()
    }

    const showSlot = (item, e, offset = {x: 0, y: 0}) => {
        setItem(item)
        if(item instanceof G.Class.Gear) {
            setCoords({x: e.clientX - 250+offset.x, y: e.clientY - 45+offset.y})
        }
        if(item instanceof G.Class.Tool) {
            setCoords({x: e.clientX - 310+offset.x, y: e.clientY - 30+offset.y})
        }
        if(!(item instanceof G.Class.Gear) && item instanceof G.Class.Item) {
            setCoords({x: e.clientX - 310+offset.x, y: e.clientY - 30+offset.y})
        }
    }
    const stopShowSlot = () => {
        setItem(null)
    }
    const refreshTooltip = () => {
        stopShowSlot()
    }

    const addAdminItems = () => {
        G.addItems({name: adminItemName, amount: adminItemAmount})
    }
    const levelSkill = (direction) => {
        if(G.Skills[adminSkillName]) {
            let skill = G.Skills[adminSkillName]
            if(direction == "up") { skill.level += 1 }
            if(skill.level > 99) { skill.level = 99 }
            if(direction == "down") { skill.level -= 1 }
            if(skill.level < 1) { skill.level = 1 }
            skill.experience = 0;
        }
    }
    const addAdminGearSet = () => {
        let gearset = [
            //Combat
            {name: "def_flask_1", amount: 20},
            {name: "def_potion_2", amount: 20},
            {name: "str_potion_2", amount: 20},
            {name: "roasted_corn", amount: 500},
            //Prayer
            {name: "ink", amount: 100},
            {name: "scroll", amount: 200},
            {name: "bone", amount: 200},
            {name: "tusk", amount: 100},
            {name: "fang", amount: 100},
            //Enchant
            {name: "minor_essence", amount: 500},
            {name: "minor_crystal", amount: 500},
            {name: "lesser_essence", amount: 500},
            {name: "lesser_crystal", amount: 500},
            //JC
            {name: "green_crystal", amount: 200},
            {name: "red_crystal", amount: 200},
            {name: "blue_crystal", amount: 200},
            {name: "yellow_crystal", amount: 200},
            {name: "purple_crystal", amount: 200},
            {name: "silver_bar", amount: 200},
            {name: "gold_bar", amount: 200},
            //Smithing
            {name: "copper_bar", amount: 1000},
            {name: "bronze_bar", amount: 1000},
            {name: "iron_bar", amount: 1000},
            {name: "steel_bar", amount: 1000},
            {name: "mithril_bar", amount: 1000},
            {name: "cloth", amount: 400},
            {name: "wing", amount: 400},
            {name: "hide", amount: 400},
            {name: "pelt", amount: 400},
            {name: "beak", amount: 100},
            {name: "sword_hilt_1", amount: 100},
            {name: "weapon_fragments", amount: 100},
            {name: "claw", amount: 100},
            {name: "sword_hilt_2", amount: 100},
            {name: "leather_scraps", amount: 3000},
            {name: "sword_hilt_3", amount: 100},
            {name: "sword_hilt_4", amount: 100},
            {name: "sword_hilt_5", amount: 100},
            //tools
            {name: "copper_axe", amount: 1},
            {name: "copper_hoe", amount: 1},
            {name: "copper_pickaxe", amount: 1},
            {name: "copper_shovel", amount: 1},
            {name: "copper_hammer", amount: 1},
            {name: "copper_mortar", amount: 1},
            {name: "copper_pot", amount: 1},
            {name: "copper_rod", amount: 1},
            {name: "copper_gemcutter", amount: 1},
            {name: "leather_bible_1", amount: 1},
            {name: "calligraphy_set_1", amount: 1},
            //Crafting 
            {name: "orb_of_absolute", amount: 50},
            {name: "orb_of_choice", amount: 50},
            {name: "orb_of_jewelry", amount: 50},
            {name: "rune_of_enhancement_1", amount: 50},
            {name: "rune_of_rarity_1", amount: 50},
            {name: "rune_of_chance_1", amount: 50},
            {name: "rune_of_striking_1", amount: 50},
            {name: "rune_of_fortitude_1", amount: 50},
            {name: "rune_of_protection_1", amount: 50},
            {name: "rune_of_strength_1", amount: 50},
        ]
        G.addItems(gearset)
        addAllRecipes()

        const allKeys = G.Drops.filter((item) => /.*_key/.test(item.name))
        allKeys.forEach((key) => G.addKey(key))
    }
    const removeAdminItems = () => {
        G.Inventory = G.Inventory.filter((item)=>item.name!=adminItemName)
        G.Keyring = G.Keyring.filter((item)=>item!=adminItemName)
        G.Recipes = G.Recipes.filter((item)=>item.name!=adminItemName)
        if(adminItemName == "coin") {
            G.removeSilver(adminItemAmount)
        }
    }
    const addAllRecipes = () => {
        const allRecipes = G.Drops.filter((item) => item.name.includes("recipe"))
        allRecipes.forEach((recipe) => G.unlockRecipe(recipe))
    }

    const loot = activityLoot.length > 0 ? activityLoot.map((loot, i) => {
        return (
            <div key={loot.name+i} className={`loot`}>
                <div className={`lootCount`}>x{loot.amount}</div>
                <img className={`lootIcon ${loot?.rarity}`} src={`./images/items/${loot.icon}.png`} alt={"Item"}/>
                <div className={loot?.rarity}>{loot.nameProper}</div>
            </div>
        )
    }) : null
    const popup = (
        <div id={`activityPopup`} className={`${popupStatus || debugPopup?"open":"close"}`}>
            <div id={`activityTitle`}>{G.RecentActivity.expSkill}</div>
            <div id={`activityExp`}>
                <div>{activityExp?`+${activityExp}xp`:null}</div>
                <Bar id={"activity"} G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} data={activityData}/>
            </div>
            <div id={`activityLoot`}>
                {loot}
            </div>
        </div>
    )


    const helmIcon = helm ? <img src={`./images/items/${helm.icon}.png`} /> : null
    const chestIcon = chest ? <img src={`./images/items/${chest.icon}.png`} /> : null
    const bootsIcon = boots ? <img src={`./images/items/${boots.icon}.png`} /> : null
    const weaponIcon = weapon ? <img src={`./images/items/${weapon.icon}.png`} /> : null
    const ringIcon = ring ? <img src={`./images/items/${ring.icon}.png`} /> : null
    const neckIcon = neck ? <img src={`./images/items/${neck.icon}.png`} /> : null
    const foodIcon = food ? <img src={`./images/items/${food.icon}.png`} /> : null
    const prayerIcon = prayer ? <img src={`./images/items/${prayer.icon}.png`} /> : null

    const potionBelt = potions.length > 0 ? potions.map((potion, i) => {
        let potionIcon = potions[i] ? <img src={`./images/items/${potions[i].icon}.png`} /> : null
        return (
            <div key={i} className={`equipSlot`}
                onMouseMove={(e)=>showSlot(potions[i], e)}
                onMouseLeave={()=>stopShowSlot()}>
                <div className={`itemCount`}>{potions[i]?.stackable?`x${potions[i]?.amount}`:""}</div>
                <div>{potions[i]?.name?potions[i].nameShort:`Potion/Flask`}{potionIcon}</div>
            </div>
        )
    }) : null

    const equipment = (
        <div id={`equipment`}>
            <div id={`playerStats`}>
                <div className={`statIcon attack`}>{G.Player.attackPower}</div>
                <div className={`statIcon defend`}>{G.Player.defense}</div>
                <div className={`statIcon health`}>{G.Player.maxhealth}</div>
                <div className={`statIcon str`}>{G.Player.str}</div>
                <div className={`statIcon int`}>{G.Player.int}</div>
                <div className={`statIcon agi`}>{G.Player.agi}</div>
                <div className={`statIcon spd`}>{G.Player.attackSpeed}s</div>
            </div>
            <div id={`gear`} className={`gearColumn`}>
                <div className={`equipSlot ${helm?.rarity}`} id={`head`}
                    onMouseMove={(e)=>showSlot(helm, e)}
                    onMouseLeave={()=>stopShowSlot()}>
                    {helm?.name?helm.nameProper:"Helm"}{helmIcon}
                </div>
                <div className={`equipSlot ${chest?.rarity}`} id={`chest`}
                    onMouseMove={(e)=>showSlot(chest, e)}
                    onMouseLeave={()=>stopShowSlot()}>
                    {chest?.name?chest.nameProper:"Chest"}{chestIcon}
                </div>
                <div className={`equipSlot ${boots?.rarity}`} id={`feet`}
                    onMouseMove={(e)=>showSlot(boots, e)}
                    onMouseLeave={()=>stopShowSlot()}>
                    {boots?.name?boots.nameProper:"Boots"}{bootsIcon}
                </div>
                <div className={`equipSlot ${weapon?.rarity}`} id={`weapon`}
                    onMouseMove={(e)=>showSlot(weapon, e)}
                    onMouseLeave={()=>stopShowSlot()}>
                    {weapon?.name?weapon.nameProper:"Weapon"}{weaponIcon}
                </div>
                <div style={{display: "flex", flexFlow: "row"}}>
                    <div className={`equipSlot small ${neck?.rarity}`} id={`neck`}
                        onMouseMove={(e)=>showSlot(neck, e)}
                        onMouseLeave={()=>stopShowSlot()}>
                        {neck?.name?"Neck":"Neck"}{neckIcon}
                    </div>
                    <div className={`equipSlot small ${ring?.rarity}`} id={`ring`}
                        onMouseMove={(e)=>showSlot(ring, e)}
                        onMouseLeave={()=>stopShowSlot()}>
                        {ring?.name?"Ring":"Ring"}{ringIcon}
                    </div>
                </div>
            </div>
            <div id={`consumes`} className={`gearColumn`}>
                {potionBelt}
                <div className={`equipSlot`}
                    onMouseMove={(e)=>showSlot(food, e)}
                    onMouseLeave={()=>stopShowSlot()}>
                    <div className={`itemCount`}>{food?.stackable?`x${food?.amount}`:""}</div>
                    <div>{food?.name?food.nameShort:`Food`}{foodIcon}</div>
                </div>
                <div className={`equipSlot`}
                    onMouseMove={(e)=>showSlot(prayer, e)}
                    onMouseLeave={()=>stopShowSlot()}>
                    <div>{prayer?.name?prayer.nameShort:`Prayer`}{prayerIcon}</div>
                </div>
            </div>
        </div>
    )

    const lootTableToShow = mobLootTable.length > 0
        ? mobLootTable
        : dungeonLootTable.length > 0 ? dungeonLootTable : currentMobLootTable
    const mobLoot = lootTableToShow.map((loot, i) => {
        let { item, chance, type } = loot
        return (
            <div key={i} className={`mobLoot ${type}`}
                onMouseEnter={(e)=>refreshTooltip()}
                onMouseMove={(e)=>showSlot(item, e)}
                onMouseLeave={()=>stopShowSlot()}> 
                <img className={`mobItemImage`} src={`./images/items/${item.icon}.png`} alt={"Item"}/>
                <div>{item.nameProper}</div>
                <div>{chance}% chance</div>
            </div>
        )
    })
    const lootTable = (
        <div id={`mobLootTable`}>
            {mobLoot}
        </div>
    )

    const tool = G.Toolbelt.find((toolitem) => toolitem.skillProper == G.Screen)
    const toolInfo = tool ? (
        <div id={`craftToolList`}>
            <div id={`craftToolTitle`}>Equipped tools:</div>
            <div className={`craftTool`}
                onMouseEnter={(e)=>refreshTooltip()}
                onMouseMove={(e)=>showSlot(tool, e)}
                onMouseLeave={()=>stopShowSlot()}>
                <img src={`./images/items/${tool.icon}.png`} />
                <div>{tool.nameProper}</div>
            </div>
        </div>
    ) : null

    const recipes = G.Recipes.filter((recipe) => recipe.skill == G.Screen.toLowerCase())
    const recipeList = recipes.length > 0 ? (
        <div id={`knownRecipeContainer`}>
            <div id={`knownRecipeTitle`}>Known Recipes:</div>
            <div id={`knownRecipeList`}>
            {recipes.map((recipe) => {
                return (
                <div key={recipe.name} className={`recipe`}
                    onMouseEnter={(e)=>refreshTooltip()}
                    onMouseMove={(e)=>showSlot(recipe, e)}
                    onMouseLeave={()=>stopShowSlot()}>
                    <img src={`./images/items/${recipe.icon}.png`} />
                    <div>{recipe.nameProper}</div>
                </div>
                )
            })}
            </div>
        </div>
    ) : null

    const expBuffs = G.Player.Buffs.concat(G.Player.WorldBuffs).filter((buff) => buff.stats.Exp)
    const dontShowExpBuffPages = ["Inventory", "Battle", "Dungeon", "Shop"]
    const expBuffList = expBuffs.length > 0 && !showEquipment && !dontShowExpBuffPages.includes(G.Screen) ? (
        <div id={`expBuffContainer`}>
            <div id={`expBuffTitle`}>Exp Buffs:</div>
            <div id={`expBuffList`}>
            {expBuffs.map((buff) => {
                const future = G.TimeNow.add({seconds: buff.duration})
                const buffTimer = G.TimeNow.until(future).round({largestUnit: "minutes", smallestUnit: "seconds"}).toLocaleString("en", { style: "narrow", secondsDisplay: "always"})
                return (
                <div key={buff.name} className={`expBuff`}
                    onMouseEnter={(e)=>refreshTooltip()}
                    onMouseMove={(e)=>showSlot(G.createItem(buff), e)}
                    onMouseLeave={()=>stopShowSlot()}>
                    <img src={`./images/bufficons/exp.png`} />
                    <div>{G.properName(buff.name)}</div>
                    <div>{buffTimer}</div>
                </div>
                )
            })}
            </div>
        </div>
    ) : null

    const buffs = G.Player.PotionBuffs.concat(G.Player.Buffs).concat(G.Player.WorldBuffs)
    const buffList = buffs.length > 0 ? (
        <div id={`buffContainer`}>
            <div id={`buffList`}>
            {buffs.map((buff, i) => {
                const worldbuffClass = G.Player.WorldBuffs.find(b => buff.name == b.name) ? "worldbuff" : ""
                const statkeys = Object.keys(buff.stats).filter((key, ind) => buff.stats[key] > 0)
                return statkeys.map((statkey, ind) => {
                    const statval = statkey == "Spd" || statkey == "Exp" ? `${buff.stats[statkey] * 100}%` : buff.stats[statkey]
                    const strippedKey = statkey.toLowerCase()
                    const img = <img src={`./images/bufficons/${strippedKey}.png`} />
                    let buffTimer = "Prayer"
                    if(!buff?.slot || (buff?.slot && buff?.slot != "prayer")) {
                        const future = G.TimeNow.add({seconds: buff.duration})
                        buffTimer = G.TimeNow.until(future).round({largestUnit: "minutes", smallestUnit: "seconds"}).toLocaleString("en", { style: "narrow", secondsDisplay: "always"})
                    }
                    return (
                    <div key={buff.name+i+ind} className={`buff ${worldbuffClass} ${buff?.slot||""}`}
                        onMouseEnter={(e)=>refreshTooltip()}
                        onMouseMove={(e)=>showSlot(G.createItem(buff), e)}
                        onMouseLeave={()=>stopShowSlot()}>
                        <div>{img}</div>
                        <div>{buffTimer}</div>
                    </div>
                    )
                })
            })}
            </div>
        </div>
    ) : null


    const infoHeader = (
        <div id={`infoHeader`}>
            { /battle|dungeon/i.test(G.Screen) ? <div className={`headerButton ${showEquipment?"":"active"}`} onClick={()=>setShowEquipment(false)}>Loot Table</div> : null }
            { !/inventory|battle|dungeon|shop/i.test(G.Screen) ? <div className={`headerButton ${showEquipment?"":"active"}`} onClick={()=>setShowEquipment(false)}>Skill Info</div> : null }
            { G.Screen != "Inventory" ? <div className={`headerButton ${showEquipment?"active":""}`} onClick={()=>setShowEquipment(true)}>Equipment</div> : null }
        </div>
    )

    //TODO: Allow testing to deployed version later
    const adminBar = location.hostname.match(".k8s.") ? (
        <div id="rightmenuBar">
            <button onClick={()=>setDebugPopup(debugPopup => !debugPopup)}>Toggle Popup</button>
            <button onClick={()=>save()}>Save</button>
            <button onClick={()=>setAdminPopup(!adminPopup)}>Admin</button>
        </div>
    ) : null
    const simpleAdminPanel = adminPopup ? (
        <div id={`adminItemPanel`}>
            <input id={`adminItemName`} className={`commonInput`} type="text" value={adminItemName} 
            onKeyDown={(e)=>e.code=="Enter" && addAdminItems()}
            onChange={(e)=>setAdminItemName(e.target.value)}></input>
            <input id={`adminItemAmount`} className={`commonInput`} type="number" value={adminItemAmount}
            onKeyDown={(e)=>e.code=="Enter" && addAdminItems()}
            onChange={(e)=>setAdminItemAmount(e.target.value)}></input>
            <button onClick={()=>addAdminItems()}>Add Item</button>
            <button onClick={()=>removeAdminItems()}>Remove</button>
            <button onClick={()=>addAllRecipes()}>Add All Recipes</button>
            <button onClick={()=>addAdminGearSet()}>Add Gear set</button>
            <input id={`adminSkillName`} className={`commonInput`} type="text" value={adminSkillName} 
            onKeyDown={(e)=>e.code=="Enter" && levelSkill("up")}
            onChange={(e)=>setAdminSkillName(e.target.value)}></input>
            <button onClick={()=>levelSkill("up")}>Level Up Skill</button>
            <button onClick={()=>levelSkill("down")}>Level Down Skill</button>
        </div>
    ) : null

    return (
        <div id="component-rightmenu">
            {item?.name ? 
                <Stats G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} item={item} show={true} propCoords={coords} />
                : null }
            {adminBar}
            <div id="rightMenu">
                {simpleAdminPanel}
                {infoHeader}
                <div id={"infoPane"}>
                    {G.Screen == "Dungeon" && G.DisplayEnemy && !showEquipment
                        ?  <div style={{textAlign: "center"}}>{G.DisplayEnemy.nameProper} Loot Table</div>
                    : null }
                    {G.Screen == "Battle" && G.Dungeon && !showEquipment
                        ?  <div style={{textAlign: "center"}}>{G.properName(G.Dungeon.name)} <br/>Loot Table</div>
                    : null }
                    {G.Screen == "Dungeon" && G.DisplayEnemy && !showEquipment ? lootTable : null}
                    {G.Screen == "Battle" && G.Dungeon && !showEquipment ? lootTable : null}
                    {G.Screen == "Battle" && !G.Dungeon && G.Enemy && !showEquipment ? lootTable : null}
                    {G.Screen != "Inventory" && (G.Screen == "Shop" || showEquipment) ? equipment : null}
                    {G.Screen != "Inventory" && G.Screen != "Battle" && showEquipment ? buffList : null}
                    {!showEquipment ? toolInfo : null}
                    {expBuffList}
                    {!showEquipment ? recipeList : null}
                </div>
                {popup}
            </div>
        </div>
    );
};

export { RightMenu as default };
