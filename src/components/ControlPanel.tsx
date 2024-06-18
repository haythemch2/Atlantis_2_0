import React from 'react';

interface ControlPanelProps {
  coordinates: { x: number; y: number };
  plot: { x: number; y: number };
}

const ControlPanel: React.FC<ControlPanelProps> = ({ coordinates, plot }) => {
  return (
    <div className='max-w-[1200px] w-full mt-2'>
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

export default ControlPanel;
