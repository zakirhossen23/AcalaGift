import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import UseFormInput from '../UseFormInput'
import Web3 from 'web3'

export default function BidNFTModal({
  show,
  onHide,
  contract,
  senderAddress,
  tokenId,
  eventId,
  toAddress,
  type,
  Highestbid,
}) {
  //Variables
  const [Alert, setAlert] = useState('')
  const Web3 = require('web3')

  const sleep = (milliseconds) => {
    //Custom Sleep function to wait
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
  }

  //Input fields
  const [Amount, AmountInput] = UseFormInput({
    type: 'text',
    placeholder: 'Amount',
  })

  function activateWarningModal(TextAlert) {
    //Activating Warning Text
    var alertELM = document.getElementById('alert')
    alertELM.style = 'contents'
    setAlert(TextAlert)
  }
  function activateWorkingModal(TextAlert) {
    //Activating Working Text
    var alertELM = document.getElementById('workingalert')
    alertELM.style = 'contents'
    setAlert(TextAlert)
  }

  async function bidNFT() {
    //Bid NFT function

    var BidNFTBTN = document.getElementById('bidNFTBTN')
    BidNFTBTN.disabled = true
    if (Number(Amount) < Number(Highestbid)) {
      // If given bid price is less than highest bid
      activateWarningModal(`Amount cannot be under ${Highestbid} cEUR`)
      return
    } else {
      var alertELM = document.getElementById('alert')
      alertELM.style.display = 'none'
    }
    try {
      activateWorkingModal('Bidding....') // If bid continue then Bidding aleart showed up

      const web3 = new Web3(window.ethereum)
      const account = await web3.eth.getAccounts();
      let AmountinFull = (
        Number(Amount) * 1000000000000000000
      ).toLocaleString('fullwide', { useGrouping: false }) //Multipling given bid price with 1E18
      activateWorkingModal('A moment please')

      const transaction = {
        from: account[0],
        to: toAddress,
        value: AmountinFull,
        gasPrice: 1000000000,
        gas: 5_000_000,
      }

      await web3.eth.sendTransaction(transaction) //Sending metamask confirmation

      activateWorkingModal('Done! Adding into EVM...')

      const tokenUri = await contract.tokenURI(tokenId).call()
      var parsed = await JSON.parse(tokenUri)
      if (
        Number(parsed['properties']['price']['description']) < Number(Amount)
      ) {
        parsed['properties']['price']['description'] = Amount
        parsed['properties']['higherbidadd']['description'] = senderAddress
      }
      let currentDate = new Date()
      const createdObject = {
        title: 'Asset Metadata Bids',
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: senderAddress,
          },
          bid: {
            type: 'string',
            description: Amount,
          },
          time: {
            type: 'string',
            description: currentDate,
          },
        },
      }
      activateWorkingModal('Please confirm creating Bid...')
      const totalraised = await contract.getEventRaised(Number(eventId)).call()
      let Raised = 0
      Raised = Number(totalraised) + Number(Amount)
      const result2 = await contract
        .createBid(
          tokenId,
          JSON.stringify(createdObject),
          JSON.stringify(parsed),
          senderAddress,
          eventId,
          Raised.toString(),
        )
        .send({
          from: account[0],
          gasPrice: 1000000000,
          gas: 5_000_000,
        })

      activateWorkingModal('Success!')
      window.document.getElementsByClassName('btn-close')[0].click()
      BidNFTBTN.disabled = false
      await sleep(200)
      window.location.reload()
    } catch (e) {
      console.error(e)
      activateWarningModal(`Error! Please try again!`)
      var alertELM = document.getElementById('workingalert')
      alertELM.style.display = 'none'
      return
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Bid NFT</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Form>
          <div id="alert" style={{ display: 'none', fontSize: '30px' }}
            className="alert alert-danger"
            role="alert"
          >
            {Alert}
          </div>
          <div
            id="workingalert"
            style={{ display: 'none', fontSize: '30px' }}
            className="alert alert-success"
            role="alert"
          >
            {Alert}
          </div>
          <Form.Group className="mb-3" controlId="formGroupName">
            <Form.Label>Bid Amount in cEUR</Form.Label>
            {AmountInput}
          </Form.Group>
          <div className="d-grid">
            <Button variant="primary" id="bidNFTBTN" onClick={bidNFT}>
              Bid NFT
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
