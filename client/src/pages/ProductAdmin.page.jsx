import React, { useEffect, useState } from "react";
import AxiosTostError from "../utils/AxiosTostError.utils";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import Loader from "../components/Loader";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearchOutline } from "react-icons/io5";
import EditProductAdmin from "../components/EditProductAdmin";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage);
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    let flag = true;
    const delayDebounceFn = setTimeout(() => {
      if(flag){
        fetchProductData();
        flag = false;
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <section>
      <div className=" p-2 bg-white shadow-md flex items-center justify-between gap-2">
        <h2 className=" font-semibold">Product</h2>
        <div className="bg-slate-100 px-2 flex items-center gap-2 py-1 rounded-md border focus-within:border-primary-200">
          <IoSearchOutline size={25} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search Product here..."
            className="w-full outline-none bg-transparent"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {loading && <Loader />}

      <div className="p-2 bg-blue-50">
        <div className="min-h-[50vh]">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {productData.map((p, index) => {
              return <ProductCardAdmin key={p+index} data={p} fetchProductData={fetchProductData} />;
            })}
          </div>
        </div>
        <div className="flex justify-between my-4">
          <button
            onClick={handlePrevious}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-200"
          >
            Previous
          </button>

          <button className="w-full bg-slate-100">
            {page}/{totalPageCount}
          </button>

          <button
            onClick={handleNext}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-200"
          >
            Next
          </button>
        </div>
      </div>

    </section>
  );
};

export default ProductAdmin;
