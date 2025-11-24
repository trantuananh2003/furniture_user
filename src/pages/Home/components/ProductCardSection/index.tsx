import { useParams, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import PaginationDto from '../../../../model/PaginationDto';
import ProductHome from '../../../../model/ProductHome';
import ProductCard from '../ProductCard/ProductCard';
import PagingBar from '../../../../components/common/PagingBar';

function ProductCardSection() {
  const [searchParams] = useSearchParams();

  const pageCurrent = parseInt(searchParams.get("pageCurrent") || "1");
  const [paginationDto, setPaginationDto] = useState<PaginationDto>() || "";
  const [dataRecommendProducts, setRecommendDataProducts] = useState<ProductHome[]>([]);
  const pageSize = 9;

  return (<div>
    <div className='p-10'>
      <div className="headline flex justify-between items-center p-4 text-3xl font-bold ">
        <span> Gợi ý cho bạn</span>
      </div>
      <div className="grid grid-cols-4 lg:grid-cols-3">
        {dataRecommendProducts?.length > 0 ? dataRecommendProducts?.map((product, index) => (
          <div key={index} >
            <ProductCard product={product} />
          </div>
        )) : <div className="text-center text-lg mx-auto">Không có sản phẩm nào</div>}
      </div>
    </div>
    <PagingBar totalRecords={paginationDto?.TotalRecords} pageSize={pageSize} />
  </div>);
}

export default ProductCardSection;