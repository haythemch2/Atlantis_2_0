import { Stage } from "@pixi/react"
import {  useCallback, useEffect, useState } from "react"
import useMapCalculations from "./hooks/useMapCalculations"
import gameConfig from "./utils/gameConfig"
import TopPanel from './components/panels/topPanel';
import PlotInfo, { PlotData } from "./components/plot/PlotInfo"
import LoadingHandler from "./components/LoadingHandler"
import GameDisplay from "./Game"
import { useReadContract } from "thirdweb/react";
import { doesPlotExist, getPlotURI } from "./utils/contractUtils";
import { AtlantisContract } from "./utils/client";
import { getDataFromIpfs } from "./utils/plotUtils";

export type Size = {
    width: number,
    height: number,
}

export type Coords = {
    x: number,
    y: number,
}

const GameContainer = () => {
  const canvasSize: Size = { width: 1024, height: 576 } // TODO: use gameConfig for initial values
  const initialMapOffset: Coords = { x: -840, y: -1250 }
  const [mapPosition, setMapPosition] = useState<Coords>(initialMapOffset);
  const [isMintTransactionConfirmed, setIsMintTransactionConfirmed] = useState<boolean>(false);

  const { plot, road, boundaries_X, boundaries_Y } = gameConfig;
  const {
      plotX,
      plotY,
      userFriendlyCoordinates
    } = useMapCalculations({
       cameraOffset: mapPosition,
        stageWidth: canvasSize.width,
         stageHeight: canvasSize.height,
          plot: plot*4,
           road: road*4,
            boundaries_X,
             boundaries_Y });

  const { data: isSelectedPlotOwned, isLoading: isVerifyingOwnership } = useReadContract(doesPlotExist, {
    contract: AtlantisContract,
    x: BigInt(plotX),
    y: BigInt(plotY),
  });

  const { data: selectedPlotUri, isLoading: isLoadingSelectedPlotUri } = useReadContract(getPlotURI, {
    contract: AtlantisContract,
    x: BigInt(plotX),
    y: BigInt(plotY),
  });

  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const plotData = await getDataFromIpfs(selectedPlotUri);
      setSelectedPlot(plotData);
    };

    fetchData();
  }, [plotX, plotY, selectedPlotUri]);

  const onMintTransactionConfirmation = useCallback(    
    () => {
      setIsMintTransactionConfirmed(!isMintTransactionConfirmed)},
    [],
  )
  

  return (
    <div className="max-w-[1200px]  m-auto">
      <div className='w-full flex flex-col justify-center items-center'>
        <TopPanel
          coordinates={userFriendlyCoordinates}
          plot={{ x: plotX, y: plotY }}
        />
        <Stage width={canvasSize.width} height={canvasSize.height} options={{ background: 0x00CC99 }}>
            <LoadingHandler canvasSize={canvasSize}>
              <GameDisplay isSelectedPlotOwned={!!isSelectedPlotOwned} canvasSize={canvasSize} mapPosition={mapPosition} setMapPosition={setMapPosition} plotX={plotX} plotY={plotY} isMintTransactionConfirmed={isMintTransactionConfirmed}/>
            </LoadingHandler>
        </Stage>
      </div>
      <div className="divider"></div>
      <PlotInfo isLoadingSelectedPlotUri={isLoadingSelectedPlotUri} isSelectedPlotOwned={!!isSelectedPlotOwned} isVerifyingOwnership={isVerifyingOwnership} selectedPlot={selectedPlot} selectedPlotUri={selectedPlotUri ?? null}  plotX={plotX} plotY={plotY} onMintTransactionConfirmation={onMintTransactionConfirmation}/>    
    </div>
  )
}

export default GameContainer