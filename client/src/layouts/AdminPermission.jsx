import React from 'react'
import { useSelector } from 'react-redux'
import isAdmin from '../utils/isAdmin.utils'

const AdminPermission = ({children}) => {
    const user = useSelector(state => state.user)
  return (
    <>
    {
        isAdmin(user.role) ? children : <h1 className='text-red-500 text-center'>You are not authorized to view this page</h1>
    }
    </>
  )
}

export default AdminPermission