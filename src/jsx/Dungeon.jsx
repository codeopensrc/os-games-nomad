"use strict";

import React, { useEffect, useState } from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import "../style/Dungeon.less"


const Dungeon = function(props) {
    const { G, triggerUpdate, coreFns } = props

    const [zoneMobs, setZoneMobs] = useState([])
    const [dungeonMobs, setDungeonMobs] = useState([])

    const [dungeons, setDungeons] = useState([])
    const [selectedDungeon, setDungeon] = useState(null)
    const [dungeonList, setDungeonList] = useState([])
    const [dungeonTier, setDungeonTier] = useState(-1)

    const [zones, setZones] = useState([])
    const [selectedZone, setZone] = useState(null)
    const [zoneList, setZoneList] = useState([])

    const [selectedBackground, setSelectedBackground] = useState()

    const title = "Adventure"

    useEffect(() => {
        fetchZoneNames(G.Mobs.zones)
        fetchDungeonNames(G.Mobs.dungeons)
        fetchMobs(G.Mobs.mobs)
    }, [G.Screen])

    const fetchZoneNames = (defaultZones) => {
        let newZones = defaultZones.map((zoneObj, i) => structuredClone(zoneObj))
        setZones(newZones)
    }
    const fetchDungeonNames = (defaultDungeons) => {
        let newDungeons = defaultDungeons.map((dungeonObj, i) => structuredClone(dungeonObj))
        setDungeons(newDungeons)
    }
    const fetchMobs = (defaultMobs) => {
        let zoneNPCMobs = defaultMobs.map((mobObj, i) => G.createNPC(mobObj))
        setZoneMobs(zoneNPCMobs)
        let dungeonNPCMobs = defaultMobs.map((mobObj, i) => G.createNPC({...mobObj, isElite: true}))
        setDungeonMobs(dungeonNPCMobs)
    }

    const selectZone = (zone) => {
        if(G.hasKey(zone.name)) {
            setZone(zone)
            setSelectedBackground(zone.name)
            setZoneList(zone.mobs)
        }
    }
    const selectDungeon = (dungeon, dungeonInd) => {
        if(G.hasKey(dungeon.name)) {
            setDungeon(dungeon)
            setSelectedBackground(dungeon.name)
            setDungeonList(dungeon.mobs)
            setDungeonTier(dungeonInd)
        }
    }

    const selectMob = (mob) => {
        G.selectMob(mob)
        coreFns.loadBattle()
    }
    const displayMob = (mob) => {
        G.displayMob(mob)
    }
    const hideMob = (mob) => {
        G.hideMob()
    }

    const startDungeon = () => {
        const filteredDungeonMobs = dungeonMobs.filter((mob) => dungeonList.includes(mob.name))
        G.startDungeon(selectedDungeon, filteredDungeonMobs, dungeonTier)
        coreFns.loadBattle()
    }

    const renderedZones = !selectedZone ? zones.map((zone, i) => {
        const selected = !G.Dungeon && G.Enemy && G.ActiveSkill == "Training" && zone.mobs.includes(G.Enemy.name)
        const properZone = G.properName(zone.name)
        const unlocked = G.hasKey(zone.name)
        return (
            <div key={zone.name+i} className={`zone ${selected?"selected":""} ${unlocked?"":"locked"}`}
                style={{backgroundImage: `url(./images/mobs/${zone.name}.jpeg)`}}
                onClick={() => selectZone(zone)}>
                <div className={`zoneText zoneName ${unlocked?"":"lockedText"}`}>{properZone}</div>
            </div>
        )
    }) : null
    const renderedDungeons = !selectedDungeon ? dungeons.map((dungeon, dungeonInd) => {
        const selected = G.Dungeon && G.Enemy && G.ActiveSkill == "Training" && dungeon.mobs.includes(G.Enemy.name)
        const properDungeon = G.properName(dungeon.name)
        const unlocked = G.hasKey(dungeon.name)
        return (
            <div key={dungeon.name+dungeonInd} className={`dungeon ${selected?"selected":""} ${unlocked?"":"locked"}`}
                style={{backgroundImage: `url(./images/mobs/${dungeon.name}.jpeg)`}}
                onClick={() => selectDungeon(dungeon, dungeonInd)}>
                <img className={`dungeonIcon`} src={`./images/dungeon.png`} alt={"Item"}/>
                <div className={`dungeonText dungeonName ${unlocked?"":"lockedText"}`}>{properDungeon}</div>
            </div>
        )
    }) : null

    const renderedZoneMobs = selectedZone ? zoneMobs.map((mob, i) => {
        const selected = !G.Dungeon && G.Enemy && G.ActiveSkill == "Training" && G.Enemy.name == mob.name
        if(!zoneList.includes(mob.name)) { return null }
        let locationName = selectedZone.name
        return (
            <div key={mob.name+i} className={`mob zoneMob ${selected?"selected":""}`}
                onMouseMove={() => displayMob(mob)}
                onMouseLeave={() => hideMob(mob)}
                onClick={() => selectMob(mob)}>
                <div className={`mobText mobName`}>{mob.nameProper}</div>
                <div style={{display: "flex", flexFlow: "column wrap", height: "100%", maxHeight: "12rem"}}>
                    <div className={`mobText mobHealth`}>Health: {mob.maxhealth}</div>
                    <div className={`mobText mobAttack`}>Attack: {mob.attackPower}</div>
                    <div className={`mobText mobDefense`}>Defense: {mob.defense}</div>
                    <div className={`mobText mobSpeed`}>Speed: {mob.attackSpeed}s</div>
                    <div className={`mobText mobExp`}>Exp: {mob.exp}</div>
                    <img src={`./images/mobs/${locationName}/${mob.name}.png`}/>
                </div>
            </div>
        )
    }) : null
    const renderedDungeonMobs = selectedDungeon ? dungeonMobs.map((mob, i) => {
        const selected = G.Enemy && G.Enemy.name == mob.name && G.ActiveSkill == "Training"
        if(!dungeonList.includes(mob.name)) { return null }
        if(!mob.isBoss && dungeonList.findLastIndex((mobname)=>mobname==mob.name) == dungeonList.length-1) {
            mob.makeElite({boss: true})
        }
        //let locationName =  selectedDungeon.name
        return (
            <div key={mob.name+i} className={`mob dungeonMob`}>
                <div className={`mobText mobName`}>{mob.nameProper}</div>
                <div style={{display: "flex", flexFlow: "column wrap", height: "100%", maxHeight: "12rem"}}>
                    <div className={`mobText mobHealth`}>Health: {mob.maxhealth}</div>
                    <div className={`mobText mobAttack`}>Attack: {mob.attackPower}</div>
                    <div className={`mobText mobDefense`}>Defense: {mob.defense}</div>
                    <div className={`mobText mobSpeed`}>Speed: {mob.attackSpeed}s</div>
                    <div className={`mobText mobExp`}>Exp: {mob.exp}</div>
                    {/*<img src={`./images/mobs/${mob.name}.png`}/>*/}
                </div>
            </div>
        )
    }) : null

    const startDungeonButton = selectedDungeon ? (
        <div key={`start`} className={`navAction`} onClick={() => startDungeon()}>
            Start Dungeon
            <img src={"./images/dungeon.png"} style={{marginLeft: "2rem", width: "2.5rem", height: "2.5rem"}}/>
        </div>
    ) : null
    const back = (
        <div key={`back`} id={`back`} className={`mob`}>
            {startDungeonButton}
            <div className={`navAction`} onClick={() => {setZone(null); setDungeon(null); setSelectedBackground(null)}}>
                Back
                <img src={"./images/mobs/back.png"} style={{marginLeft: "2rem", width: "2.5rem", height: "2.5rem"}}/>
            </div>
        </div>
    )
    selectedZone ? renderedZoneMobs.unshift(back) : null
    selectedDungeon ? renderedDungeonMobs.unshift(back) : null

    return (
        <div id={`mobPage`}>
            <div id={"mobTitle"}>
                {title}
            </div>
            <div id={`mainMob`} style={{backgroundImage: selectedBackground ? `url(./images/mobs/${selectedBackground}.jpeg)`: ""}}>
                <div id={`zones`} style={{display: `${selectedDungeon || selectedZone ? "none" : "" }`}}>
                    {renderedZones}
                </div>
                <div id={`dungeons`} style={{display: `${selectedDungeon || selectedZone ? "none" : "" }`}}>
                    {renderedDungeons}
                </div>
                {renderedZoneMobs}
                {renderedDungeonMobs}
            </div>
        </div>
    );
};

export { Dungeon as default };
