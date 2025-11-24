import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "~/model/ApiResponse";
import { setUser } from "../../../redux/features/userSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errAccount, setErrAccount] = useState("");

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setErrAccount("Vui lòng nhập đẩy đủ thông tin");
        return;
      }
      let data: ApiResponse = await clientAPI
        .service("auth/login")
        .authentication(email, password);
      dispatch(setUser(data.result));
      if (data.isSuccess) {
        window.location.href = "/";
      }
    } catch (error: any) {
      setErrAccount(
        error?.response?.data?.errorMessages[0] || "Hệ thống từ chối"
      );
    }
  };

  const handleSuccessLoginGoogle = async (response: any) => {
    try {
      const formData = new FormData();
      formData.append("TokenId", response?.credential);
      let data: ApiResponse = await clientAPI
        .service("auth/login-google")
        .create(formData);
      localStorage.setItem("userToken", data?.result?.token);

      dispatch(setUser(data.result));
      if (data.isSuccess) {
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">
          Chào mừng bạn ghé thăm
        </h1>
        <h2 className="text-3xl font-bold text-center text-red-700 mb-6">
          SPRING HOME
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Hãy nhập thông tin của bạn
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
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-red-300 focus:outline-none"
              />
            </div>
          </div>
          {/* Input Password */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-red-400">
                🔒
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-red-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {/* {errPassword && <p className="text-red-500 text-sm mt-1">{errPassword}</p>} */}
            {errAccount && (
              <p className="text-red-500 text-sm mt-2">{errAccount}</p>
            )}
          </div>

          {/* Nút Đăng nhập */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-red-700 hover:bg-red-800 text-white py-2 rounded-md font-semibold cursor-pointer transition disabled:opacity-70"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {/* Quên mật khẩu */}
          <div className="text-center text-sm text-gray-600">
            Quên mật khẩu?{" "}
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Khôi phục mật khẩu
            </Link>
          </div>

          {/* Đăng nhập bằng Google */}
          <div className="mt-2 mx-auto text-center">
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_API_GOOGLE_AUTH || ""}
            >
              <GoogleLogin
                onSuccess={handleSuccessLoginGoogle}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </GoogleOAuthProvider>
          </div>

          {/* Chuyển đến trang đăng ký */}
          <div className="text-center mt-4">
            <span className="text-gray-600">Bạn chưa có tài khoản? </span>
            <div className="text-red-700 hover:underline">Hãy đăng ký ngay</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
