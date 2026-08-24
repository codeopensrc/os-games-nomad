"use strict";

import React, { useEffect, useState } from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import Bar from "./Bar.jsx"
import Stats from './Stats.jsx';

import "../style/Battle.less"


const Battle = function(props) {
    const { G, triggerUpdate, coreFns } = props

    const [playerAttack, setPlayerAttack] = useState(-1)
    const [enemyAttack, setEnemyAttack] = useState(-1)

    const [lastPlayerAttack, setLastPlayerAttack] = useState(-1)
    const [lastEnemyAttack, setLastEnemyAttack] = useState(-1)

    const [item, setItem] = useState(null);
    const [coords, setCoords] = useState({x: 0, y: 0});

    const [potions, setPotions] = useState([G.Player.Gear.Potion1, G.Player.Gear.Potion2, G.Player.Gear.Potion3])
    const [scrolls, setScrolls] = useState([])

    const [autoRestartDungeon, setAutoRestartDungeon] = useState(G.Dungeon?.autoRestart || false)
    const [restAfterDungeon, setRestAfterDungeon] = useState(G.Dungeon?.restAfter || false)

    const [displayMob, setDisplayMob] = useState(null);

    useEffect(() => {
        let enemytimer = null
        setEnemyAttack(G.Enemy.LastAttack) 
        if(G.Enemy?.LastAttack >= 0) {
            setLastEnemyAttack(G.Enemy.LastAttack) 
            enemytimer = setTimeout(() => { G.Enemy.resetLastAttack(); setEnemyAttack(G.Enemy.LastAttack) }, 500)
        }
        return () => clearTimeout(enemytimer);
    }, [G.Enemy?.LastAttack])

    useEffect(() => {
        let playertimer = null
        setPlayerAttack(G.Player.LastAttack) 
        if(G.Player.LastAttack >= 0) {
            setLastPlayerAttack(G.Player.LastAttack)
            playertimer = setTimeout(() => { G.Player.resetLastAttack(); setPlayerAttack(G.Player.LastAttack) }, 500)
        }
        return () => clearTimeout(playertimer);
    }, [G.Player.LastAttack])

    useEffect(() => {
        let invScrolls = G.Inventory.filter((item) => item instanceof G.Class.Scroll).sort((a, b) => a.name > b.name)
        setScrolls(invScrolls)
    }, [G.TimeCraftStarted])


    const attack = () => {
        if(G.Player.health > 0) {
            G.startAttack(autoRestartDungeon, restAfterDungeon)
        }
    }
    const run = () => {
        G.resetActivity()
    }
    const usePotion = (potion, potionSlot) => {
        const usedPotion = G.Player.usePotion(potion)
        usedPotion && G.resetLastRegenTick() 
        setPotions([G.Player.Gear.Potion1, G.Player.Gear.Potion2, G.Player.Gear.Potion3])
    }
    const useFood = (food) => {
        if(food.amount > 0) {
            const usedFood = G.Player.heal(food.health)
            if(usedFood) {
                food.reduceAmount(1)
            }
        }
    }
    const useScroll = (scroll) => {
        if(scroll.amount > 0) {
            const usedScroll = G.Player.addMiscBuff(scroll)
            if(usedScroll) {
                scroll.reduceAmount(1)
                G.Inventory = G.Inventory.filter((invItem, ind) => invItem.amount !== 0)
                const invScrolls = G.Inventory.filter((item) => item instanceof G.Class.Scroll).sort((a, b) => a.name > b.name)
                setScrolls(invScrolls)
                stopShowItem()
            }
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
        stopShowItem()
    }

    const updateAutoRestartDungeon = (newRestartState) => {
        setAutoRestartDungeon(newRestartState)
        G.Dungeon.autoRestart = newRestartState
    }
    const updateRestAfterDungeon = (newRestState) => {
        setRestAfterDungeon(newRestState)
        G.Dungeon.restAfter = newRestState
    }

    const showItem = (item, e) => {
        setItem(item)
        setCoords({x: e.clientX - 245, y: e.clientY - 65})
    }
    const stopShowItem = () => {
        setItem(null)
    }
    const showMob = (mob, e) => {
        setDisplayMob(mob)
    }
    const stopShowMob = () => {
        setDisplayMob(null)
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

    const food = G.Player.Gear.Food
        ? (<div className={`food icon`} 
                onClick={()=>useFood(G.Player.Gear.Food)}
                onMouseMove={(e)=>showItem(G.Player.Gear.Food, e)}
                onMouseLeave={()=>stopShowItem()}>
                <div className={`itemCount`}>{`x${G.Player.Gear.Food.amount}`}</div>
                <img src={`./images/items/${G.Player.Gear.Food.icon}.png`} />
           </div>)
        : null

    const potionBelt = potions.filter(p=>p).length > 0 ? potions.map((potion, i) => {
        if(!potion) { return null }
        let lowhealth = false
        if(potion.amount > 0 && potion.stats.Health && G.Player.maxhealth - G.Player.health >= potion.stats.Health) {
            lowhealth = true
        }
        return (
            <div key={i} className={`icon`}>
                <div key={i} className={`potionicon ${lowhealth?"low":""}`}
                    onClick={()=>usePotion(potion, i)}
                    onMouseMove={(e)=>showItem(potion, e)}
                    onMouseLeave={()=>stopShowItem()}>
                    <div className={`itemCount`}>{potion?.stackable?`x${potion?.amount}`:""}</div>
                    <img src={`./images/items/${potion?.icon}.png`} />
                </div>
                <div className={`potionBox`} >
                    <input type={`checkbox`} checked={potion.autoRefresh}
                    onChange={()=>potion.autoRefresh=!potion.autoRefresh}/>
                    Refresh
                </div>
            </div>
        )
    }) : null
    const foundScrolls = scrolls.length > 0 ? (
        <div id={`scrollList`}>
        {scrolls.map((scroll) => {
            return (
            <div key={scroll.name} className={`scroll`}
                onClick={()=>useScroll(scroll)}
                onMouseMove={(e)=>showItem(scroll, e)}
                onMouseLeave={()=>stopShowItem()}>
                <div style={{display: "flex", flexFlow: "row", justifyContent: "space-evenly", alignItems: "end"}}>
                    <div className={`amount`}>x{scroll.amount}</div>
                    <img src={`./images/items/${scroll.icon}.png`} />
                </div>
                <div>{scroll.nameShort}</div>
            </div>
            )
        })}
        </div>
    ) : null


    const buffs = G.Player.PotionBuffs.concat(G.Player.Buffs).concat(G.Player.WorldBuffs).map((buff, i) => {
        const statkeys = Object.keys(buff.stats).filter((key, ind) => buff.stats[key] > 0)
        return statkeys.map((statkey, ind) => {
            const { statval, img, buffTimer } = extractBuffInfo(buff, statkey)
            return (
                <div key={buff.name+statkey} className={`buff ${!/_\d/i.test(buff.name)?"worldbuff":buff?.slot??""}`}
                    onContextMenu={(e)=>removeBuff(e, buff, i)} 
                    onMouseMove={(e)=>showItem(G.createItem(buff), e)}
                    onMouseLeave={()=>stopShowItem()}>
                <div>{img}: <span>+{statval}</span></div>
                <div>{buffTimer}</div>
            </div>)
        })
    })
    
    const atkDisabled = G.Player.health <= 0
    const actionButton = !G.Battling && G.Enemy
        ? <button className={`commonButton ${atkDisabled?"disabled":""}`} disabled={atkDisabled} onClick={()=>attack()}>Attack</button>
        : <button className={`commonButton ${!G.Enemy?"disabled":""}`} disabled={!G.Enemy} onClick={()=>run()}>Run</button>
    const debugPauseButton = false && G.Enemy
        ? <button className={`commonButton debug`} onClick={()=>{G.Battling = !G.Battling}}>Pause</button>
        : null

    const autoRestartDungeonButton = G.Dungeon ? (
        <div id={`restart`}>
            <input type="checkbox" checked={autoRestartDungeon} onChange={()=>updateAutoRestartDungeon(!autoRestartDungeon)}/>
            Auto restart
        </div>
    ) : null
    const restAfterDungeonButton = G.Dungeon ? (
        <div id={`rest`}>
            <input type="checkbox" checked={restAfterDungeon} onChange={()=>updateRestAfterDungeon(!restAfterDungeon)}/>
            Rest after
        </div>
    ) : null

    const playerDamage = (<div className={`hitIcon ${enemyAttack>=0?"show":""} ${lastEnemyAttack==0?"blocked":""}`}>
        {lastEnemyAttack>0?`-${lastEnemyAttack}`:"Blocked"}
    </div>)
    const enemyDamage = (<div className={`hitIcon ${playerAttack>=0?"show":""} ${lastPlayerAttack==0?"blocked":""}`}>
        {lastPlayerAttack>0?`-${lastPlayerAttack}`:"Blocked"}
    </div>)

    const mobType = G.Dungeon && G.Enemy.name == G.Dungeon.mobs[G.Dungeon.mobs.length-1].name
        ? "boss"
        : G.Dungeon ? "elite" : ""

    const attackData = {barType: "attack", barTextType: "timer", timer: G.TimeNow}
    const enemyAttackData = {barType: "enemyattack", barTextType: "timer", timer: G.TimeNow}
    const playerHealthData = {barType: "health", barTextType: "value", health: {current: G.Player.health, max: G.Player.maxhealth}}
    const enemyHealthData = {barType: G.Dungeon ? `${mobType}health` : "health", barTextType: "value", health: {current: G.Enemy?.health, max: G.Enemy?.maxhealth}}

    const enemyList = G.Enemy && G.Dungeon ? G.Dungeon.mobs.map((mob, i) => {
        let classes = []
        if(mob.health <= 0) { classes.push("dead") }
        if(mob.name == G.Enemy.name) { classes.push("current") }
        return (
            <span key={mob.name} id={`enemyList`} className={classes.join(" ")}
                onMouseMove={(e)=>showMob(mob, e)}
                onMouseLeave={()=>stopShowMob()}>
                {mob.nameProper}
            </span>
        )
    }) : null

    const showDisplayMob = displayMob ? (
        <div id={`mobInfo`}>
            <div>Name: {displayMob.nameProper}</div>
            <div>Attack: {displayMob.attackPower}</div>
            <div>Defense: {displayMob.defense}</div>
        </div>
    ) : null

    const enemy = G.Enemy ? (
        <div className={`unitframe`} id={`enemy`}>
            <div style={{width: "100%", display: "flex", flexFlow: "column", justifyContent: "space-between"}}>
                {G.Enemy.isElite ? <div className={`${mobType}`}></div> : null}
                <Bar id={"enemyHealth"} G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} data={enemyHealthData}/>
                <div className={`stats`}>
                    <div className={`icons`}>
                        <div className={`icon attack`}>:{G.Enemy?.attackPower}</div>
                        <div className={`icon defend`}>:{G.Enemy?.defense}</div>
                    </div>
                </div>
                <div className={`actions`}>
                    {enemyList || G.Enemy.nameProper}
                    {showDisplayMob ? showDisplayMob : null}
                </div> 
            </div> 
        </div>
    ) : null

    const recentLootList = G.RecentDrops.length > 0 ? (
        <div id={`recentNPCLootContainer`}>
            <button className={`commonButton`} onClick={()=> G.RecentDrops = []}>Clear</button>
            <div id={`recentNPCLootList`}>
                { G.RecentDrops.map((lootHaul, i) => {
                    return (
                    <div key={i} className={`recentNPCLootHaul`}>
                        {i+1}
                        { lootHaul.map((loot, ind) => {
                        return (
                        <div key={ind} 
                            onMouseMove={(e)=>showItem(loot, e)}
                            onMouseLeave={()=>stopShowItem()}
                            className={`recentNPCLoot`}>
                            <div style={{display: "flex", flexFlow: "row", justifyContent: "space-evenly", alignItems: "end"}}>
                                x{loot.amount}
                                <img src={`./images/items/${loot.icon}.png`} />
                            </div>
                            <div className={loot?.rarity}>{loot.nameShort}</div>
                        </div>
                        )
                        })}
                    </div>
                    )
                })}
            </div>
        </div>
    ) : null

    return (
        <div id={`battlePage`}>
            {item?.name ? 
                <Stats G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} item={item} show={true} propCoords={coords} />
                : null }
            <div id={"battleTitle"}>
                {G.Dungeon ? G.properName(G.Dungeon.name) : "Battle"}
            </div>
            <div id={`battleground`}>
                <div className={`unitframe`} id={`player`}>
                    <div style={{width: "100%", display: "flex", flexFlow: "column", justifyContent: "space-between"}}>
                        <Bar id={"playerHealth"} G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} data={playerHealthData}/>
                        <div className={`stats`}>
                            <div className={`icons`}>
                                <div className={`icon attack`}>:{G.Player.attackPower}</div>
                                <div className={`icon defend`}>:{G.Player.defense}</div>
                            </div>
                        </div>
                        <div id={`buffs`}>
                            {buffs}
                        </div>
                    </div>
                    {autoRestartDungeonButton}
                    {restAfterDungeonButton}
                    {actionButton}
                    {debugPauseButton}
                    { food || potionBelt ?
                        <div className={`actions`}>
                            {food}
                            {potionBelt}
                        </div>
                    : null }
                    <div id={`scrollBook`} style={{maxWidth: `${scrolls.length > 12 ? "12.3rem" : ""}`}}>
                        {foundScrolls}
                    </div>
                </div>
                <div className={`portrait`}>
                    {playerDamage}
                    <Bar id={"miniplayerHealth"} G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} data={playerHealthData}/>
                    <div className={`block playerblock ${enemyAttack>=0 ? "showhit":""} ${playerAttack>=0 ? "swing":""}`} />
                    <img className={`${playerAttack>=0?"swing":""}`} src={`./images/mobs/player.png`}/>
                    <Bar id={"playerAttack"} G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} data={attackData}/>
                </div>
                { G.Enemy ?
                    <div id={`enemyPortrait`} className={`portrait ${G.Enemy.name}`}>
                        {enemyDamage}
                        <Bar id={"minienemyHealth"} G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} data={enemyHealthData}/>
                        <div className={`block enemyblock ${playerAttack>=0 ? "showhit":""} ${enemyAttack>=0 ? "enemyswing":""}`} />
                        <img className={`${enemyAttack>=0?"enemyswing":""}`} src={`./images/mobs/${G.Enemy.name}.png`}
                            onError={(e)=>{e.target.onerror=null; e.target.src=`./images/mobs/default_enemy.png`}}
                        />
                        <Bar id={"enemyAttack"} G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} data={enemyAttackData}/>
                    </div>
                : null }
                {enemy}
                {recentLootList}
            </div>
        </div>
    );
};

export { Battle as default };
