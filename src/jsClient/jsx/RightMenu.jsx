"use strict";

const React = require('react');
const DOM = require('react-dom');
// var PropTypes = React.PropTypes;

require("../style/RightMenu.less");


const RightMenu = React.createClass({

    render: function() {
        return (
            <div id="component-rightmenu">
                Right
            </div>
        );
    }

});

module.exports = RightMenu;
