import React from 'react'
import ArrowKeys from '../ArrowKeys'
import PlotInfo from '../plot/PlotInfo'

type Props = {
    keysPressedRef:  React.MutableRefObject<Record<string, boolean>>,
    plotX: number,
    plotY: number,
}

const BottomPanel = (props: Props) => { //TODO: discard component 
  return (
    <div className='flex max-w-[1200px] m-auto h-[12rem]'>
    <div className='w-1/4 flex justify-center items-center'>
      <ArrowKeys keysPressed={props.keysPressedRef.current} />
    </div>
    <div className="divider divider-horizontal"></div>
    <div className='w-3/4'>
      <PlotInfo plotX={props.plotX} plotY={props.plotY} />
    </div>
  </div>
  )
}

export default BottomPanel