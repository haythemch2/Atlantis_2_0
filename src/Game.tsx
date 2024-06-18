import React, { useMemo, useState } from 'react';
import { Stage } from '@pixi/react';
import { BlurFilter } from 'pixi.js';
import ControlPanel from './components/panels/topPanel';
import './App.css'
import Map from './components/Map';
import Preview from './components/graphics/Preview';
import Overlay from './components/graphics/Overlay';
import gameConfig from './utils/gameConfig';
import { useActiveAccount } from 'thirdweb/react';
import TickerHandler from './components/tickerHandler';
import useKeyboardControls from './hooks/useKeyboardControls';
import useMapCalculations from './hooks/useMapCalculations';
import BottomMenu from './components/panels/bottomPanel';

const Game: React.FC = () => {
  const { mapUrl, plot, road, stageWidth, stageHeight, boundaries_X, boundaries_Y } = gameConfig;
  
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [paused, setPaused] = useState(true);
  const [hasAttemptedToStart, setHasAttemptedToStart] = useState<boolean>(false);

  const activeAccount = useActiveAccount();
  
  const connectedAddress = useMemo(() => activeAccount?.address, [activeAccount]);
  const blurFilter = useMemo(() => new BlurFilter(2, 10), []);
  const shadowBlurFilter = useMemo(() => new BlurFilter(2, 5), []);
  const navigationKeys = useMemo(() => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], []);

  const keysPressedRef = useKeyboardControls({ setHasAttemptedToStart, setPaused, navigationKeys });

  const {
    interpolatedPosition,
    plotX,
    plotY,
    plotTexture,
    userFriendlyCoordinates
  } = useMapCalculations({ cameraOffset, stageWidth, stageHeight, plot, road, mapUrl, boundaries_X, boundaries_Y });

  return (
    <div>
      <div className='flex flex-col items-center'>
        <ControlPanel
          coordinates={userFriendlyCoordinates}
          plot={{ x: plotX, y: plotY }}
        />
        <Stage width={stageWidth} height={stageHeight} options={{ background: 0x171213 }}>
          <TickerHandler
            paused={paused}
            connectedAddress={connectedAddress}
            setCameraOffset={setCameraOffset}
            keysPressedRef={keysPressedRef}
            boundaries_X={boundaries_X}
            boundaries_Y={boundaries_Y}
          />
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
          {(paused || !connectedAddress) && (
            <Overlay blurFilter={blurFilter} showConnectWalletText={!connectedAddress && hasAttemptedToStart} />
          )}
        </Stage>
      </div>
      <div className="divider"></div>
      <BottomMenu keysPressedRef={keysPressedRef} plotX={plotX} plotY={plotY} />
    </div>
  );
};

export default Game;