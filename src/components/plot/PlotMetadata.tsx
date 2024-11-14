import { PlotData } from './PlotInfo';
import EvmAddress from '../EvmAddress';

type Props = {
    data: PlotData | null
}
const PlotMetadata = (props: Props) => {

    return (
        <>
            {
                props.data
                    ? 
                    <div className='text-sm text-primary flex flex-col gap-2'>
                        <div className='flex justify-between'>
                            <div className='flex items-center'><span className='text-base-content'>Owner:</span><EvmAddress address={props.data.ownerAddress} /></div>
                            <div className='flex items-center'><span className='text-base-content'>Token:</span><EvmAddress address={props.data.tokenAddress} /></div>
                        </div>
                        <p><span className='text-base-content'>Name: </span>{props.data.metadata.name}</p>
                        <p><span className='text-base-content'>Description: </span>{props.data.metadata.description}</p>
                        <p><span className='text-base-content'>Edition: </span>{props.data.metadata.edition}</p>
                        <div className="divider lg:divider-horizontal"></div> 
                    </div>
                    : 
                    <div className="mt-2 rounded-lg shadow-md animate-pulse">
                        <div className="h-6 bg-base-content rounded mb-2"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-base-content rounded w-3/4"></div>
                            <div className="h-4 bg-base-content rounded w-3/4"></div>
                            <div className="h-4 bg-base-content rounded w-3/4"></div>
                        </div>
                    </div>            
            }
        </>
    );
};

export default PlotMetadata;