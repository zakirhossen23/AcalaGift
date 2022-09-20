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
    DonateBTN.disabled = true;

    try {
      activateWorkingModal("Transferring....")
      const Web3 = require("web3")
      const web3 = new Web3(window.ethereum)
      const account = await web3.eth.getAccounts();
      let AmountinFull = (Number(Amount) * 1000000000000000000).toLocaleString('fullwide', { useGrouping: false });
      console.log("Donating")

      const ABI = [
        {
          "constant": true,
          "inputs": [
            {
              "name": "_to",
              "type": "address"
            },
            {
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "name": "success",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      const address = '0x0000000000000000000100000000000000000001'; //Chainlink contract link
      const contract2 = new web3.eth.Contract(ABI, address);
      await contract2.methods.transfer(EventWallet, (AmountinFull)).send({ from: window.ethereum.selectedAddress, gasPrice: 10000000000, gasLimit: 400000 });


      
      const Raised = Number(await contract.getEventRaised(eventId).call()) + Number(Amount);
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
            <Form.Label>Amount in aUSD</Form.Label>
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
