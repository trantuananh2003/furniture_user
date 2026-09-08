// ========== Filter Types ==========

export interface PriceFilter {
  minPrice: number;
  maxPrice: number;
  label: string;
  isChecked?: boolean;
}

export interface ColorFilter {
  color: string;
  label: string;
  isChecked?: boolean;
  hexCode?: string;
}

export interface SizeFilter {
  length: number;
  width: number;
  height: number;
}

// ========== Preset Data ==========

export const PRICE_PRESETS: PriceFilter[] = [
  { minPrice: 0, maxPrice: 200_000, label: "0₫ – 200.000₫", isChecked: false },
  { minPrice: 200_000, maxPrice: 500_000, label: "200.000₫ – 500.000₫", isChecked: false },
  { minPrice: 500_000, maxPrice: 1_000_000, label: "500.000₫ – 1.000.000₫", isChecked: false },
  { minPrice: 1_000_000, maxPrice: 5_000_000, label: "1.000.000₫ – 5.000.000₫", isChecked: false },
  { minPrice: 5_000_000, maxPrice: 10_000_000, label: "5.000.000₫ – 10.000.000₫", isChecked: false },
];

export const COLOR_PRESETS: ColorFilter[] = [
  { color: "black", label: "Đen", isChecked: false, hexCode: "#000000" },
  { color: "white", label: "Trắng", isChecked: false, hexCode: "#FFFFFF" },
  { color: "red", label: "Đỏ", isChecked: false, hexCode: "#CC3333" },
  { color: "blue", label: "Xanh biển", isChecked: false, hexCode: "#00CCFF" },
  { color: "green", label: "Xanh lá", isChecked: false, hexCode: "#008000" },
  { color: "yellow", label: "Vàng", isChecked: false, hexCode: "#FFFF00" },
  { color: "brown", label: "Nâu", isChecked: false, hexCode: "#663300" },
  { color: "beige", label: "Be", isChecked: false, hexCode: "#F5F5DC" },
  { color: "pink", label: "Hồng", isChecked: false, hexCode: "#FFC0CB" },
  { color: "gray", label: "Xám", isChecked: false, hexCode: "#D3D3D3" },
];

export const DEFAULT_SIZE: SizeFilter = {
  length: 0,
  width: 0,
  height: 0,
};