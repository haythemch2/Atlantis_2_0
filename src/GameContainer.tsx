import { Stage } from "@pixi/react";
import {  useCallback, useEffect, useState } from "react";
import useMapCalculations from "./hooks/useMapCalculations";
import gameConfig from "./utils/gameConfig";
import TopPanel from './components/panels/topPanel';
import PlotInfo, { PlotData } from "./components/plot/PlotInfo";
import LoadingHandler from "./components/LoadingHandler";
import GameDisplay from "./GameDisplay";
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
    const { stageHeight, stageWidth, cameraOffset_X, cameraOffset_Y } = gameConfig;

    const [mapPosition, setMapPosition] = useState<Coords>({ x: cameraOffset_X, y: cameraOffset_Y });
    const [plotTransactionConfirmed, setPlotTransactionConfirmed] = useState<Coords>({x:0,y:0});
    const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);

    const {
        plotX,
        plotY,
        userFriendlyCoordinates
    } = useMapCalculations(mapPosition);

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

    const onMintTransactionConfirmation = useCallback(    
        (coords: Coords) => {
            setPlotTransactionConfirmed(coords);},
        [],
    );

    useEffect(() => {
        const fetchData = async () => {
            const plotData = await getDataFromIpfs(selectedPlotUri);
            setSelectedPlot(plotData);
        };

        fetchData();
    }, [plotX, plotY, selectedPlotUri]);  

    return (
        <div className="max-w-[1200px]  m-auto">
            <div className='w-full flex flex-col justify-center items-center'>
                <TopPanel
                    coordinates={userFriendlyCoordinates}
                    plot={{ x: plotX, y: plotY }}
                />
                <Stage width={stageWidth} height={stageHeight} options={{ background: 0x00CC99 }}>
                    <LoadingHandler>
                        <GameDisplay isSelectedPlotOwned={!!isSelectedPlotOwned} mapPosition={mapPosition} setMapPosition={setMapPosition} plotX={plotX} plotY={plotY} plotTransactionConfirmed={plotTransactionConfirmed}/>
                    </LoadingHandler>
                </Stage>
            </div>
            <div className="divider"></div>
            <PlotInfo isLoadingSelectedPlotUri={isLoadingSelectedPlotUri} isSelectedPlotOwned={!!isSelectedPlotOwned} isVerifyingOwnership={isVerifyingOwnership} selectedPlot={selectedPlot} selectedPlotUri={selectedPlotUri ?? null}  plotX={plotX} plotY={plotY} onMintTransactionConfirmation={onMintTransactionConfirmation}/>    
        </div>
    );
};

export default GameContainer;