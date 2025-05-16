import React from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPrice } from "../utils/DisplayPrice";
import { FaCaretRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";
import { priceDiscount } from "../utils/priceDiscount";
import imagecart from "../assets/empty_cart.webp";

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  
  const redirectToCheckoutPage = () => {
    if(user?._id){
      navigate("/checkout")
      if(close) close()
      return
    }
    toast('Please login to continue')
  }

  return (
    <section className="bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50">
      <div className="bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto">
        <div className="flex items-center justify-between p-4 gap-3 shadow-md">
          <h2 className="font-semibold">Cart</h2>
          <Link to={"/"} className="lg:hidden">
            <IoClose size={25} />
          </Link>
          <button onClick={close} className="hidden lg:block">
            <IoClose size={25} />
          </button>
        </div>

        <div className="min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4">
          {cartItem[0] ? (
            <>
              <div className="flex items-center justify-between py-2 px-4 bg-blue-100 text-blue-500 rounded">
                <p>Your total savings</p>
                <p>{DisplayPrice(notDiscountTotalPrice - totalPrice)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 grid gap-4 overflow-auto">
                {cartItem[0] &&
                  cartItem.map((item, index) => {
                    return (
                      <div key={index + item} className="flex w-full gap-4">
                        <div className="w-16 h-16 min-h-16 min-w-16 border rounded">
                          <img
                            src={item?.productId?.image[0]}
                            alt=""
                            className="object-scale-down"
                          />
                        </div>
                        <div className="w-full max-w-sm text-xs">
                          <p className="text-xs text-ellipsis line-clamp-2">
                            {item?.productId?.name}
                          </p>
                          <p className="text-neutral-500">
                            {item?.productId?.unit}
                          </p>
                          <p className="font-semibold">
                            {DisplayPrice(
                              priceDiscount(
                                item?.productId?.price,
                                item?.productId?.discount
                              )
                            )}
                          </p>
                        </div>
                        <div>
                          <AddToCartButton data={item?.productId} />
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="bg-white p-4">
                <h3 className="font-semibold">Bill details</h3>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Items Total</p>
                  <p className="flex items-center gap-2"><span className="line-through text-neutral-400">{DisplayPrice(notDiscountTotalPrice)}</span><span>{DisplayPrice(totalPrice)}</span></p>
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
            </>
          ) : (
            <div className="mt-14 flex flex-col justify-center items-center">
              <img
                src={imagecart}
                alt="empty cart image"
                className="w-full h-full object-scale-down"
              />
              <Link onClick={close} to={'/'} className="block bg-green-600 text-white mt-5 px-4 py-2 rounded">Start Shopping</Link>
            </div>
          )}
        </div>

        {cartItem[0] && (
          <div className="p-2">
            <div className="bg-green-700 font-bold text-base px-4 py-4 text-neutral-100 p-2 static bottom-3 rounded flex items-center justify-between gap-4">
              <div>{DisplayPrice(totalPrice)}</div>

              <button onClick={redirectToCheckoutPage} className="flex items-center gap-1">
                Proceed
                <span>
                  <FaCaretRight />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DisplayCartItem;
