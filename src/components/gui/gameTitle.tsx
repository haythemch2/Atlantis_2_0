import React from 'react';
import { Text, Container } from '@pixi/react';
import { TextStyle } from 'pixi.js';

const GameTitle: React.FC = () => {
    const titleStyle = new TextStyle({
        fontFamily: 'Press Start 2P, Courier, monospace',
        fontSize: 48,
        fontWeight: 'bold',
        fill: ['#FFD700', '#FFA500'],
        stroke: '#4A0E0E',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        letterSpacing: 4,
        lineJoin: 'round',
    });

    return (
        <Container position={[400, 300]}>
            <Text
                text="Atlantis 2.0"
                anchor={0.5}
                style={titleStyle}
            />
        </Container>
    );
};

export default GameTitle;