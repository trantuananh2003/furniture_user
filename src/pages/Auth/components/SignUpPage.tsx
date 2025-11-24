import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "~/model/ApiResponse";

const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errConfirmPassword, setErrConfirmPassword] = useState("");

  const handleSignUp = async () => {
    setErrEmail("");
    setErrPassword("");
    setErrConfirmPassword("");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    if (!email.includes("@")) {
      setErrEmail("Email không hợp lệ!");
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrPassword(
        "Mật khẩu phải từ 8 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt!"
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrConfirmPassword("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      var formData = new FormData();
      formData.append("FullName", fullName);
      formData.append("Email", email);
      formData.append("Password", password);

      let data: ApiResponse = await clientAPI
        .service("auth/register")
        .create(formData);

      toast.success("Đăng ký thành công!");
      window.location.reload();
    } catch (error) {
      setErrConfirmPassword("Thông tin không chính xác!");
      console.warn("Đăng ký không thành công!");
    } finally {
      setLoading(false);
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
            {errEmail && (
              <p className="text-red-500 text-sm mt-1">{errEmail}</p>
            )}
          </div>

          {/* Input Full name */}
          <div>
            <label htmlFor="fullName" className="sr-only">
              Email
            </label>
            <div className="relative">
              <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-green-400">
                O
              </span>
              <input
                type="fullName"
                name="fullName"
                id="fullName"
                placeholder="Họ tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-red-300 focus:outline-none"
              />
            </div>
            {errEmail && (
              <p className="text-red-500 text-sm mt-1">{errEmail}</p>
            )}
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
            {errPassword && (
              <p className="text-red-500 text-sm mt-1">{errPassword}</p>
            )}
          </div>

          {/* Input Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-red-400">
                🔒
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-red-300 focus:outline-none"
              />
            </div>
            {errConfirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errConfirmPassword}</p>
            )}
          </div>

          {/* Nút Đăng ký */}
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="bg-red-700 hover:bg-red-800 cursor-pointer text-white py-2 rounded-md font-semibold transition disabled:opacity-70"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          {/* Đăng ký bằng Google
          <div className="mt-4">
            <p className="text-center text-gray-600">Hoặc đăng ký bằng:</p>
            <button
              type="button"
              className="w-full mt-2 p-2 border rounded-lg flex items-center justify-center gap-2"
            >
              <img
                src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                alt="Google"
                className="w-6 h-6"
              />
            </button>
          </div> */}

          {/* Chuyển đến trang đăng nhập */}
          <div className="text-center mt-4">
            <span className="text-gray-600">Bạn đã có tài khoản? </span>
            <div className="text-red-700 hover:underline">Đăng nhập</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
