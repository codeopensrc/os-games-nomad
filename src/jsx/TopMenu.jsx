"use strict";

import React, { useEffect, useState } from 'react';
import DOM from 'react-dom';
// var PropTypes = React.PropTypes;

import "../style/TopMenu.less"


const TopMenu = function(props) {
    const { G, triggerUpdate, coreFns } = props

    const [infoData, setInfoData] = useState([])

    //TODO: Support span/highlighted text in popup
    useEffect(() => {
        setInfoData(G.PopupInfo)
    }, [G.PopupInfo.length])

    const dismissPopup = (data, ind) => {
        G.PopupInfo = G.PopupInfo.filter((d, i) => d.id != data.id)
    }

    const popup = infoData.map((data, i) => { 
        return (
            <div key={i} 
                onClick={()=>dismissPopup(data, i)}
                className={`infoPopup ${data.status}`}>
                <div id={`infoTitle`}>{data.text}</div>
            </div>
        )
    })

    //NOTE: For now just use top as alert popup
    //Nomad
    return (
        <div id="component-topmenu">
            {popup}
        </div>
    );
};

export { TopMenu as default };
