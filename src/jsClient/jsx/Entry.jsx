"use strict";

const React = require('react');
const DOM = require('react-dom');

const LeftMenu = require("./LeftMenu.jsx");
const TopMenu = require("./TopMenu.jsx");
const Main = require("./Main.jsx");
const RightMenu = require("./RightMenu.jsx");
const BottomMenu = require("./BottomMenu.jsx");
// var PropTypes = React.PropTypes;

require("../style/Entry.less")

const Entry = React.createClass({

    render: function() {
        return (
            <div>
                <TopMenu />
                <LeftMenu />
                <Main />
                <RightMenu />
                <BottomMenu />
            </div>
        );
    }

});

DOM.render(<Entry />, document.getElementById("main"))
