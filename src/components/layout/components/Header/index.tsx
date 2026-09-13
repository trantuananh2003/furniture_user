import React, { memo, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type User from "../../../../model/User";
import Cart from "../Cart";
import type { RootState } from "../../../../redux/store";
import { setUser, emptyUserState } from "../../../../redux/features/userSlice";
import Navigation from "../Navigation";
import logo from "~/assets/leaf_logo.svg";
import {
  FaAddressBook,
  FaAngleDown,
  FaReceipt,
  FaSearch,
  FaSignOutAlt,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const userData: User = useSelector((state: RootState) => state.users);

  const [stringSearch, setStringSearch] = useState<string>(
    searchParams.get("stringSearch") ?? "",
  );
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Đóng menu người dùng khi click bên ngoài / nhấ Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const triggerSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = stringSearch.trim();
    navigate(
      trimmed
        ? `/products?stringSearch=${encodeURIComponent(trimmed)}`
        : "/products",
    );
  };

  const triggerLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("conversationId");
    dispatch(setUser(emptyUserState));
    window.location.reload();
  };

  const closeUserMenu = () => setIsUserMenuOpen(false);

  const userMenuVisibility = isUserMenuOpen
    ? "visible opacity-100 pointer-events-auto"
    : "invisible opacity-0 pointer-events-none";

  return (
    <header className="bg-lime-800 text-white shadow-sm">
      <div className="mx-auto w-full max-w-[1600px] px-4">
        {/* ── Top bar: logo | search | actions ── */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 md:flex-nowrap">
          {/* Logo */}
          <Link to="/" aria-label="Trang gia" className="order-1 shrink-0">
            <img src={logo} alt="Bànnoithàt" className="h-11 w-auto lg:h-14" />
          </Link>

          {/* Tìm kié m */}
          <form
            role="search"
            onSubmit={triggerSearch}
            className="order-3 w-full min-w-0 md:order-2 md:flex-1"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={stringSearch}
                onChange={(e) => setStringSearch(e.target.value)}
                placeholder="Tìm kiếm sản phẩm"
                aria-label="Tìm kiếm sản phẩm"
                className="w-full rounded-full border border-white/40 bg-white py-2 pl-4 pr-11 text-sm text-gray-900 placeholder:text-gray-400 transition-shadow focus:border-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-300/60"
              />
              <button
                type="submit"
                aria-label="Bắt tìm kié"
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-full border-l border-white/40 text-gray-500 transition-colors hover:bg-lime-100 hover:text-lime-700"
              >
                <FaSearch className="size-4" />
              </button>
            </div>
          </form>

          {/* Hành: giỏ hàng + người dùng */}
          <div className="order-2 flex shrink-0 items-center gap-2 md:order-3 md:gap-3">
            {userData.user_id ? (
              <>
                <Cart />

                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((open) => !open)}
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-label="Meni người dùng"
                    className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 transition-colors hover:bg-white/20"
                  >
                    <FaUserCircle className="size-5" />
                    <FaAngleDown
                      className={`size-3.5 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    aria-hidden={!isUserMenuOpen}
                    className={`absolute right-0 top-full z-40 mt-2 w-52 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-gray-200 transition-all duration-150 ${userMenuVisibility}`}
                  >
                    <div className="border-b border-gray-100 px-3 py-2">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {userData.fullName || userData.email}
                      </p>
                      {userData.fullName && (
                        <p className="truncate text-xs text-gray-500">
                          {userData.email}
                        </p>
                      )}
                    </div>

                    <div className="p-1.5">
                      <Link
                        to="/information"
                        onClick={closeUserMenu}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <FaAddressBook className="size-4 text-gray-400" />
                        Thông tin tài khoản
                      </Link>
                      <Link
                        to="/orders"
                        onClick={closeUserMenu}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <FaReceipt className="size-4 text-gray-400" />
                        Đơn hàng
                      </Link>
                      <button
                        type="button"
                        onClick={triggerLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <FaSignOutAlt className="size-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"
              >
                <FaUser className="size-4" />
                <span className="hidden sm:inline">Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>

        {/* ── Navigation bar ── */}
        <div className="m-2 md:m-4">
          <Navigation />
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
