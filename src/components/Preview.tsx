import React, { useMemo } from 'react';
import { Container, Sprite, Text } from '@pixi/react';
import { TextStyle, Texture, BlurFilter } from 'pixi.js';

interface PreviewProps {
  stageWidth: number;
  shadowBlurFilter: BlurFilter;
  plotTexture: Texture;
}

const Preview: React.FC<PreviewProps> = ({ stageWidth, shadowBlurFilter, plotTexture }) => {
  const retroTextStyle = useMemo(() => new TextStyle({
    fontFamily: 'Press Start 2P',
    fontSize: 28,
    fill: '#1eb854',
    align: 'center',
    stroke: '#000000',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowDistance: 4,
  }), []);

  return (
    <Container x={stageWidth - 220} y={30} width={200} height={200} eventMode="auto">
      <Text text="Plot" anchor={0.5} x={105} y={10} style={retroTextStyle} />
      <Sprite
        texture={Texture.WHITE}
        x={-5}
        y={35}
        width={210}
        height={210}
        filters={[shadowBlurFilter]}
        alpha={0.5}
      />
      <Sprite texture={plotTexture} x={0} y={40} width={200} height={200} />
    </Container>
  );
};

export default Preview;
