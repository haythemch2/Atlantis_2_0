import React, { useCallback } from 'react';
import { Container, Graphics, Sprite } from '@pixi/react';
import { Graphics as TypeGraphics } from 'pixi.js';

interface MapProps {
  mapUrl: string;
  interpolatedPosition: { x: number; y: number };
  plotX: number;
  plotY: number;
  plot: number;
}

const Map: React.FC<MapProps> = ({ mapUrl, interpolatedPosition, plotX, plotY, plot }) => {

  const drawBorder = useCallback((g: TypeGraphics) => {
    g.clear();
    g.lineStyle(2, 0xff0000, 1);
    g.drawRect(plotX, plotY, plot, plot);
  }, [plotX, plotY, plot]);

  return (
    <Container x={interpolatedPosition.x} y={interpolatedPosition.y}>
      <Sprite image={mapUrl} x={0} y={0} />
      <Graphics draw={drawBorder} />
    </Container>
  );
};

export default Map;
