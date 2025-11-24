import React, { useState } from "react";
import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "~/model/ApiResponse";
import { toast } from "react-toastify";

interface FormDataState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState<FormDataState>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ.";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataObject = new FormData();
      formDataObject.append("OldPassword", formData.oldPassword);
      formDataObject.append("NewPassword", formData.newPassword);

      const response: ApiResponse = await clientAPI
        .service("auth/change-password")
        .create(formDataObject);

      if (response.isSuccess) {
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({});
        toast.success("Đổi mật khẩu thành công");
      } else {
        toast.success("Đổi mật khẩu không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          {/* Mật khẩu cũ */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Mật khẩu cũ
            </label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none ${
                errors.oldPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
            )}
          </div>

          {/* Mật khẩu mới */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Mật khẩu mới
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Nút Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded font-semibold ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}
