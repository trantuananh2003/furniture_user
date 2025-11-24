import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Nếu dùng carousel khác thì giữ
import clientAPI from "~/client-api/rest-client";
import type ProductHome from "~/model/ProductHome";
import type ApiResponse from "~/model/ApiResponse";
import type PaginationDto from "~/model/PaginationDto";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "./components/ProductCard/ProductCard";
import SectionCategories from "./components/SectionCategory";

const Homepage: React.FC = () => {
  const [searchParams] = useSearchParams();
  let stringSearch = searchParams.get("stringSearch") || "";
  const { slug } = useParams();
  const pageCurrent = parseInt(searchParams.get("pageCurrent") || "1");
  const [paginationDto, setPaginationDto] = useState<PaginationDto>();
  const pageSize = 12;

  const [dataNewProducts, setNewDataProducts] = useState<ProductHome[]>([]);

  const LoadProductNew = async () => {
    if (slug) stringSearch = slug;

    const result = await clientAPI
      .service("client/products")
      .find<ApiResponse>(`pageSize=${10}&pageCurrent=${1}`);

    setNewDataProducts(result.result);
    setPaginationDto(result.paginationDto);
  };

  useEffect(() => {
    LoadProductNew();
  }, []);

  const navigateToFilterPage = () => {
    window.location.href = `/collections`;
  };

  return (
    <div className="min-h-[80em]">
      {/* New product */}
      <div className="relative md:w-[80%] w-full md:p-10 p-2 mx-auto">
        <div className="flex justify-between items-center p-4 md:text-3xl text-xl font-bold">
          <span>Sản phẩm mới</span>
          <span
            className="hover:cursor-pointer text-lg text-black"
            onClick={navigateToFilterPage}
          >
            Xem thêm
          </span>
        </div>

        {/* Grid thay thế Swiper */}
        {dataNewProducts?.length > 0 ? (
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-4">
            {dataNewProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-lg">Không có sản phẩm nào</div>
        )}
      </div>

      <SectionCategories />

      {/* Các phần khác vẫn giữ nguyên */}
    </div>
  );
};

export default Homepage;
