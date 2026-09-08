import DefaultLayout from "~/components/layout/DefaultLayout";
import UserLayout from "~/components/layout/UserLayout";
import HomePage from "../pages/Home";
import AuthPage from "../pages/Auth";
import ProductDetail from "../pages/ProductDetail";
import CheckOutPage from "../pages/Checkout";
import InformationUserPage from "../pages/InformationUser";
import MangeOrderPage from "../pages/OrderUser";
import AddressUser from "../pages/InformationUser/FavoriteUser";
import FilteredProduct from "../pages/FilteredProduct";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import NonHeaderLayout from "~/components/layout/NonHeaderLayout";
import PaymentSuccessPage from "~/pages/PageStatus/SuccessfulPayPage";
import ResetPassword from "../pages/Auth/ResetPasswordPage";
import ResetPasswordForm from "../pages/InformationUser/ChangePasswordPage";
import NotFoundPage from "~/pages/PageStatus/NotFoundPage";

//Public
const publicRoutes = [
  { path: "/", component: HomePage },
  {
    path: "/products/",
    component: FilteredProduct,
    Layout: DefaultLayout,
  },
  {
    path: "/categories/:slug",
    component: FilteredProduct,
    Layout: DefaultLayout,
  },
  {
    path: "/brands/:slug",
    component: FilteredProduct,
    Layout: DefaultLayout,
  },
  { path: "/auth", component: AuthPage, Layout: NonHeaderLayout },
  {
    path: "/products/:slug",
    component: ProductDetail,
    Layout: DefaultLayout,
  },
  { path: "/checkout", component: CheckOutPage, Layout: NonHeaderLayout },
  { path: "/information", component: InformationUserPage, Layout: UserLayout },
  { path: "/orders", component: MangeOrderPage, Layout: UserLayout },
  {
    path: "/change-password",
    component: ResetPasswordForm,
    Layout: UserLayout,
  },
  { path: "/address", component: AddressUser, Layout: UserLayout },
  {
    path: "/forgot-password",
    component: ForgotPasswordPage,
    Layout: null,
  },
  {
    path: "/payment-successful",
    component: PaymentSuccessPage,
    Layout: NonHeaderLayout,
  },
  {
    path: "/reset-password",
    component: ResetPassword,
    Layout: NonHeaderLayout,
  },
  { path: "*", component: NotFoundPage, Layout: NonHeaderLayout },
];

export { publicRoutes };
