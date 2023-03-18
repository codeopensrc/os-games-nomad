"use strict";

import { hot } from 'react-hot-loader/root';
import React from 'react';
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

let Game = require("../js/Game.js");
let G = new Game();
let loops = 0;
// var PropTypes = React.PropTypes;

import "../style/Entry.less"

class Test extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            test: this.props.gameState
        }
    }
    render() {
        return (
            <div id={`test`}>
                <h3>Test</h3>
                <h4>{this.state.test}</h4>
            </div>
        );
    }
}

class Entry extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            testVar: "hi"
        }
    }

    componentDidMount() {
        setInterval(() => {
            G.Loop();
            this.setState({})
            // ++loops === 3 && this.setState({});
            // loops === 3 && (loops = 0)
        }, 2000);
    }

    upd() { this.setState({}) }

    render() {
        return (
            <Router>
                <div id="component-entry">
                    {/*<Link to={"/"} className={"headerButton"}>Home</Link> */}
                    {/*<Link to={"/test"} className={"headerButton"}>Test</Link> */}
                    <Switch>
                        <Route exact path={"/"}>
                            <TopMenu G={G} triggerUpdate={this.upd.bind(this)}/>
                            <div id={`mid`}>
                                <LeftMenu G={G} triggerUpdate={this.upd.bind(this)}/>
                                <Main G={G} triggerUpdate={this.upd.bind(this)}/>
                                <RightMenu G={G} triggerUpdate={this.upd.bind(this)}/>
                            </div>
                            <BottomMenu G={G} triggerUpdate={this.upd.bind(this)}/>
                        </Route>
                        {/*<Route path={"/test"} render={() => <Test gameState={this.state.testVar}/>} /> */}
                    </Switch>
                </div>
            </Router>
        );
    }

};

export default hot(Entry);

DOM.render(<Entry />, document.getElementById("main"))
