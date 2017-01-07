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

    render: function() {
        return (
            <div id="component-main">
                Main
            </div>
        );
    }

});

module.exports = Main;
