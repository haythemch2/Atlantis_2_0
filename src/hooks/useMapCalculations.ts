import { useMemo, useRef } from 'react';
import gameConfig from '../utils/gameConfig';
import { Coords } from '../GameContainer';
interface MapCalculations {
  interpolatedPosition: Coords;
  plotX: number;
  plotY: number;
  userFriendlyCoordinates: Coords;
}

const { stageWidth, stageHeight, plot, road, boundaries_X, boundaries_Y } = gameConfig;

const isPlotRestricted = (plotX: number, plotY: number) : boolean => {
  const restrictedPlots = [
    { x:1152, y: 2208 },
  ]
  
  const CoordsLimits = 4000; 
  const isRestricted  = restrictedPlots.some((plotCoords) => plotCoords.x === plotX && plotCoords.y === plotY);
  const isOutOfLimit = plotX > CoordsLimits || plotY > CoordsLimits;

  return isRestricted || isOutOfLimit
}

const useMapCalculations = (cameraOffset: Coords): MapCalculations => {
  const previousClosestPlotRef = useRef<Coords>({ x: 0, y: 0 });

  const interpolatedPosition = useMemo(() => ({
    x: cameraOffset.x,
    y: cameraOffset.y,
  }), [cameraOffset]);

  const scaledPlot: number = 4* plot;
  const scaledRoad: number = 4* road;

  const centerX = (stageWidth / 2) - interpolatedPosition.x;
  const centerY = (stageHeight / 2) - interpolatedPosition.y;
  const closestPlotX = Math.floor(centerX / (scaledPlot + scaledRoad)) * (scaledPlot + scaledRoad);
  const closestPlotY = Math.floor(centerY / (scaledPlot + scaledRoad)) * (scaledPlot + scaledRoad);
  const plotX = closestPlotX + scaledRoad;
  const plotY = closestPlotY + scaledRoad;

  const isRestricted = isPlotRestricted(plotX, plotY);

  if(!isRestricted) {
    previousClosestPlotRef.current.x = plotX;
    previousClosestPlotRef.current.y = plotY;
  }

  const userFriendlyCoordinates = useMemo(() => ({
    x: boundaries_X.min - cameraOffset.x,
    y: boundaries_Y.min - cameraOffset.y,
  }), [cameraOffset]);

  return {
    interpolatedPosition,
    plotX: isRestricted ? previousClosestPlotRef.current.x : plotX,
    plotY: isRestricted ? previousClosestPlotRef.current.y : plotY,
    userFriendlyCoordinates
  };
};

export default useMapCalculations;
