import { Link } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:flex">
      {/* Nút mở menu (hamburger) cho màn hình nhỏ */}
      <button
        className="fixed top-[50%] left-4 z-50 p-2 text-white bg-gray-800 rounded lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-t-2 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static`}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold">Thông tin cá nhân</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                to="/information"
                className="block p-2 text-gray-700 rounded hover:bg-gray-200"
              >
                Thông tin tài khoản
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className="block p-2 text-gray-700 rounded hover:bg-gray-200"
              >
                Đơn hàng
              </Link>
            </li>
            <li>
              <Link
                to="/change-password"
                className="block p-2 text-gray-700 rounded hover:bg-gray-200"
              >
                Đổi mật khẩu
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay (màn hình nhỏ khi mở menu) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default Sidebar;
