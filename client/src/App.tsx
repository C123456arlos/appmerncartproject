import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import SearchResults from "./pages/SearchResults";
import FlashDeals from "./pages/FlashDeals";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";
import Addresses from "./pages/Addresses";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDeliveryPartners from "./pages/admin/AdminDeliveryPartners";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryLayout from "./pages/delivery/DeliveryLayout";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1b3022",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      ></Toaster>
      <Routes>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/" element={<AppLayout></AppLayout>}>
          <Route index element={<Home></Home>}></Route>
          <Route path="products" element={<Products></Products>}></Route>
          <Route
            path="products/:id"
            element={<ProductPage></ProductPage>}
          ></Route>
          <Route
            path="search"
            element={<SearchResults></SearchResults>}
          ></Route>
          <Route path="deals" element={<FlashDeals></FlashDeals>}></Route>
          <Route element={<ProtectedRoute></ProtectedRoute>}>
            <Route path="checkout" element={<Checkout></Checkout>}></Route>
            <Route path="orders" element={<MyOrders></MyOrders>}></Route>
            <Route
              path="orders/:id"
              element={<OrderTracking></OrderTracking>}
            ></Route>
            <Route path="addresses" element={<Addresses></Addresses>}></Route>
          </Route>
        </Route>
        <Route path="/admin" element={<AdminLayout></AdminLayout>}>
          <Route index element={<AdminDashboard></AdminDashboard>}></Route>
          <Route
            path="products"
            element={<AdminProducts></AdminProducts>}
          ></Route>
          <Route
            path="products/new"
            element={<AdminProductForm></AdminProductForm>}
          ></Route>
          <Route
            path="products/:id/edit"
            element={<AdminProductForm></AdminProductForm>}
          ></Route>
          <Route path="orders" element={<AdminOrders></AdminOrders>}></Route>
          <Route
            path="delivery-partners"
            element={<AdminDeliveryPartners></AdminDeliveryPartners>}
          ></Route>
        </Route>
        <Route
          path="/delivery/login"
          element={<DeliveryLogin></DeliveryLogin>}
        ></Route>
        <Route path="/delivery" element={<DeliveryLayout></DeliveryLayout>}>
          <Route
            index
            element={<DeliveryDashboard></DeliveryDashboard>}
          ></Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
