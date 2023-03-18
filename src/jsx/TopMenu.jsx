"use strict";

import React from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import "../style/TopMenu.less"


class TopMenu extends React.Component {

    constructor(props) {
        super(props)
        this.state = { }
    }

    componentDidMount() { }

    render() {
        return (
            <div id="component-topmenu">
                <img src={`./images/Logo.png`} />
            </div>
        );
    }

};

export { TopMenu as default };
