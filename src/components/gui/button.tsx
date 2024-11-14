import React, { useState, useCallback } from 'react';
import { Container, Graphics, Text } from '@pixi/react';
import { TextStyle, Graphics as PIXIGraphics } from 'pixi.js';

const buttonWidth = 200;
const buttonHeight = 60;

const retroColors = {
    background: 0x4A0E0E,
    hover: 0x6B1515,
    border: 0xFFD700,
    text: ['#FFD700', '#FFA500'],
};

const buttonTextStyle = new TextStyle({
    fontFamily: 'Press Start 2P, Courier, monospace',
    fontSize: 24,
    fontWeight: 'bold',
    fill: retroColors.text,
    stroke: '#000000',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 2,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 2,
    letterSpacing: 2,
    lineJoin: 'round',
});


const RetroButton: React.FC<{ text: string; y: number; onClick: () => void }> = ({ text, y, onClick }) => {
    const [hover, setHover] = useState(false);

    const drawRetroButton = useCallback((g: PIXIGraphics, hover: boolean = false) => {
        g.clear();
    
        // Button background
        g.beginFill(hover ? retroColors.hover : retroColors.background);
        g.drawRect(0, 0, buttonWidth, buttonHeight);
        g.endFill();
  
        // Border
        g.lineStyle(4, retroColors.border, 1);
        g.drawRect(0, 0, buttonWidth, buttonHeight);
  
        // Pixel corners
        g.beginFill(retroColors.border);
        g.drawRect(0, 0, 8, 8);
        g.drawRect(buttonWidth - 8, 0, 8, 8);
        g.drawRect(0, buttonHeight - 8, 8, 8);
        g.drawRect(buttonWidth - 8, buttonHeight - 8, 8, 8);
        g.endFill();
  
        // inner shadow effect
        g.lineStyle(2, 0x000000, 0.3);
        g.moveTo(4, buttonHeight - 4);
        g.lineTo(4, 4);
        g.lineTo(buttonWidth - 4, 4);
    }, []);
  

    return (
        <Container
            y={y}
            x={-(buttonWidth * 0.5)}
            interactive={true}
            mouseover={() => setHover(true)}
            mouseout={() => setHover(false)}
            pointerdown={onClick}
        >
            <Graphics draw={(g) => drawRetroButton(g, hover)} />
            <Text 
                text={text} 
                anchor={0.5} 
                x={buttonWidth / 2} 
                y={buttonHeight / 2} 
                style={buttonTextStyle} 
            />
        </Container>
    );
};

export default RetroButton;