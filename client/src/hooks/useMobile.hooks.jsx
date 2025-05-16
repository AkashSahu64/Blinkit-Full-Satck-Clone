import React,{ useEffect, useState } from "react"

const useMobile = (breackpoint = 768) => {
    const[isMobile, setIsMobile] = useState(window.innerWidth < breackpoint)

    const handleResize = () => {
        const checkpoint = (window.innerWidth < breackpoint)
        setIsMobile(checkpoint)
    }

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () =>{
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    
    return [isMobile]
}

export default useMobile;