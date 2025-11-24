import React, { useState, useEffect } from "react";
import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "~/model/ApiResponse";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type User from "~/model/User";

interface OrderInfo {
  fullName: string;
  email: string;
  address: string;
  phoneNumber: string;
  paymentMethod: string;
}

const CheckOutMain: React.FC = () => {
  const userData: User = useSelector((state: RootState) => state.users);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    paymentMethod: "vnpay",
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response: ApiResponse = await clientAPI
          .service(`users/${userData.user_id}`)
          .find();
        setOrderInfo((prev) => ({
          ...prev,
          ...response?.result,
        }));
      } catch (error) {
        console.error("Error loading user information:", error);
      }
    };
    loadUserInfo();
  }, [userData]);

  const createOrder = async () => {
    if (
      !(
        orderInfo.paymentMethod === "vnpay" || orderInfo.paymentMethod === "cod"
      )
    ) {
      toast.warning("Vui lòng chọn phương thức thanh toán");
      return;
    }

    const formOrder = new FormData();
    formOrder.append("fullName", orderInfo.fullName);
    formOrder.append("phoneNumber", orderInfo.phoneNumber);
    formOrder.append("email", orderInfo.email);
    formOrder.append("shippingAddress", orderInfo.address);
    formOrder.append("paymentMethod", orderInfo.paymentMethod);

    try {
      const response: ApiResponse = await clientAPI
        .service(`Payment`)
        .create(formOrder);
      if (response.isSuccess) {
        if (orderInfo.paymentMethod === "cod") navigate("/");
        else if (orderInfo.paymentMethod === "vnpay")
          window.location.href = response.result;
        console.log("Create order success");
      } else console.log("Create order failed");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Thông tin giao hàng
        </h1>

        {/* Card info */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="Họ và tên"
            value={orderInfo.fullName}
            onChange={(e) =>
              setOrderInfo((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Email"
              value={orderInfo.email}
              onChange={(e) =>
                setOrderInfo((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <input
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Số điện thoại"
              value={orderInfo.phoneNumber}
              onChange={(e) =>
                setOrderInfo((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
            />
          </div>

          {/* Address selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tỉnh/Thành phố
              </label>
              <select className="w-full p-2 border rounded-lg">
                <option value="">Chọn tỉnh/thành phố</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Quận/Huyện
              </label>
              <select className="w-full p-2 border rounded-lg">
                <option value="">Chọn quận/huyện</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Xã/Phường
              </label>
              <select className="w-full p-2 border rounded-lg">
                <option value="">Chọn xã/phường</option>
              </select>
            </div>
          </div>

          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="Địa chỉ chi tiết"
            value={orderInfo.address}
            onChange={(e) =>
              setOrderInfo((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>

        {/* Payment */}
        <h2 className="text-2xl font-bold mt-8 mb-3 text-gray-800">
          Phương thức thanh toán
        </h2>
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="payment"
              id="cod"
              value="cod"
              checked={orderInfo.paymentMethod === "cod"}
              onChange={(e) =>
                setOrderInfo((prev) => ({
                  ...prev,
                  paymentMethod: e.target.value,
                }))
              }
            />
            <label htmlFor="cod" className="font-medium">
              Thanh toán khi nhận hàng (COD)
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="payment"
              id="vnpay"
              value="vnpay"
              checked={orderInfo.paymentMethod === "vnpay"}
              onChange={() =>
                setOrderInfo((prev) => ({ ...prev, paymentMethod: "vnpay" }))
              }
            />
            <label htmlFor="vnpay" className="font-medium">
              Thanh toán qua VNPAY
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors"
            onClick={createOrder}
          >
            Hoàn tất đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOutMain;
