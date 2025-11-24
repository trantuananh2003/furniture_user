import { useEffect, useState } from "react";
import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "../../model/ApiResponse";
import type { OrderResponse } from "../../model/OrderResponse.";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ReviewDialog from "./Components/DialogComponent";
import Swal from "sweetalert2";

const OrderPage = () => {
  const [activeTab, setActiveTab] = useState("Processing");
  const [dataOrders, setDataOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tabs = ["Processing", "Shipping", "Returned", "Done", "Cancelled"];

  const LoadOrders = async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse = await clientAPI
        .service("client/orders")
        .find(`orderStatus=${activeTab}`);
      setDataOrders(response.result || []);
    } catch (error) {
      setDataOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    LoadOrders();
  }, [activeTab]);

  const triggerCancelOrder = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Xác nhận hủy đơn hàng",
      text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Quay lại",
    });

    if (result.isConfirmed) {
      try {
        let formData = new FormData();
        formData.append("orderStatus", "Cancelled");
        const response: ApiResponse = await clientAPI
          .service("client/orders")
          .patchEachProperty(orderId, formData);

        if (response.isSuccess) {
          Swal.fire("Đã hủy!", "Đơn hàng của bạn đã được hủy.", "success");
          LoadOrders();
        } else {
          Swal.fire(
            "Lỗi!",
            "Không thể hủy đơn hàng. Vui lòng thử lại.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể kết nối đến máy chủ.", "error");
      }
    }
  };

  const triggerShowInfoOrder = async (orderId: string) => {
    try {
      var data: ApiResponse = await clientAPI
        .service(`orders/${orderId}`)
        .find();

      toast.success(
        <div>
          <strong>Đơn vị vận chuyển:</strong> {data.result?.transferService}{" "}
          <br />
          <strong>Mã vận đơn:</strong> {data.result?.addressCode}
        </div>
      );
    } catch (e) {
      toast.warn("Không có thông tin");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 to-indigo-200 p-4">
      <div className="bg-white  shadow-md rounded-md">
        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-2 text-sm font-medium ${
                activeTab === tab
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-700 hover:text-red-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="p-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
            className="w-full border rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {activeTab} Orders
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Hiển thị danh sách đơn hàng trong trạng thái "{activeTab}".
          </p>

          {isLoading ? (
            <div className="text-center text-gray-500 mt-4">Đang tải...</div>
          ) : dataOrders.length === 0 ? (
            <div className="text-gray-500 text-center mt-4">
              Không có đơn hàng trong trạng thái "{activeTab}".
            </div>
          ) : (
            dataOrders.map((order, index) => (
              <div
                key={index}
                className="bg-gray-100 shadow-md rounded-md p-4 mt-4"
              >
                <div className="flex justify-between m-2">
                  <div className="flex  items-center">
                    Trạng thái đơn hàng:&nbsp;
                    <div className="text-green-600">{order.orderStatus}</div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-700 text-sm">
                      Ngày đặt hàng:&nbsp;
                    </span>
                    <div className="text-black underline">
                      {order?.orderPaidTime
                        ? format(new Date(order?.orderPaidTime), "dd/MM/yyyy")
                        : "Chưa có thông tin"}
                    </div>
                  </div>
                </div>
                <div className=" flex flex-col bg-gray-100 gap-4 p-3">
                  {order.orderItems.map((orderItem, indexOr) => (
                    <div
                      key={indexOr}
                      className="relative flex border border-t-gray-400 justify-around gap-4"
                    >
                      <img
                        src={
                          orderItem.imageItemUrl ||
                          "https://placehold.co/600x400"
                        }
                        className="w-16 h-16 m-2 object-cover rounded-md"
                      />
                      <div className="flex flex-col">
                        <div className="text-lg">{orderItem.nameItem}</div>
                        <div>x{orderItem.quantity}</div>
                      </div>
                      <div className="flex-1 text-black mt-2 text-right px-3">
                        {Number(orderItem.price).toLocaleString("vi-VN")} đ
                      </div>
                      {activeTab === "Done" &&
                        orderItem.isComment === false && (
                          <div className="absolute bottom-1 right-1">
                            <button
                              className="px-4 py-2 bg-yellow-500 text-white rounded"
                              onClick={() => setIsDialogOpen(true)}
                            >
                              Đánh giá
                            </button>

                            {isDialogOpen && (
                              <ReviewDialog
                                productId={orderItem.productItem_Id}
                                name={orderItem.nameItem}
                                orderItemId={orderItem.id}
                                onClose={() => setIsDialogOpen(false)}
                                onSuccess={() => {
                                  console.log("Đánh giá thành công");
                                }}
                              />
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                  <div className="flex flex-row justify-between">
                    <div>
                      <span className="text-lg text-black font-bold">
                        Địa chỉ nhận hàng:{" "}
                      </span>
                      {order.shippingAddress}
                    </div>
                    <div>
                      <span className="text-sm text-black">Thành tiền: </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "baseline",
                        }}
                      >
                        <span className="text-lg text-orange-600 font-bold">
                          đ {Number(order.totalPrice).toLocaleString("vi-VN")}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                {activeTab === "Processing" && (
                  <div className="flex justify-end">
                    <button
                      className="bg-red-600 rounded-md px-2 py-1 text-white"
                      onClick={() => triggerCancelOrder(order.id)}
                    >
                      Hủy đơn
                    </button>
                  </div>
                )}
                {(activeTab === "Shipping" ||
                  activeTab === "Returned" ||
                  activeTab === "Done" ||
                  activeTab === "Cancelled") && (
                  <div className="flex justify-end">
                    <button
                      className="bg-green-800 rounded-md px-2 py-1 text-white"
                      onClick={() => triggerShowInfoOrder(order.id)}
                    >
                      Xem thông tin vẫn chuyển
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
