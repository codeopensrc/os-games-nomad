"use strict";

import React, { useEffect  } from 'react';

const AdsComponent = (props) => {
    const { dataAdSlot } = props;  

    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
        catch (e) {
          console.log("OOPS", e)
        }
    },[]);

    return (
        <>
            <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-2629923031428828"
                data-ad-format="auto"
                data-full-width-responsive="true"
                data-ad-slot={dataAdSlot}>
            </ins>
        </>
    );
};

export default AdsComponent;
