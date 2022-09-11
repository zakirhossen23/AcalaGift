import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import UseFormInput from '../UseFormInput'

export default function DirectDonateModal({
  show,
  onHide,
  eventId,
  contract,
  senderAddress,
  EventWallet,
}) {
  const [Alert, setAlert] = useState('')

  const Web3 = require('web3')

  const sleep = (milliseconds) => {
    //Custom sleep(n) code
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
  }

  const [Amount, AmountInput] = UseFormInput({
    //Input field
    type: 'number',
    placeholder: 'Amount',
  })

  function activateWarningModal(TextAlert) {
    //Changing Warning Alert box text
    var alertELM = document.getElementById('alert')
    alertELM.style = 'contents'
    setAlert(TextAlert)
  }
  function activateWorkingModal(TextAlert) {
    //Changing Success Alert box text
    var alertELM = document.getElementById('workingalert')
    alertELM.style = 'contents'
    setAlert(TextAlert)
  }

  async function DonateCoin() {
    //Donate button function
    var DonateBTN = document.getElementById("DonateBTN");
    var SelectCoin = document.getElementById("stablecoin");
    DonateBTN.disabled = true;

    try {
      activateWorkingModal("Transferring....")
      const Web3 = require("web3")
      const ContractKit = require('@celo/contractkit')
      const web3 = new Web3(window.ethereum)
      const kit = ContractKit.newKitFromWeb3(web3)

      let celotoken = await kit.contracts.getGoldToken();
      let cUSDtoken = await kit.contracts.getStableToken();
      let cEURtoken = await kit.contracts.getStableToken("cEUR");
      let convertedDefaultAmount = Number(Amount);
      let AmountinFull = (Number(Amount) * 1000000000000000000).toLocaleString('fullwide', { useGrouping: false });
      console.log("Donating")
      if (SelectCoin.value == "CELO") {
        let celotx = await celotoken
          .transfer(EventWallet, AmountinFull)
          .send({ from: senderAddress, gas: 2100000, gasPrice: 10000000000 });
        let celoReceipt = await celotx.waitReceipt();
        convertedDefaultAmount = convertedDefaultAmount / 1.3258
      }
      if (SelectCoin.value == "cEUR") {
        let cEURtx = await cEURtoken
          .transfer(EventWallet, AmountinFull)
          .send({ from: senderAddress, gas: 2100000, gasPrice: 10000000000 });
        let cEURReceipt = await cEURtx.waitReceipt();

      }
      if (SelectCoin.value == "cUSD") {
        let cUSDtx = await cUSDtoken
          .transfer(EventWallet, AmountinFull)
          .send({ from: senderAddress, gas: 2100000, gasPrice: 10000000000 });
        let cUSDReceipt = await cUSDtx.waitReceipt();
        convertedDefaultAmount = convertedDefaultAmount / 1.0431
      }
      const Raised = Number(await contract.getEventRaised(eventId).call()) + Number(convertedDefaultAmount);
      activateWorkingModal("Done! Please confirm Updating Raised...")

      await contract							//Resending updating Raised 
        ._setEventRaised(Number(eventId), Raised.toString())
        .send({
          from: window.ethereum.selectedAddress,
          gasPrice: 1000000000,
          gas: 5_000_000,
        })

      activateWorkingModal('Success!')
      window.document.getElementsByClassName('btn-close')[0].click()
      DonateBTN.disabled = false
      await sleep(200)
      window.location.reload()
    } catch (e) {
      //Got error
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
        <Modal.Title id="contained-modal-title-vcenter">
          Donate Coin
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Form>
          <div id="alert" style={{ display: 'none', fontSize: '30px' }} className="alert alert-danger" role="alert">
            {Alert}
          </div>
          <div id="workingalert" style={{ display: 'none', fontSize: '30px' }} className="alert alert-success" role="alert" >
            {Alert}
          </div>
          <Form.Group className="mb-3" controlId="formGroupName">
            <Form.Label>Stablecoin</Form.Label>
            <Form.Select id='stablecoin' className='w-100 form-control' autocomplete="off" style={{ "appearance": "auto" }}>
              <option selected value="CELO">CELO</option>
              <option value="cEUR">cEUR</option>
              <option value="cUSD">cUSD</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupName">
            <Form.Label>Amount</Form.Label>
            {AmountInput}
          </Form.Group>
          <div className="d-grid">
            <Button variant="primary" id="DonateBTN" onClick={DonateCoin}>
              Donate
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
