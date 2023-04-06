"use strict";

import React from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import "../style/TopMenu.less"


const TopMenu = function() {
    //const [testVar, setTestVar] = useState("")
    //const { G, triggerUpdate } = props

    return (
        <div id="component-topmenu">
            <img src={`./images/Logo.png`} />
        </div>
    );
};

export { TopMenu as default };
