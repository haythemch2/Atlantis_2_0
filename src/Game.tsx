import { Container, Graphics, Sprite } from '@pixi/react'
import { useCallback, useMemo, useState } from 'react'
import Player from './components/player'
import Preview from './components/graphics/Preview'
import { Coords, Size } from './GameContainer'
import { Assets, BlurFilter, LINE_CAP, LINE_JOIN, Rectangle, Texture } from 'pixi.js'
import Menu from './components/gui/menu'
import gameConfig from './utils/gameConfig'
import { Graphics as TypeGraphics } from 'pixi.js';
import CelebrationParticles from './components/CelebrationParticles'

type IGameState = {
  mapPosition: Coords,
  canvasSize: Size,
  plotX: number,
  plotY: number,
  isSelectedPlotOwned: boolean,
  setMapPosition: React.Dispatch<React.SetStateAction<Coords>>,
  isMintTransactionConfirmed: boolean;
}

const GameDisplay = ({mapPosition, canvasSize, plotX, plotY, isSelectedPlotOwned, setMapPosition, isMintTransactionConfirmed}: IGameState) => {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handlePlay = () => {
    setIsGameStarted(true);
  };

  const handleExit = () => {
    // Handle exit logic
    console.log("Exiting game...");
  };
  const shadowBlurFilter = useMemo(() => new BlurFilter(2, 5), []);
  const { plot } = gameConfig;

  // const drawBorder = useCallback((g: TypeGraphics) => {
  //   g.clear();
  //   g.lineStyle(2, 0xff0000, 1);
  //   g.drawRect(plotX, plotY, plot * 4, plot * 4);
  // }, [plotX, plotY, plot]);

  const mapTexture = useMemo(() => Assets.get('map2'), [])

  const plotTexture = useMemo(() => new Texture(
    mapTexture.baseTexture,
    new Rectangle(plotX, plotY, plot * 4, plot * 4)
  ), [mapTexture.baseTexture, plotX, plotY, plot]);

  const drawPlotBorder = useCallback((graphics: TypeGraphics) => {
    console.log(isSelectedPlotOwned);
    
    const x = plotX;
    const y = plotY;
    const width = plot * 4;
    const height = plot * 4;
    graphics.clear();
  
    if (isSelectedPlotOwned) {
      // Style for owned plot
      graphics.lineStyle({
        width: 4,
        color: 0xff6f70, // Gold color
        alignment: 0.5,
        join: LINE_JOIN.BEVEL,
        cap: LINE_CAP.SQUARE,
      });
  
      // Draw main border
      graphics.drawRect(x, y, width, height);
  
      // Add pixelated corner accents
      const cornerSize = 8;
      graphics.beginFill(0xffd700);
      graphics.drawRect(x, y, cornerSize, cornerSize);
      graphics.drawRect(x + width - cornerSize, y, cornerSize, cornerSize);
      graphics.drawRect(x, y + height - cornerSize, cornerSize, cornerSize);
      graphics.drawRect(x + width - cornerSize, y + height - cornerSize, cornerSize, cornerSize);
      graphics.endFill();
  
    } else {
      // Style for plot available to mint
      graphics.lineStyle({
        width: 3,
        color: 0x00ff00, // Bright green color
        alignment: 0.5,
        join: LINE_JOIN.MITER,
        cap: LINE_CAP.SQUARE,
      });
  
      // Draw dashed border
      const dashLength = 8;
      const gapLength = 4;
      let currentX = x;
      let currentY = y;
  
      // Top border
      while (currentX < x + width) {
        graphics.moveTo(currentX, y);
        graphics.lineTo(Math.min(currentX + dashLength, x + width), y);
        currentX += dashLength + gapLength;
      }
  
      // Right border
      currentX = x + width;
      while (currentY < y + height) {
        graphics.moveTo(currentX, currentY);
        graphics.lineTo(currentX, Math.min(currentY + dashLength, y + height));
        currentY += dashLength + gapLength;
      }
  
      // Bottom border
      currentY = y + height;
      currentX = x + width;
      while (currentX > x) {
        graphics.moveTo(currentX, currentY);
        graphics.lineTo(Math.max(currentX - dashLength, x), currentY);
        currentX -= dashLength + gapLength;
      }
  
      // Left border
      currentX = x;
      currentY = y + height;
      while (currentY > y) {
        graphics.moveTo(currentX, currentY);
        graphics.lineTo(currentX, Math.max(currentY - dashLength, y));
        currentY -= dashLength + gapLength;
      }
    }
  }, [plotX, plotY, plot, isSelectedPlotOwned]);


  return (
    <>
    <Container x={mapPosition.x} y={mapPosition.y} >
              <Sprite texture={Assets.get('map2')} x={0} y={0} />
              <Graphics draw={drawPlotBorder} />
              <CelebrationParticles plotX={plotX} plotY={plotY} plotWidth={plot} plotHeight={plot} isMintTransactionConfirmed={isMintTransactionConfirmed}/>
            </Container>
            <Player canvasSize={canvasSize} mapPosition={mapPosition} isGameStarted={isGameStarted}  setMapPosition={setMapPosition} />
            <Container x={mapPosition.x} y={mapPosition.y} >
              <Sprite texture={Assets.get('map2_foreGround')} x={0} y={0} />
            </Container>
            {!isGameStarted && (
          <Menu canvasSize={canvasSize} onPlay={handlePlay} onExit={handleExit} />
        ) }
        {(isGameStarted) && (
            <Preview
              stageWidth={canvasSize.width}
              shadowBlurFilter={shadowBlurFilter}
              plotTexture={plotTexture}
            />
          )}
            {/* {boundaries.map((boundary) => (
                <Sprite 
                texture={Texture.WHITE} 
                width={boundary.width} 
                height={boundary.height} 
                x={boundary.x + mapPosition.x} 
                y={boundary.y + mapPosition.y}
                />
            ))} */}
    </>
  )
}

export default GameDisplay