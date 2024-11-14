import React from 'react';

interface EvmAddressProps {
  address: string;
  explorerUrl?: string;
}

const EvmAddress: React.FC<EvmAddressProps> = ({ address, explorerUrl }) => {
    const explorerLink = explorerUrl || `https://sepolia.etherscan.io/address/${address}`;

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
