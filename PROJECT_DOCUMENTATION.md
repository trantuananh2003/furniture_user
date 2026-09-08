# 📋 Tài liệu Dự án - Bannoithat User PJ

## 🎯 Tổng quan Dự án

**Tên dự án:** bannoithat_user_pj  
**Loại:** Website bán nội thất (Frontend)  
**Công nghệ:** React + TypeScript + Vite  
**Mô tả:** Ứng dụng web frontend cho hệ thống bán nội thất, cho phép người dùng xem sản phẩm, đăng nhập, đăng ký, quản lý giỏ hàng và đặt hàng.

---

## 🛠️ Công nghệ & Thư viện

### Core
- **React 19.2.0** - Thư viện UI
- **TypeScript** - Kiểm tra kiểu tĩnh
- **Vite 7.2.4** - Build tool và dev server

### UI/UX
- **MUI (Material-UI) 7.3.5** - Component library
- **Tailwind CSS 4.1.17** - CSS framework
- **React Responsive Carousel** - Carousel component
- **React Toastify** - Thông báo toast
- **SweetAlert2** - Dialog/alert

### State Management
- **Redux Toolkit 2.10.1** - Quản lý state toàn cục
- **React Redux 9.2.0** - Kết nối React với Redux

### Routing & Authentication
- **React Router DOM 7.9.6** - Routing
- **React OAuth Google** - Đăng nhập Google
- **JWT Decode** - Giải mã token JWT

### HTTP Client
- **Axios 1.13.2** - Gọi API

---

## 📁 Cấu trúc Thư mục

```
src/
├── App.tsx                    # Component gốc, cấu hình routes
├── main.tsx                   # Entry point
├── index.css                  # Global styles
├── assets/                  # Hình ảnh, icons, fonts
├── client-api/              # API client (REST client)
├── components/              # Components dùng chung
│   ├── common/              # Components chung
│   └── layout/              # Layout components
│       ├── DefaultLayout/     # Layout mặc định (có header/footer)
│       ├── UserLayout/        # Layout người dùng (khu vực user)
│       └── NonHeaderLayout/   # Layout không header
├── model/                   # TypeScript interfaces
│   ├── ApiResponse.ts
│   ├── ProductDetail.ts
│   ├── ProductHome.ts
│   ├── User.ts
│   ├── CartResponse.ts
│   ├── CategoriesResponse.ts
│   ├── BrandsResponse.ts
│   ├── Coupon.ts
│   ├── OrderResponse..ts
│   └── PaginationDto.ts
├── pages/                   # Các trang (pages)
│   ├── Home/                # Trang chủ
│   ├── Auth/                # Đăng nhập, đăng ký, quên mật khẩu
│   ├── ProductDetail/       # Chi tiết sản phẩm
│   ├── Checkout/            # Thanh toán
│   ├── InformationUser/     # Thông tin người dùng
│   ├── OrderUser/           # Quản lý đơn hàng
│   ├── FilteredProduct/     # Lọc sản phẩm
│   └── Status/              # Trạng thái (thành công, lỗi)
├── redux/                   # Redux store & slices
│   ├── store.ts             # Cấu hình store
│   └── features/
│       ├── userSlice.ts     # State người dùng
│       ├── cartSlice.ts     # State giỏ hàng
│       └── couponSlice.ts   # State coupon
├── routes/                  # Định nghĩa routes
│   └── index.ts
└── utils/                   # Utility functions
```

---

## 🗺️ Định tuyến (Routes)

| Path | Component | Layout | Mô tả |
|------|-----------|--------|-------|
| `/` | HomePage | DefaultLayout | Trang chủ |
| `/collections/` | FilteredProduct | DefaultLayout | Danh sách sản phẩm |
| `/collections/:slug` | FilteredProduct | DefaultLayout | Lọc sản phẩm theo slug |
| `/auth` | AuthPage | NonHeaderLayout | Đăng nhập/đăng ký |
| `/products/:slug` | ProductDetail | DefaultLayout | Chi tiết sản phẩm |
| `/checkout` | CheckOutPage | NonHeaderLayout | Thanh toán |
| `/information` | InformationUserPage | UserLayout | Thông tin cá nhân |
| `/orders` | MangeOrderPage | UserLayout | Quản lý đơn hàng |
| `/change-password` | ResetPasswordForm | UserLayout | Đổi mật khẩu |
| `/address` | AddressUser | UserLayout | Địa chỉ người dùng |
| `/forgot-password` | ForgotPasswordPage | null | Quên mật khẩu |
| `/payment-successful` | PaymentSuccess | NonHeaderLayout | Thanh toán thành công |
| `/reset-password` | ResetPassword | NonHeaderLayout | Đặt lại mật khẩu |

---

## 🗄️ Redux Store

### Slices:
1. **userSlice** - Quản lý thông tin người dùng
2. **cartSlice** - Quản lý giỏ hàng
3. **couponSlice** - Quản lý mã giảm giá

### State Structure:
```typescript
// RootState
{
  users: User,
  carts: CartState,
  coupons: CouponState
}
```

---

## 📦 Model Interfaces

### ProductDetail
```typescript
{
  id: string
  name: string
  description: string
  images: string[]
  slug: string
  price: number
  salePrice: number
  quantity: number
  category: Category
  brand: Brand
  lengthSize: number
  widthSize: number
  heightSize: number
}
```

### User
```typescript
{
  user_id: string
  email: string
  fullName: string
}
```

### ApiResponse
```typescript
{
  result: any
  // ... các trường khác
}
```

---

## 🔌 API Endpoints (Client)

Dựa trên mã nguồn, các API endpoints chính:

- `client/products/{slug}` - Lấy chi tiết sản phẩm
- `client/products/recommend` - Sản phẩm gợi ý
- `client/products/sameproduct` - Sản phẩm cùng loại
- `carts` - Quản lý giỏ hàng (PUT)

---

## 🎨 Layout Components

### DefaultLayout
- Layout mặc định với header và footer
- Sử dụng cho trang chủ, danh sách sản phẩm, chi tiết sản phẩm

### UserLayout
- Layout dành cho khu vực người dùng đã đăng nhập
- Bao gồm thông tin cá nhân, đơn hàng, đổi mật khẩu

### NonHeaderLayout
- Layout không header
- Sử dụng cho trang đăng nhập, thanh toán

---

## 📱 Các Page Chính

### 1. HomePage (`src/pages/Home/`)
- Trang chủ
- Hiển thị sản phẩm nổi bật

### 2. ProductDetail (`src/pages/ProductDetail/`)
- Hiển thị chi tiết sản phẩm
- Hình ảnh carousel
- Chọn số lượng
- Thêm vào giỏ hàng
- Sản phẩm liên quan & gợi ý

### 3. Auth (`src/pages/Auth/`)
- Đăng nhập/đăng ký
- Quên mật khẩu
- Đặt lại mật khẩu

### 4. Checkout (`src/pages/Checkout/`)
- Thanh toán đơn hàng

### 5. InformationUser (`src/pages/InformationUser/`)
- Thông tin cá nhân
- Đổi mật khẩu
- Quản lý địa chỉ

### 6. OrderUser (`src/pages/OrderUser/`)
- Lịch sử đơn hàng
- Trạng thái đơn hàng

---

## 🚀 Scripts

```json
{
  "dev": "vite",              // Chạy development server
  "build": "tsc -b && vite build", // Build production
  "lint": "eslint .",         // Kiểm tra lỗi
  "preview": "vite preview"     // Preview build
}
```

---

## 📝 Ghi chú

- Dự án sử dụng **Tailwind CSS** kết hợp với **MUI**
- Authentication dựa vào **JWT token** lưu trong localStorage
- State quản lý bằng **Redux Toolkit**
- API client tùy chỉnh trong `src/client-api/`
- Environment variables trong `.env.development` và `.env.production`

---

## 🔗 Tài liệu tham khảo

- Vite: https://vitejs.dev/
- React Router: https://reactrouter.com/
- Redux Toolkit: https://redux-toolkit.js.org/
- Tailwind CSS: https://tailwindcss.com/
- MUI: https://mui.com/