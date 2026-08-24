"use strict";

import React, { useEffect, useState } from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import "../style/Bar.less"
const { Temporal, Intl, toTemporalInstant } = require('@js-temporal/polyfill');


const Bar = function(props) {
    const { id, G, triggerUpdate, coreFns, data } = props
    const { barType, barTextType, skill, plot, health, timer } = data

    const [currentValue, setCurrentValue] = useState(0)
    const [maxValue, setMaxValue] = useState(0)
    const [percent, setPercent] = useState(0)
    const [displayText, setDisplayText] = useState("")

    useEffect(() => {
        if(/health$/i.test(barType)) {
            updateHealthBar()
        }
        if(barType == "exp") {
            updateExpBar()
        }
        if(barType == "skill") {
            updateSkillBar()
        }
        if(barType == "craft") {
            updateCraftBar()
        }
        if(barType == "attack" || barType == "enemyattack") {
            updateAttackBar()
        }
        if(barType == "activity") {
            updateActivityBar()
        }
    }, [skill?.experience, health?.current, health?.max, timer])

    const resetBar = () => {
        setCurrentValue(0)
        setMaxValue(0)
        setPercent(0)
        updateText(``)
    }
    const updateHealthBar = () => {
        setCurrentValue(health.current)
        setMaxValue(health.max)
        const newPercent = (health.current / health.max * 100).toFixed(4)
        setPercent(newPercent)
        updateText(health.current, health.max)
    }

    const updateExpBar = () => {
        setCurrentValue(skill.experience)
        const newMax = (skill.baseExp * (skill.multi ** skill.level)).toFixed(0)
        setMaxValue(newMax)
        const newPercent = (skill.experience / newMax * 100).toFixed(4)
        setPercent(newPercent)
        updateText(skill.experience, newMax)
    }
    const updateSkillBar = () => {
        const duration = G.TimeNow.since(G.TimePlotSelected)
        const seconds = duration.total("seconds")
        const cleartime = plot.cleartime
        const newPercent = (seconds / cleartime * 100).toFixed(4)
        setPercent(newPercent)
        const durationLeft = (cleartime - seconds).toFixed(1)
        updateText(durationLeft)
    }
    const updateCraftBar = () => {
        if(!G.Craft?.item) { 
            return resetBar()
        }
        const duration = G.TimeNow.since(G.TimeCraftStarted)
        const seconds = duration.total("seconds")
        const cleartime = G.Craft.item.recipe.craftTime
        const newPercent = (seconds / cleartime * 100).toFixed(4)
        setPercent(newPercent)
        const durationLeft = (cleartime - seconds).toFixed(1)
        updateText(durationLeft)
    }
    const updateAttackBar = () => {
        let attacktime = G.Player.AttackSpeed
        let duration = G.Player.SwingTimer
        if(barType == "enemyattack" && G.Enemy) {
            attacktime = G.Enemy?.AttackSpeed || 0
            duration = G.Enemy?.SwingTimer || 0
        }
        const normalizedAtkSpeed = (attacktime.seconds * 1000) + attacktime.milliseconds
        const normalizedSwingTimer =  duration.milliseconds * 100
        const newPercent = (normalizedSwingTimer/normalizedAtkSpeed).toFixed(4)
        setPercent(newPercent)
        const durationLeft = attacktime.subtract(duration).round({largestUnit: "seconds", smallestUnit: "milliseconds"})
        updateText(`${(durationLeft.total("milliseconds") / 1000).toFixed(1)}`)
    }
    const updateActivityBar = () => {
        if(!skill) { 
            return resetBar()
        }
        setCurrentValue(skill.experience)
        const newMax = (skill.baseExp * (skill.multi ** skill.level)).toFixed(0)
        setMaxValue(newMax)
        const newPercent = (skill.experience / newMax * 100).toFixed(4)
        setPercent(newPercent)
        updateText(`Lvl ${skill.level}`)
    }

    const updateText = (val, max) => {
        if(barTextType == "value") {
            setDisplayText(`${val} / ${max}`)
        }
        if(barTextType == "timer") {
            setDisplayText(val ? `${val}s` : "")
        }
        if(barTextType == "activity") {
            setDisplayText(val)
        }
    }

    return (
        <div key={id} id={id} className={`barContainer ${barType}`}>
            <div className={`barText`}>{displayText}</div>
            <div style={{width: `${percent}%`}} className={"bar"}></div>
        </div>
    );
};

export { Bar as default };
