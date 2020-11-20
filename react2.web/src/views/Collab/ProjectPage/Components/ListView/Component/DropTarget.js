import React from 'react'
import { useDrop } from 'react-dnd'


function Square({ black }) {
  const fill = black ? 'black' : 'white'
  return <div style={{ backgroundColor: fill }} />
}

function DropTarget({ x, y, children }) {
  const black = true
  const [{ isOver, data }, drop] = useDrop({
    accept: 'KNIGHT',
    canDrop: () => { return true},
    drop: () => console.log(x, y),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      data : monitor.getItem()
    }),
  })

  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <Square black={black}>{children}</Square>
      {isOver && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: 'yellow',
          }}
        >
          {JSON.stringify(data)}
        </div>
      )}
    </div>
  )
}

export default DropTarget;
