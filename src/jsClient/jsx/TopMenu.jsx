"use strict";

const React = require('react');
const DOM = require('react-dom');
// var PropTypes = React.PropTypes;

require("../style/TopMenu.less");


const TopMenu = React.createClass({

    render: function() {
        return (
            <div id="component-topmenu">
                Top
            </div>
        );
    }

});

module.exports = TopMenu;