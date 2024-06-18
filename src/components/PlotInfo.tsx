import React, { useEffect, useMemo, useState } from 'react';
// import world from '../assets/worldSprite.png';
import { doesPlotExist, getPlotURI, mintPlot } from '../thirdweb/11155111/0x9396ee067189be46f42ca8c3fb88d9a32e027812';
import { AtlantisContract, client } from '../client';
import { TransactionButton, useActiveAccount, useReadContract } from 'thirdweb/react';
import { download, upload } from 'thirdweb/storage';
import PlotMetadata from './PlotMetadata';
import MintIcon from './MintIcon';

export interface PlotData {
  plotX: number;
  plotY: number;
  tokenAddress: string;
  ownerAddress: string;
  metadata: Metadata;
}

interface Metadata {
  name: string;
  description: string;
  edition: string;
}

interface PlotInfoProps {
  plotX: number,
  plotY: number,
}

const PlotInfo = ({ plotX, plotY }: PlotInfoProps) => {
  const { data: isSelectedPlotOwned, isLoading: isVerifyingOwnership } = useReadContract(doesPlotExist, {
    contract: AtlantisContract,
    x: BigInt(plotX),
    y: BigInt(plotY),
  });

  const { data: selectedPlotUri, isLoading: isLoadingSelectedPlotUri } = useReadContract(getPlotURI, {
    contract: AtlantisContract,
    x: BigInt(plotX),
    y: BigInt(plotY),
  });

  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);
  const activeAccount = useActiveAccount();

  const saveJsonDataInIpfs = async (): Promise<string> => {
    const plotJsonData: PlotData = {
      plotX: plotX,
      plotY: plotY,
      tokenAddress: AtlantisContract.address,
      ownerAddress: activeAccount?.address ?? '0x0',
      metadata: {
        name: `${plotX}x${plotY} Plot`,
        description: 'A beautiful piece of virtual real estate',
        edition: 'Atlantis 2.0 patch 240609',
    }
  }
     const uri = upload({
      client,
      files: [
        JSON.stringify(plotJsonData)
      ]
     })
     
     return uri;
  };

  const getDataFromIpfs = async () => {
    if (!selectedPlotUri) {
      return setSelectedPlot(null);
    }
  
    try {
      const file = await download({
        client,
        uri: selectedPlotUri,
      });
  
      const plotData = await file.json();
      setSelectedPlot(plotData as PlotData);
    } catch (error) {
      console.error('Error fetching data from IPFS:', error);
      setSelectedPlot(null);
    }
  }

  useEffect(() => {
    getDataFromIpfs()
  }, [plotX, plotY, selectedPlotUri])

  const getStatusColor = (): string => {
    return isVerifyingOwnership 
    ? 'text-neutral' 
    : isSelectedPlotOwned 
    ? 'text-error'
    : 'text-primary'
  }

  const getStatusBadgeColor = (): string => {
    return isVerifyingOwnership 
    ? 'badge-neutral' 
    : isSelectedPlotOwned 
    ? 'badge-error'
    : 'badge-primary'
  }



  const customTransactionBtnStyle = useMemo(() => {
    const style : React.CSSProperties = {
      width: '8rem',
      height: '8rem',
    }
    return style;
  }, [])


  return (
    <div className='flex h-full'>
      <div className='w-4/5'>
        <div className='flex justify-between'>
            <h2 className={getStatusColor()}>
              {
                (isLoadingSelectedPlotUri && isSelectedPlotOwned) || isVerifyingOwnership
                ? <span className="loading loading-spinner loading-md mr-2"></span>
                : <div className={`badge badge-md mr-2 ${getStatusBadgeColor()}`}></div>
              }
              Status: { isVerifyingOwnership ? 'Verifying' : isSelectedPlotOwned ? 'Owned' : 'Available' }
              </h2>
            {/* <h2>Plot:({plotX},{plotY})</h2>           */}
        </div>
        <div>
          { (isLoadingSelectedPlotUri && isSelectedPlotOwned) || isVerifyingOwnership 
          ? null
          : selectedPlotUri 
          ? <PlotMetadata data={selectedPlot} /> 
          : null }
        </div>
      </div>
      <div className='w-1/5 flex justify-center items-center'>
        <TransactionButton
          style={customTransactionBtnStyle}
          disabled={isSelectedPlotOwned || isVerifyingOwnership}
          transaction={async() => {
            const uri = await saveJsonDataInIpfs();
            console.log(uri);
            
            const tx = mintPlot({
              contract: AtlantisContract,
              x: BigInt(plotX),
              y: BigInt(plotY),
              fullURI: uri
            })
        
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
              <MintIcon width='4rem' height='4rem' fill={isSelectedPlotOwned ? 'black': 'green'} />
              <h1 className="mt-2">Claim</h1>
            </div>
        </TransactionButton>
      </div>
  </div>
  );
};

export default PlotInfo;
