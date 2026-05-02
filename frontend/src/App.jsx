import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { CustomerLayout } from "./layouts/CustomerLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { LandingPage } from "./pages/public/LandingPage";
import { ExplorePage } from "./pages/public/ExplorePage";
import { AuthPage } from "./pages/public/AuthPage";
import { CartPage } from "./pages/customer/CartPage";
import { OrdersPage } from "./pages/customer/OrdersPage";
import { ProfilePage } from "./pages/customer/ProfilePage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
