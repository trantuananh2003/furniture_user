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
    //Card product
    <div
      className="relative md:m-1 box-border min-w-[11.3em] border border-[#e4e2e2] font-['Inter',sans-serif] hover:opacity-75 hover:cursor-pointer hover:shadow-[0_0_10px_rgba(0,0,0,0.5)] lg:h-[22rem]"
      onClick={() => navigateProductDetail(product.slug)}
    >
      <div className="relative h-48 overflow-hidden group">
        <img
          src={product.thumbnailUrl ?? "https://placehold.co/600x400"}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out 
               opacity-100 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col items-start mx-2 mb-2 text-[0.8rem] md:text-sm">
        <h3 className="mt-2 w-full min-h-[3.4rem] overflow-hidden text-ellipsis whitespace-nowrap md:text-[1.1rem]">
          {product.name}
        </h3>

        <div className="flex flex-wrap items-center gap-1 w-full">
          <span className="text-[#2b8a3e] text-xl">
            {product.salePrice.toLocaleString()}đ
          </span>

          {product.price !== 0 && (
            <span className="line-through text-gray-400 text-sm">
              {product.price.toLocaleString("vn")}đ
            </span>
          )}
        </div>

        <div className="text-gray-500 text-sm">
          Đã bán: {product.totalSoldQuantity}
        </div>
      </div>

      <div className="absolute top-1 left-1 flex flex-col gap-1">
        {product.salePrice !== product.price && (
          <div className="flex justify-center items-center text-[16px] w-10 h-10 rounded-full text-white bg-[#c92a2a]">
            {((1 - product.salePrice / product.price) * 100).toFixed(0)}%
          </div>
        )}
        {product.isHaveModel3D && (
          <button className="w-max px-3 py-1 h-full font-semibold rounded-sm bg-gray-300 flex justify-center items-center">
            <TbCube className="size-6" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
