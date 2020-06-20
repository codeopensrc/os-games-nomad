"use strict";

const React = require('react');
const DOM = require('react-dom');

const LeftMenu = require("./LeftMenu.jsx");
const TopMenu = require("./TopMenu.jsx");
const Main = require("./Main.jsx");
const RightMenu = require("./RightMenu.jsx");
const BottomMenu = require("./BottomMenu.jsx");

let Game = require("../js/Game.js");
let G = new Game();
let loops = 0;
// var PropTypes = React.PropTypes;

require("../style/Entry.less")

const Entry = React.createClass({

    getInitialState: function() {
        return { };
    },

    componentDidMount: function() {
        setInterval(() => {
            G.Loop();
            this.setState({})
            // ++loops === 3 && this.setState({});
            // loops === 3 && (loops = 0)
        }, 2000);
    },

    upd: function() { this.setState({}) },

    render: function() {
        return (
            <div id="component-entry">
                <TopMenu G={G} triggerUpdate={this.upd}/>
                <div id={`mid`}>
                    <LeftMenu G={G} triggerUpdate={this.upd}/>
                    <Main G={G} triggerUpdate={this.upd}/>
                    <RightMenu G={G} triggerUpdate={this.upd}/>
                </div>
                <BottomMenu G={G} triggerUpdate={this.upd}/>
            </div>
        );
    }

});

DOM.render(<Entry />, document.getElementById("main"))
