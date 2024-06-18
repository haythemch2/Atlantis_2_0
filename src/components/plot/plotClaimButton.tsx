import React, { useMemo } from 'react';
import { TransactionButton } from 'thirdweb/react';
import { mintPlot } from '../../utils/contractUtils';
import { AtlantisContract } from '../../utils/client';
import MintIcon from '../../common/MintIcon';
import { saveJsonDataInIpfs } from '../../utils/plotUtils';

interface PlotClaimButtonProps {
  plotX: number;
  plotY: number;
  isSelectedPlotOwned: boolean;
  isVerifyingOwnership: boolean;
  ownerAddress: string;
}

const PlotClaimButton: React.FC<PlotClaimButtonProps> = ({ plotX, plotY, isSelectedPlotOwned, isVerifyingOwnership, ownerAddress }) => {
  const customTransactionBtnStyle = useMemo(() => {
    const style: React.CSSProperties = {
      width: '8rem',
      height: '8rem',
    };
    return style;
  }, []);

  return (
    <TransactionButton
      style={customTransactionBtnStyle}
      disabled={isSelectedPlotOwned || isVerifyingOwnership}
      transaction={async () => {
        const uri = await saveJsonDataInIpfs(plotX, plotY, ownerAddress);
        console.log(uri);
        
        const tx = mintPlot({
          contract: AtlantisContract,
          x: BigInt(plotX),
          y: BigInt(plotY),
          fullURI: uri,
        });

        return tx;
      }}
      onTransactionSent={(result) => {
        console.log("Transaction submitted", result.transactionHash);
      }}
      onTransactionConfirmed={(receipt) => {
        console.log("Transaction confirmed", receipt.transactionHash);
      }}
      onError={(error) => {
        console.error("Transaction error", error);
      }} >
        <div className='flex flex-col justify-center items-center'>
          <MintIcon width='4rem' height='4rem' fill={isSelectedPlotOwned ? 'black' : 'green'} />
          <h1 className="mt-2">Claim</h1>
        </div>
    </TransactionButton>
  );
};

export default PlotClaimButton;
