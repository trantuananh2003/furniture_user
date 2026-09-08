import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Nếu dùng carousel khác thì giữ
import clientAPI from "~/client-api/rest-client";
import type ProductHome from "~/model/ProductHome";
import type PaginationDto from "~/model/PaginationDto";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ProductCard from "./components/ProductCard";
import SectionCategories from "./components/SectionCategory";
import HeroSection from "~/pages/Home/components/HeroSection";
import PagingBar from "~/components/common/PagingBar";

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const pageSize = 8;

  const pageCurrent = parseInt(searchParams.get("pageCurrent") || "1");
  const [paginationDto, setPaginationDto] = useState<PaginationDto>();
  const [dataNewProducts, setNewDataProducts] = useState<ProductHome[]>([]);
  const [dataRecommendProducts, setRecommendDataProducts] = useState<
    ProductHome[]
  >([]);
  const [errorRecommendResponse, setErrorRecommendResponse] = useState<
    string | null
  >(null);

  const LoadProductNew = async () => {
    const result = await clientAPI
      .service("client/products/new")
      .find(`pageSize=${8}&pageCurrent=${1}`);

    setNewDataProducts(result.result);
    setPaginationDto(result.paginationDto);
  };

  const LoadRecommendProduct = async () => {
    try {
      const result = await clientAPI
        .service("client/products/recommend")
        .find(`pageSize=${pageSize}&pageCurrent=${pageCurrent}`);

      setRecommendDataProducts(result.result);
      setPaginationDto(result.paginationDto);
    } catch (error) {
      setErrorRecommendResponse("Vui lòng đăng nhập");
    }
  };

  useEffect(() => {
    LoadRecommendProduct();
  }, [pageCurrent, searchParams, slug]);

  useEffect(() => {
    LoadProductNew();
  }, []);

  return (
    <div className="min-h-[80em]">
      <HeroSection />
      <SectionCategories />

      {/* New product */}
      <div className="relative md:w-[80%] w-full md:p-10 p-2 mx-auto">
        <div className="flex justify-between items-center p-4 md:text-3xl text-xl font-bold">
          <span>Sản phẩm mới</span>
          <span
            className="hover:cursor-pointer text-lg text-black"
            onClick={() => navigate("/products")}
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

      {/* Các phần khác vẫn giữ nguyên */}
      <div className="relative md:w-[80%] w-full md:p-10 p-2 mx-auto">
        <div className="flex justify-center items-center p-4 md:text-3xl text-xl font-bold">
          <span>Gợi ý</span>
        </div>
        {/* Grid thay thế Swiper */}
        {dataRecommendProducts?.length > 0 ? (
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-4">
            {dataRecommendProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-lg">
            {errorRecommendResponse ?? "Không có sản phẩm nào"}
          </div>
        )}
        <PagingBar
          totalRecords={paginationDto?.TotalRecords ?? 0}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default Homepage;
