import { upload, download } from 'thirdweb/storage';
import { AtlantisContract, client } from './client';
import { Metadata, PlotData,  } from '../components/plot/PlotInfo';

export const saveJsonDataInIpfs = async (plotX: number, plotY: number, ownerAddress: string, metadata: Metadata): Promise<string> => {
    const plotJsonData: PlotData = {
        plotX,
        plotY,
        tokenAddress: AtlantisContract.address,
        ownerAddress,
        metadata
    };
    const uri = await upload({
        client,
        files: [
            JSON.stringify(plotJsonData)
        ]
    });
    return uri;
};

export const getDataFromIpfs = async (uri: string | undefined): Promise<PlotData | null> => {
    if (!uri) {
        return null;
    }

    try {
        const file = await download({ client, uri });
        const plotData = await file.json();
        return plotData as PlotData;
    } catch (error) {
        console.error('Error fetching data from IPFS:', error);
        return null;
    }
};
