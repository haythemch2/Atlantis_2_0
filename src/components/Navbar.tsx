import WalletConnect from './WalletConnect'

const Navbar = () => {
  return (
<div className="navbar bg-neutral text-neutral-content">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">Atlantis 2.0</a>
  </div>
  <div className="flex-none">
    <WalletConnect />
  </div>
</div>  )
}

export default Navbar