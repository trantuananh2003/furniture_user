import { useNavigate } from "react-router-dom";
import type ProductHome from "~/model/ProductHome";
import { TbCube } from "react-icons/tb";

interface Props {
  product: ProductHome;
}

function ProductCard({ product }: Props) {
  const navigate = useNavigate();

  const navigateProductDetail = (slug: string) => {
    navigate(`/products/${slug}`);
  };
  return (
    <div
      className="
      relative
      border border-gray-200
      cursor-pointer
      hover:opacity-75 hover:shadow-lg
      md:m-1
    "
      onClick={() => navigateProductDetail(product.slug)}
    >
      {/* Product image */}
      <div className="group relative h-40 overflow-hidden sm:h-48">
        <img
          src={product.thumbnailUrl ?? "https://placehold.co/600x400"}
          alt={product.name}
          className="
          h-full w-full object-cover
          transition-transform duration-500
          group-hover:scale-110
        "
        />
      </div>

      {/* Product information */}
      <div className="mx-2 mb-2 text-sm">
        <h3
          className="
          mt-2 w-full
          line-clamp-2
          min-h-10
          font-semibold
          text-center
          md:text-left sm:text-lg
        "
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex justify-center items-center md:justify-start gap-1.5">
          <span className="text-lg font-bold text-green-700 sm:text-xl">
            {product.salePrice.toLocaleString("vi-VN")}đ
          </span>

          {product.price > product.salePrice && (
            <span className="hidden md:block text-xs text-gray-400 line-through sm:text-sm">
              {product.price.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        {/* Sold */}
        <p className="text-sm text-center md:text-left text-gray-500">
          Đã bán: {product.totalSoldQuantity}
        </p>
      </div>

      {/* Badges */}
      <div className="absolute left-1 top-1 flex flex-col gap-1">
        {product.salePrice !== product.price && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white sm:h-10 sm:w-10">
            {((1 - product.salePrice / product.price) * 100).toFixed(0)}%
          </div>
        )}

        {product.isHaveModel3D && (
          <button
            type="button"
            className="
            flex h-9 w-9 items-center justify-center
            rounded-sm bg-gray-300
            sm:h-10 sm:w-10
          "
          >
            <TbCube className="size-5 sm:size-6" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
