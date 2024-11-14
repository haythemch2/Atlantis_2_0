import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { loadAssets } from '../utils/loading';
import { Container, Graphics, Sprite, Text } from '@pixi/react';
import { Graphics as TypeGraphics, TextStyle, Assets } from 'pixi.js';
import gameConfig from '../utils/gameConfig';

const assets: Map<string, string> = new Map([
    ['map2', '/map2.png'],
    ['map2_foreGround', '/map2_foreground.png'],
    ['playerDown', '/playerDown.png'],
    ['playerUp', '/playerUp.png'],
    ['playerLeft', '/playerLeft.png'],
    ['playerRight', '/playerRight.png'],
]);

interface LoadingHandlerProps {
  children: React.ReactNode;
}

const LoadingHandler: React.FC<LoadingHandlerProps> = ({ children }) => {
    const { stageHeight, stageWidth} = gameConfig;

    const [loading, setLoading] = useState(true);
    const [bgLoaded, setBgLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    const easeOutQuad = (t: number) => t * (2 - t);

    const loadProgressUpdate = useCallback((e: number) => {
        setProgress(prev => {
            const target = easeOutQuad(e);
            const smoothingFactor = 0.1 + (target * 0.5);
            const smoothed = prev + (target - prev) * smoothingFactor;
      
            if (target > 0.99) {
                return 1;
            }
      
            return Math.min(smoothed, 1);
        });
    }, []);

    useEffect(() => {
        Assets.add({alias:'loading_bg', src:'/loading_bg.jpeg'});
        Assets.load('loading_bg').then(() => {
            setBgLoaded(true);
            loadAssets(assets, loadProgressUpdate)
                .then(() => {
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error loading assets:', error);
                });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const barWidth = 600;
    const barHeight = 70;
    const cornerRadius = 5;

    const drawProgress = useCallback((g: TypeGraphics) => {
        g.clear();
        g.beginFill(0x4caf50);
        g.drawRoundedRect(50, 80, barWidth * progress, barHeight, cornerRadius);
        g.endFill();
    }, [progress]);

    const drawBorder = useCallback((g: TypeGraphics) => {
        g.clear();
        g.beginFill(0x000000);
        g.drawRoundedRect(50-2, 80-2, barWidth+4, barHeight+4, cornerRadius);
        g.endFill();
    }, []);

    const textStyle = useMemo(() => new TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xFFFFFF,
        align: 'center',
    }), []);

    if (loading) {
        return (
            <>
                {bgLoaded &&  <Sprite texture={Assets.get('loading_bg')} x={stageWidth - 1024} y={stageHeight - 1024 + 100}/>}
                <Container x={150} y={160}>
                    <Graphics draw={drawBorder} />
                    <Graphics draw={drawProgress} />
                    <Text 
                        text={`Loading... ${Math.round(progress * 100)}%`}
                        x={350}
                        y={115}
                        anchor={0.5}
                        style={textStyle}
                    />
                </Container>
            </>
        );
    }

    return <>{children}</>;
};

export default LoadingHandler;