import type User from "../../model/User";
import type { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";

const PaymentSuccess = () => {
  const userData: User = useSelector((state: RootState) => state.users);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-20 text-green-600 mx-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <h1 className="text-2xl font-bold mt-4 text-gray-800">
          Thanh toán thành công!
        </h1>
        <p className="mt-2 text-gray-600">
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Đơn hàng của bạn đã được
          xử lý thành công.
        </p>
        <div className="mt-4">
          <p className="text-gray-800">
            <strong>Email:</strong> {userData.email}
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
