import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import BidNFTModal from '../../../components/components/modals/BidNFTModal'
import ViewBidNFTModal from '../../../components/components/modals/ViewBidNFTModal'
import DonateNFTModal from '..//..//..//components/components/modals/DonateNFTModal'
import DirectDonateModal from '..//..//..//components/components/modals/DirectDonateModal'
import SlideShow from '..//..//..//components/components/Slideshow'

import useContract from '../../../services/useContract'
import { Header } from '../../../components/layout/Header'
import isServer from '../../../components/isServer'
let EventEnd= '';
let EventWaiting= false;
export default function AuctionNFT() {
  //variables
  const { contract, signerAddress } = useContract('ERC721')
  const [eventId, setEventId] = useState(-1)
  const [list, setList] = useState([])
  const [imageList, setimageList] = useState([])
  const [title, setTitle] = useState('')
  const [goal, setgoal] = useState('')
  const [EventEarned, setEventEarned] = useState('')
  const [EventDescription, setEventDescription] = useState('')
  const [EventWallet, setEventWallet] = useState('')
  const [SelectedendDate, setSelectedendDate] = useState('')
  const [date, setdate] = useState('')
  const [dateleftBid, setdateleftBid] = useState('')
  const [selectid, setselectid] = useState('')
  const [selecttitle, setselecttitle] = useState('')
  const [selectedAddress, setselectedAddress] = useState('')
  const [selecttype, setselecttype] = useState('')
  const [selectbid, setselectbid] = useState('')

  const [modalShow, setModalShow] = useState(false)
  const [ViewmodalShow, setViewModalShow] = useState(false)
  const [DonatemodalShow, setDonateModalShow] = useState(false)
  const [DirectModalShow, setDirectModalShow] = useState(false)

  const formatter = new Intl.NumberFormat('en-US', {                    //Converting number into comma version

    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  let m
  let id = ''                                                           //Event id from url
  function LeftDate(datetext) {                                         //String date to dd/hh/mm/ss format

    var c = new Date(datetext).getTime()
    var n = new Date().getTime()
    var d = c - n
    var da = Math.floor(d / (1000 * 60 * 60 * 24))
    var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60))
    var s = Math.floor((d % (1000 * 60)) / 1000)
    return (
      da.toString() +
      ' Days ' +
      h.toString() +
      ' hours ' +
      m.toString() +
      ' minutes ' +
      s.toString() +
      ' seconds'
    )
  }
  function LeftDateBid(datetext) {                                      //String date to d/h/m/s format

    var c = new Date(datetext).getTime()
    var n = new Date().getTime()
    var d = c - n
    var da = Math.floor(d / (1000 * 60 * 60 * 24))
    var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60))
    var s = Math.floor((d % (1000 * 60)) / 1000)
    if (  EventEnd === "Finished" && s.toString().includes('-')){
      return ("Auction Ended")
    } else if (s.toString().includes('-')&& EventWaiting === true && EventEnd !== "Finished") {
      return ("Waiting for release")

    }  else{

      return (
        da.toString() +
        'd ' +
        h.toString() +
        'h ' +
        m.toString() +
        'm ' +
        s.toString() +
        's'
      )
    }

  }

  useEffect(() => {
    if (!isServer()) {
      fetchContractData()
    }
  }, [id, contract])
  if (isServer()) return null
  const regex = /\[(.*)\]/g
  const str = decodeURIComponent(window.location.search)

  while ((m = regex.exec(str)) !== null) {                             // This is necessary to avoid infinite loops with zero-width matches

    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    id = m[1]
  }

  async function fetchContractData() {
    try {
      if (contract && id) {
        setEventId(id)                                                          //setting Event id
        const valueAll = await contract.eventURI(id).call()                     //Getting event URI from smart contract
        const value = valueAll[1]

        const arr = []
        const totalTokens = await contract.gettokenSearchEventTotal(id).call()  //Getting total NFTs of that event
        let totalEarned = await contract.getEventRaised(Number(id)).call()
        console.log(totalEarned)
        for (let i = 0; i < totalTokens.length; i++) {                          //Getting total 10 NFTs
          const obj = await totalTokens[i]

          let object = {}
          try {
            object = await JSON.parse(obj)
          } catch { }
          if (object.title) {
            var pricedes1 = 0
            try {
              pricedes1 = formatter.format(
                Number(object.properties.price.description * 5.51),
              )                                                                 //Bid price in comma version
            } catch (ex) { }
            const TokenId = Number(await contract.gettokenIdByUri(obj).call()) //Getting NFT id from NFT URI

            arr.push({
              Id: TokenId,
              name: object.properties.name.description,
              description: object.properties.description.description,
              Bidprice: pricedes1,
              highestbidder: object.properties.higherbidadd.description,
              price: Number(object.properties.price.description),
              type: object.properties.typeimg.description,
              image: object.properties.image.description
            })
          }
        }

        EventEnd = valueAll[2];
        //Setting these data into variables
        setList(arr)
        if (document.getElementById('Loading'))
          document.getElementById('Loading').style = 'display:none'

        const object = JSON.parse(value)
        setimageList(object.properties.allFiles)
        setTitle(object.properties.Title.description)
        setselectedAddress(object.properties.wallet.description)
        setgoal(Number(object.properties.Goal.description))
        setEventEarned(formatter.format(Number(totalEarned)))
        setEventDescription(object.properties.Description.description)
        setEventWallet(object.properties.wallet.description)
        setSelectedendDate(object.properties.Date.description)
        setdate(object.properties.Date.description)
        setdateleftBid(LeftDateBid(object.properties.Date.description))

        console.log(object.properties.wallet.description )
        //Checking if the event manager has to distribute NFT or not
        var c = new Date(object.properties.Date.description).getTime()
        var n = new Date().getTime()
        var d = c - n
        var s = Math.floor((d % (1000 * 60)) / 1000)
        if (s.toString().includes('-') && object.properties.wallet.description === signerAddress && valueAll[2] !== "Finished") {
          EventWaiting = true;
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  setInterval(function () {
    calculateTimeLeft()
  }, 1000)

  function calculateTimeLeft() {                        //Calculating time left
    try {
      var allDates = document.getElementsByName('dateleft')
      for (let i = 0; i < allDates.length; i++) {
        var date = allDates[i].getAttribute('date')
        allDates[i].innerHTML = LeftDate(date)
      }
      var allDates = document.getElementsByName('date')
      for (let i = 0; i < allDates.length; i++) {
        var date = allDates[i].getAttribute('date')
        allDates[i].innerHTML = LeftDateBid(date)
      }
    } catch (error) { }
  }

  function activateViewBidModal(e) {                    //Activating view bid Modal
    setselectid(e.target.getAttribute('tokenid'))
    setselecttitle(e.target.getAttribute('title'))

    setViewModalShow(true)
  }

  function activateBidNFTModal(e) {                     //Activating Bid NFT Modal
    setselectid(e.target.getAttribute('tokenid'))
    setselectbid(e.target.getAttribute('highestbid'))
    console.log(selectbid)
    setselecttype('NFT')
    setModalShow(true)
  }
  function activateDonateNFTModal(e) {                  //Activating Donate NFT Modal
    setDonateModalShow(true)
  }
  function activateDirectDonateModal(e) {               //Activating Direct Donate Modal
    setDirectModalShow(true)
  }

  async function distributeNFTs(e) { //Distributte NFTs funciton
    var distributeNFTBTN = document.getElementById('distributeNFTBTN');
    distributeNFTBTN.disabled = true;
    try {
      await contract
        .DistributeToken(eventId)
        .send({
          from: signerAddress,
          gasPrice: 1000000000,
          gas: 5_000_000,
        })

    } catch (error) {
      console.error(error)
    }
window.location.reload()
  }

  return (
    <><>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>

      <div className="p-campaign" data-view-id="pg_donate_index">
        <div className="p-campaign-collage color-background-blue">
          <SlideShow images={imageList} />
        </div>
        <header className="mb-2 p-campaign-header">
          <h1 className="mb-0 a-campaign-title">{title}</h1>
          <a className="fs-6 a-campaign-title" href={`/user/` + EventWallet} >{EventWallet}</a>
        </header>
        <div className="p-campaign-sidebar">
          <aside className="o-campaign-sidebar">
            <div className="o-campaign-sidebar-wrapper">
              <div className="o-campaign-sidebar-progress-meter m-progress-meter">
                <progress className="a-progress-bar a-progress-bar--green" max='100' value={(EventEarned * 100) / goal} />
                <h2 className="m-progress-meter-heading">
                  {EventEarned}
                  <span className="text-stat text-stat-title">
                    cEUR raised of {goal} cEUR goal
                  </span>
                </h2>
              </div>
              {window.localStorage.getItem('Type') == '' || window.localStorage.getItem('Type') == null || window.localStorage.getItem('Type') == 'manager' ? (<>
                {(EventWaiting === true && EventEnd !== "Finished") ? (<>
                  <div className="p-campaign-share-donate-buttons">
                    <a id="distributeNFTBTN" onClick={distributeNFTs} className="p-campaign-share-button-exp mb2x m-auto hrt-gradient-button hrt-gradient-button--gradient-orange hrt-gradient-button--full hrt-gradient-button--shadow hrt-base-button" data-element-id="btn_donate" data-analytic-event-listener="true"  >
                      <span className="hrt-gradient-button-text">
                        Distribute NFTs to highest bidders
                      </span>
                    </a>
                  </div>
                </>) : (<></>)}</>
              ) : (
                <><div className="p-campaign-share-donate-buttons">
                  <a className="p-campaign-share-button-exp mb2x m-auto hrt-gradient-button hrt-gradient-button--gradient-orange hrt-gradient-button--full hrt-gradient-button--shadow hrt-base-button" data-element-id="btn_donate" data-analytic-event-listener="true" onClick={activateDonateNFTModal} >
                    <span className="hrt-gradient-button-text">
                      Donate NFT
                    </span>
                  </a>
                </div>
                  <div className="p-campaign-share-donate-buttons">
                    <a className="p-campaign-share-button-exp mb2x m-auto hrt-gradient-button hrt-gradient-button--gradient-orange hrt-gradient-button--full hrt-gradient-button--shadow hrt-base-button" data-element-id="btn_donate" data-analytic-event-listener="true" onClick={activateDirectDonateModal} >
                      <span className="hrt-gradient-button-text">
                        Donate Coin
                      </span>
                    </a>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
        <div className="p-campaign-description" style={{ gridArea: 'description' }}>
          <div className="m-campaign-byline">
            <div className="m-campaign-byline-members">
              <ul className="list-unstyled hrt-avatar-stack m-campaign-byline-avatar-stack" />
              <div className="o-campaign-description" >
                Description
              </div>
            </div>
          </div>
          <div className="mb-0 mt-1 hrt-rule hrt-rule--horizontal" />
          <div
            className="o-campaign-description position-relative mt-3">
            <div className="o-campaign-story mt3x">{EventDescription}</div>
          </div>
        </div>
      </div>
      <div className="auction NFTs-container">
        {list.map((listItem) => (
          <div key={listItem.Id} className="row auction ElementsContainer">
            <div className="auction NFt-contain">
              <img src={listItem.image} className="auction AuctionBidImage" />
              <div className='w-100 d-flex h-100 p-0 position-relative flex-column justify-content-around'>
                <div className="DetialsContainer" >
                  <h6 className="Auction NFT-title">{listItem.name}</h6>
                  <div className="TextContainer">
                    <h6 className="Auction NFT-Description" style={{ color: '#8B8B8B' }}>
                      {listItem.description}
                    </h6>
                  </div>
                  <div style={{ fontWeight: '600', color: '#8B8B8B' }}>
                    Highest Bidder:
                    <a className="Auction text-primary ms-1" href={`/user/${listItem.highestbidder}`} >
                      {listItem.highestbidder}
                    </a>
                  </div>
                </div>

                <div className='d-flex flex-column m-3'>
                  <h6 className="Auction Grey-text smallgrey">Current bid</h6>
                  <h6 className="Auction priceText bidprice">
                    {listItem.price} cEUR
                  </h6>
                  <h6 name="date" date={date} className="Auction Grey-text smallgrey">
                    {dateleftBid}
                  </h6>
                </div>
                <div className="Auction ElementBottomContainer">
                  <div className="BidAllcontainer">
                    <div className="Bidsbutton">
                      <div tokenid={listItem.Id} title={listItem.name} onClick={activateViewBidModal} className="Bidcontainer col">
                        <div tokenid={listItem.Id} title={listItem.name} className="card BidcontainerCard">
                          <div tokenid={listItem.Id} title={listItem.name} className="align-items-center d-flex donation event-BTN  justify-content-center p-0 text-center bidbuttonText">
                            View
                          </div>
                        </div>
                      </div>

                      {window.localStorage.getItem('Type') == '' ||
                        window.localStorage.getItem('Type') == null ||
                        window.localStorage.getItem('Type') == 'manager' ? (
                        <></>
                      ) : (
                        <>
                          <div tokenid={listItem.Id} highestbid={listItem.price} onClick={activateBidNFTModal} className="Bidcontainer col" >
                            <div tokenid={listItem.Id} highestbid={listItem.price} className="card BidcontainerCard">
                              <div tokenid={listItem.Id} highestbid={listItem.price} className="align-items-center d-flex donation event-BTN  justify-content-center p-0 text-center bidbuttonText" >
                                Bid
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BidNFTModal //Showing Bid NFT Modal
        show={modalShow}
        onHide={() => {
          setModalShow(false)
          fetchContractData()
        }}
        contract={contract}
        tokenId={selectid}
        senderAddress={signerAddress}
        toAddress={selectedAddress}
        type={selecttype}
        eventId={eventId}
        Highestbid={selectbid} />

      <ViewBidNFTModal //Showing View Bid NFT Modal
        show={ViewmodalShow}
        onHide={() => {
          setViewModalShow(false)
          fetchContractData()
        }}
        id={selectid}
        title={selecttitle} />
      <DonateNFTModal //Showing Donate NFT Modal
        show={DonatemodalShow}
        onHide={() => {
          setDonateModalShow(false)
        }}
        contract={contract}
        senderAddress={signerAddress}
        EventID={eventId}
        type={'NFT'}
        SelectedTitle={title}
        enddate={SelectedendDate}
        EventWallet={EventWallet} />
      <DirectDonateModal //Showing Direct Donate Modal
        show={DirectModalShow}
        onHide={() => {
          setDirectModalShow(false)
        }}
        eventId={eventId}
        contract={contract}
        senderAddress={signerAddress}
        EventWallet={EventWallet} /></>
    </>
  )
}
