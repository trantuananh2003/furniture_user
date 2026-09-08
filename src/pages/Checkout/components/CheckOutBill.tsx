import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CartItemResponse } from "~/model/CartResponse";
import type { RootState } from "~/redux/store";
import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "~/model/ApiResponse";
import { setCart } from "~/redux/features/cartSlice";

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

interface ItemProps {
  itemCart: CartItemResponse;
}

const ItemCheckOut = ({ itemCart }: ItemProps) => (
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 bg-gray-100 mr-4 shrink-0">
      <img
        src={itemCart.imageUrl || "https://placehold.co/600x400"}
        alt={itemCart.imageUrl}
        className="w-full h-full object-cover rounded-sm"
      />
    </div>
    <div className="grow">
      <h2 className="text-sm font-medium">{itemCart.nameOption}</h2>
      <h2 className="text-[0.8rem] text-gray-400 font-medium">
        x{itemCart.quantity}
      </h2>
    </div>
    <div className="text-right">
      <p className="font-medium text-orange-500 text-lg">
        {itemCart.salePrice.toLocaleString("vi-VN")}₫
      </p>
      <p className="font-medium text-sm line-through">
        {itemCart.price.toLocaleString("vi-VN")}₫
      </p>
    </div>
  </div>
);

const CheckOutBill = () => {
  const dispatch = useDispatch();
  const [feeShipping, setFeeShipping] = useState<ShippingFeeResponse>();
  const [calPrice, setCalPrice] = useState<CalculatorPrice>();
  const cartData = useSelector((state: RootState) => state.carts);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response: ApiResponse = await clientAPI.service("carts").find();
        dispatch(setCart(response.result));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };
    loadCart();
  }, [dispatch]);

  useEffect(() => {
    if (!cartData) return;

    const items = cartData.cartItems;
    const subtotal = items.reduce((t, i) => t + i.salePrice * i.quantity, 0);
    const discount = items.reduce(
      (t, i) => t + (i.price - i.salePrice) * i.quantity,
      0,
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