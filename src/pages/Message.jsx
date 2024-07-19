import React from 'react'

const Message = ({name, message, isOther}) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: !isOther ? 'flex-end' : 'flex-start'}} className='w-full'>
        <p className='text-black'>{name}</p>
        <div style={{backgroundColor: !isOther ? '#5c80e6' : '#bac6e8'}} className='w-fit h-fit max-w-[300px] p-4'>
            <p style={{color: !isOther ? 'white': 'black'}}  className='break-all' >{message}</p>
        </div>
    </div>
  )
}

export default Message