import clientAPI from "~/client-api/rest-client";
import { useEffect, useState } from "react";
import type ApiResponse from "~/model/ApiResponse";

interface Category {
  id: string;
  name: string;
  slug: string;
  categoryUrlImage: string;
}

const SectionCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = async () => {
    try {
      const data: ApiResponse = await clientAPI
        .service("client/categories")
        .find();
      setCategories(data.result);
    } catch (error) {
      console.log("test", error);
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const navigateToFilterPage = (path: string) => {
    window.location.href = `/categories/${path}`;
  };

  return categories.length > 0 ? (
    <section className="grid h-auto grid-cols-2 grid-rows-3 justify-center gap-4 bg-[#363535] p-6 md:h-[30rem] md:grid-cols-3 md:grid-rows-2 md:p-8">
      <div
        className="group relative row-span-2 cursor-pointer overflow-hidden bg-[#181616] transition-colors after:pointer-events-none after:absolute after:inset-0 after:z-[2] after:bg-black/15 after:content-[''] after:transition-colors after:duration-300 hover:after:bg-black/55"
        onClick={() => navigateToFilterPage(categories[0].slug || "#")}
      >
        <img
          className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
          src={categories[0].categoryUrlImage}
          alt="Bàn ăn"
        />
        <span className="absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[0.25rem] px-4 py-2 text-center text-lg sm:text-[1.5rem] font-medium text-white transition-all duration-300 group-hover:text-[1.8rem] group-hover:tracking-wider group-hover:[text-shadow:0_2px_8px_rgba(0,0,0,0.8),0_4px_16px_rgba(0,0,0,0.5)] md:text-[2rem] md:group-hover:text-[2.5rem]">
          {categories[0].name}
        </span>
      </div>
      {categories.slice(1).map((category, index) => (
        <div
          className="group relative cursor-pointer overflow-hidden bg-[#181616] transition-colors after:pointer-events-none after:absolute after:inset-0 after:z-[2] after:bg-black/15 after:content-[''] after:transition-colors after:duration-300 hover:after:bg-black/55"
          key={index}
          onClick={() => navigateToFilterPage(category.slug || "#")}
        >
          <img
            className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
            src={category.categoryUrlImage}
            alt={category.name}
          />
          <span className="absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[0.25rem] px-4 py-2 text-center text-lg md:text-[1.5rem] font-medium text-white transition-all duration-300 group-hover:text-[1.8rem] group-hover:tracking-wider group-hover:[text-shadow:0_2px_8px_rgba(0,0,0,0.8),0_4px_16px_rgba(0,0,0,0.5)] md:text-[2rem] md:group-hover:text-[2.5rem]">
            {category.name}
          </span>
        </div>
      ))}
    </section>
  ) : (
    <div className="mx-auto text-center">Không có danh mục</div>
  );
};

export default SectionCategories;
