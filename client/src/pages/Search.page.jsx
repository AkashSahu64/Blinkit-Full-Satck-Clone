import React, { useEffect, useState } from "react";
import CardLoader from "../components/CardLoader";
import AxiosTostError from "../utils/AxiosTostError.utils";
import Axios from "../utils/Axios.utils";
import SummaryApi from "../common/SummaryApi";
import CardProduct from "../components/CardProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import noDataImage from "../assets/nothing_here_yet.webp";

const Search = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingArrayCard = new Array(10).fill(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const params = useLocation();
  const searchText = params?.search?.slice(3);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data);
        } else {
          setData((prev) => {
            return [...prev, ...responseData.data];
          });
        }
        setTotalPage(responseData.totalPage);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchText]);

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <p className="font-semibold">Search Results: {data.length} </p>
        <InfiniteScroll
          dataLength={data.length}
          hasMore={true}
          next={handleFetchMore}
        >
          <div className="grid grid-cols-1 py-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.map((p, index) => {
              return <CardProduct data={p} key={p?._id + index} />;
            })}

            {/* loading data */}
            {loading &&
              loadingArrayCard.map((_, index) => {
                return <CardLoader key={index + "loading"} />;
              })}
          </div>
        </InfiniteScroll>

        { /* no data image */
        !data[0] && !loading && (
          <div className="flex flex-col justify-center items-center w-full mx-auto">
            <img src={noDataImage} alt="" 
            className="w-full h-full max-w-sm"
            />
            <p className="font-semibold my-2">Nothing realated product found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Search;
