import React from 'react'
import { ConnectButton } from 'thirdweb/react'
import { client } from '../client'


const WalletConnect = () => {

      
  return (
    <ConnectButton client={client} theme={'dark'} />
)
}

export default WalletConnect