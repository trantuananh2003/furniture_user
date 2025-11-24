import React, { useState, useEffect } from "react";
import axios from "axios";

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

interface LocationSelectorProps {
  selectedProvince: string;
  selectedDistrict: string;
  selectedWard: string;
  shippingAddress: string;
  setSelectedProvince: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDistrict: React.Dispatch<React.SetStateAction<string>>;
  setSelectedWard: React.Dispatch<React.SetStateAction<string>>;
  setProvincesOut: React.Dispatch<React.SetStateAction<Province[]>>;
  setDistrictsOut: React.Dispatch<React.SetStateAction<District[]>>;
  setWardsOut: React.Dispatch<React.SetStateAction<Ward[]>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedProvince,
  selectedDistrict,
  selectedWard,
  shippingAddress,
  setSelectedProvince,
  setSelectedDistrict,
  setSelectedWard,
  setProvincesOut,
  setDistrictsOut,
  setWardsOut,
  setAddress,
}) => {

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/p");
        setProvinces(response.data);
        setProvincesOut(response.data)
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        try {
          const response = await axios.get("https://provinces.open-api.vn/api/d/");
          const filteredDistricts = response.data.filter(
            (district: any) => String(district.province_code) === String(selectedProvince)
          );
          setDistricts(filteredDistricts);
          setDistrictsOut(filteredDistricts);

        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      } else {
        setDistricts([]);
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        try {
          const response = await axios.get("https://provinces.open-api.vn/api/w/");
          const filteredWards = response.data.filter(
            (ward: any) => String(ward.district_code) === String(selectedDistrict)
          );
          setWards(filteredWards);
          setWardsOut(filteredWards);
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      } else {
        setWards([]);
      }
    };
    fetchWards();
  }, [selectedDistrict]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row space-x-4">
        <div className="flex-1">
          <label className="block text-gray-700 font-bold mb-2">Tỉnh/Thành phố:</label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-bold mb-2">Quận/Huyện:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-bold mb-2">Xã/Phường:</label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Chọn xã/phường</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">Địa chỉ:</label>
        <input className="w-full p-2 border rounded" placeholder="Địa chỉ" value={shippingAddress} onChange={(e) => setAddress(e.target.value)} />
      </div>
    </div>
  );
};

export default LocationSelector;
