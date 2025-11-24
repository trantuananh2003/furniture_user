import { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clientAPI from "~/client-api/rest-client";
import { useDispatch, useSelector } from "react-redux";
import type User from "~/model/User";
import type { RootState } from "../../../../redux/store";
import type { CartResponse } from "../../../../model/CartResponse";
import type ApiResponse from "../../../../model/ApiResponse";
import { setCart } from "../../../../redux/features/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartData, setCartData] = useState<CartResponse>();
  const navigate = useNavigate();

  const userData: User = useSelector((state: RootState) => state.users);

  //Call Api
  const LoadData = async () => {
    try {
      const data: ApiResponse = await clientAPI.service("carts").find();
      dispatch(setCart(data.result));
      setCartData(data.result);
    } catch {
      console.error("Error during system");
    }
  };

  //Upsert với giỏ hàng
  const UpsertProductToCart = async (cartItem: FormData) => {
    try {
      const data: ApiResponse = await clientAPI
        .service(`carts`)
        .create(cartItem);
      LoadData();
    } catch (error) {
      console.error("Error during signup", error);
    }
  };

  const deleteCartItem = async (cartId: string, cartItemId: string) => {
    const apiResponse: ApiResponse = await clientAPI
      .service(`carts/${cartId}/cartitems`)
      .delete(cartItemId);
    if (apiResponse.isSuccess) {
      LoadData();
    }
  };

  //Thêm vào giỏ hàng

  const triggerAddItemManual = (
    productItem_Id: string,
    quantity: string,
    isAddManual: boolean
  ) => {
    const data = new FormData();
    data.append("productItem_Id", productItem_Id);
    data.append("quantity", quantity);
    data.append("isAddManual", isAddManual.toString());
    UpsertProductToCart(data);
  };

  //None
  useEffect(() => {
    if (userData.email) {
      LoadData();
    }
  }, [userData]);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const navigateCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="relative">
      <button className="relative cursor-pointer" onClick={toggleCart}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-8 text-green-100"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
        <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {cartData?.cartItems.length}
        </span>
      </button>

      <div
        className={`sm:absolute sm:w-96 sm:right-0 max-sm:left-0 fixed mt-2 w-[100vw] bg-white border border-gray-200 rounded-lg shadow-lg z-50
      transform transition-all duration-300 ease-in-out transform-origin-top-left
      ${
        cartOpen
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"
      }`}
        onMouseLeave={() => setCartOpen(false)}
      >
        <div className="p-4">
          <div className="flex flex-row justify-between items-center">
            <h3 className="font-bold">GIỎ HÀNG</h3>
          </div>

          {cartData?.cartItems.length! > 0 ? (
            <div>
              {cartData?.cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center border-b border-gray-200 pb-4 mb-4"
                >
                  <div className="w-24 h-24 bg-gray-100 mr-4">
                    <img
                      src={item.imageUrl || "https://placehold.co/600x400"}
                      alt={item.nameOption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium">{item.nameOption}</h4>
                    <div className="flex items-center mt-1 gap-2">
                      <input
                        value={item.quantity}
                        type="number"
                        min="1"
                        max="100"
                        onChange={(e) => {
                          triggerAddItemManual(
                            item.product_Id,
                            e.target.value,
                            false
                          );
                        }}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none py-2 border rounded-md text-center"
                      />
                      <div>
                        <p className="text-orange-500 font-bold">
                          {item.salePrice.toLocaleString()}đ
                        </p>
                        <p className="text-gray-500 text-xs line-through">
                          {item.price.toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={() => deleteCartItem(cartData?.id!, item.id!)}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">TỔNG TIỀN:</span>
                <span className="text-orange-500 font-bold">
                  {cartData?.cartItems
                    .reduce((total, item) => {
                      return total + item.salePrice * item.quantity; // <-- SỬA LẠI THÀNH CÔNG THỨC NÀY
                    }, 0)
                    .toLocaleString()}
                  đ
                </span>
              </div>

              <div className="flex space-x-2">
                <Link
                  to="/checkout"
                  className="flex-1 py-2 bg-teal-700 text-white text-center rounded font-medium"
                  onClick={navigateCheckout}
                >
                  THANH TOÁN
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">Giỏ hàng của bạn đang trống.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(Cart);
