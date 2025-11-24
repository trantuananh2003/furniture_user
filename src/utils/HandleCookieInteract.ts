// Hàm lấy cookie theo tên
function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

function setCookie(
  name: string,
  value: string,
  days: number,
  isHttps: boolean = true
): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const secureAttribute = isHttps ? "; Secure" : "";
  const domainAttribute = "; Domain=api.noithatvn.click"; // Đặt domain cookie
  const sameSiteAttribute = "; SameSite=None"; // Cho phép cross-origin

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; expires=${expires.toUTCString()}${sameSiteAttribute}${secureAttribute}${domainAttribute}`;
}

// Hàm thêm sản phẩm vào cookie
export function addProductToCookie(
  productId: string,
  maxItems: number = 5
): void {
  const cookieName = "userInteraction";
  const existing = getCookie(cookieName);
  let products: string[] = existing ? JSON.parse(existing) : [];

  // Thêm sản phẩm mới vào đầu danh sách nếu chưa có
  if (!products.includes(productId)) {
    products.unshift(productId);
    if (products.length > maxItems) {
      products = products.slice(0, maxItems);
    }
    setCookie(cookieName, JSON.stringify(products), 7); // lưu 7 ngày
  }
}

// Hàm lấy danh sách sản phẩm từ cookie
export function getRecentProducts(): string[] {
  const cookieName = "userInteraction";
  const existing = getCookie(cookieName);
  return existing ? JSON.parse(existing) : [];
}
