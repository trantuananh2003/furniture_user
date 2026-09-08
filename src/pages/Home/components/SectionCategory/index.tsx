import "./SectionCategory.css";
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
    <section className="section-categories">
      <div
        className="item item-main"
        onClick={() => navigateToFilterPage(categories[0].slug || "#")}
      >
        <img
          className="img-category"
          src={categories[0].categoryUrlImage}
          alt="Bàn ăn"
        />
        <span className="text-center-category">{categories[0].name}</span>
      </div>
      {categories.slice(1).map((category, index) => (
        <div
          className="item"
          key={index}
          onClick={() => navigateToFilterPage(category.slug || "#")}
        >
          <img
            className="img-category"
            src={category.categoryUrlImage}
            alt={category.name}
          />
          <span className="text-center-category">{category.name}</span>
        </div>
      ))}
    </section>
  ) : (
    <div className="mx-auto text-center">Không có danh mục</div>
  );
};

export default SectionCategories;
