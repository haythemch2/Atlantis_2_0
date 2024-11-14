export interface Boundaries {
    min: number;
    max: number;
  }
  
  interface GameConfig {
    mapUrl: string;
    tile: number;
    plot: number;
    road: number;
    stageWidth: number;
    stageHeight: number;
    cameraOffset_X: number;
    cameraOffset_Y: number;
    boundaries_X: Boundaries;
    boundaries_Y: Boundaries;
  }
  
const gameConfig: GameConfig = {
    mapUrl: '/map.png',
    tile: 12,
    plot: 12 * 9,
    road: 12 * 2,
    stageWidth: 1024,
    stageHeight: 576,
    cameraOffset_X: -840,
    cameraOffset_Y: -1250,
    boundaries_X: { min: 500, max: -600 },
    boundaries_Y: { min: 200, max: -900 },
};

export const gamePatch: string = "241411";
  
export default gameConfig;
  