import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import clientAPI from "~/client-api/rest-client";
import { toast } from "react-toastify";
import type ApiResponse from "../../model/ApiResponse";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";
  const token = queryParams.get("token") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [userInput, setUserInput] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (userInput.newPassword !== userInput.confirmNewPassword) {
      setLoading(false);
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Tạo FormData để chứa dữ liệu
      const formData = new FormData();
      formData.append("email", email);
      formData.append("token", token);
      formData.append("newPassword", userInput.newPassword);

      // Gửi FormData qua clientAPI
      const response: ApiResponse = await clientAPI
        .service("auth/reset-password")
        .create(formData);

      setLoading(false);

      if (response.isSuccess) {
        toast.success("Password Reset Successful");
        navigate("/auth");
      } else {
        const errorMessage =
          response?.errorMessages?.[0] || "Password reset failed";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      setLoading(false);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">
          Đặt lại mật khẩu
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="newPassword" className="sr-only">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="Nhập mật khẩu mới"
                value={userInput.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-red-300 focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="sr-only">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmNewPassword"
                id="confirmNewPassword"
                placeholder="Nhập lại mật khẩu"
                value={userInput.confirmNewPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-red-300 focus:outline-none"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition"
            disabled={loading}
          >
            {loading ? "Vui lòng đợi!" : "Xác nhận"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
