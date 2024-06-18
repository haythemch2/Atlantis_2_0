interface Boundaries {
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
    boundaries_X: Boundaries;
    boundaries_Y: Boundaries;
  }
  
  const gameConfig: GameConfig = {
    mapUrl: '/map.png',
    tile: 12,
    plot: 12 * 9,
    road: 12 * 2,
    stageWidth: 1200,
    stageHeight: 600,
    boundaries_X: { min: 500, max: -600 },
    boundaries_Y: { min: 200, max: -900 },
  };
  
  export default gameConfig;
  