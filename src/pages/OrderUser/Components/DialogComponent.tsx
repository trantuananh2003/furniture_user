import React, { useState } from "react";
import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "~/model/ApiResponse";
import { toast } from "react-toastify";

interface ReviewDialogProps {
  productId: string;
  orderItemId: string;
  name: string;
  onClose: () => void;
  onSuccess: () => void;
}

const Star = ({
  filled,
  onClick,
}: {
  filled: boolean;
  onClick: () => void;
}) => (
  <svg
    onClick={onClick}
    className={`w-8 h-8 cursor-pointer ${
      filled ? "text-yellow-400" : "text-gray-300"
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.455a1 1 0 00-.364 1.118l1.286 3.974c.3.92-.755 1.688-1.54 1.118l-3.388-2.455a1 1 0 00-1.176 0l-3.388 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.037 9.402c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.975z" />
  </svg>
);

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  productId,
  orderItemId,
  name,
  onClose,
  onSuccess,
}) => {
  const [comment, setComment] = useState("");
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rate < 0 || rate > 5) {
      alert("Điểm đánh giá phải nằm trong khoảng 0 đến 5");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("ProductItemId", productId);
      formData.append("Comment", comment);
      formData.append("Rate", rate.toString());
      formData.append("orderItemId", orderItemId);

      var data: ApiResponse = await clientAPI
        .service("reviews")
        .create(formData);

      toast.success("Đánh giá thành công");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      alert("Gửi đánh giá thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4">
          Đánh giá sản phẩm <span className="text-blue-600">{name}</span>
        </h2>

        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= rate}
              onClick={() => setRate(star)}
            />
          ))}
        </div>

        <textarea
          className="w-full p-2 border rounded mb-4 resize-none"
          rows={4}
          placeholder="Nhập bình luận..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            } transition`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDialog;
