import EvmAddress from '../EvmAddress';
import { gamePatch } from '../../utils/gameConfig';
import { Metadata } from './PlotInfo';
import { useMemo } from 'react';

type Props = {
    ownerAddress: string;
    formMetadata: Metadata;
    seFormMetadata: React.Dispatch<React.SetStateAction<Metadata>>
}
const PlotFormData = ({ownerAddress,formMetadata,seFormMetadata}: Props) => {
    const Edition = useMemo(() => `Atlantis 2.0 patch ${gamePatch}`, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        seFormMetadata(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <div className='text-sm text-primary flex flex-col gap-2'>
                <div className='flex justify-between'>
                    <div className='flex items-center'><span className='text-base-content'>Owner:</span><EvmAddress address={ownerAddress} /></div>
                    <div className='flex items-center'><span className='text-base-content'>Token:</span>*x***</div>
                </div>
                <div className="flex items-center">
                    <span className="text-base-content min-w-24">Name: </span>
                    <input
                        type="text"
                        name="name"
                        value={formMetadata.name}
                        onChange={handleChange}
                        className="ml-2 px-3 py-1 w-3/4 focus:outline-none border-b border-dashed border-primary"
                    />
                </div>
      
                <div className="flex items-center">
                    <span className="text-base-content min-w-24">Description: </span>
                    <input
                        type="text"
                        name="description"
                        value={formMetadata.description}
                        onChange={handleChange}
                        className="ml-2 px-3 py-1 w-3/4  focus:outline-none border-b border-dashed border-primary"
                    />
                </div>
                <p><span className='text-base-content py-1'>Edition: </span>{Edition}</p>
                <div className="divider lg:divider-horizontal"></div> 
            </div>
        </>
    );
};

export default PlotFormData;