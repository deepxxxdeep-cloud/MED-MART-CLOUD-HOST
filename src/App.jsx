import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { ShopProvider } from "./context/ShopContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import BuyerHome from "./pages/BuyerHome";
import ComingSoon from "./pages/ComingSoon";
import SellerLayout from "./pages/seller/SellerLayout";
import Overview from "./pages/seller/Overview";
import SellerProducts from "./pages/seller/Products";
import AddProduct from "./pages/seller/AddProduct";
import SellerInquiries from "./pages/seller/Inquiries";
import BuyRequirements from "./pages/seller/BuyRequirements";
import SellerAnalytics from "./pages/seller/Analytics";
import SellerProfile from "./pages/seller/Profile";
import SellerSettings from "./pages/seller/Settings";

const ease = [0.22, 1, 0.36, 1];

// Fade + slight slide between routes.
function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/shop" element={<BuyerHome />} />

        {/* Seller dashboard — nested so the shell persists across sections */}
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<Overview />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="inquiries" element={<SellerInquiries />} />
          <Route path="buy-requirements" element={<BuyRequirements />} />
          <Route path="analytics" element={<SellerAnalytics />} />
          <Route path="profile" element={<SellerProfile />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>
        <Route
          path="/login"
          element={
            <Page>
              <Login />
            </Page>
          }
        />
        <Route
          path="/signup"
          element={
            <Page>
              <Signup />
            </Page>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Page>
              <ForgotPassword />
            </Page>
          }
        />
        <Route
          path="*"
          element={
            <Page>
              <ComingSoon />
            </Page>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <AnimatedRoutes />
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
