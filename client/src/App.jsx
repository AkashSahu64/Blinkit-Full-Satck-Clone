import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import toast, { Toaster } from "react-hot-toast";
import fetchUserDetials from "./utils/FetchUserDetails.utils";
import { useEffect } from "react";
import { setUserDetails } from "./store/userSlice";
import { useDispatch } from "react-redux";
import React from "react";
import {
  setAllCategory,
  setAllSubCategory,
  loadingCategory,
} from "./store/productSlice";
import Axios from "./utils/Axios.utils";
import SummaryApi from "./common/SummaryApi";
import GlobalProvider from "./provider/GlobalProvider";
import CartMobileLink from "./components/CartMobile";

function App() {
  const dispatch = useDispatch();
  const location = useLocation()

  const fetchUser = async () => {
    const UserData = await fetchUserDetials();
    if (UserData) {
      dispatch(setUserDetails(UserData.data));
    } else {
      toast.error("Error fetching user details");
    }
  };

  const fetchCategory = async () => {
    try {
      dispatch(loadingCategory(true));
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data));
        //setCategoryData(responseData.data);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      toast.error("Failed to fetch categories");
    } finally {
      dispatch(loadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data));
        //setCategoryData(responseData.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
    //fetchCartItem()
  }, []);

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {
        location.pathname !== '/checkout' && (
          <CartMobileLink />
        )
      }
    </GlobalProvider>
  );
}

export default App;
