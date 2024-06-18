import React from 'react';

interface EvmAddressProps {
  address: string;
  explorerUrl?: string; // Optional prop to customize the explorer URL
}

const EvmAddress: React.FC<EvmAddressProps> = ({ address, explorerUrl }) => {
  // Default to Etherscan if no explorer URL is provided
  const explorerLink = explorerUrl || `https://sepolia.etherscan.io/address/${address}`;

  // Function to shorten the address for display
  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="inline-block p-2">
      <a
        href={explorerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline"
      >
        {shortenAddress(address)}
      </a>
    </div>
  );
};

export default EvmAddress;
