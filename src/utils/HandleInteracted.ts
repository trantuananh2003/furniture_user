// Hàm lấy giá trị từ localStorage
function getFromLocalStorage(name: string): string | null {
  return localStorage.getItem(name);
}

// Hàm lưu giá trị vào localStorage
function setToLocalStorage(name: string, value: string): void {
  localStorage.setItem(name, value);
}

// Hàm thêm sản phẩm vào localStorage
export function addProductToLocalStorage(
  productId: string,
  maxItems: number = 5
): void {
  const storageKey = "userInteraction";
  const existing = getFromLocalStorage(storageKey);
  let products: string[] = existing ? JSON.parse(existing) : [];

  // Thêm sản phẩm mới vào đầu danh sách nếu chưa có
  if (!products.includes(productId)) {
    products.unshift(productId);
    if (products.length > maxItems) {
      products = products.slice(0, maxItems);
    }
    setToLocalStorage(storageKey, JSON.stringify(products)); // Lưu danh sách vào localStorage
  }
}

// Hàm lấy danh sách sản phẩm từ localStorage
export function getRecentProducts(): string[] {
  const storageKey = "userInteraction";
  const existing = getFromLocalStorage(storageKey);
  return existing ? JSON.parse(existing) : [];
}
