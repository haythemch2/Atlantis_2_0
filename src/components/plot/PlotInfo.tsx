import React from 'react';
import PlotMetadata from './PlotMetadata';
import PlotStatus from './plotStatus';
import PlotClaimButton from './plotClaimButton';
import { useActiveAccount } from 'thirdweb/react';
import { Coords } from '../../GameContainer';

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
  isLoadingSelectedPlotUri: boolean;
  isVerifyingOwnership: boolean;
  isSelectedPlotOwned: boolean
  selectedPlotUri: string | null;
  selectedPlot: PlotData | null;
  onMintTransactionConfirmation: (coords: Coords) => void;
}

const PlotInfo: React.FC<PlotInfoProps> = ({ plotX, plotY, isLoadingSelectedPlotUri, isVerifyingOwnership, isSelectedPlotOwned, selectedPlotUri, selectedPlot, onMintTransactionConfirmation }) => {
  const activeAccount = useActiveAccount();
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
          onMintTransactionConfirmation={onMintTransactionConfirmation}
        />
      </div>
    </div>
  );
};

export default PlotInfo;
