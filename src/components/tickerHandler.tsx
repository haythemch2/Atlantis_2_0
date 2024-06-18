import { useTick } from '@pixi/react';
import React from 'react'
import { Boundaries } from '../utils/gameConfig';

type Props = {
    paused: boolean,
    connectedAddress?: string,
    setCameraOffset: (value: React.SetStateAction<{
        x: number;
        y: number;
    }>) => void,
    keysPressedRef: React.MutableRefObject<Record<string, boolean>>,
    boundaries_X: Boundaries,
    boundaries_Y: Boundaries,
}

const TickerHandler = ({ paused, connectedAddress, setCameraOffset, keysPressedRef, boundaries_X, boundaries_Y }: Props) => {

    useTick(() => {
        if (!paused && connectedAddress) {
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
        }
      });

  return (
    <></>
  )
}

export default TickerHandler