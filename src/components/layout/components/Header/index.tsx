import React, { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type User from "../../../../model/User";
import Cart from "../Cart";
import type { RootState } from "../../../../redux/store";
import { setUser, emptyUserState } from "../../../../redux/features/userSlice";
import "./Header_style.css";
import Navigation from "../Navigation";
import logo from "~/assets/leaf_logo.svg";

const Header = () => {
  const [stringSearch, setStringSearch] = useState("");
  const [isOpenUser, setIsOpenUser] = useState(false);
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
        <div className="flex items-center justify-around sm:p-2 p-4">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-[4em] h-[4em] mx-[2em]" />
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
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={2}
                  d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
          </div>

          {/* User*/}
          <div className="flex justify-center items-center">
            {userData.user_id ? (
              <div className="flex flex-row gap-4 sm:flex ">
                <Cart />
                {/* Icon người dùng */}
                <div className="cursor-pointer relative">
                  <div onClick={() => setIsOpenUser((prev) => !prev)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-8 text-green-100"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div
                    className={`dropdown-menu-user ${
                      isOpenUser ? "open-menu-user" : ""
                    } z-10`}
                  >
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
                  className="max-[640px]:hidden flex  bg-slate-200 px-2 py-1 rounded-full items-center text-black hover:text-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-10 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <div>
                    <span>Đăng nhập </span>
                  </div>
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
