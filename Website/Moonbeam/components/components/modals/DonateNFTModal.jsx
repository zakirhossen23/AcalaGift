import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import UseFormInput from '../UseFormInput'
import { useRouter } from 'next/router'
import Web3 from 'web3'
export default function DonateNFTModal({
  show,
  onHide,
  contract,
  senderAddress,
  type,
  EventID,
  SelectedTitle,
  enddate,
  EventWallet,
}) {
  //Input fields
  const [name, nameInput] = UseFormInput({
    type: 'text',
    placeholder: 'Enter name',
  })
  const [description, descriptionInput] = UseFormInput({
    as: 'textarea',
    placeholder: 'Enter description',
  })
  const [url, urlInput] = UseFormInput({
    type: 'text',
    placeholder: 'Enter image url',
  })

  const [price, priceInput] = UseFormInput({
    type: 'text',
    placeholder: 'Enter Price',
  })
  const [NFTaddress, NFTaddressInput] = UseFormInput({
    type: 'text',
    placeholder: 'Enter NFT address',
  })

  async function createNFT() {
    //donate button click function
    let Logourl = url
    var tokenAddress = NFTaddress

    //Creating an Object of all informations
    const createdObject = {
      title: 'Asset Metadata',
      type: 'object',
      properties: {
        eventID: EventID,
        name: {
          type: 'string',
          description: name,
        },
        description: {
          type: 'string',
          description: description,
        },
        image: {
          type: 'string',
          description: Logourl,
        },
        price: {
          type: 'string',
          description: price,
        },
        typeimg: {
          type: 'string',
          description: type,
        },
        nftaddress: {
          type: 'string',
          description: tokenAddress,
        },
        higherbidadd: {
          type: 'string',
          description: EventWallet,
        },
        date: {
          type: 'string',
          description: enddate,
        },
        wallet: {
          type: 'string',
          description: EventWallet,
        },
      },
      bids: [],
    }


    const web3 = new Web3(window.ethereum)
    const account = await web3.eth.getAccounts();

    //Calling smart contract method(functon) to store in to EVM
    const result = await contract
      .claimToken(
        window.ethereum.selectedAddress,
        JSON.stringify(createdObject),
        EventID,
      )
      .send({
        from: window.ethereum.selectedAddress,
        gasPrice: 1000000000,
        gas: 5_000_000,
      })
    await window.document.getElementsByClassName('btn-close')[0].click()
    window.location.href = `/donation/auction?[${EventID}]` //Going to that event auction page
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      size="xxl"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Donate {type} - {SelectedTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Form>
          <Form.Group className="mb-3" controlId="formGroupName">
            <Form.Label>Name</Form.Label>
            {nameInput}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupDescription">
            <Form.Label>Description</Form.Label>
            {descriptionInput}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupName">
            <Form.Label>Opening price in aUSD</Form.Label>
            {priceInput}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupImageUrl">
            <Form.Label>Enter image URL</Form.Label>
            {urlInput}
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" onClick={createNFT}>
              Donate {type}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
