"use strict";

import React, { useEffect, useState } from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import Inventory from "./Inventory.jsx"
import Battle from "./Battle.jsx"
import Skill from "./Skill.jsx"
import Craft from "./Craft.jsx"
import Shop from "./Shop.jsx"
import Dungeon from "./Dungeon.jsx"

import "../style/Main.less"

const Main = function(props) {
    const { G, triggerUpdate, coreFns } = props

    const [filters, setFilters] = useState({data: {}})

    const updateFilters = (newFilters) => {
        setFilters({data: newFilters})
    }

    useEffect(() => {
        const foundFilters = localStorage.getItem("filters");
        if(foundFilters) {
            setFilters({data: JSON.parse(foundFilters)})
        }
    }, [])


    let invDisplay = <Inventory G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} filters={{...filters, update: updateFilters}}/>
    let battleDisplay = <Battle G={G} triggerUpdate={triggerUpdate} coreFns={coreFns}/>
    let dungeonDisplay = <Dungeon G={G} triggerUpdate={triggerUpdate} coreFns={coreFns}/>
    let skillDisplay = <Skill G={G} triggerUpdate={triggerUpdate} coreFns={coreFns}/>
    let craftDisplay = <Craft G={G} triggerUpdate={triggerUpdate} coreFns={coreFns}/>
    let shopDisplay = <Shop G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} filters={{...filters, update: updateFilters}}/>

    let displays = {
        "Inventory": invDisplay,
        "Battle": battleDisplay,
        "Training": craftDisplay,
        "Shop": shopDisplay,
        "Dungeon": dungeonDisplay,
        "Alchemy": craftDisplay,
        "Farming": skillDisplay,
        "Forestry": skillDisplay,
        "Smithing": craftDisplay,
        "Enchanting": craftDisplay,
        "Cooking": craftDisplay,
        "Prayer": craftDisplay,
        "Inscription": craftDisplay,
        "Jewelcrafting": craftDisplay,
    }
    let activeDisplay = displays[G.Screen]
        ? displays[G.Screen]
        : G.Screen ? skillDisplay : null

    return (
        <div id="component-main">
            <div id={`mainView`} className={`${G.Screen}`}>
                {activeDisplay}
            </div>
        </div>
    );
};

export { Main as default };
