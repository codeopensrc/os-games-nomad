"use strict";

const React = require('react');
const DOM = require('react-dom');

let Game = require("../js/Game.js");
// var PropTypes = React.PropTypes;

require("../style/RightMenu.less");

const RightMenu = React.createClass({
    getInitialState: function() {
        return { };
    },

    componentDidMount: function() {
    },

    componentWillMount: function() {
        this.G = this.props.G;
    },

    upgradeStructure: function (mat) {
        let matsNeeded = this.G.calcStructureUpgrade(mat);
        if(!this.G.hasSufficientMats(matsNeeded)) { console.log("Not enough minerals"); return;  }
        this.G.subtractAmount(matsNeeded)
        this.G.upgradeStructure(mat)
        this.props.triggerUpdate();
    },

    upgradeStat: function (stat) {
        this.G.upgradeStat(stat)
        // let matsNeeded = this.G.calcStructureUpgrade(mat);
        // if(!this.G.hasSufficientMats(matsNeeded)) { console.log("Not enough minerals"); return;  }
        // this.G.subtractAmount(matsNeeded)
        // this.G.upgradeStructure(mat)
        this.props.triggerUpdate();
    },

    displayUpgradeCost: function (material) {
        let mats = this.G.calcStructureUpgrade(material);
        let cost = Object.keys(mats).map((mat) => {
            let style = {name: {color: this.G.Materials[mat].Color} , all: {}}
            if(this.G.Materials[mat].Amount < mats[mat]) { style.name = style.all = {color: "#ff4848"} }
            return (
                <div key={mat} style={style.all}>
                    <span style={style.name}>{mat}:</span> <span>{this.G.formatNum(mats[mat])}</span>
                </div>
            )
        })
        return (
            <div className="structureCost">
                {cost}
            </div>
        )
    },

    renderStructures: function () {
        return Object.keys(this.G.Materials).map((mat) => {
            let matsNeeded = this.G.calcStructureUpgrade(mat);
            let buttonVisibility = this.G.hasSufficientMats(matsNeeded)
                ? {display: "inline-block"}
                : {display: "none"}

            return (
                <div key={this.G.Materials[mat].Main} className="structureRow">
                    <div className="structureName" style={{color: this.G.Materials[mat].Color}}>{this.G.Materials[mat].Main}:</div>
                    <div className="structureLevel">{this.G.Materials[mat].Level}</div>
                    <button className="structureUpgrade" style={buttonVisibility} onClick={this.upgradeStructure.bind(this, mat)}>Upgrade</button>
                    <div className="structureCostBox">Cost: {this.displayUpgradeCost(mat)}</div>
                </div>
            )
        })
    },

    activateTab: function (tab) {
        let tabs = document.getElementsByClassName("rightmenuTab");
        for(let p in tabs) { tabs[p].style && (tabs[p].className = "rightmenuTab"); }
        document.getElementById(tab+"Tab").className += " selected";

        let childs = document.getElementById("rightMenu").childNodes;
        for(let p in childs) { childs[p].style && (childs[p].style.display = "none"); }
        document.getElementById(tab).style.display = "block";
    },

    render: function() {

        let structures = this.renderStructures();

        return (
            <div id="component-rightmenu">
                <div id="rightmenuBar">
                    <div id="structureTab" className="rightmenuTab selected" onClick={this.activateTab.bind(this, "structure")}>Structures</div>
                    <div id="trainingTab" className="rightmenuTab" onClick={this.activateTab.bind(this, "training")}>Training</div>
                </div>
                <div id="rightMenu">
                    <div id="structure">
                        {structures}
                    </div>
                    <div id="training">
                        Training Tab
                        <br />
                        <button onClick={this.upgradeStat.bind(this, "Attack")}>Upgrade Attack</button>
                        <br />
                        <button onClick={this.upgradeStat.bind(this, "Defense")}>Upgrade Defense</button>
                        <br />
                        <button onClick={this.upgradeStat.bind(this, "Health")}>Upgrade Health</button>
                        <br />
                        <button onClick={this.upgradeStat.bind(this, "Workers")}>Upgrade Workers</button>
                        <br />
                        <button onClick={this.upgradeStat.bind(this, "Gatherers")}>Upgrade Gatherers</button>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = RightMenu;
