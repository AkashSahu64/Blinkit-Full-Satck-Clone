import React from 'react'
import { Link } from 'react-router-dom'

const Cancel = () => {
  return (
     <div className="m-2 w-full max-w-sm bg-red-200 p-4 rounded mx-auto flex flex-col justify-center items-center gap-5">
      <p className="text-red-800 font-bold">
        Order Cancceled
      </p>
      <Link to='/' className="border border-red-900 textredn-900 hover:bg-red-900 hover:text-white transition-all px-4 py-1">Continue Shopping</Link>
    </div>
  )
}

export default Cancel