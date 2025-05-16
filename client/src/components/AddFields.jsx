import React from 'react'
import { IoClose } from 'react-icons/io5'

const AddFields = ({close, value, onChange, submit}) => {
  return (
    <section className='fixed bottom-0 left-0 right-0 top-0 bg-neutral-900 flex items-center justify-center bg-opacity-70 z-50 p-3'>    
        <div className='bg-white rounded p-4 w-full max-w-md'>
            <div className='flex items-center justify-between gap-3'>
                <h1 className='font-semibold'>Add Fields</h1>
                <button onClick={close}>
                    <IoClose size={25}/>
                </button>
            </div>
            <input
                className='bg-blue-50 my-3 p-2 outline-none focus-within:border-primary-100 rounded w-full border'
                placeholder='Enter field name'
                value={value}
                onChange={onChange}
            />
            <button onClick={submit}
            className='bg-primary-200 px-4 py-2 rounded mx-auto w-fit block hover:bg-primary-100'>
                Add Field
            </button>
        </div>
    </section>
  )
}

export default AddFields