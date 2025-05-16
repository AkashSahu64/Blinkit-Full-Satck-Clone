import React, { useEffect, useState } from 'react'
import AxiosTostError from "../utils/AxiosTostError.utils";
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const Product = () => {
    const [productData, setProductData] = useState([])
    const [page, setPage] = useState(1)

    const fetchProductData = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getProduct,
                data: {
                    page: page,
                }
            })
            
            const {data, responseData} = response
            console.log(data)
            if (responseData.success) {
                setProductData(responseData.data)
            } else {
                AxiosTostError(responseData.message || data.error || "Failed to fetch product data")
            }
        } catch (error) {
            AxiosTostError(error.message || error || "Failed to fetch product data")
        }
    }

    useEffect(() => {
        fetchProductData()
    }, [])
  return (
    <div>Product.page</div>
  )
}

export default Product