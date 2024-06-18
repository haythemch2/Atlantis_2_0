import React, { useMemo } from 'react';
import { Container, Text } from '@pixi/react';
import { TextStyle, BlurFilter } from 'pixi.js';
import Message from '../../Message';

interface OverlayProps {
  blurFilter: BlurFilter;
  showConnectWalletText: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ blurFilter, showConnectWalletText }) => {
  const bigBlurredTextStyle = useMemo(() => new TextStyle({
    fontFamily: 'Press Start 2P',
    fontSize: 48,
    fill: '#FFFFFF',
    align: 'center',
    stroke: '#000000',
    strokeThickness: 6,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 10,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 700
  }), []);

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
    wordWrap: true,
    wordWrapWidth: 700,
  }), []);

  const connectWalletText = useMemo(() => showConnectWalletText ? 'Please connect wallet first' : '', [showConnectWalletText])

  return (
    <Container x={400} y={50}>
      <Text
        text={`Atlantis 2.0`}
        anchor={0.5}
        x={220}
        y={300}
        filters={[blurFilter]}
        style={bigBlurredTextStyle}
      />
      <Text
        text={connectWalletText}
        anchor={0.5}
        x={220}
        y={400}
        filters={[blurFilter]}
        style={bigBlurredTextStyle}
      />
      <Message poem="Welcome to Atlantis 2.0!
The myth is real. Dive into the legendary city and own a piece of history as an ERC721 token." interval={1000 / 10}>
        {(text) => (
          <Text
            text={text}
            x={220}
            y={80}
            anchor={0.5}
            style={retroTextStyle}
          />
        )}
      </Message>
    </Container>
  );
};

export default Overlay;
