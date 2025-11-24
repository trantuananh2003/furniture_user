import React, { memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PagingBar = ({ totalRecords, pageSize }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get("pageCurrent") || "1", 10);
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      searchParams.delete("pageCurrent");
      searchParams.append("pageCurrent", page.toString());
      navigate(`?${searchParams.toString()}`);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 p-4">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 border rounded-lg ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-orange-500 text-white hover:bg-red-400"
        }`}
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 border rounded-lg ${
            page === currentPage
              ? "bg-orange-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 border rounded-lg ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-orange-500 text-white hover:bg-red-400"
        }`}
      >
        &gt;
      </button>
    </div>
  );
};

export default memo(PagingBar);
