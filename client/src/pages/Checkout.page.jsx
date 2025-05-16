import React, { useState } from "react";
import { DisplayPrice } from "../utils/DisplayPrice";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import AxiosTostError from "../utils/AxiosTostError.utils";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {loadStripe} from '@stripe/stripe-js'

const Checkout = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()
  
  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.cashOnDeliveryOrder,
        data: {
          list_items: cartItemsList, 
          addressId: addressList[selectAddress]?._id, 
          subTotalAmt: totalPrice,
          totalAmt: totalPrice, 
        }
      })

      const {data: responseData} = response

      if(responseData.success){
        toast.success(responseData.message)
        if(fetchCartItem){
          fetchCartItem()
        }
        if(fetchOrder){
          fetchOrder()
        }
        navigate('/success', {
          state: {
            text: "Order"
          }
        })
      }
    } catch (error) {
      AxiosTostError(error)
    }
  }

  const handleOnlinePayment = async () => {
    try {
      toast.loading("Redirecting to payment page")
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripePromise = await loadStripe(stripePublicKey)

      const response = await Axios({
        ...SummaryApi.onlinePayment,
        data: {
          list_items: cartItemsList, 
          addressId: addressList[selectAddress]?._id, 
          subTotalAmt: totalPrice,
          totalAmt: totalPrice, 
        }
      })

      const {data: responseData} = response

      stripePromise.redirectToCheckout({sessionId: responseData.id})
      if(fetchCartItem){
        fetchCartItem()
      }
      if(fetchOrder){
          fetchOrder()
      }
    } catch (error) {
      AxiosTostError(error)
    }
  }

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        <div className="w-full">
          {/* address */}
          <h3 className="text-lg font-semibold">Select Address</h3>
          <div className="bg-white p-2 grid gap-4">
            {addressList.map((address, index) => {
              return (
                <label htmlFor={"address"+index}>
                <div key={index} className="border rounded p-3 flex gap-4 hover:bg-blue-50 cursor-pointer">
                  <div>
                    <input type="radio" id={"address"+index} value={index} onChange={(e) => setSelectAddress(e.target.value)} name="address" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{address.address_line}</h3>
                    <p>
                      {address.city}, {address.state}
                    </p>
                    <p>
                      {address.country} - {address.pincode}
                    </p>
                    <p>{address.mobile}</p>
                  </div>
                </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex items-center justify-center cursor-pointer"
            >
              Add address
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white py-4 px-2">
          {/* summary */}
          <h3 className="text-lg  font-semibold">Summary</h3>
          <div className="bg-white p-4">
            <h3 className="font-semibold">Bill details</h3>
            <div className="flex gap-4 justify-between ml-1">
              <p>Items Total</p>
              <p className="flex items-center gap-2">
                <span className="line-through text-neutral-400">
                  {DisplayPrice(notDiscountTotalPrice)}
                </span>
                <span>{DisplayPrice(totalPrice)}</span>
              </p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Quantity Total</p>
              <p className="flex items-center gap-2">{totalQty} item</p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Delivery Charge</p>
              <p className="flex items-center gap-2">Free</p>
            </div>
            <div className="flex gap-4 justify-between ml-1 font-semibold">
              <p>Grand Total</p>
              <p>{DisplayPrice(totalPrice)}</p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <button onClick={handleOnlinePayment} className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded font-semibold">
              Online Payment
            </button>
            <button onClick={handleCashOnDelivery} className="py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white rounded">
              Cash on delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default Checkout;
