import React, { memo, useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FaFilter } from "react-icons/fa";

import clientAPI from "~/client-api/rest-client";
import type ProductHome from "../../model/ProductHome";
import type ApiResponse from "../../model/ApiResponse";
import type PaginationDto from "../../model/PaginationDto";
import ProductCard from "../Home/components/ProductCard";
import PagingBar from "~/components/common/PagingBar";
import RadioButtonBox from "./components/RadioButtonBox";
import MultiFieldComboBox from "./components/ComboboxInput";

import {
  type PriceFilter,
  type ColorFilter,
  type SizeFilter,
  PRICE_PRESETS,
  COLOR_PRESETS,
  DEFAULT_SIZE,
} from "./types";

// ──────────────────────────────────────────────
//  Helper: build query string from filter state
// ──────────────────────────────────────────────
function buildFilterQuery(params: {
  prices: PriceFilter[];
  colors: ColorFilter[];
  size: SizeFilter;
}): string {
  const parts: string[] = [];

  params.prices.forEach((p) => {
    if (!p.isChecked) return;
    parts.push(
      `PriceRanges[${parts.length}].minPrice=${p.minPrice}`,
      `PriceRanges[${parts.length}].maxPrice=${p.maxPrice}`,
    );
  });

  params.colors.forEach((c) => {
    if (!c.isChecked) return;
    parts.push(`Colors[${parts.length}]=${c.color}`);
  });

  const { length: l, width: w, height: h } = params.size;
  if (l > 0) parts.push(`size.lengthSize=${l}`);
  if (w > 0) parts.push(`size.widthSize=${w}`);
  if (h > 0) parts.push(`size.heightSize=${h}`);

  return parts.length ? "&" + parts.join("&") : "";
}

// ──────────────────────────────────────────────
//  Page component
// ──────────────────────────────────────────────
const PAGE_SIZE = 12;

const FilteredProductPage: React.FC = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const stringFilter = searchParams.get("stringSearch") || "";

  // ── State ──
  const [products, setProducts] = useState<ProductHome[]>([]);
  const [pagination, setPagination] = useState<PaginationDto | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const [prices, setPrices] = useState<PriceFilter[]>(PRICE_PRESETS);
  const [colors, setColors] = useState<ColorFilter[]>(COLOR_PRESETS);
  const [size, setSize] = useState<SizeFilter>(DEFAULT_SIZE);

  // ── Fetch products ──
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      const pageCurrent = parseInt(searchParams.get("pageCurrent") || "1", 10);
      const filterQS = buildFilterQuery({ prices, colors, size });
      console.log(filterQS);

      const query = [
        `pageSize=${PAGE_SIZE}`,
        `pageCurrent=${pageCurrent}`,
        `stringSearch=${stringFilter}`,
        `slug=${slug}`,
        filterQS,
      ]
        .filter(Boolean)
        .join("&");

      const response: ApiResponse = await clientAPI
        .service("client/products/")
        .find(query);

      setProducts(response.result ?? []);
      setPagination(response.paginationDto);
    } catch (error) {
      console.error("Failed to load filtered products", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, stringFilter, slug, prices, colors, size]);

  // Reload when URL params change (not when local filter state changes)
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, stringFilter, slug]);

  // ── Render ──
  return (
    <div className="mx-auto md:w-[75%] w-full px-4 py-6">
      {/* ── Filter bar ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
        {/* Header row: title + button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-50 rounded-lg">
              <FaFilter className="w-5 h-5 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 uppercase tracking-wide">
              Bộ Lọc
            </h2>
          </div>

          <button
            onClick={loadProducts}
            className="
              text-sm font-medium uppercase tracking-wider
              text-white bg-gray-800
              px-5 py-2 rounded-lg
              shadow-sm
              hover:bg-gray-900
              transition-all duration-200 ease-in-out
              cursor-pointer
            "
          >
            Lọc
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-end gap-3">
          <RadioButtonBox
            title="Giá sản phẩm"
            filters={prices}
            setFilters={setPrices}
          />
          <RadioButtonBox
            title="Màu sắc"
            filters={colors}
            setFilters={setColors}
            renderHeader={(filter) => (
              <p
                style={{ backgroundColor: filter?.hexCode }}
                className="w-5 h-5 rounded-full border-2 border-gray-300"
              />
            )}
          />
          <MultiFieldComboBox value={size} onChange={setSize} />
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
        {isLoading ? (
          <div className="text-center text-gray-500 col-span-full py-16">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mb-3" />
            <p className="text-sm">Đang tải sản phẩm…</p>
          </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={product.id ?? product.slug}>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 col-span-full py-16">
            <p className="text-base">
              Không có sản phẩm nào phù hợp với yêu cầu.
            </p>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      <div className="mt-10">
        <PagingBar
          totalRecords={pagination?.TotalRecords ?? 0}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
};

export default memo(FilteredProductPage);
