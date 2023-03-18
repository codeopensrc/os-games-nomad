"use strict";

import React from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import "../style/Main.less"

let Game = require("../js/Game.js");
// new Game().Loop()


class Main extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            points: []
        }
        this.G = this.props.G;
    }

    componentDidMount() {
        this.createRandomizedPoints();
    }

    calcDef(level) {
        return level * (Math.random() * 2.3 + level).toFixed(2)
    }

    calcHealth(level) {
        return level * (Math.random() * 5.6 + level).toFixed(2)
    }

    calcAttack(level) {
        return level * (Math.random() * 1.4 + level).toFixed(2)
    }

    createRandomizedPoints() {
        let numPoints = 15
        let points = [];
        let maxX = 880;
        let maxY = 770;
        let createPoint = (index) => {
            let resources = {}
            Object.keys(this.G.Materials).forEach((mat) => {
                let num = Math.ceil(Math.random() * (this.G.Materials[mat].TickAmount * 1.8) + (this.G.Materials[mat].TickAmount * 1.6))
                resources[mat] = num
            })
            return {
                index: index,
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY),
                resources: resources,
                taken: false,
                defense: this.calcDef(index),
                health: this.calcHealth(index)
            }
        }

        for(let i = 0; i < numPoints; i++) {
            let point = createPoint(i)
            points.push(point)
        }
        this.setState({ points: points })
    }

    renderPoints() {
        return this.state.points.map((point, i) => {
            // let color = point.taken ? "#51ca72" : "#caab51"
            let color = point.taken ? "taken" : "nottaken"
            return (
                <div key={i} style={{left: point.x, top: point.y}}
                    className={`point ${color}`}
                    onClick={this.attackPoint.bind(this, point)}>
                    {i}
                </div>
            )
        })
    }

    attackPoint(point) {
        console.log("Index is: ", point.index);
        console.log("Resrouces at this base are:", point.resources);
        console.log(this.G.Player.Stats.Attack, point.defense);
        if(this.G.Player.Stats.Attack < point.defense) {
            return console.log("You're too weak");
        }
        if(this.G.Player.Stats.Attack >= point.defense) {
            console.log("You're our new king");
        }
        if(!point.resources) { return console.log("Already Captured"); }
        this.G.addAmount(point.resources)
        point.resources = null;
        point.taken = true;
        this.props.triggerUpdate();
    }

    render() {
        return (
            <div id="component-main">
                <div id={`mainMap`}>
                    Mid
                    {this.renderPoints()}
                </div>
            </div>
        );
    }

};

export { Main as default };
