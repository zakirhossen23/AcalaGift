import React from 'react'
import { Header } from '../../components/layout/Header'
import Head from 'next/head'
import isServer from '../../components/isServer'
export default function Login() {
  if (isServer()) return null
  //Getting url redirecting link from url
  const regex = /\[(.*)\]/g
  const str = decodeURIComponent(window.location.search)
  let m
  let redirecting = ''
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    redirecting = m[1]
  }

  async function TypeSet(e) {                           //Setting Type (manager/donator)
    window.localStorage.setItem('Type', e.target.getAttribute('type'))
    await onClickConnect()
    window.location.href = redirecting
  }
  //Connecting with metamask
  async function onClickConnect() {                     //Connecting with metamask
    let result = await window.ethereum.request({ method: 'eth_requestAccounts' });
    result;
    try {
        const getacc = await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaef3', }], //44787
        });
        getacc;
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0xaef3', //44787
                            chainName: 'Alfajores Acala testnet',
                            nativeCurrency: {
                                name: 'CELO',
                                symbol: 'CELO',
                                decimals: 18,
                            },
                            rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
                        },
                    ],
                });
            } catch (addError) {
                // handle "add" error
                console.log(addError);
            }
        }
        // handle other "switch" errors
    }
    window.localStorage.setItem('ConnectedMetaMask', 'true')
  }
  function EventManger() {                             //Event Manager Button
    if (window.localStorage.getItem('Type') == 'manager') {
      return (
        <>
          <div
            type="manager"
            onClick={TypeSet}
            className="Login eventManagerButton active"
          >
            <span type="manager" >
              Manager
            </span>
          </div>
        </>
      )
    }
    return (
      <>
        <div
          type="manager"
          onClick={TypeSet}
          className="Login eventManagerButton"
        >
          <span type="manager" >
            Manager
          </span>
        </div>
      </>
    )
  }
  function DonatorType() {                             //Donator Button
    if (window.localStorage.getItem('Type') == 'Donator') {
      return (
        <>
          <div
            type="Donator"
            onClick={TypeSet}
            className="Login userButton active"
          >
            <span type="Donator" style={{ color: 'white' }}>
              Donator
            </span>
          </div>
        </>
      )
    }
    return (
      <>
        <div type="Donator" onClick={TypeSet} className="Login userButton">
          <span type="Donator" style={{ color: 'white' }}>
            Donator
          </span>
        </div>
      </>
    )
  }
  return (
    <>
      <>
        <Head>
          <title>Login</title>
          <meta name="description" content="AcalaGift - Login" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header></Header>
        <div className="Login h-100 row">
          <div className="Login col">
            <div className='Login-Parent-Container'>
              <div className="Login-container">
                <div className='d-flex h-50 justify-content-center mb-2'>
                  <h1 className='mb-1 text-center'>Login</h1>
                </div>
                <div className='align-items-lg-baseline d-flex gap-4 h-100 justify-content-end mx-1'>
                  <EventManger />
                  <DonatorType />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  )
}
