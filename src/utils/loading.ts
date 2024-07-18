import { Assets, Texture }from 'pixi.js';

export type NumberCallback = (e: number) => void

export const loadAssets = ( assets: Map<string, string>, progressUpdate: NumberCallback): Promise<Texture[]> => {
  const assetNames = [...assets.keys()];

  return new Promise((resolve, reject) => {
    assets.forEach((assetSrc, assetName) => Assets.add({
        alias: assetName,
        src: assetSrc
    }));
    
    Assets.load(assetNames, progressUpdate).then((textures) => {
        if (Object.keys(textures).length === assetNames.length) {
            resolve(Object.values(textures));
          } else {
            reject(new Error('Some assets failed to load.'));
          }
        });
    })
};
