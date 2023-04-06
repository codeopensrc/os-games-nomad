"use strict";

import React, { useEffect, useState, useCallback } from 'react';
import DOM from 'react-dom';

const itemColors = {
    Steel: "#7d7a7a",
    Wood: "#926738",
    Stone: "#c5c5c5"
}

// var PropTypes = React.PropTypes;

import "../style/LeftMenu.less"

const LeftMenu = function(props) {
    //const [testVar, setTestVar] = useState("")
    let { G, triggerUpdate } = props

    const renderInventory = () => {
        return Object.keys(G.Materials).map((mat) => {
            if(!G.Materials[mat].active) { return; }
            // <div className="itemName" style={{color: G.Materials[mat].Color}}>{mat}</div>
            let amountShown = G.formatNum(G.Materials[mat].Amount)
            return (
                <div key={mat} className="itemRow">

                    <img className="itemName" src={`./images/${mat}.png`} />
                    <div className="itemAmount">:{amountShown}</div>
                    <div className="itemTick"><span>Per tick:</span><span>~{G.formatNum(G.Materials[mat].TickAmount)}</span></div>
                </div>
            )
        })
    }

    const renderTechTree = () => {
        return Object.keys(G.Player.TechTree).map((tech, i) => {
            return (
                <div key={i} className="techTreeRow">
                    <div className="techTreeName">{tech}</div>
                    <div className="techTreeAmount">:{G.Player.TechTree[tech].unlocked.toString()}</div>
                </div>
            )
        })
    }


    let inventory = renderInventory();
    let techTree = renderTechTree();

    return (
        <div id="component-leftmenu">
            TechTree:
            <br />
            <div id={`techTree`}>
                {techTree}
            </div>
            <br />
            Inventory:
            <br />
            <div id={`inventory`}>
                {inventory}
            </div>

        </div>
    );
};

export { LeftMenu as default };
