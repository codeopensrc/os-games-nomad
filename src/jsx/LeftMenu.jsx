"use strict";

import React, { useEffect, useState } from 'react';
import DOM from 'react-dom';

// var PropTypes = React.PropTypes;

import "../style/LeftMenu.less"

const LeftMenu = function(props) {
    const { G, triggerUpdate, coreFns } = props

    const selectSkill = (skill) => {
        coreFns.loadScreen(skill.name)
    }
    const selectInventory = () => {
        coreFns.loadInventory()
    }
    const selectBattle = () => {
        if(!G.Enemy) { return }
        coreFns.loadBattle()
    }
    const selectShop = () => {
        coreFns.loadShop()
    }
    const selectDungeon = () => {
        coreFns.loadScreen("Dungeon")
    }

    const skillTree = Object.keys(G.Skills).map((skillname) => {
        let skill = G.Skills[skillname]
        let activeSkill = G.ActiveSkill == skillname ? "active" : ""
        return (
            <div key={skillname} onClick={()=>selectSkill(skill)} className={`skillTreeRow ${activeSkill}`}>
                <img className={`skillImage ${skillname}`} alt={"Item"}/>
                <div className={"skillTreeName"}>{skillname}:</div>
                <div className={"skillTreeLevel"}>{skill.level.toString()}</div>
            </div>
        )
    })

    return (
        <div id="component-leftmenu">
            <div id={`inventoryButton`} className={"leftMainButton"} onClick={()=>selectInventory()}>
                Inventory
                <img id={`inventoryImage`} src={`./images/inventory.png`} alt={"Item"}/>
            </div>
            <div id={`battleButton`} className={`leftMainButton ${G.Battling?"battling":""}`} onClick={()=>selectBattle()}>
                Battle
                <img id={`battleImage`} src={`./images/battle.png`} alt={"Item"}/>
            </div>
            <div id={`dungeonButton`} className={"leftMainButton"} onClick={()=>selectDungeon()}>
                Adventure
                <img src={`./images/adventure.png`} alt={"Item"}/>
            </div>
            <div id={`shopButton`} className={"leftMainButton"} onClick={()=>selectShop()}>
                Shop
                <img id={`shopImage`} src={`./images/shop.png`} alt={"Item"}/>
            </div>
            <div id={`skillTree`}>
                <div style={{textAlign: "center"}}>Skills:</div>
                {skillTree}
            </div>
        </div>
    );
};

export { LeftMenu as default };
