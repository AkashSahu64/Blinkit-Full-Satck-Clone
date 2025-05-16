import React from 'react'
import { IoClose } from 'react-icons/io5'

const ConfirmBox = ({cancel, confirm, close}) => {
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
        <div className='bg-white w-full max-w-md p-4 rounded'>
            <div className='flex justify-end'>
                <IoClose onClick={close} className='cursor-pointer' />
            </div>
            <div className='flex flex-col gap-4'>
                <h2 className='text-lg font-semibold'>Are you sure?</h2>
                <div className='flex gap-4'>
                <button onClick={cancel} className='flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounded'>Cancel</button>
                <button onClick={confirm} className='flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded'>Confirm</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ConfirmBox