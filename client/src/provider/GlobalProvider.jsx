import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import { handleAddItemCart } from "../store/cartProduct";
import { useDispatch, useSelector } from "react-redux";
import AxiosTostError from "../utils/AxiosTostError.utils";
import toast from "react-hot-toast";
import { priceDiscount } from "../utils/priceDiscount";
import { handleAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";



export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector(state => state?.user)

  const fetchCartItem = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCartQty = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: {
          _id: id,
          qty: qty,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        //toast.success(responseData.message);
        fetchCartItem();
        return responseData
      }
    } catch (error) {
      AxiosTostError(error);
      return error
    }
  };

  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: {
          _id: cartId,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosTostError(error);
    }
  };

  useEffect(() => {
    const qty = cartItem.reduce((prev, curr) => {
      return prev + curr.quantity;
    }, 0);
    setTotalQty(qty);

    const tprice = cartItem.reduce((prev, curr) => {
      const priceAfterdiscount = priceDiscount(
        curr?.productId?.price,
        curr?.productId?.discount
      );
      return prev + (priceAfterdiscount * curr.quantity);
    }, 0);
    setTotalPrice(tprice);

    const notDiscountPrice = cartItem.reduce((prev, curr) => {
      return prev + (curr?.productId?.price * curr.quantity);
    }, 0)
    setNotDiscountTotalPrice(notDiscountPrice)
  }, [cartItem]);

  const handleLogOut = () => {
    localStorage.clear()
    dispatch(handleAddItemCart([]))
  }

  const fetchAddress = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAddress
      })
      const {data: responseData} = response

      if(responseData.success){
        dispatch(handleAddress(responseData.data))
      }
    } catch (error) {
      AxiosTostError(error)
    }
  }

  const fetchOrder = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getOrderList
      })
      const {data: responseData} = response

      if(responseData.success){
        dispatch(setOrder(responseData.data))
      }
    } catch (error) {
      AxiosTostError(error)
    }
  }
  
  useEffect(() => {
    fetchCartItem()
    handleLogOut()
    fetchAddress()
    fetchOrder()
  },[user])

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartQty,
        deleteCartItem,
        fetchAddress,
        totalPrice,
        totalQty,
        notDiscountTotalPrice,
        fetchOrder
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
