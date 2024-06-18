type Props = {
  keysPressed: Record<string, boolean>;
}

const ArrowKeys = ({ keysPressed }: Props) => {

  const getcolorForArrow = (type:string): string => {
    const isKeyPressed = keysPressed[type]
    const colorString = isKeyPressed ? 'text-white bg-primary': 'text-primary'

    return colorString;
  }
  return (
    <div>
      <div className="flex justify-center w-full">
        <kbd className={`kbd kbd-lg ${getcolorForArrow('ArrowUp')}`}>▲</kbd>
      </div>
      <div className="flex justify-center gap-12 w-full">
        <kbd className={`kbd kbd-lg ${getcolorForArrow('ArrowLeft')}`}>◀︎</kbd>
        <kbd className={`kbd kbd-lg ${getcolorForArrow('ArrowRight')}`}>▶︎</kbd>
      </div>
      <div className="flex justify-center w-full">
        <kbd className={`kbd kbd-lg ${getcolorForArrow('ArrowDown')}`}>▼</kbd>
      </div>
    </div>
  )
}

export default ArrowKeys