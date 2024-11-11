import { Container, Graphics, Text } from "@pixi/react";
import { useMemo, useState, useCallback } from "react";
import { TextStyle } from "pixi.js";
import { useActiveAccount } from "thirdweb/react";
import GameTitle from "./gameTitle";
import RetroButton from "./button";
import gameConfig from "../../utils/gameConfig";

const buttonHeight = 50;
const buttonMargin = 120;

type MenuProps = {
  onPlay: () => void;
  onExit: () => void;
};

const Menu = ({ onPlay, onExit }: MenuProps) => {
  const { stageHeight, stageWidth} = gameConfig;

  const [showModal, setShowModal] = useState(false);
  const account = useActiveAccount();
  const isUserConnected = useMemo(() => !!account?.address, [account]);

  const handlePlay = useCallback(() => {
    if (!isUserConnected) {
      setShowModal(true);
    } else {
      onPlay();
    }
  }, [isUserConnected, onPlay]);

  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <Container x={(stageWidth * 0.5)} y={stageHeight * 0.5} anchor={0.5}>
      <RetroButton text="Start" y={-(buttonHeight) + buttonMargin} onClick={handlePlay} />
      <RetroButton text="Exit" y={buttonHeight + buttonMargin} onClick={onExit} />
      <Container y={-350} x={-360} >
        <GameTitle />
      </Container>
      {showModal && (
        <Container>
          <Graphics
            draw={(g) => {
              g.clear();
              g.beginFill(0x000000, 0.8);
              g.drawRect(-stageWidth * 0.5, -stageHeight * 0.5, stageWidth, stageHeight);
              g.endFill();
            }}
            interactive={true}
            pointertap={closeModal}
          />
          <Text
            text="Please connect your wallet with `Connect Wallet` button for the full experience!"
            anchor={0.5}
            style={new TextStyle({ fontFamily: 'Press Start 2P, Courier, monospace', fill: "white", fontSize: 16, wordWrap: true, wordWrapWidth: 800 })}
          />
        </Container>
      )}
    </Container>
  );
};

export default Menu;