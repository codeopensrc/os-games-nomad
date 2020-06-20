"use strict";

const React = require('react');
const DOM = require('react-dom');

const itemColors = {
    Steel: "#7d7a7a",
    Wood: "#926738",
    Stone: "#c5c5c5"
}

let Game = require("../js/Game.js");
// var PropTypes = React.PropTypes;

require("../style/LeftMenu.less");

const LeftMenu = React.createClass({
    getInitialState: function() {
        return { };
    },

    componentDidMount: function() {
    },

    componentWillMount: function() {
        this.G = this.props.G;
    },

    renderInventory: function() {
        return Object.keys(this.G.Materials).map((mat) => {
            if(!this.G.Materials[mat].active) { return; }
            // <div className="itemName" style={{color: this.G.Materials[mat].Color}}>{mat}</div>
            let amountShown = this.G.formatNum(this.G.Materials[mat].Amount)
            return (
                <div key={mat} className="itemRow">

                    <img className="itemName" src={`./images/${mat}.png`} />
                    <div className="itemAmount">:{amountShown}</div>
                    <div className="itemTick"><span>Per tick:</span><span>~{this.G.formatNum(this.G.Materials[mat].TickAmount)}</span></div>
                </div>
            )
        })
    },

    renderStats: function () {
        return Object.keys(this.G.Player).map((stat, i) => {
            return (
                <div key={i} className="statRow">
                    <div className="statName">{stat}</div>
                    <div className="statAmount">:{this.G.Player[stat].unlocked.toString()}</div>
                </div>
            )
        })
    },

    render: function() {

        let inventory = this.renderInventory()
        let stats = this.renderStats();

        return (
            <div id="component-leftmenu">
                Stats:
                <br />
                <div id={`stats`}>
                    {stats}
                </div>
                <br />
                Inventory:
                <br />
                <div id={`inventory`}>
                    {inventory}
                </div>

            </div>
        );
    }

});

module.exports = LeftMenu;
