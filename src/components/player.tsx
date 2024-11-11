// components/player.tsx

import { Container, Sprite, useTick } from "@pixi/react";
import { Coords } from "../GameContainer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Assets, Rectangle, Sprite as SpriteType, Texture } from "pixi.js";
import { verifyBoundariesCollisions } from "../utils/collisions";
import gameConfig from "../utils/gameConfig";

const frameWidth = 192 / 4;
const frameHeight = 68;
const frameChangeSpeed = 120; // Change speed in milliseconds

const textureCacheKeys: { [key: string]: string } = {
  ArrowDown: 'playerDown',
  ArrowUp: 'playerUp',
  ArrowLeft: 'playerLeft',
  ArrowRight: 'playerRight',
};

type PlayerProps = {
  mapPosition: Coords,
  isGameStarted: boolean,
  setMapPosition: React.Dispatch<React.SetStateAction<Coords>>;
};

const Player = ({ mapPosition, isGameStarted, setMapPosition }: PlayerProps) => {
  const { stageHeight, stageWidth} = gameConfig;

  const [frame, setFrame] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const navigationKeys = useMemo(() => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], []);
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});

  const playerRef = useRef<SpriteType>(null);

  const direction = useMemo(() => {
    const pressedKeys = Object.entries(keysPressed)
      .filter(([key, pressed]) => pressed && navigationKeys.includes(key))
      .map(([key]) => key);

    const lastPressedKey = pressedKeys[pressedKeys.length - 1];

    return lastPressedKey || 'ArrowDown'; // Default to 'ArrowDown' if no key is pressed
  }, [keysPressed, navigationKeys]);

  const isMoving = useMemo(() => {
    return (
      keysPressed['ArrowDown'] ||
      keysPressed['ArrowUp'] ||
      keysPressed['ArrowLeft'] ||
      keysPressed['ArrowRight']
    );
  }, [keysPressed]);

  const texture = Assets.get(textureCacheKeys[direction]);

  const x = frame * frameWidth;
  const y = 0;

  const frameTexture = useMemo(() => {
    return new Texture(texture.baseTexture, new Rectangle(x, y, frameWidth, frameHeight));
  }, [texture, frame]);

  useTick(() => {
    if (isMoving && isGameStarted) {
      const now = Date.now();
      if (now - lastUpdate > frameChangeSpeed) {
        setFrame((prevFrame) => (prevFrame + 1) % 4);
        setLastUpdate(now);
      }

      const newPosition = { ...mapPosition };

      // Calculate next position based on keys pressed
      if (keysPressed['ArrowUp']) newPosition.y += 5;
      if (keysPressed['ArrowDown']) newPosition.y -= 5;
      if (keysPressed['ArrowLeft']) newPosition.x += 5;
      if (keysPressed['ArrowRight']) newPosition.x -= 5;

      const collisionDetected = verifyBoundariesCollisions({
        x: playerRef.current!.x,
        y: playerRef.current!.y,
        width: frameWidth,
        height: frameHeight,
      }, newPosition)

      if (!collisionDetected) {
        setMapPosition(newPosition);
      }
    } else {
      setFrame(0); // Show the first frame when not moving
    }
  });

  useEffect(() => {
    setFrame(0); // Reset frame when direction changes
  }, [direction]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (navigationKeys.includes(event.key)) {
      event.preventDefault();
      setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key]: true }));
    }
  }, [navigationKeys]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (navigationKeys.includes(event.key)) {
      event.preventDefault();
      setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key]: false }));
    }
  }, [navigationKeys]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <Container >
      <Sprite ref={playerRef} anchor={0.5} texture={frameTexture} x={stageWidth * 0.5} y={stageHeight * 0.5} width={frameWidth} height={frameHeight} />
    </Container>
  );
};

export default Player;
