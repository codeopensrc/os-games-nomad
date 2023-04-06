"use strict";

import React from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

//import "../style/Docs.less"


const Docs = function(props) {
    //const [points, setPoints] = useState([])
    //const { G, triggerUpdate } = props

    return (
        <div id="component-docs" style={{color: "black"}}>
            Docs Page
            <br />
            Testing keeping val/state between pages
        </div>
    );
};

export { Docs as default };
