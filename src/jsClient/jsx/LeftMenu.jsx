"use strict";

const React = require('react');
const DOM = require('react-dom');
// var PropTypes = React.PropTypes;

require("../style/LeftMenu.less");

const LeftMenu = React.createClass({

    render: function() {
        return (
            <div id="component-leftmenu">
                Left
            </div>
        );
    }

});

module.exports = LeftMenu;
