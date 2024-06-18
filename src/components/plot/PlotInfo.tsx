import React, { useEffect, useState } from 'react';
import { useActiveAccount, useReadContract } from 'thirdweb/react';
import { doesPlotExist, getPlotURI } from '../../utils/contractUtils';
import { AtlantisContract } from '../../utils/client';
import PlotMetadata from './PlotMetadata';
import { getDataFromIpfs } from '../../utils/plotUtils';
import PlotStatus from './plotStatus';
import PlotClaimButton from './plotClaimButton';

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
  plotX: number;
  plotY: number;
}

const PlotInfo: React.FC<PlotInfoProps> = ({ plotX, plotY }) => {
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

  useEffect(() => {
    const fetchData = async () => {
      const plotData = await getDataFromIpfs(selectedPlotUri);
      setSelectedPlot(plotData);
    };

    fetchData();
  }, [plotX, plotY, selectedPlotUri]);

  return (
    <div className='flex h-full'>
      <div className='w-4/5'>
        <div className='flex justify-between'>
          <PlotStatus 
            isLoadingSelectedPlotUri={isLoadingSelectedPlotUri} 
            isVerifyingOwnership={isVerifyingOwnership} 
            isSelectedPlotOwned={!!isSelectedPlotOwned} 
          />
        </div>
        <div>
          { (!isLoadingSelectedPlotUri || isVerifyingOwnership) && selectedPlotUri 
          ? <PlotMetadata data={selectedPlot} /> 
          : null }
        </div>
      </div>
      <div className='w-1/5 flex justify-center items-center'>
        <PlotClaimButton 
          plotX={plotX} 
          plotY={plotY} 
          isSelectedPlotOwned={!!isSelectedPlotOwned} 
          isVerifyingOwnership={isVerifyingOwnership} 
          ownerAddress={activeAccount?.address ?? '0x0'} 
        />
      </div>
    </div>
  );
};

export default PlotInfo;
