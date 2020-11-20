import React from 'react'
import { useDrag, DragPreviewImage} from 'react-dnd'

function DragSource() {
  const [{isDragging}, drag, preview] = useDrag({
    item: { type: 'KNIGHT', name : 'drag drag' },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div>
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          fontSize: 25,
          fontWeight: 'bold',
          cursor: 'move',
          backgroundColor : isDragging ? '#f00' : '#00f',
        }}
      >
        ♘
      </div>
    </div>
    
  )
}

export default DragSource