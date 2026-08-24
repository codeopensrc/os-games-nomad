"use strict";

import React, { useEffect, useState, useCallback } from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import Bar from "./Bar.jsx"

import "../style/Skill.less"


const Skill = function(props) {
    const { G, triggerUpdate, coreFns } = props

    const [plots, setPlots] = useState([])

    //TODO: better like this maybe
    //const [selectedPlot, setSelectedPlot] = useState("")

    const title = G.Screen

    useEffect(() => {
        fetchPlotNames(G.Items)
    }, [G.Screen])

    const fetchPlotNames = (defaultSkills) => {
        const skillname = G.Screen.toLowerCase()
        const newPlots = defaultSkills[skillname].plots.map((plot, ind) => {
            const lootName = Object.keys(plot.lootTable)[0]
            const icon = G.createItem(lootName).icon
            const newPlot = Object.create(plot)
            newPlot.skillname = G.Screen
            newPlot.icon = icon
            return newPlot
        })
        setPlots(newPlots)
    }

    const selectPlot = (plot) => {
        if(G.Plot && plot.name == G.Plot.name) {
            G.resetActivity()
        } else {
            if(G.Skills[G.Screen].level >= plot.lvl) {
                G.selectPlot(plot)
            }
        }
    }

    const skillData = {barType: "skill", barTextType: "timer", skill: G.Skills[G.Screen], plot: G.Plot, timer: G.TimeNow}
    const skillProgressBar = <Bar id={"skill"} G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} data={skillData}/>

    const renderedPlots = plots.map((plot, i) => {
        if(!plot) { return }
        const selected = G.Plot && G.Plot.name == plot.name && G.Screen == G.ActiveSkill ? "selected" : ""
        const disabled = G.Skills[G.Screen].level < plot.lvl ? "disabled" : ""
        return (
            <div key={plot.name+i} className={`plot ${selected} ${disabled}`}
                onClick={() => selectPlot(plot)}>
                <div className={`plotText plotName`}>{plot.name}</div>
                <div className={`plotText plotIcon`}>
                    <img className={`lootIcon`} src={`./images/items/${plot.icon}.png`} alt={"Item"}/>
                </div>
                <div className={`plotText plotLevel ${disabled}`}>Required level: {plot.lvl}</div>
                <div className={`plotText plotExp`}>Exp: {plot.baseExp}</div>
                <div className={`plotText plotTime`}>Time: {plot.cleartime}s</div>
                {selected ? skillProgressBar : null}
            </div>
        )
    })

    const expData = {barType: "exp", barTextType: "value", skill: G.Skills[G.Screen]}
    return (
        <div id={`skillPage`}>
            <div id={"skillTitle"}>
                {title}
            </div>
            <Bar id={"exp"} G={G} triggerUpdate={triggerUpdate} coreFns={coreFns} data={expData}/>
            <div id={`mainPlot`}>
                {renderedPlots}
            </div>
        </div>
    );
};

export { Skill as default };
