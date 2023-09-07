import React from 'react'
import { X } from 'react-feather'
import "./chip.css"

const Chip = (props) => {
  return (
    <div className='chip' style={{backgroundColor: props.color}}>
      <p>
        {props.text}
        
        {props.close && <X onClick={() => (props.onClose ? props.close() : "")}/>}</p>
    </div>
  )
}

export default Chip
