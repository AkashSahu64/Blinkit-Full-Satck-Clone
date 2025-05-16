import React, { useEffect, useRef, useState } from "react";
import { Link} from "react-router-dom";
import AxiosTostError from "../utils/AxiosTostError.utils";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import CardLoader from "./CardLoader";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import {useSelector} from 'react-redux'
import { validUrlConvert } from "../utils/ValidUrlConvert";

const CategoryWiseProduct = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const subCategoryData = useSelector(state => state.product.allSubCategory);

  const loadingCardNumber = new Array(6).fill(null);

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: id,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, []);

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200;
  };

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200;
  };

  const handleProductList = () => {
    const subCategory = subCategoryData.find(sub => {
      return sub.category?.some(c => c._id === id);
    });
  
    if (!subCategory) return '/'; // fallback route or handle gracefully
  
    const url = `/${validUrlConvert(name)}-${id}/${validUrlConvert(subCategory?.name)}-${subCategory?._id}`;
    return url;
  };
  

  const redirectURL = handleProductList()

  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
        <Link to={redirectURL} className="text-green-600 hover:text-green-400">
          See All
        </Link>
      </div>
      <div className="relative flex items-center">
        <button
          className="z-10 absolute left-2 bg-white hidden lg:block hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full"
          onClick={handleScrollLeft}
        >
          <FaAngleLeft />
        </button>
        <div
          className="flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth"
          ref={containerRef}
        >
          {loading &&
            loadingCardNumber.map((c, index) => {
              return <CardLoader key={index} />;
            })}

          {data.map((p, index) => {
            return (
              <CardProduct key={p._id + "CategoryProduct" + index} data={p} />
            );
          })}
        </div>
        <button
          className="z-10 absolute right-2 hidden lg:block bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full"
          onClick={handleScrollRight}
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
};

export default CategoryWiseProduct;
