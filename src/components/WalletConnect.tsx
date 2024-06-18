import { ConnectButton } from 'thirdweb/react'
import { client } from '../utils/client'


const WalletConnect = () => {
  return (
    <ConnectButton client={client} theme={'dark'} />
)
}

export default WalletConnect