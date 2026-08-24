"use strict";

import { hot } from 'react-hot-loader/root';

import React, { useEffect, useState, useCallback } from 'react';
import DOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom';

import { Temporal, Intl, toTemporalInstant } from '@js-temporal/polyfill';

import LeftMenu from "./LeftMenu.jsx"
import TopMenu from "./TopMenu.jsx"
import Main from "./Main.jsx"
import RightMenu from "./RightMenu.jsx"
import BottomMenu from "./BottomMenu.jsx"
import Docs from "./Docs.jsx"

import itemsFile from "../js/items.yaml"
import mobsFile from "../js/mobs.yaml"

let Game = require("../js/Game.js");
let G = new Game(itemsFile, mobsFile);
// var PropTypes = React.PropTypes;

import "../style/Entry.less"


const Entry = function() {
    const [loops, updateLoops] = useState(0)
    const [trigger, triggerUpdate] = useState(false)

    // TODO: Is having a whole page force re-render like this what we're stickin with until server authority
    useEffect(() => {
        let loopCounter = 0
        let interval = setInterval(() => {
            G.Loop();
            updateLoops(++loopCounter)
            if(loopCounter % 150 == 0) { save(); }
            //if(loopCounter % 350 == 0) { save(); }
        }, 100);
        G.loadGameClocks()
        getSaveState()
        G.populateGamblingDen()
        return () => clearInterval(interval)
    }, [])

    const upd = () => triggerUpdate(trigger => !trigger)

    const loadScreen = (skillname) => {
        G.Screen = skillname
        //upd()
    }
    const loadInventory = () => {
        G.Screen = "Inventory"
    }
    const loadBattle = () => {
        G.Screen = "Battle"
    }
    const loadShop = () => {
        G.Screen = "Shop"
    }

    const getSaveState = (doc = {}) => {
        if(Object.keys(doc).length !== 0) {
            return setSaveState(doc)
        }
        let prevUser = localStorage.getItem("user");
        if(prevUser) {
            let data = JSON.parse(prevUser)
            if(data.gear) {
                G.Player.Gear = G.createGear(G.Player, data.gear)
                if(G.Player.Gear?.Prayer) {
                    G.Player.setPrayer(G.Player.Gear.Prayer)
                }
                G.resetActivity()
            }
            if(data.inventory) {
                data.inventory.forEach((item, i) => G.addItems(item))
            }
            if(data.toolbelt) {
                //TODO: Map not array
                data.toolbelt.forEach((tool) => G.addTool(tool))
            }
            if(data.skills) {
                G.loadSkills(data.skills)
            }
            if(data.screen) {
                G.Screen = data.screen
            }
            if(data.silver) {
                G.Silver = parseInt(data.silver)
            }
            if(data.recipes) {
                data.recipes.forEach((recipe) => G.unlockRecipe(recipe))
            }
            if(data.keyring) {
                data.keyring.forEach((key) => G.addKey(key))
            }
            if(data.clocks) {
                G.loadGameClocks(data.clocks)
            }
            if(data.shop && G.ShopRefreshTime > G.TimeNow.since(G.GameClocks.LastShopRefresh).total("seconds")) {
                G.refreshShop(data.shop)
            } else {
                G.refreshShop()
                G.GameClocks.LastShopRefresh = G.TimeNow
            }
            if(data.potionbuffs) {
                //Use
                data.potionbuffs.forEach((potion) => {
                    let oldPotion = G.createItem(potion)
                    G.Player.usePotion(oldPotion)
                })
                //Then override duration
                G.Player.PotionBuffs = data.potionbuffs
            }
            if(data.buffs) {
                //Use
                data.buffs.forEach((buff) => {
                    let oldBuff = G.createItem(buff)
                    G.Player.addMiscBuff(oldBuff)
                })
                //Then override duration
                G.Player.Buffs = data.buffs
            }
            if(data.worldbuffs) {
                //Use
                data.worldbuffs.forEach((buff) => {
                    let oldBuff = G.createItem(buff)
                    G.Player.addWorldBuff(oldBuff)
                })
                //Then override duration
                G.Player.WorldBuffs = data.worldbuffs
            }
            if(data?.health >= 0) {
                G.Player.health = data.health
                if(data.health > G.Player.maxhealth) {
                    G.Player.health = G.Player.maxhealth
                }
            }
            if(data.enemy) {
                const enemyData = G.findMob(data.enemy)
                const mob = G.createNPC(enemyData)
                G.selectMob(mob)
            }
            if(data.dungeon) {
                const dungeonTier = G.Mobs.dungeons.findIndex((d) => d.name == data.dungeon)
                const foundDungeon = G.Mobs.dungeons.find((d) => d.name == data.dungeon)
                const filteredMobs = G.Mobs.mobs.filter((mobObj, i) => foundDungeon.mobs.includes(mobObj.name))
                const dungeonMobs = filteredMobs.map((mob, i) => {
                    mob = G.createNPC({...mob, isElite: true})
                    if(i == filteredMobs.length-1 && !mob.isBoss) {
                        mob.makeElite({boss: true})
                    }
                    return mob
                })
                G.startDungeon(foundDungeon, dungeonMobs, dungeonTier)
            }
        }
        //api.get(`/savestate`, (res) => {
        //    if(res.status && res.data) {
        //        this.setSaveState(res.data)
        //    }
        //    //TODO: Feel like we should do something if not found idk
        //})
    }

    const setSaveState = (doc) => {
        let newStateObj = {}
        Object.hasOwn(doc, 'inventory') && (newStateObj.inventory = doc.inventory)
        Object.hasOwn(doc, 'gear') && (newStateObj.gear = doc.gear)
        Object.hasOwn(doc, 'skills') && (newStateObj.skills = doc.skills)
        Object.hasOwn(doc, 'recipes') && (newStateObj.recipes = doc.recipes)
        //this.setState(newStateObj, this.highlightSelectOnChange)
    }

    const save = () => {

        const saveSockets = (sockets) => {
            const newSockets = Object.assign([], sockets ?? []).map((socket) => {
                let newSocket = structuredClone(socket)
                const socketColor = Object.keys(socket)[0]
                const gem = socket[socketColor]
                if(gem) {
                    newSocket[socketColor] = {
                        name: gem.name,
                        color: gem.color,
                    }
                }
                return newSocket
            })
            return newSockets
        }

        const gear = Object.entries(G.Player.Gear).map(([slot, item]) => {
            let gearitem = {name: item?.name}
            item?.stackable ? gearitem.amount = item.amount : null
            item?.enchantedStats ? gearitem.enchantedStats = item.enchantedStats : null
            item?.affixes ? gearitem.affixes = item.affixes : null
            item?.sockets ? gearitem.sockets = saveSockets(item.sockets) : null
            item?.craftMats ? gearitem.craftMats = item.craftMats : null
            item?.dropLocation ? gearitem.dropLocation = item.dropLocation : null
            item?.craftedStats ? gearitem.craftedStats = item.craftedStats : null
            return [slot, gearitem]
        }).filter((arr, ind) => arr[1].name)

        const inv = G.Inventory.map((item) => ({
            name: item?.name,
            amount: item.amount,
            enchantedStats: item.enchantedStats,
            affixes: item.affixes,
            sockets: saveSockets(item.sockets),
            craftMats: item?.craftMats,
            dropLocation: item.dropLocation,
            craftedStats: item.craftedStats,
        }))

        const shop = G.Shop.map((item) => ({
            name: item?.name,
            amount: item.amount,
            //TODO: In case we give shop items random enchants
            enchantedStats: item.enchantedStats,
            affixes: item.affixes,
            sockets: saveSockets(item.sockets),
        }))

        const skills = Object.entries(G.Skills).map(([skillname, stats]) => 
            [skillname, {level: stats.level, experience: stats.experience}]
        )

        let clocks = {}
        for(let clockname in G.GameClocks) {
            if(G.GameClocks[clockname] != null) {
                clocks[clockname] = G.GameClocks[clockname].toJSON()
            }
        }

        const json = {
            //Gear and inventory
            health: G.Player.health,
            gear: Object.fromEntries(gear),
            inventory: inv,
            skills: Object.fromEntries(skills),
            recipes: G.Recipes.map((item) => ({name: item.name})),
            screen: G.Screen,
            silver: G.Silver,
            clocks: clocks,
            shop: shop,
            potionbuffs: G.Player.PotionBuffs,
            buffs: G.Player.Buffs,
            worldbuffs: G.Player.WorldBuffs,
            enemy: G.Enemy ? G.Enemy.name : "",
            keyring: G.Keyring,
            toolbelt: G.Toolbelt.map((tool) => ({name: tool.name})),
            dungeon: G.Dungeon ? G.Dungeon.name : "",
        }
        localStorage.setItem("user", JSON.stringify(json));
    }

    //useContext https://react.dev/learn/passing-data-deeply-with-context
    const coreFns = {
        loadScreen: loadScreen,
        loadInventory: loadInventory,
        loadBattle: loadBattle,
        loadShop: loadShop,
        save: save,
        //load: load,
        //getSaveState: getSaveState,
        //setSaveState: setSaveState,
    }

    return (
        <Router>
            <div id="component-entry">
                {/*<div id={`component-header`}>
                    <Link to={"/"} className={"headerButton"}>Home</Link>
                    <Link to={"/docs"} className={"headerButton"}>Docs</Link>
                </div>*/}
                <Switch>
                    <Route exact path={"/"}>
                        <TopMenu G={G} triggerUpdate={upd} coreFns={coreFns}/>
                        <div id={`mid`}>
                            <LeftMenu G={G} coreFns={coreFns}/>
                            <Main G={G} triggerUpdate={upd} coreFns={coreFns}/>
                            <RightMenu G={G} triggerUpdate={upd} coreFns={coreFns}/>
                        </div>
                        {/*<BottomMenu G={G} /> */}
                    </Route>
                    <Route path={"/docs"} render={() =>
                        <Docs G={G}/>
                    }/>
                </Switch>
            </div>
        </Router>
    );

};

export default hot(Entry);

DOM.render(<Entry />, document.getElementById("main"))
