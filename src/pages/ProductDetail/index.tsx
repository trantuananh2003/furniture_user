import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import clientAPI from "~/client-api/rest-client";
import type ApiResponse from "../../model/ApiResponse";
import type User from "../../model/User";
import type { RootState } from "../../redux/store";
import type { ProductDetail } from "../../model/ProductDetail";
import type ProductHome from "~/model/ProductHome";

import Tabs from "./Components/Tabs";
import ProductCard from "../Home/components/ProductCard/ProductCard";
import QuantitySelector from "../../components/layout/components/QuantityPlusMinus/QuantityPlusMinus";
import Spinner from "../../components/layout/components/Loading/Spinner";

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentImageSelected, setCurrentImageSelected] = useState<string>();
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  const [dataProduct, setDataProducts] = useState<ProductDetail>();
  const userData: User = useSelector((state: RootState) => state.users);

  const [dataRecommendProducts, setRecommendDataProducts] = useState<
    ProductHome[]
  >([]);
  const [dataSameProductRecommend, setDataSameProductRecommend] = useState<
    ProductHome[]
  >([]);

  // Lấy chi tiết sản phẩm
  const LoadDetailProduct = async () => {
    try {
      setIsLoading(true);
      const response: ApiResponse = await clientAPI
        .service(`client/products/${slug}`)
        .find();
      setDataProducts(() => response.result);
      if (response.result?.images[0]) {
        setAdditionalImages((prev) => [...prev, response.result.images]);
        triggerSelectCurrentImage(response.result?.images[0]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error during signup", error);
    }
  };

  useEffect(() => {
    LoadDetailProduct(); // Đợi LoadDetailProduct hoàn thành
  }, [slug]);

  //Upsert với giỏ hàng
  const AddProductToCart = async (cartItem: FormData) => {
    try {
      const data: ApiResponse = await clientAPI
        .service(`carts`)
        .put(null, cartItem);
      toast.success("Đã thêm vào giỏ hàng!");
      window.location.reload();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errorMessages?.[0] ?? "Đã xảy ra lỗi";
      console.error(errorMessage);
    }
  };

  const triggerAddItemManual = () => {
    const data = new FormData();
    data.append("product_id", dataProduct?.id || "");
    data.append("quantity", quantity.toString());
    data.append("isAddManual", "true");
    AddProductToCart(data);
    setQuantity(1);
  };

  const triggerBuyNow = () => {
    if (!userData.user_id) {
      toast.warn("Vui lòng đăng nhập");
      return;
    }
  };

  const triggerSelectCurrentImage = (image: string) => {
    setCurrentImageSelected(() => image);
  };

  return isLoading ? (
    <Spinner></Spinner>
  ) : (
    <div className="w-full">
      <div className="relative flex sm:flex-row flex-col lg:w-3/4 w-full gap-2 p-4 mx-auto">
        <div className="flex sm:flex-row flex-col-reverse mx-auto gap-2">
          {/* Additional Images Section */}
          <div className="flex sm:flex-col flex-row gap-2 z-50 w-max max-h-[25em] overflow-y-auto">
            {additionalImages?.length > 0 &&
              additionalImages.map((image, index) => (
                <img
                  key={index}
                  onClick={() => triggerSelectCurrentImage(image)}
                  className="w-20 h-20 object-cover rounded-md border hover:cursor-pointer hover:border-gray-500"
                  src={image || "https://placehold.co/600x400"}
                  alt={`Additional Image ${index}`}
                />
              ))}
          </div>

          {/* Main Image Section */}
          <div className="relative flex flex-col gap-2 z-10">
            <div className="relative">
              <img
                className="w-[400px] h-[400px] p-1 object-contain rounded-md"
                src={currentImageSelected || "https://placehold.co/600x400"}
                alt="Product Thumbnail"
              />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 sm:max-w-[50%] max-w-[90%]">
          <h1 className="text-2xl font-bold mb-2">{dataProduct?.name}</h1>

          {/* Thông tin phụ */}
          {/* <div className="flex gap-5">
            <div className="text-sm text-gray-500 font-semibold mb-4">
              SKU: {currentItemSelected?.sku}
            </div>
            <div className="text-sm text-gray-500 font-semibold mb-4">
              Đã bán:{" "}
              <span className="font-bold text-black">
                {currentItemSelected?.soldQuantity}
              </span>
            </div>
          </div> */}

          {/* Price */}
          <div className="bg-gray-100 text-xl w-max p-2 text-red-700 font-semibold mb-4 flex gap-2 items-center">
            {dataProduct?.salePrice.toLocaleString()} &#8363;
            {/* {dataProduct?.saleProgram?.name && (
              <span className=" text-white text-xs font-semibold uppercase">
                <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/a67394e0bf3ee5f4d181.svg"></img>
              </span>
            )} */}
            <span className="text-gray-500 line-through text-sm ml-2">
              {dataProduct?.price.toLocaleString()} &#8363;
            </span>
          </div>

          {/* Thương hiệu*/}
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-bold">Thương thiệu:&nbsp;</h2>
            <ul className=" text-gray-700">{dataProduct?.brand?.name}</ul>
          </div>

          {/* Kích thước */}
          <div className="mb-4 flex flex-row gap-2 items-center">
            <h2 className="text-lg font-bold">Kích thước (cm):</h2>
            <p>
              {dataProduct?.lengthSize &&
              dataProduct?.widthSize &&
              dataProduct?.heightSize
                ? `${dataProduct.lengthSize} dài x ${dataProduct.widthSize} rộng x ${dataProduct.heightSize} cao `
                : "N/A"}
            </p>
          </div>

          {/* <div className="mb-4 flex flex-row gap-2 items-center">
            <h2 className="text-lg font-bold">Cân nặng:</h2>
            <p>
              {currentItemSelected?.weight
                ? `${(currentItemSelected.weight / 1000).toFixed(2)} kg`
                : "N/A"}
            </p>
          </div> */}

          {/* Quantity */}
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-bold">Số lượng:&nbsp;</h2>
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          </div>

          {/* Buttons */}
          {dataProduct !== undefined && (
            <div className="flex flex-row items-center sm:justify-start justify-center rounded-3xl gap-4">
              <button
                className="font-semibold font-sans rounded-3xl bg-[#da684c] uppercase text-white py-2 px-4 hover:bg-[#f89075]"
                onClick={triggerBuyNow}
              >
                Mua ngay
              </button>
              <button
                className="font-sans uppercase border rounded-3xl border-gray-950 py-2 px-4 hover:bg-gray-400"
                onClick={triggerAddItemManual}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          )}
        </div>
      </div>

      {/*Tabs*/}
      <div className="sm:w-1/2 w-[90%] mx-auto">
        <Tabs
          description={dataProduct?.description || ""}
          product_id={dataProduct?.id || null}
        />
      </div>

      {/*Gợi ý sản phẩm*/}
      <div className="sm:p-10 p-5">
        <div className="flex justify-between px-4 text-3xl font-bold ">
          <span> Sản phẩm liên quan </span>
          {/* <span className="text-sm"> Xem thêm </span> */}
        </div>
        <div className="grid sm:grid-cols-4 grid-cols-2 gap-4">
          {dataSameProductRecommend.length > 0 ? (
            dataSameProductRecommend.map((product, index) => (
              <div key={index}>
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="text-center text-lg">Không có sản phẩm nào</div>
          )}
        </div>
      </div>

      {/*Gợi ý sản phẩm*/}
      <div className="sm:p-10 p-5">
        <div className="flex justify-between px-4 text-3xl font-bold py-4">
          <span> Gợi ý cho bạn</span>
          {/* <span className="text-sm"> Xem thêm </span> */}
        </div>
        <div className="grid sm:grid-cols-4 grid-cols-2 gap-4">
          {dataRecommendProducts.length > 0 ? (
            dataRecommendProducts.map((product, index) => (
              <div key={index}>
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="text-center text-lg">Không có sản phẩm nào</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
