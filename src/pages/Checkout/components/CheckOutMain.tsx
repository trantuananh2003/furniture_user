import React, { useState, useEffect, useCallback } from "react";
import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "~/model/ApiResponse";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type User from "~/model/User";

interface OrderInfo {
  fullName: string;
  email: string;
  address: string;
  phoneNumber: string;
  paymentMethod: string;
}

const initialOrderInfo: OrderInfo = {
  fullName: "",
  email: "",
  phoneNumber: "",
  address: "",
  paymentMethod: "cod",
};

const CheckOutMain: React.FC = () => {
  const userData: User = useSelector((state: RootState) => state.users);
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState<OrderInfo>(initialOrderInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUserInfo = async () => {
      if (!userData?.user_id) return;
      try {
        const response: ApiResponse = await clientAPI
          .service(`users/${userData.user_id}`)
          .find();
        if (response?.result) {
          setOrderInfo((prev) => ({
            ...prev,
            fullName: response.result.fullName || prev.fullName,
            email: response.result.email || prev.email,
            phoneNumber: response.result.phoneNumber || prev.phoneNumber,
            address: response.result.address || prev.address,
          }));
        }
      } catch (error) {
        console.error("Error loading user information:", error);
      }
    };
    loadUserInfo();
  }, [userData]);

  const handleInputChange = useCallback(
    (field: keyof OrderInfo) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setOrderInfo((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [],
  );

  const validateOrderInfo = (): boolean => {
    const { fullName, phoneNumber, email, address, paymentMethod } = orderInfo;

    if (!fullName.trim()) {
      toast.warning("Vui lòng nhập họ và tên");
      return false;
    }
    if (!phoneNumber.trim()) {
      toast.warning("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!/^(0|\+84)[3-9][0-9]{8}$/.test(phoneNumber.trim())) {
      toast.warning("Số điện thoại không hợp lệ");
      return false;
    }
    if (!email.trim()) {
      toast.warning("Vui lòng nhập email");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.warning("Email không hợp lệ");
      return false;
    }
    if (!address.trim()) {
      toast.warning("Vui lòng nhập địa chỉ giao hàng");
      return false;
    }
    if (paymentMethod !== "vnpay" && paymentMethod !== "cod") {
      toast.warning("Vui lòng chọn phương thức thanh toán");
      return false;
    }

    return true;
  };

  const createOrder = async () => {
    if (!validateOrderInfo()) return;

    setIsSubmitting(true);

    const formOrder = new FormData();
    formOrder.append("fullName", orderInfo.fullName.trim());
    formOrder.append("phoneNumber", orderInfo.phoneNumber.trim());
    formOrder.append("email", orderInfo.email.trim());
    formOrder.append("shippingAddress", orderInfo.address.trim());
    formOrder.append("paymentMethod", orderInfo.paymentMethod);

    try {
      const response: ApiResponse = await clientAPI
        .service("Payment")
        .post(formOrder);

      if (response.isSuccess) {
        toast.success("Đặt hàng thành công!");
        if (orderInfo.paymentMethod === "cod") {
          navigate("/");
        } else if (orderInfo.paymentMethod === "vnpay") {
          window.location.href = response.result;
        }
      } else {
        toast.error("Đặt hàng thất bại, vui lòng thử lại");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Đã xảy ra lỗi khi đặt hàng";
      toast.error(errorMessage);
      console.error("Error creating order:", error);
    } finally {
      setIsSubmitting(false);
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
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Họ và tên
            </label>
            <input
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Nhập họ và tên"
              value={orderInfo.fullName}
              onChange={handleInputChange("fullName")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="Nhập email"
                value={orderInfo.email}
                onChange={handleInputChange("email")}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Số điện thoại
              </label>
              <input
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="Nhập số điện thoại"
                value={orderInfo.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Địa chỉ giao hàng
            </label>
            <input
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Nhập địa chỉ giao hàng"
              value={orderInfo.address}
              onChange={handleInputChange("address")}
            />
          </div>
        </div>

        {/* Payment */}
        <h2 className="text-2xl font-bold mt-8 mb-3 text-gray-800">
          Phương thức thanh toán
        </h2>
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <label
            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              orderInfo.paymentMethod === "cod"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={orderInfo.paymentMethod === "cod"}
              onChange={handleInputChange("paymentMethod")}
              className="accent-green-600 w-5 h-5"
            />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="font-medium text-gray-800">
                  Thanh toán khi nhận hàng
                </span>
                <p className="text-sm text-gray-500">
                  Chỉ thanh toán khi nhận được hàng
                </p>
              </div>
            </div>
          </label>

          <label
            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              orderInfo.paymentMethod === "vnpay"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="vnpay"
              checked={orderInfo.paymentMethod === "vnpay"}
              onChange={handleInputChange("paymentMethod")}
              className="accent-green-600 w-5 h-5"
            />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <span className="font-medium text-gray-800">
                  Thanh toán qua VNPAY
                </span>
                <p className="text-sm text-gray-500">
                  Chuyển hướng đến cổng thanh toán VNPAY
                </p>
              </div>
            </div>
          </label>
        </div>

        <div className="flex justify-end mt-8">
          <button
            className={`font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white hover:cursor-pointer"
            }`}
            onClick={createOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOutMain;
