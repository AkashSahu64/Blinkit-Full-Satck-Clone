import React from 'react'
import { IoClose } from 'react-icons/io5'

const ViewImage = ({url, close}) => {
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center p-4'>
        <div className='w-full max-w-md max-h-[75vh] p-4 bg-white'>
            <button onClick={close} className='w-fit ml-auto block'>
                <IoClose size={25}/>
            </button>
            <img src={url} alt='full screen'
            className='w-full h-full object-scale-down'/>
        </div>
    </div>
  )
}

export default ViewImage