import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import Search from "./Search.components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import useMobile from "../hooks/useMobile.hooks";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayPrice } from "../utils/DisplayPrice";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();

  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();

  const user = useSelector((state) => state?.user);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  // const [totalPrice, setTotalPrice] = useState(0)
  // const [totalQty, setTotalQty] = useState(0)
  const {totalPrice, totalQty} = useGlobalContext()
  const [openCartSection, setOpenCartSection] = useState(false)


  const redirectToSearchPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setShowUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user?._id) {
      navigate("/login");
      return;
    }
    navigate("/user-menu");
  };

  // useEffect(() => {
  //   const qty = cartItem.reduce((prev, curr) => {
  //     return prev + curr.quantity
  //   },0)
  //   setTotalQty(qty)

  //   const tprice = cartItem.reduce((prev, curr) => {
  //     return prev + (curr.productId.price * curr.quantity)
  //   },0)
  //   setTotalPrice(tprice)
  // },[cartItem])

  return (
    <header className="h-[4.9rem] shadow-sm md:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          {/* logo */}
          <div className=" h-full">
            <Link to={"/"} className=" h-full flex justify-center items-center">
              <img
                src={logo}
                width={170}
                height={60}
                alt="logo"
                className=" hidden lg:block"
              />

              <img
                src={logo}
                width={120}
                height={60}
                alt="logo"
                className=" lg:hidden"
              />
            </Link>
          </div>
          {/* Search*/}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/* Login and my cart */}
          <div className="">
            {/* icon display in mobile versions */}
            <button
              className=" text-neutral-600 lg:hidden"
              onClick={handleMobileUser}
            >
              <FaRegCircleUser size={30} />
            </button>

            {/* Desktop versions */}
            <div className=" hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className="flex items-center select-none gap-1 cursor-pointer"
                  >
                    <p>Account</p>
                    {showUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {showUserMenu && (
                    <div className="absolute top-12 right-0 bg-white shadow-md rounded-md">
                      <div className="flex flex-col gap-2 p-2 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToSearchPage} className="text-lg px-2">
                  Login
                </button>
              )}
              <button onClick={() => setOpenCartSection(true)} className="flex items-center gap-2 hover:bg-green-700 bg-green-800 p-1 rounded text-white">
                <div className="animate-pulse">
                  <BsCart4 size={26} />
                </div>
                <div className="font-semibold text-sm">
                  {
                    cartItem[0] ? (
                      <div>
                        <p>{totalQty} Items</p>
                        <p>{DisplayPrice(totalPrice)}</p>
                      </div>
                    ): (
                      <p>My Cart</p>
                    )
                  }
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className=" container mx-auto px-2 lg:hidden">
        <Search />
      </div>

      {
        openCartSection && (
          <DisplayCartItem close={() => setOpenCartSection(false)}/>
        )
      }
    </header>
  );
};

export default Header;
