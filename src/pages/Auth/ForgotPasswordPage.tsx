import React, { useState } from "react";
import { Link } from "react-router-dom";
import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "../../model/ApiResponse";

// filepath: d:\HocKy\2024-2025\Kỳ 2\KLTN\BanNoiThat_user\src\pages\Auth\ForgotPasswordPage.tsx

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleForgotPassword = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    // Replace this with your actual forgot password API call
    try {
      if (!email.includes("@")) {
        setError("Vui lòng nhập email hợp lệ.");
      } else {
        var data: ApiResponse = await clientAPI
          .service("auth/forgot-password")
          .find(`email=${email}`);
        if (data.isSuccess) {
          setSuccessMsg(
            "Hướng dẫn đặt lại mật khẩu đã được gửi tới email của bạn."
          );
        }
      }
    } catch {
      setError("Error .");
    }
    setLoading(false);
  };

  return (
    <div className="min-h flex items-center justify-center p-3">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Quên mật khẩu</h1>
        <p className="text-center text-gray-600 mb-4">
          Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
        </p>

        <div className="flex flex-col gap-4">
          {/* Input Email */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-red-400">
                @
              </span>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-red-300 focus:outline-none"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {successMsg && (
              <p className="text-green-500 text-sm mt-1">{successMsg}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleForgotPassword}
            disabled={loading}
            className="bg-red-700 hover:bg-red-800 text-white py-2 rounded-md font-semibold transition disabled:opacity-70"
          >
            {loading ? "Đang xử lý..." : "Gửi email xác nhận"}
          </button>

          {/* Back to Login */}
          <div className="text-center mt-4">
            <Link to="/auth" className="text-red-700 hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
