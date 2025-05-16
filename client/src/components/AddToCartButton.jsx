import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosTostError from "../utils/AxiosTostError.utils";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartQty, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0)
  const [cartItemDetails, setCartItemDetails] = useState()

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addToCart,
        data: {
          productId: data?._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) {
          fetchCartItem();
        }
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkingItem = cartItem.some(
      (item) => item.productId._id === data._id
    );
    setIsAvailableCart(checkingItem);

    const productQty = cartItem.find(item => item.productId._id === data._id)
    setQty(productQty?.quantity)
    setCartItemDetails(productQty)
  }, [data, cartItem]);

  const increaseQty = async(e) => {
    e.preventDefault()
    e.stopPropagation()

    const response = await updateCartQty(cartItemDetails?._id, qty+1)
    if(response.success){
      toast.success('Item added')
    }
  }

  const decreaseQty = async(e) => {
    e.preventDefault()
    e.stopPropagation()

    if(qty == 1 ){
        deleteCartItem(cartItemDetails?._id)
    }else{
      const response = await updateCartQty(cartItemDetails?._id, qty-1)
      if(response.success){
        toast.success('Item removed')
      }
    }
  }

  return (
    <div className="w-full max-w-[150px]">
      {isAvailableCart ? (
        <div className="flex h-full w-full">
          <button onClick={decreaseQty} className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded-sm flex items-center justify-center"><FaMinus/></button>
          <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">{qty}</p>
          <button onClick={increaseQty} className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded-sm flex items-center justify-center"><FaPlus/></button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="bg-green-600 text-white px-2 lg:px-4 py-1 rounded hover:bg-green-500 transition duration-200 ease-in-out"
        >
          {loading ? <Loader /> : "Add"}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
