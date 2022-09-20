import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import useContract from '../../services/useContract'
import { Header } from '../../components/layout/Header'
import isServer from '../../components/isServer'
// Assets and Tokens
import 'isomorphic-fetch'

//Assets and Token Component
import NFTComponent from './components/NFTComponent'
import Web3 from 'web3'
//Gift Card
import SendAsGiftCardModal from '../../components/components/modals/SendAsGiftCardModal'
import UnwrapGiftCardModal from '../../components/components/modals/UnwrapGiftCardModal'

let PROFILE_ADDRESS = ''

export default function User() {
  //Variables

  const { contract, signerAddress } = useContract()
  //Gift Card Modal
  const [ShowGiftModal, setShowGiftModal] = useState(false)
  const [ShowUnwrapGiftModal, setShowUnwrapGiftModal] = useState(false)
  const [SelectedEventID, setSelectedEventID] = useState(false)
  const [SelectedTokenID, setSelectedTokenID] = useState(false)

  const [NFTs, setNFTs] = useState([])

  const sleep = (milliseconds) => {                                           //Custom Sleep function to wait
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
  }

  useEffect(() => {
    PROFILE_ADDRESS = window.location.pathname.replace('/user/', '')
    fetchData()
  }, [contract])


  if (isServer()) return null
  async function fetchData() {
    if (contract) {
      if (PROFILE_ADDRESS === '') {
        return
      }

      let arr = [];
      let allLSP9NFTs = await contract.GetNFTsByUserAddrs(PROFILE_ADDRESS).call();
      for (let index = 0; index < allLSP9NFTs.length; index++) {
        const object = JSON.parse(allLSP9NFTs[index]);
        const TokenId = Number(await contract.gettokenIdByUri(allLSP9NFTs[index]).call()) //Getting NFT id from NFT URI
        const EventID = Number(await contract.geteventIdFromTokenURI(TokenId).call())
        const isGifted = await contract.GetGiftedFromToken(TokenId.toString()).call();
        arr.push({
          Id: TokenId,
          name: object.properties.name.description,
          description: object.properties.description.description,
          price: Number(object.properties.price.description),
          image: object.properties.image.description,
          EventID: EventID,
          isGift: isGifted
        })
      }
      setNFTs(arr)

      console.log(arr);

      document.getElementById('Loading').style = 'display:none'
    }

  }
  function activateGiftCardModal(TokenID, EventID) {
    setSelectedTokenID(TokenID)
    setSelectedEventID(EventID)
    setShowGiftModal(true)
  }

  function activateUnwrapGiftCardModal(TokenID, EventID) {
    setSelectedTokenID(TokenID)
    setSelectedEventID(EventID)
    setShowUnwrapGiftModal(true)
  }

  return (<>
    <Header></Header>
    <Head>
      <title>User</title>
      <meta name="description" content="Donation" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="row user UserContainer">
      <div className="user imagecontainer" >
        <div className="TextContainer">
          <h4>Address: </h4>
          <h5 style={{ paddingTop: '0.4rem' }}>{PROFILE_ADDRESS} </h5>
        </div>
      </div>
    </div>

    <div id="Loading" className="user LoadingArea" >
      <h1>Loading...</h1>
    </div>
    <div className="user won-nft-Container">
      <h2>NFTs</h2>
      {(NFTs.length === 0) ? (<><h6>No items</h6></>) : (
        <div className="gap-3 won-nft-grid user">
          {NFTs.map((listItem) => (<NFTComponent key={listItem.TokenId} Id={listItem.Id} EventID={listItem.EventID} name={listItem.name} price={listItem.price} isGifted={listItem.isGift} image={listItem.image} signer={window.ethereum.selectedAddress} wallet={PROFILE_ADDRESS} showingFunc={activateGiftCardModal} unwrapingFunc={activateUnwrapGiftCardModal} />))}
        </div>)}
    </div>
   

    <SendAsGiftCardModal
      show={ShowGiftModal}
      onHide={() => {
        setShowGiftModal(false)
      }}
      TokenID={SelectedTokenID}
      EventID={SelectedEventID}
      contract={contract}

    />

    <UnwrapGiftCardModal
      show={ShowUnwrapGiftModal}
      onHide={() => {
        setShowUnwrapGiftModal(false)
      }}
      TokenID={SelectedTokenID}
      EventID={SelectedEventID}
      contract={contract}

    />
  </>
  )
}
