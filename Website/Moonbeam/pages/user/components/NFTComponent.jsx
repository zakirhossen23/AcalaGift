import React, { useState, useEffect } from 'react'
import isServer from '../../../components/isServer'
export default function NFTComponent({ Id, EventID, name, price, image, signer, wallet, isGifted, showingFunc, unwrapingFunc }) {

  if (isServer()) return <></>
  return (<>
    <div className="LSPs-asset-wrapper">
      <div className="LSPs-preview-card" >
        <div className="d-flex flex-lg-row-reverse h-50 p-1 w-100">
          <small className="LSPs-supply">{price} aUSD </small>
        </div>
        <div style={{ height: "70%", display: "flex", justifyContent: "center" }}>
          <img src={image} className="h-100 main-nav" />
        </div>
        <div className="LSPs-infos position-relative">
          <small style={{ bottom: "30%" }} className="balance-amount position-absolute">
            {name.substring(0, 17)}
          </small>
        </div>
        {(signer !== wallet) ? (<></>) : (<>
          {(isGifted !== "True") ? (<>
            <div className="LSPs-infos">
              <button className="btn btn-primary rounded-3 w-100" onClick={() => { showingFunc(Id, EventID) }}>Send as Giftcard</button>
            </div>
          </>) : (<><div className="LSPs-infos">
            <button className="btn btn-primary rounded-3 w-100" onClick={() => { unwrapingFunc(Id, EventID) }}>Unwrap Giftcard</button>
          </div></>)}

        </>)}
      </div>
    </div>


  </>)
}
