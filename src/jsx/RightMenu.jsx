"use strict";

import React, { useEffect, useState, useCallback } from 'react';
import DOM from 'react-dom';

// var PropTypes = React.PropTypes;

import "../style/RightMenu.less"

const RightMenu = function(props) {
    //const [testVar, setTestVar] = useState("")
    const { G, triggerUpdate } = props

    const upgradeStructure = (mat) => {
        let matsNeeded = G.calcStructureUpgrade(mat);
        if(!G.hasSufficientMats(matsNeeded)) { console.log("Not enough minerals"); return;  }
        G.subtractAmount(matsNeeded)
        G.upgradeStructure(mat)
        triggerUpdate();
    }

    const unlockTech = (tech) => {
        G.unlockTech(tech)
        // let matsNeeded = G.calcStructureUpgrade(mat);
        // if(!G.hasSufficientMats(matsNeeded)) { console.log("Not enough minerals"); return;  }
        // G.subtractAmount(matsNeeded)
        // G.upgradeStructure(mat)
        triggerUpdate();
    }

    const displayUpgradeCost = (material) => {
        let mats = G.calcStructureUpgrade(material);
        let calcTickReduction = G.Materials[material].calcTickReduction

        let cost = Object.keys(mats).map((mat) => {

            let style = {name: {color: G.Materials[mat].Color} , all: {}}
            if(G.Materials[mat].Amount < mats[mat]) { style.name = style.all = {color: "#ff4848"} }

            let costPerTick = Object.keys(calcTickReduction).length
                ? (<span>-{calcTickReduction[mat]}/tick</span>)
                : (<span></span>)

            return (
                <div key={mat} style={style.all}>
                    <span style={style.name}>{mat}:</span> <span>{G.formatNum(mats[mat])}</span>
                    {costPerTick}
                </div>
            )
        })

        return (
            <div className="structureCost">
                {cost}
            </div>
        )
    }

    const renderStructures = () => {
        return Object.keys(G.Materials).map((mat) => {
            if(!G.Materials[mat].active) { return; }
            let matsNeeded = G.calcStructureUpgrade(mat);
            let buttonVisibility = G.hasSufficientMats(matsNeeded)
                ? {opacity: 1}
                : {opacity: 0}
            return (
                <div key={G.Materials[mat].main} className="structureRow">
                    <div className="structureName" style={{color: G.Materials[mat].color}}>{G.Materials[mat].main}:</div>
                    <div className="structureLevel">{G.Materials[mat].level}</div>
                    <button className="structureUpgrade" style={buttonVisibility} onClick={() => upgradeStructure(mat)}>Upgrade</button>
                    <div className="structureCostBox">Cost: {displayUpgradeCost(mat)}</div>
                </div>
            )
        })
    }

    const activateTab = (tab) => {
        let tabs = document.getElementsByClassName("rightmenuTab");
        for(let p in tabs) { tabs[p].style && (tabs[p].className = "rightmenuTab"); }
        document.getElementById(tab+"Tab").className += " selected";

        let childs = document.getElementById("rightMenu").childNodes;
        for(let p in childs) { childs[p].style && (childs[p].style.display = "none"); }
        document.getElementById(tab).style.display = "block";
    }

    const renderPlayerUnlocks = () => {
        return Object.keys(G.Player.TechTree).map((unlock, ind) =>
            <button className={`playerUnlock`} key={ind} onClick={() => unlockTech(unlock)}>Unlock {unlock}</button>
        )
    }


    let structures = renderStructures();
    let unlocks = renderPlayerUnlocks();

    return (
        <div id="component-rightmenu">
            <div id="rightmenuBar">
                <div id="structureTab" className="rightmenuTab selected" onClick={() => activateTab("structure")}>Structures</div>
                <div id="unlockTab" className="rightmenuTab" onClick={() => activateTab("unlock")}>Unlock</div>
            </div>
            <div id="rightMenu">
                <div id="structure">
                    {structures}
                </div>
                <div id="unlock">
                    Unlock Tab
                    {unlocks}
                </div>
            </div>
        </div>
    );
};

export { RightMenu as default };
