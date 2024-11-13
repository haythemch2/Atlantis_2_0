import React from 'react';
import { Coords } from '../../GameContainer';

interface TopPanelProps {
  coordinates: Coords;
  plot: Coords;
}

const TopPanel: React.FC<TopPanelProps> = ({ coordinates, plot }) => {
  return (
    <div className='w-full mt-2'>
      <div className='w-full flex justify-between'>
        <div className='flex items-center'> 
          <span className="loading loading-ring loading-lg mr-2"></span>
          {`X:${coordinates.x} Y:${coordinates.y}`}
         </div>
        <div className='flex items-center'> 
        Plot {`X:${plot.x}  Y:${plot.y}`}</div>
      </div>
    </div>
  );  
};

export default TopPanel;
