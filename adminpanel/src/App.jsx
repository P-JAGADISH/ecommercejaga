import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom"; // Correct import
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import AddColor from "./pages/AddColor";
import AddSize from "./pages/AddSize";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import Toast from "./components/Toast";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Coupons from "./pages/Coupons";
import ComboPack from "./pages/ComboPack";
import Pages from "./pages/Pages";
import MetaTags from "./pages/MetaTags";
import Banners from "./pages/Banners";
import HeaderFooter from "./pages/HeaderFooter";
import Shipping from "./pages/Shipping";



function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/colors/add" element={<AddColor />} />
        <Route path="/sizes/add" element={<AddSize />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/profile" element={<Profile />} />
       <Route path="/customers" element={<Customers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/combo-pack" element={<ComboPack />} /> 
        <Route path="/pages" element={<Pages />} />
        <Route path="/meta-tags" element={<MetaTags />} />
        <Route path="/banners" element={<Banners />} />
        <Route path="/header-footer" element={<HeaderFooter />} />
        <Route path="/shipping" element={<Shipping />} />

      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <AppRoutes />
            <Toast />
          </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;