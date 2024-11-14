import React, { useEffect, useState } from 'react';
import PlotMetadata from './PlotMetadata';
import PlotStatus from './plotStatus';
import PlotClaimButton from './plotClaimButton';
import { useActiveAccount } from 'thirdweb/react';
import { Coords } from '../../GameContainer';
import PlotFormData from './plotFormData';
import { saveJsonDataInIpfs } from '../../utils/plotUtils';
import { gamePatch } from '../../utils/gameConfig';

export interface PlotData {
  plotX: number;
  plotY: number;
  tokenAddress: string;
  ownerAddress: string;
  metadata: Metadata;
}

export interface Metadata {
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
    const [formMetadata, seFormMetadata] = useState<Metadata>(
        {
            name: `${plotX}x${plotY} Plot`,
            description: 'A beautiful piece of virtual real estate',
            edition: `Atlantis 2.0 patch ${gamePatch}`,
        }
    );

    useEffect(() => {
        seFormMetadata(prev => ({
            ...prev,
            ['name']: `${plotX}x${plotY} Plot`
        }));
  
    }, [plotX, plotY]);
  

    const saveMetadataInIpfs = async () => {
        const finalMetadata = {
            name: formMetadata.name !== '' ? formMetadata.name : `${plotX}x${plotY} Plot`,
            description: formMetadata.description !== '' ? formMetadata.description :'A beautiful piece of virtual real estate',
            edition: formMetadata.edition ?? `Atlantis 2.0 patch ${gamePatch}`,
        };
    
        const uri = await saveJsonDataInIpfs(plotX,plotY,activeAccount?.address ?? '0x0', finalMetadata);
        return uri;
    };

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
                        : <PlotFormData ownerAddress={activeAccount?.address ?? '0x0'} formMetadata={formMetadata} seFormMetadata={seFormMetadata} />  }
                </div>
            </div>
            <div className='w-1/5 flex justify-center items-center'>
                <PlotClaimButton 
                    plotX={plotX} 
                    plotY={plotY} 
                    isSelectedPlotOwned={!!isSelectedPlotOwned} 
                    isVerifyingOwnership={isVerifyingOwnership} 
                    saveMetadataInIpfs={saveMetadataInIpfs}
                    onMintTransactionConfirmation={onMintTransactionConfirmation}
                />
            </div>
        </div>
    );
};

export default PlotInfo;
