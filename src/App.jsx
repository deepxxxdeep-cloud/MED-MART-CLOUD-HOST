import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { ShopProvider } from "./context/ShopContext";
import RouteFallback from "./components/RouteFallback";

// Landing is the entry point, so it ships in the initial bundle — lazily
// loading it would only add a round trip before first paint.
import Landing from "./pages/Landing";

// Everything else is split. The seller dashboard matters most: it pulls in
// Recharts, which no visitor to the marketing site should have to download.
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const BuyerHome = lazy(() => import("./pages/BuyerHome"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const FlaggedUsers = lazy(() => import("./pages/admin/FlaggedUsers"));

const SellerLayout = lazy(() => import("./pages/seller/SellerLayout"));
const Overview = lazy(() => import("./pages/seller/Overview"));
const SellerProducts = lazy(() => import("./pages/seller/Products"));
const AddProduct = lazy(() => import("./pages/seller/AddProduct"));
const SellerInquiries = lazy(() => import("./pages/seller/Inquiries"));
const BuyRequirements = lazy(() => import("./pages/seller/BuyRequirements"));
const SellerAnalytics = lazy(() => import("./pages/seller/Analytics"));
const SellerProfile = lazy(() => import("./pages/seller/Profile"));
const SellerSettings = lazy(() => import("./pages/seller/Settings"));
const SellerOrders = lazy(() => import("./pages/seller/Orders"));
const SellerRevenue = lazy(() => import("./pages/seller/Revenue"));

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
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/admin/flagged-users" element={<FlaggedUsers />} />

        {/* Seller dashboard — nested so the shell persists across sections */}
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<Overview />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="inquiries" element={<SellerInquiries />} />
          <Route path="buy-requirements" element={<BuyRequirements />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="revenue" element={<SellerRevenue />} />
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
          <Suspense fallback={<RouteFallback />}>
            <AnimatedRoutes />
          </Suspense>
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
