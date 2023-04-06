"use strict";

import React, { useEffect, useState, useCallback } from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import "../style/Main.less"

const Main = function(props) {
    const [points, setPoints] = useState([])
    const { G, triggerUpdate } = props

    useEffect(() => {
        createRandomizedPoints();
    }, [])

    const calcDef = (level) => {
        return level * (Math.random() * 2.3 + level).toFixed(2)
    }

    const calcHealth = (level) => {
        return level * (Math.random() * 5.6 + level).toFixed(2)
    }

    const calcAttack = (level) => {
        return level * (Math.random() * 1.4 + level).toFixed(2)
    }

    const createRandomizedPoints = () => {
        let numPoints = 15
        let points = [];
        let maxX = 880;
        let maxY = 770;
        let createPoint = (index) => {
            let resources = {}
            Object.keys(G.Materials).forEach((mat) => {
                let num = Math.ceil(Math.random() * (G.Materials[mat].TickAmount * 1.8) + (G.Materials[mat].TickAmount * 1.6))
                resources[mat] = num
            })
            return {
                index: index,
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY),
                resources: resources,
                taken: false,
                defense: calcDef(index),
                health: calcHealth(index)
            }
        }

        for(let i = 0; i < numPoints; i++) {
            let point = createPoint(i)
            points.push(point)
        }
        setPoints(points)
    }

    const renderPoints = () => {
        return points.map((point, i) => {
            // let color = point.taken ? "#51ca72" : "#caab51"
            let color = point.taken ? "taken" : "nottaken"
            return (
                <div key={i} style={{left: point.x, top: point.y}}
                    className={`point ${color}`}
                    onClick={() => attackPoint(point)}>
                    {i}
                </div>
            )
        })
    }

    const attackPoint = (point) => {
        console.log("Index is: ", point.index);
        console.log("Resrouces at this base are:", point.resources);
        console.log(G.Player.Stats.Attack, point.defense);
        if(G.Player.Stats.Attack < point.defense) {
            return console.log("You're too weak");
        }
        if(G.Player.Stats.Attack >= point.defense) {
            console.log("You're our new king");
        }
        if(!point.resources) { return console.log("Already Captured"); }
        G.addAmount(point.resources)
        point.resources = null;
        point.taken = true;
        triggerUpdate();
    }

    return (
        <div id="component-main">
            <div id={`mainMap`}>
                Mid
                {renderPoints()}
            </div>
        </div>
    );
};

export { Main as default };
