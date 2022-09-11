import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import UseFormInput from '../UseFormInput'
import Web3 from 'web3'


export default function SendAsGiftCardModal({
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
    console.log(TokenID)
    const tokeninfo = await contract.tokenURI(Number(TokenID)).call();
    var value = JSON.parse(tokeninfo);
    setTokenURI({
      name: value.properties.name.description,
      image: value.properties.image.description,
      price: value.properties.price.description,
      higherbidder: value.properties.higherbidadd.description
    })

  }

  async function SendGiftCard() {
    //Send Gift Card function
    var sendGiftBTN = document.getElementById('sendGiftBTN')
    sendGiftBTN.disabled = true

    try {
      const web3 = new Web3(window.ethereum)
      const account = await web3.eth.getAccounts();

      const createdObject = {
        Message: Message,
        FontType: FontType,
        NameUser: NameUser,
        Wallet:account[0]
      }

      await contract
        .createTokenGift(
          TokenID.toString(),
          RecipientAdd,
          JSON.stringify(createdObject)
        )
        .send({
          from: account[0],
          gasPrice: 1000000000,
          gas: 5_000_000,
        })

      window.document.getElementsByClassName('btn-close')[0].click()
      sendGiftBTN.disabled = false
      await sleep(200)
      window.location.reload()
    } catch (e) {
      console.error(e)
    }
    sendGiftBTN.disabled = false;
  }

  return (
    <Modal
      show={show}
      onShow={FecthNFTinfo}
      onHide={onHide}
      size='lg'
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Send As Gift Card</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid d-flex">

        <div className="d-flex">
          <div style={{ width: 400, height: 220 }} className="position-relative">
            <div style={{ backgroundColor: '#212529',color: 'white',borderRadius: '10px' }} className="d-flex h-100 justify-content-sm-around w-100">
              <div style={{ width: 238, padding: "13px 0 0 13px" }} className="d-block position-relative">

                <div className='d-flex flex-column h-75 justify-content-center'>
                  <small style={{ fontFamily: FontType }} className={(FontType === "Tangerine, cursive") ? "fs-4" : ""}>
                    You have given {TokenURI.price} cEUR
                  </small>
                  <small style={{ fontFamily: FontType }} className={(FontType === "Tangerine, cursive") ? "fs-4" : ""}>
                    {Message}
                  </small>
                </div>
                <div style={{ bottom: 9, width: 225 }} className="align-items-center d-flex flex-column position-absolute">
                  <small style={{ bottom: 20, padding: 0, fontSize: "0.8rem", lineHeight: "1.57", letterSpacing: "0.00714em" }} className="fw-bold text-center text-muted">
                    {NameUser}
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


        <Form className='ps-3 w-100'>

          <Form.Group className="mb-1">
            <input placeholder="Recipient Address" type="text" onChange={(e) => { setRecipientAdd(e.target.value) }} id="recipientBOX" className="form-control rounded-0" />
          </Form.Group>
          <Form.Group className="mb-1">
            <textarea placeholder="Write your message" onChange={(e) => { setMessage(e.target.value) }} type="text" id="MessageBOX" className="form-control rounded-0" rows="3" />
          </Form.Group>
          <Form.Group className="mb-1">
            <select placeholder="Choose Font Family" className='form-control rounded-0' onChange={(e) => { setFontType(e.target.value) }} style={{ fontFamily: FontType, appearance: 'auto'}}>
              <option value="">Choose Font....</option>
              <option value="Arial" style={{ 'fontFamily': "Arial" }}>Arial</option>
              <option value="Calibri" style={{ 'fontFamily': "Calibri" }}>Calibri</option>
              <option value="Tangerine, cursive" style={{ 'fontFamily': "Tangerine, cursive" }}>Tangerine, cursive</option>
              <option value="Times new roman" style={{ 'fontFamily': "Times new roman" }}>Times new roman</option>
            </select>
          </Form.Group>
          <Form.Group className="mb-3">
            <input placeholder="Write your name" onChange={(e) => { setNameUser(e.target.value) }} type="text" id="NameBOX" className="form-control rounded-0" />
          </Form.Group>
          <div className="d-grid">
            <Button variant="primary" id="sendGiftBTN" onClick={SendGiftCard}>
              Send your Gift Card
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
