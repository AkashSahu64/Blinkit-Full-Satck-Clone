import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import AxiosTostError from "../utils/AxiosTostError.utils";
import Axios from '../utils/Axios.utils';
import SummaryApi from '../common/SummaryApi';
import {FaAngleRight, FaAngleLeft} from 'react-icons/fa6'
import {DisplayPrice} from '../utils/DisplayPrice'
import Divider from '../components/Divider';
import image1 from '../assets/minute_delivry.webp'
import image2 from '../assets/best_price.png'
import image3 from '../assets/wide_assortmen.png'
import { priceDiscount } from '../utils/priceDiscount';
import AddToCartButton from '../components/AddToCartButton';

const ProductDisplay = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(0)
  const imageConatiner = useRef()

  const fetchProductDetails = async () => {
    try {
      // setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductDetail,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if(responseData.success){
        setData(responseData.data)
      }
    } catch (error) {
      AxiosTostError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=> {
    fetchProductDetails()
  }, [params])

  const handleScrollRight = () => {
    imageConatiner.current.scrollLeft += 100
  }

  const handleScrollLeft = () => {
    imageConatiner.current.scrollLeftt -= 100
  }

  
  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2 '>
      <div className=''>
        <div className=' bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
          <img 
            src={data.image[image]} alt="" 
            className='w-full h-full object-scale-down'
          />
        </div>
        <div className='flex items-center justify-center my-2 gap-3'>
          {
            data.image.map((img, index) => {
              return (
                <div key={img+index+"image"} className={`bg-slate-200  w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-300"}`}></div>
              )
            })
          }
        </div>
        <div className='grid relative'>
          <div ref={imageConatiner} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
            {
              data.image.map((img, index) => {
                return (
                  <div className='w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-md' key={img+index}> 
                    <img 
                    src={img} alt="productImage" 
                    onClick={()=> setImage(index)}
                    className='w-full h-full object-scale-down'
                    />
                  </div>
                )
              })
            }
          </div>
          <div className='w-full h-full hidden -ml-3 lg:flex justify-between absolute items-center'>
            <button onClick={handleScrollLeft} className='z-10 bg-white relative rounded-full shadow-lg'>
              <FaAngleLeft/>
            </button>
            <button onClick={handleScrollRight} className='z-10 bg-white relative rounded-full shadow-lg'>
              <FaAngleRight/>
            </button>
          </div>
        </div>
      </div>

      <div className='p-5 lg:pl-7 text-base lg:text-lg'>
        <p className='bg-green-300 w-fit px-2 rounded-full'>10 Min</p>
        <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>
        <p>{data.unit}</p>
        <Divider/>
        <div>
          <p>Price</p>
          <div className='flex items-center gap-2 lg:gap-4'>
          <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
            <p className='font-semibold text-lg lg:text-xl'>{DisplayPrice(priceDiscount(data.price, data.discount))}</p>
          </div>
          {
            data.discount && (
              <p className='line-through'>{DisplayPrice(data.price)}</p>
            )
          }
          {
            data.discount && (
              <p className='font-bold text-green-600 lg:text-2xl'>{data.discount}% <span className='text-base text-neutral-500'>OFF</span></p>
            )
          }
          </div>
        </div>

        {
          data.stock === 0 ? (
            <p className='text-lg text-red-500 my-2'>Out of Stock</p>
          ):(
            // <button className='my-4 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded'>Add</button>
            <div className='my-4'>
              <AddToCartButton data={data}/>
            </div>
          )
        }

        <h2 className='font-semibold'>Why shop from blinkit?</h2>
        <div>
          <div className=' flex items-center gap-4 my-4'>
            <img src={image1} 
            alt="fast delivery"
            className='w-20 h-20'
            />
            <div className=' text-sm'>
              <div className=' font-semibold'>Superfast Delivery</div>
              <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
            </div>
          </div>
          <div className=' flex items-center gap-4 my-4'>
            <img src={image2} 
            alt="best price and offer"
            className='w-20 h-20'
            />
            <div className=' text-sm'>
              <div className=' font-semibold'>Best Prices & Offers</div>
              <p>Best price destination with offers directly from the manufacturers.</p>
            </div>
          </div>
          <div className=' flex items-center gap-4 my-4'>
            <img src={image3} 
            alt="wide assortmen"
            className='w-20 h-20'
            />
            <div className=' text-sm'>
              <div className=' font-semibold'>Wide Assortment</div>
              <p>Choose from 5000+ products across food, personal care, household & other categories.</p>
            </div>
          </div>
        </div>
      </div>

      <div className='my-4 grid gap-3'>
        <div>
        <p className='font-semibold'>Description</p>
        <p className='text-base'>{data.description}</p>
        </div>
        <div>
        <p className='font-semibold'>Unit</p>
        <p className='text-base'>{data.unit}</p>
        </div>
        {
          data?.more_details && Object.keys(data?.more_details).map((element, index) => {
            return (
              <div>
              <p className='font-semibold'>{element}</p>
              <p className='text-base'>{data?.more_details[element]}</p>
              </div>
            )
          })
        }
      </div>
    </section>
  )
}

export default ProductDisplay