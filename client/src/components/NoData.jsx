import React from 'react'
import noDtaImage from '../assets/nothing_here_yet.webp'

const NoData = () => {
  return (
    <div className='flex flex-col items-center justify-center p-4 gap-2'>
        <img src={noDtaImage} alt="NoDataImage" className=' w-48'/>
        <p className=' text-neutral-500'>No Data Available</p>
    </div>
  )
}

export default NoData