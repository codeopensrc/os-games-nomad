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

    unlockTech: function (tech) {
        this.G.unlockTech(tech)
        // let matsNeeded = this.G.calcStructureUpgrade(mat);
        // if(!this.G.hasSufficientMats(matsNeeded)) { console.log("Not enough minerals"); return;  }
        // this.G.subtractAmount(matsNeeded)
        // this.G.upgradeStructure(mat)
        this.props.triggerUpdate();
    },

    displayUpgradeCost: function (material) {
        let mats = this.G.calcStructureUpgrade(material);
        let calcTickReduction = this.G.Materials[material].calcTickReduction

        let cost = Object.keys(mats).map((mat) => {

            let style = {name: {color: this.G.Materials[mat].Color} , all: {}}
            if(this.G.Materials[mat].Amount < mats[mat]) { style.name = style.all = {color: "#ff4848"} }

            let costPerTick = Object.keys(calcTickReduction).length
                ? (<span>-{calcTickReduction[mat]}/tick</span>)
                : (<span></span>)

            return (
                <div key={mat} style={style.all}>
                    <span style={style.name}>{mat}:</span> <span>{this.G.formatNum(mats[mat])}</span>
                    {costPerTick}
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
            if(!this.G.Materials[mat].active) { return; }
            let matsNeeded = this.G.calcStructureUpgrade(mat);
            let buttonVisibility = this.G.hasSufficientMats(matsNeeded)
                ? {opacity: 1}
                : {opacity: 0}
            return (
                <div key={this.G.Materials[mat].main} className="structureRow">
                    <div className="structureName" style={{color: this.G.Materials[mat].color}}>{this.G.Materials[mat].main}:</div>
                    <div className="structureLevel">{this.G.Materials[mat].level}</div>
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

    renderPlayerUnlocks: function () {
        return Object.keys(this.G.Player.TechTree).map((unlock, ind) =>
            <button className={`playerUnlock`} key={ind} onClick={this.unlockTech.bind(this, unlock)}>Unlock {unlock}</button>
        )
    },

    render: function() {

        let structures = this.renderStructures();
        let unlocks = this.renderPlayerUnlocks();

        return (
            <div id="component-rightmenu">
                <div id="rightmenuBar">
                    <div id="structureTab" className="rightmenuTab selected" onClick={this.activateTab.bind(this, "structure")}>Structures</div>
                    <div id="unlockTab" className="rightmenuTab" onClick={this.activateTab.bind(this, "unlock")}>Unlock</div>
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
    }

});

module.exports = RightMenu;
