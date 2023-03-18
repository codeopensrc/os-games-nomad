"use strict";

import React from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import "../style/BottomMenu.less"


class BottomMenu extends React.Component {

    constructor(props) {
        super(props)
        this.state = { }
    }

    componentDidMount() { }

    render() {
        return (
            <div id="component-bottommenu">
                Bottom
            </div>
        );
    }

};

export { BottomMenu as default };
