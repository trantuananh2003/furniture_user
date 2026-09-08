import React, { useState, useEffect, ChangeEvent } from "react";
import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "~/model/ApiResponse";
import type User from "~/model/User";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

import { FaUser, FaPhone, FaCalendarAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoMaleFemale } from "react-icons/io5";

interface Province {
  code: string;
  name: string;
}
interface District {
  code: string;
  name: string;
}
interface Ward {
  code: string;
  name: string;
}

function InformationUserPage() {
  const userData = useSelector((state: RootState) => state.users);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  // Địa chỉ
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [address, setAddress] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // 🔵 Load user
  const loadInfoUser = async () => {
    try {
      const response: ApiResponse = await clientAPI
        .service(`users/${userData.user_id}`)
        .find();

      if (response.isSuccess) {
        const u = response.result;
        setUserInfo(u);

        setAddress(u.address || "");
        setSelectedProvince(u.provinceCode || "");
        setSelectedDistrict(u.districtCode || "");
        setSelectedWard(u.wardCode || "");
      }
    } catch {
      console.error("Error load user info");
    }
  };

  // 🔵 Update user
  const updateInfoUser = async () => {
    if (!userInfo) return;

    const formData = new FormData();
    formData.append("fullName", userInfo.fullName);
    formData.append("birthday", new Date(userInfo.birthday).toISOString());
    formData.append("isMale", userInfo.isMale);
    formData.append("phoneNumber", userInfo.phoneNumber);

    formData.append("shippingAddress", address);
    formData.append(
      "province",
      provinces.find((p) => p.code === selectedProvince)?.name || "",
    );
    formData.append(
      "district",
      districts.find((d) => d.code === selectedDistrict)?.name || "",
    );
    formData.append(
      "ward",
      wards.find((w) => w.code === selectedWard)?.name || "",
    );

    const response: ApiResponse = await clientAPI
      .service("users")
      .put(userData.user_id, formData);
    if (response.isSuccess) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (userData) loadInfoUser();
  }, [userData, isEditing]);

  // Change input
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUserInfo((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // Label component
  const Label = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <label className="flex items-center text-sm font-medium text-gray-700 gap-2 mb-1">
      {icon} {text}
    </label>
  );

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Thông tin cá nhân & Địa chỉ nhận hàng
        </h2>

        {userInfo ? (
          <div>
            {/* THÔNG TIN CÁ NHÂN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Họ tên */}
              <div>
                <Label icon={<FaUser className="text-base" />} text="Họ và tên" />
                {isEditing ? (
                  <input
                    name="fullName"
                    value={userInfo.fullName}
                    onChange={handleChange}
                    className="input w-full border rounded-lg px-3 py-2"
                  />
                ) : (
                  <p>{userInfo.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label icon={<MdEmail className="text-base" />} text="Email" />
                <input
                  value={userInfo.email}
                  disabled
                  className="input w-full border bg-gray-100 rounded-lg px-3 py-2"
                />
              </div>

              {/* Ngày sinh */}
              <div>
                <Label icon={<FaCalendarAlt className="text-base" />} text="Ngày sinh" />
                {isEditing ? (
                  <input
                    type="date"
                    name="birthday"
                    value={
                      userInfo?.birthday
                        ? userInfo.birthday.substring(0, 10)
                        : ""
                    }
                    onChange={handleChange}
                    className="input w-full border rounded-lg px-3 py-2"
                  />
                ) : (
                  <p>
                    {userInfo?.birthday
                      ? userInfo.birthday.substring(0, 10)
                      : ""}
                  </p>
                )}
              </div>

{/* Giới tính */}
              <div>
                <Label icon={<IoMaleFemale className="text-base" />} text="Giới tính" />
                {isEditing ? (
                  <select
                    name="isMale"
                    value={userInfo.isMale.toString()}
                    onChange={handleChange}
                    className="input w-full border rounded-lg px-3 py-2"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                ) : (
                  <p>{userInfo.isMale ? "Nam" : "Nữ"}</p>
                )}
              </div>

{/* Số điện thoại */}
              <div>
                <Label icon={<FaPhone className="text-base" />} text="Số điện thoại" />
                {isEditing ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={userInfo.phoneNumber}
                    onChange={handleChange}
                    className="input w-full border rounded-lg px-3 py-2"
                  />
                ) : (
                  <p>{userInfo.phoneNumber}</p>
                )}
              </div>
            </div>

            {/* ĐỊA CHỈ */}
            <div>
              <hr className="my-8" />
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                Địa chỉ nhận hàng
              </h3>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tỉnh */}
                  <select
                    value={selectedProvince || ""}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="input border rounded-lg px-3 py-2"
                  >
                    <option value="">-- Chọn Tỉnh --</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  {/* Huyện */}
                  <select
                    value={selectedDistrict || ""}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="input border rounded-lg px-3 py-2"
                  >
                    <option value="">-- Chọn Huyện --</option>
                    {districts.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  {/* Xã */}
                  <select
                    value={selectedWard || ""}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    className="input border rounded-lg px-3 py-2"
                  >
                    <option value="">-- Chọn Xã --</option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>

                  {/* Địa chỉ chi tiết */}
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số nhà, đường..."
                    className="col-span-3 border rounded-lg px-3 py-2"
                  />
                </div>
              ) : (
                <p className="text-gray-800">{userInfo.address}</p>
              )}
            </div>

            {/* NÚT */}
            <div className="flex justify-end gap-4 mt-6">
              {isEditing ? (
                <>
                  <button
                    onClick={updateInfoUser}
                    className="bg-green-500 hover:bg-green-600 text-white  px-5 py-2 rounded-lg shadow hover:cursor-pointer"
                  >
                    Lưu thông tin
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg shadow hover:cursor-pointer"
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-400 hover:bg-blue-500 hover:cursor-pointer text-white px-5 py-2 rounded-lg shadow"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        ) : (
          <p>Đang tải thông tin...</p>
        )}
      </div>
    </div>
  );
}

export default InformationUserPage;
