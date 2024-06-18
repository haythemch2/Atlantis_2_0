import React from 'react';

interface PlotStatusProps {
  isLoadingSelectedPlotUri: boolean;
  isVerifyingOwnership: boolean;
  isSelectedPlotOwned: boolean;
}

const PlotStatus: React.FC<PlotStatusProps> = ({ isLoadingSelectedPlotUri, isVerifyingOwnership, isSelectedPlotOwned }) => {
  const getStatusColor = (): string => {
    return isVerifyingOwnership 
    ? 'text-neutral' 
    : isSelectedPlotOwned 
    ? 'text-error'
    : 'text-primary';
  };

  const getStatusBadgeColor = (): string => {
    return isVerifyingOwnership 
    ? 'badge-neutral' 
    : isSelectedPlotOwned 
    ? 'badge-error'
    : 'badge-primary';
  };

  return (
    <h2 className={getStatusColor()}>
      {
        (isLoadingSelectedPlotUri && isSelectedPlotOwned) || isVerifyingOwnership
        ? <span className="loading loading-spinner loading-md mr-2"></span>
        : <div className={`badge badge-md mr-2 ${getStatusBadgeColor()}`}></div>
      }
      Status: { isVerifyingOwnership ? 'Verifying' : isSelectedPlotOwned ? 'Owned' : 'Available' }
    </h2>
  );
};

export default PlotStatus;
