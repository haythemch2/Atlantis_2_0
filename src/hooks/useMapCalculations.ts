import { useMemo } from 'react';
import { Rectangle, Texture } from 'pixi.js';

interface Boundaries {
  min: number;
  max: number;
}

interface UseMapCalculationsProps {
  cameraOffset: { x: number, y: number };
  stageWidth: number;
  stageHeight: number;
  plot: number;
  road: number;
  mapUrl: string;
  boundaries_X: Boundaries;
  boundaries_Y: Boundaries;
}

interface MapCalculations {
  interpolatedPosition: { x: number, y: number };
  plotX: number;
  plotY: number;
  plotTexture: Texture;
  userFriendlyCoordinates: { x: number, y: number };
}

const useMapCalculations = ({
  cameraOffset,
  stageWidth,
  stageHeight,
  plot,
  road,
  mapUrl,
  boundaries_X,
  boundaries_Y
}: UseMapCalculationsProps): MapCalculations => {
  const interpolatedPosition = useMemo(() => ({
    x: cameraOffset.x,
    y: cameraOffset.y,
  }), [cameraOffset]);

  const centerX = (stageWidth / 2) - interpolatedPosition.x;
  const centerY = (stageHeight / 2) - interpolatedPosition.y;
  const closestPlotX = Math.floor(centerX / (plot + road)) * (plot + road);
  const closestPlotY = Math.floor(centerY / (plot + road)) * (plot + road);
  const plotX = closestPlotX + road;
  const plotY = closestPlotY + road;

  const mapTexture = useMemo(() => Texture.from(mapUrl), [mapUrl]);

  const plotTexture = useMemo(() => new Texture(
    mapTexture.baseTexture,
    new Rectangle(plotX, plotY, plot, plot)
  ), [mapTexture.baseTexture, plotX, plotY, plot]);

  const userFriendlyCoordinates = useMemo(() => ({
    x: boundaries_X.min - cameraOffset.x,
    y: boundaries_Y.min - cameraOffset.y,
  }), [cameraOffset, boundaries_X, boundaries_Y]);

  return {
    interpolatedPosition,
    plotX,
    plotY,
    plotTexture,
    userFriendlyCoordinates
  };
};

export default useMapCalculations;
