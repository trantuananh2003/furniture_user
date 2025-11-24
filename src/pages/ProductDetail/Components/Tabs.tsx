import { useState, useEffect } from "react";
import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "../../../model/ApiResponse";

interface TabsProps {
  description: string;
  product_id: string | null;
}

interface Review {
  id: string;
  user_Id: string;
  comment: string;
  rate: number;
  createAt: string;
  nameUser: string;
}

const Tabs = (props: TabsProps) => {
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "reviews" && props.product_id) {
      fetchReviews();
    }
  }, [activeTab, props.product_id]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(props.product_id);
      const data: ApiResponse = await clientAPI
        .service(`reviews/product/${props.product_id}`)
        .find();

      setReviews(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return <Description />;
      case "reviews":
        return <Reviews />;
      default:
        return null;
    }
  };

  const Description = () => (
    <div>
      <span dangerouslySetInnerHTML={{ __html: props.description }} />
    </div>
  );

  const Reviews = () => (
    <div className="space-y-6">
      {loading && (
        <p className="text-blue-500 text-center">Đang tải đánh giá...</p>
      )}
      {error && <p className="text-red-500 text-center">Lỗi: {error}</p>}
      {!loading && !error && reviews.length === 0 && (
        <p className="text-gray-500 text-center">
          Chưa có đánh giá nào cho sản phẩm này.
        </p>
      )}
      {!loading &&
        !error &&
        reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-semibold">
                  {review.user_Id?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{review.nameUser}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(review.createAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-700 mb-2">
                <strong>Đánh giá:</strong> {review.comment}
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">
                  {"★".repeat(Math.round(review.rate))}
                </span>
                <span className="text-gray-300">
                  {"★".repeat(5 - Math.round(review.rate))}
                </span>
                <span className="text-sm text-gray-500">
                  ({review.rate} / 5)
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="tabs-container">
      {/* Tab Navigation */}
      <div className="tabs-nav flex space-x-4 border-b">
        <button
          className={`tab ${
            activeTab === "description" ? "active font-bold" : ""
          }`}
          onClick={() => setActiveTab("description")}
        >
          Mô tả
        </button>
        <button
          className={`tab ${activeTab === "reviews" ? "active font-bold" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          Đánh giá ({reviews.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content mt-4">{renderContent()}</div>
    </div>
  );
};

export default Tabs;
