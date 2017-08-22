"use strict";

const React = require('react');
const DOM = require('react-dom');
// var PropTypes = React.PropTypes;

require("../style/Main.less");

let Game = require("../js/Game.js");
new Game().Loop()


const Main = React.createClass({

    getInitialState: function() {
        return { };
    },

    componentDidMount: function() {
    },

    createRandomizedPoints: function() {
        let numPoints = 5
        let points = [];
        for(let i = 0; i < numPoints; i++) {
            let point = (
                <div key={i} className={`point`}>

                </div>
            )
            points.push(point)
        }
        return points
    },

    render: function() {
        return (
            <div id="component-main">
                <img style={{width: 200}} src={`./images/Logo.png`} />
                <div className = "mainMap">
                    {this.createRandomizedPoints()}
                </div>
            </div>
        );
    }

});

module.exports = Main;
