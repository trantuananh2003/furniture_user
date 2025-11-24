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
import PaymentSuccess from "../pages/Status/SuccessfulPay";
import ResetPassword from "../pages/Auth/ResetPasswordPage";
import ResetPasswordForm from "../pages/InformationUser/ChangePasswordPage";

//Public
const publicRoutes = [
  { path: "/", component: HomePage },
  {
    path: "/collections/",
    component: FilteredProduct,
    Layout: DefaultLayout,
  },
  {
    path: "/collections/:slug",
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
    component: PaymentSuccess,
    Layout: NonHeaderLayout,
  },
  {
    path: "/reset-password",
    component: ResetPassword,
    Layout: NonHeaderLayout,
  },
];

export { publicRoutes };
