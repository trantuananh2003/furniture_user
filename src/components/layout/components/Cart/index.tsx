import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import clientAPI from "~/client-api/rest-client";
import { useDispatch, useSelector } from "react-redux";
import type User from "~/model/User";
import type { RootState } from "~/redux/store";
import type ApiResponse from "~/model/ApiResponse";
import {
  setCart,
  updateCartItemQuantity,
  removeCartItem,
} from "~/redux/features/cartSlice";
import { FaShoppingCart, FaTimes } from "react-icons/fa";

function Cart() {
  const dispatch = useDispatch();
  const cartData = useSelector((state: RootState) => state.carts);
  const userData: User = useSelector((state: RootState) => state.users);
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);

  const cartItems = cartData?.cartItems ?? [];
  const totalCartItems = cartItems.length;
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.salePrice * item.quantity,
    0,
  );

  // Call Api
  const loadCart = useCallback(async () => {
    try {
      const data: ApiResponse = await clientAPI.service("carts").find();
      dispatch(setCart(data.result));
    } catch {
      console.error("Error during system");
    }
  }, [dispatch]);

  // Upsert s giỏ hàng
  const upsertProductToCart = async (cartItem: FormData) => {
    try {
      await clientAPI.service("carts").put(null, cartItem);
      loadCart();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCartItem = async (cartId: string, cartItemId: string) => {
    const apiResponse: ApiResponse = await clientAPI
      .service(`carts/${cartId}/cartitems`)
      .delete(cartItemId);
    if (apiResponse.isSuccess) {
      dispatch(removeCartItem(cartItemId));
    }
  };

  // Thêm vao giỏ hàng
  const triggerAddItemManual = (
    productItem_Id: string,
    quantity: number,
    isAddManual: boolean,
  ) => {
    const data = new FormData();
    data.append("product_Id", productItem_Id);
    data.append("quantity", quantity.toString());
    data.append("isAddManual", isAddManual.toString());
    upsertProductToCart(data);
  };

  useEffect(() => {
    if (userData.email) {
      loadCart();
    }
  }, [userData, loadCart]);

  // Đóng giỏ hàng khi click bên ngoài / nhấ Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // Khóa cuộn trang nền khi mở giỏ hàng (mobile)
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  return (
    <div ref={cartRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label="Giỏ hàng"
        className="relative flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <FaShoppingCart className="size-4" />
        {totalCartItems > 0 && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-lime-900 text-[0.65rem] font-bold leading-none text-white">
            {totalCartItems > 99 ? "99+" : totalCartItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white sm:absolute sm:inset-auto sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-[80vh] sm:w-96 sm:shadow-lg sm:ring-1 sm:ring-gray-200">
          <div className="flex min-h-0 flex-1 flex-col p-4">
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 py-3">
              <h3 className="text-base font-bold text-gray-800">Giỏ hàng</h3>
              <span className="ml-auto text-xs text-gray-500">
                {totalCartItems} sản phẩm
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Đóng giỏ hàng"
                className="flex size-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <FaTimes className="size-4" />
              </button>
            </div>

            {totalCartItems > 0 ? (
              <>
                <div className="mt-2 min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id ?? item.product_Id ?? index}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-100 sm:h-20 sm:w-20">
                        <img
                          src={item.imageUrl ?? "https://placehold.co/600x400"}
                          alt={item.nameOption}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium text-gray-800">
                          {item.nameOption}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            value={item.quantity}
                            type="number"
                            min="1"
                            max="100"
                            onChange={(e) => {
                              dispatch(
                                updateCartItemQuantity({
                                  product_Id: item.product_Id,
                                  quantity: Number(e.target.value),
                                }),
                              );
                            }}
                            onBlur={() => {
                              triggerAddItemManual(
                                item.product_Id,
                                item.quantity,
                                false,
                              );
                            }}
                            className="w-11 rounded-md border bg-white py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <div>
                            <p className="text-sm font-bold text-orange-500">
                              {item.salePrice.toLocaleString()}đ
                            </p>
                            {item.price > item.salePrice && (
                              <p className="text-xs text-gray-400 line-through">
                                {item.price.toLocaleString()}đ
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteCartItem(cartData.id, item.id)}
                        aria-label={`Xóa ${item.nameOption}`}
                        className="p-1 text-gray-400 transition-colors hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-gray-100 py-2.5">
                  <span className="text-sm font-medium text-gray-600">
                    Tổng:
                  </span>
                  <span className="text-base font-bold text-orange-500">
                    {totalPrice.toLocaleString()}đ
                  </span>
                </div>

                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 block w-full rounded-lg bg-teal-700 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-800"
                >
                  THANH TOÁN
                </Link>
              </>
            ) : (
              <p className="flex flex-1 items-center justify-center py-8 text-center text-sm text-gray-500">
                Giỏ hàng của bạn đang trống.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Cart);
