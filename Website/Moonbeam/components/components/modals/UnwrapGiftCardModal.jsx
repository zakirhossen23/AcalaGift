import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import UseFormInput from '../UseFormInput'
import Web3 from 'web3'


export default function UnwrapGiftCardModal({
  show,
  onHide,
  contract,
  TokenID,
  EventID,
}) {

  //Variables
  const [TokenURI, setTokenURI] = useState({
    name: "",
    image: "",
    price: "",
    higherbidder: "",
  })
  const [GiftURI, setGiftURI] = useState({
    Message: "",
    FontType: "",
    NameUser: "",
    Wallet: ""
  })
  const [RecipientAdd, setRecipientAdd] = useState('')
  const [NameUser, setNameUser] = useState('Write your name')
  const [Message, setMessage] = useState('(Write your message)')
  const [FontType, setFontType] = useState('')
  const Web3 = require('web3')

  const sleep = (milliseconds) => {
    //Custom Sleep function to wait
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
  }

  async function FecthNFTinfo() {

    const tokeninfo = await contract.tokenURI(Number(TokenID)).call();
    var value = JSON.parse(tokeninfo);
    setTokenURI({
      name: value.properties.name.description,
      image: value.properties.image.description,
      price: value.properties.price.description,
      higherbidder: value.properties.higherbidadd.description
    })

    const giftinfo = await contract.GetGiftURIFromToken(TokenID.toString()).call();
    var value = JSON.parse(giftinfo);
    setGiftURI({
      Message: value.Message,
      FontType: value.FontType,
      NameUser: value.NameUser,
      Wallet: value.Wallet
    })

  }

  async function UnwrapGiftCard() {
    //Unwrap Gift Card function
    var unwrapGiftBTN = document.getElementById('unwrapGiftBTN')
    unwrapGiftBTN.disabled = true

    try {
      const web3 = new Web3(window.ethereum)
      const account = await web3.eth.getAccounts();


      await contract
        .UnWrapGift(
          TokenID.toString()
        )
        .send({
          from: window.ethereum.selectedAddress,
          gasPrice: 1000000000,
          gas: 5_000_000,
        })

      window.document.getElementsByClassName('btn-close')[0].click()
      unwrapGiftBTN.disabled = false
      await sleep(200)
      window.location.reload()
    } catch (e) {
      console.error(e)
    }
    unwrapGiftBTN.disabled = false;
  }

  return (
    <Modal
      show={show}
      onShow={FecthNFTinfo}
      onHide={onHide}
      dialogClassName="modal-50w"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Unwrap Gift Card</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-3 modal-body">

        <div className="d-flex justify-content-center">
          <div style={{ width: 400, height: 220 }} className="position-relative">
          <div style={{ backgroundColor: '#212529',color: 'white',borderRadius: '10px' }} className="d-flex h-100 justify-content-sm-around w-100">
                <div style={{ width: 238, padding: "13px 0 0 13px" }} className="d-block position-relative">

                <div className='d-flex flex-column h-75 justify-content-center'>
                  <small style={{ fontFamily: FontType }} className={(FontType === "Tangerine, cursive") ? "fs-4" : ""}>
                    You have given {TokenURI.price}
                  </small>
                  <small style={{ fontFamily: FontType }} className={(FontType === "Tangerine, cursive") ? "fs-4" : ""}>
                    {GiftURI.Message}
                  </small>
                </div>
                <div style={{ bottom: 9, width: 225 }} className="align-items-center d-flex flex-column position-absolute">
                  <small style={{ bottom: 20, padding: 0, fontSize: "0.8rem", lineHeight: "1.57", letterSpacing: "0.00714em" }} className="fw-bold text-center text-muted">
                    {GiftURI.NameUser}
                  </small>
                  <small
                    style={{ bottom: 20, fontFamily: 'calibri', letterSpacing: "0.00938em", color: "rgb(158, 158, 158)", textAlign: "center", fontSize: "0.5rem" }} className="fw-bolder lh-base m-0 text-center">
                    {TokenURI.higherbidder}
                  </small>
                </div>
              </div>
              <div style={{ width: 160 }} className="align-items-center d-flex flex-column justify-content-center">
                <img src={TokenURI.image} style={{ width: 160, height: 160, fontFamily: FontType }} className="rounded-circle" />
                <small className="balance-amount fs-6">{TokenURI.name}</small>
              </div>
            </div>
          </div>
        </div>

        <div className="d-grid ">
          <Button variant="primary" id="unwrapGiftBTN" onClick={UnwrapGiftCard}>
            Unwrap Gift Card
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
