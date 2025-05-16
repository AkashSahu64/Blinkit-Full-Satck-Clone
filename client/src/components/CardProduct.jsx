import React from "react";
import { DisplayPrice } from "../utils/DisplayPrice";
import { Link } from "react-router-dom";
import { validUrlConvert } from "../utils/ValidUrlConvert";
import { priceDiscount } from "../utils/priceDiscount";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const url = `/product/${validUrlConvert(data.name)}-${data._id}`;
  
  
  return (
    <Link to={url} className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white">
      <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
        <img
          src={data.image[0]}
         // alt={data.name}
          className="w-full h-full object-scale-down lg:scale-125"
        />
      </div>
      <div className="flex items-center gap-2">
      <div className=" rounded text-xs lg:text-sm w-fit px-2 p-[1px] lg:mt-1 text-green-600 bg-green-50">
        10 min
      </div>
      <div>
      {
          Boolean(data.discount) &&(
            <p className="text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full">{data.discount}% OFF</p>
          )
        }
      </div>
      </div>
      <div className="px-2 lg:px-0 font-medium text-ellipsis text-sm line-clamp-2" title={data.name}>
        {data.name}
      </div>
      <div className="w-fit px-2 lg:px-0 text-sm lg:text-base">
        {data.unit}
      </div>

      <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base">
       <div className="flex items-center gap-1">
       <div className=" font-semibold">
          {DisplayPrice(priceDiscount(data.price, data.discount))}
        </div>
       </div>
        <div className="">
         {
          data.stock == 0 ? (
            <p className="text-red-500 text-sm text-center">Out of Stock</p>
          ): (
            <AddToCartButton data={data}/>
          )
         }
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
