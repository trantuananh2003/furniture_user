export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  images: string[];
  slug: string;
  price: number;
  salePrice: number;
  quantity: number;
  category: Category;
  brand: Brand;
  lengthSize: number;
  widthSize: number;
  heightSize: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface SaleProgram {
  id: string;
  name: string;
  slug: string;
}
