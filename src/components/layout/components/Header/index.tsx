import React, { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type User from "../../../../model/User";
import Cart from "../Cart";
import type { RootState } from "../../../../redux/store";
import { setUser, emptyUserState } from "../../../../redux/features/userSlice";
import Navigation from "../Navigation";
import logo from "~/assets/leaf_logo.svg";
import { FaSearch, FaUser, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [stringSearch, setStringSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData: User = useSelector((state: RootState) => state.users);

  const triggerSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate({
      pathname: "/collections",
      search: `?stringSearch=${stringSearch.toString()}`,
    });
  };

  const triggerLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("conversationId");
    dispatch(setUser(emptyUserState));
    window.location.reload();
  };

  return (
    <header className="relative h-max p-3 bg-lime-800 max-w-full">
      <div className="container mx-auto px-1">
        <div className="flex items-center gap-2 justify-around p-4">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="size-[3em] lg:size-[4em] lg:mx-[1em]"
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 w-max flex flex-row justify-center items-center gap-1">
            <input
              type="text"
              value={stringSearch}
              onChange={(e) => setStringSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="relative w-full text-white sm:w-[20rem] lg:w-[40rem] p-2 pr-10 border-2 rounded-lg focus:outline-none focus:border-white hover:shadow-[0_0_15px_4px_rgba(0,150,255,0.7)]"
            ></input>
            <button
              className="cursor-pointer bg-gray-800 p-2 rounded"
              onClick={triggerSearch}
            >
              <FaSearch className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* User*/}
          <div className="flex justify-center items-center">
            {userData.user_id ? (
              <div className="flex sm:flex flex-row gap-4">
                <Cart />
                {/* Icon người dùng */}
                <div className="cursor-pointer relative group rounded-full hover:bg-white/10 transition-colors duration-200">
                  <FaUserCircle className="size-8 text-green-100 group-hover:text-white transition-colors duration-200" />
                  <div className="absolute right-0 mt-0.5 w-max min-w-40 bg-white border rounded-lg shadow-lg cart-dropdown whitespace-nowrap">
                    <Link
                      to="/information"
                      className="p-2 hover:cursor-pointer block"
                    >
                      Thông tin tài khoản
                    </Link>
                    <Link
                      to="/orders"
                      className="p-2 hover:cursor-pointer block"
                    >
                      Đơn hàng
                    </Link>
                    <button
                      className="p-2 hover:cursor-pointer"
                      onClick={triggerLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm">
                <Link
                  to="/auth"
                  className="flex  bg-slate-200 px-2 py-1 rounded-full items-center text-black hover:text-gray-500"
                >
                  <FaUser className="size-5" />
                  <span className="hidden lg:inline">Đăng nhập</span>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="navigate-section-header">
          <Navigation />
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
