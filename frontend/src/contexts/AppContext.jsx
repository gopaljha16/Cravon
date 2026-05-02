import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { api } from "../api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [orders, setOrders] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [cartBusy, setCartBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  const showNotice = (message, type = "info") => setNotice({ message, type });
  const clearNotice = () => setNotice(null);

  async function loadRestaurants() {
    try {
      const data = await api("/restaurants/");
      setRestaurants(data.restaurants || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadCart() {
    if (!isCustomer) return;
    try {
      const data = await api("/cart/");
      setCart(data.cart);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadOrders() {
    if (!user) return;
    try {
      const data = await api("/orders/");
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadDashboard() {
    if (!isAdmin) return;
    try {
      const data = await api("/dashboard/");
      setDashboard(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    api("/me/")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (user) {
      loadCart();
      loadOrders();
      loadDashboard();
    }
  }, [user]);

  async function signOut() {
    await api("/auth/signout/", { method: "POST" });
    setUser(null);
    setCart({ items: [], total_price: 0 });
    setOrders([]);
  }

  async function addToCart(item) {
    if (!isCustomer) {
      showNotice("Sign in as a customer to order.", "error");
      return;
    }
    setCartBusy(true);
    try {
      const data = await api(`/cart/add/${item.id}/`, { method: "POST" });
      setCart(data.cart);
      showNotice(`${item.name} added to cart!`, "success");
    } catch (error) {
      showNotice(error.message, "error");
    } finally {
      setCartBusy(false);
    }
  }

  async function updateCart(path) {
    setCartBusy(true);
    try {
      const data = await api(path, { method: "POST" });
      setCart(data.cart);
    } catch (error) {
      showNotice(error.message, "error");
      await loadCart();
    } finally {
      setCartBusy(false);
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAdmin,
        isCustomer,
        restaurants,
        setRestaurants,
        cart,
        setCart,
        orders,
        setOrders,
        dashboard,
        cartBusy,
        notice,
        showNotice,
        clearNotice,
        loadRestaurants,
        loadCart,
        loadOrders,
        loadDashboard,
        signOut,
        addToCart,
        updateCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
