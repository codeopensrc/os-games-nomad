"use strict";

import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState, useCallback } from 'react';
import DOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom';

import LeftMenu from "./LeftMenu.jsx"
import TopMenu from "./TopMenu.jsx"
import Main from "./Main.jsx"
import RightMenu from "./RightMenu.jsx"
import BottomMenu from "./BottomMenu.jsx"
import Docs from "./Docs.jsx"

let Game = require("../js/Game.js");
let G = new Game();
// var PropTypes = React.PropTypes;

import "../style/Entry.less"

const Test = function(props) {
    const [test, setTest] = useState(props.gameState)

    return (
        <div id={`test`}>
            <h3>Test</h3>
            <h4>{test}</h4>
        </div>
    );
}

const Entry = function() {
    const [loops, updateLoops] = useState(0)
    const [trigger, triggerUpdate] = useState(false)
    let testVar = "hi"

    useEffect(() => {
        console.log("Loop start");
        const interval = setInterval(() => {
            G.Loop();
            updateLoops(loops => loops + 1)
        }, 2000);
        //return () => clearInterval(interval)
    }, [])

    const upd = () => triggerUpdate(trigger => !trigger)

    return (
        <Router>
            <div id="component-entry">
                <div id={`component-header`}>
                    <Link to={"/"} className={"headerButton"}>Home</Link>
                    <Link to={"/test"} className={"headerButton"}>Test</Link>
                    <Link to={"/docs"} className={"headerButton"}>Docs</Link>
                </div>
                <Switch>
                    <Route exact path={"/"}>
                        <TopMenu G={G} />
                        <div id={`mid`}>
                            <LeftMenu G={G} />
                            <Main G={G} triggerUpdate={upd}/>
                            <RightMenu G={G} triggerUpdate={upd}/>
                        </div>
                        <BottomMenu G={G} />
                    </Route>
                    <Route path={"/test"} render={() =>
                        <Test gameState={testVar}/>
                    }/>
                    <Route path={"/docs"} render={() =>
                        <Docs G={G} gameState={testVar}/>
                    }/>
                </Switch>
            </div>
        </Router>
    );

};

export default hot(Entry);

DOM.render(<Entry />, document.getElementById("main"))
