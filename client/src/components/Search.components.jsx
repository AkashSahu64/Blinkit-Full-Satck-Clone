import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import useMobile from "../hooks/useMobile.hooks";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();
  const params = useLocation()
  const searchText = params.search.slice(3)

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  const handleOnChange = (e) => {
    const value = e.target.value
    const url = `/search?q=${value}`
    navigate(url) 
  }
  // console.log("search", isSearchPage)

  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-8 lg:h-10 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200">
      <div>
        {isMobile && isSearchPage ? (
          <Link to={'/'} className="flex justify-center items-center h-full p-1 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md">
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button className="flex justify-center items-center h-full p-3 group-focus-within:text-primary-200">
            <IoSearch size={22} />
          </button>
        )}
      </div>
      <div className="w-full h-full">
        {!isSearchPage ? (
          <div
            onClick={redirectToSearchPage}
            className=" w-full h-full flex items-center"
          >
            <TypeAnimation
              sequence={[
                'Search "milk"',
                1000,
                'Search "bread"',
                1000,
                'Search "paneer"',
                1000,
                'Search "butter"',
                1000,
                'Search "sugar"',
                1000,
                'Search "curd"',
                1000,
                'Search "cocolate"',
                1000,
                'Search "rice"',
                1000,
                'Search "chips"',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Search for products..."
              autoFocus
              defaultValue={searchText}
              className="w-full h-full bg-transparent outline-none"
              onChange={handleOnChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
