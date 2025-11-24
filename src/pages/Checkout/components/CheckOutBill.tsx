import { useEffect, useState } from "react";
import ItemCheckOut from "./ItemCheckOut";
import type { CartResponse } from "~/model/CartResponse";
import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "~/model/ApiResponse";

interface ShippingFeeResponse {
  total: number;
  serviceFee: number;
  insuranceFee: number;
  pickStationFee: number;
  couponValue: number;
  r2sFee: number;
  returnAgain: number;
  documentReturn: number;
  doubleCheck: number;
  codFee: number;
  pickRemoteAreasFee: number;
  deliverRemoteAreasFee: number;
  codFailedFee: number;
}

interface CalculatorPrice {
  subtotal: number;
  discount: number;
  total: number;
}

const CheckOutBill = () => {
  const [feeShipping, setFeeShipping] = useState<ShippingFeeResponse>();
  const [cartData, setCartData] = useState<CartResponse>();
  const [calPrice, setCalPrice] = useState<CalculatorPrice>();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response: ApiResponse = await clientAPI.service(`carts`).find();
        setCartData((prev) => ({
          ...prev,
          ...response?.result,
        }));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    if (!cartData) return;

    const items = cartData.cartItems;
    const subtotal = items.reduce((t, i) => t + i.salePrice * i.quantity, 0);
    const discount = items.reduce(
      (t, i) => t + (i.price - i.salePrice) * i.quantity,
      0
    );

    setCalPrice({
      subtotal,
      discount,
      total: subtotal + (feeShipping?.total || 0),
    });
  }, [cartData, feeShipping]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Order Items */}
      <div className="p-4 space-y-3">
        {cartData?.cartItems.map((item) => (
          <ItemCheckOut key={item.id} itemCart={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 px-5 py-4 border-t space-y-2">
        <div className="flex justify-between text-gray-700">
          <span className="text-base">Tạm tính</span>
          <span className="font-medium">
            {calPrice?.subtotal.toLocaleString("vi-VN")} ₫
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span className="text-sm">Giảm giá</span>
          <span className="text-sm text-red-500">
            -{calPrice?.discount.toLocaleString("vi-VN")} ₫
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-600">
            Phí vận chuyển ước tính (GHN)
          </span>
          <span className="text-sm text-blue-600 font-medium">
            {feeShipping?.total && feeShipping.total !== 0
              ? `${feeShipping.total.toLocaleString("vi-VN")} ₫`
              : "Chưa có phí"}
          </span>
        </div>

        <div className="border-t pt-3 mt-2 flex justify-between items-center">
          <span className="text-base font-semibold">Tổng cộng</span>
          <span className="text-xl font-bold text-gray-900">
            {calPrice?.total.toLocaleString("vi-VN")} ₫
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckOutBill;
