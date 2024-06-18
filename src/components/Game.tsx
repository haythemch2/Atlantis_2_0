import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stage } from '@pixi/react';
import { BlurFilter, Rectangle, Texture } from 'pixi.js';
import ControlPanel from './ControlPanel';
import '../App.css'
import Map from './Map';
import Preview from './Preview';
import Overlay from './Overlay';
import gameConfig from '../utils/gameConfig';
import PlotInfo from './PlotInfo';
import ArrowKeys from './ArrowKeys';
import { useActiveAccount } from 'thirdweb/react';

const Game: React.FC = () => {
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [paused, setPaused] = useState(true);


  const [hasAttemptedToStart, setHasAttemptedToStart] = useState<boolean>(false);
  const activeAccount = useActiveAccount();
  const connectedAddress = useMemo(() => activeAccount?.address , [activeAccount])
  
  const keysPressedRef = useRef<Record<string, boolean>>({});

  const { mapUrl, plot, road, stageWidth, stageHeight, boundaries_X, boundaries_Y } = gameConfig;

  const blurFilter = useMemo(() => new BlurFilter(2, 10), []);
  const shadowBlurFilter = useMemo(() => new BlurFilter(2, 5), []);

  const navigationKeys = useMemo(() => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (navigationKeys.includes(event.key)) {
      event.preventDefault();
    }
    keysPressedRef.current = { ...keysPressedRef.current, [event.key]: true };
    setHasAttemptedToStart(true);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (navigationKeys.includes(event.key)) {
      event.preventDefault();
    }
    keysPressedRef.current = { ...keysPressedRef.current, [event.key]: false };
  }, []);

  const handleUnpause = useCallback(() => {
    setPaused(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleUnpause, { once: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Cleanup event listeners once

  useEffect(() => {
    const updatePosition = () => {
      setCameraOffset((prevPosition) => {
        const newPosition = { ...prevPosition };
        const keysPressed = keysPressedRef.current;
        if (keysPressed['ArrowUp']) newPosition.y += 5;
        if (keysPressed['ArrowDown']) newPosition.y -= 5;
        if (keysPressed['ArrowLeft']) newPosition.x += 5;
        if (keysPressed['ArrowRight']) newPosition.x -= 5;

        newPosition.x = Math.max(Math.min(newPosition.x, boundaries_X.min), boundaries_X.max);
        newPosition.y = Math.max(Math.min(newPosition.y, boundaries_Y.min), boundaries_Y.max);

        return newPosition;
      });
    };

    let interval: NodeJS.Timeout;
    if(!paused && connectedAddress) {
     interval = setInterval(updatePosition, 1000 / 30);
    }    
    
    return () => clearInterval(interval); 
  }, [boundaries_X, boundaries_Y, paused, connectedAddress]);

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
  }), [cameraOffset, boundaries_X]);

  return (
    <div>
        <div className='flex flex-col items-center'>
           <ControlPanel
           coordinates={userFriendlyCoordinates}
           plot={{ x: plotX, y: plotY }}
           />
           <Stage width={stageWidth} height={stageHeight} options={{ background: 0x171213 }}>
                <Map
                  mapUrl={mapUrl}
                  interpolatedPosition={interpolatedPosition}
                  plotX={plotX}
                  plotY={plotY}
                  plot={plot}
                  />
                {(!paused && connectedAddress) && (
                  <Preview
                  stageWidth={stageWidth}
                  shadowBlurFilter={shadowBlurFilter}
                  plotTexture={plotTexture}
                  />
                )}
            {(paused || !connectedAddress) && <Overlay blurFilter={blurFilter} showConnectWalletText={!connectedAddress && hasAttemptedToStart} />}
            </Stage>
       </div>
       <div className="divider"></div>
       <div className='flex max-w-[1200px] m-auto h-[12rem]'>
        <div className='w-1/4 flex justify-center items-center'>
          <ArrowKeys keysPressed={keysPressedRef.current} />
        </div>
       <div className="divider divider-horizontal"></div>
        <div className='w-3/4'>
       <PlotInfo plotX={plotX} plotY={plotY} />
        </div>
       </div>
    </div>
  );
};

export default Game;
