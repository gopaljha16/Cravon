import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { api } from "./api";
import { AdminPanel } from "./components/AdminPanel";
import { AuthPanel } from "./components/AuthPanel";
import { CartPanel } from "./components/CartPanel";
import { Header } from "./components/Header";
import { MenuPanel } from "./components/MenuPanel";
import { RestaurantList } from "./components/RestaurantList";
import { Sidebar } from "./components/Sidebar";
import "./styles.css";

const emptyRestaurant = { name: "", cuisine: "", rating: "", image_url: "" };
const emptyMenuItem = { name: "", description: "", price: "", image_url: "" };

function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("signin");
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [dashboard, setDashboard] = useState(null);
  const [auth, setAuth] = useState({ username: "", password: "", email: "", mobile: "", address: "" });
  const [restaurantForm, setRestaurantForm] = useState(emptyRestaurant);
  const [menuForm, setMenuForm] = useState(emptyMenuItem);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  const filteredRestaurants = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return restaurants;
    return restaurants.filter((restaurant) =>
      `${restaurant.name} ${restaurant.cuisine}`.toLowerCase().includes(term)
    );
  }, [query, restaurants]);

  const stats = useMemo(() => [
    ["Users", dashboard?.total_users ?? 0],
    ["Restaurants", dashboard?.total_restaurants ?? restaurants.length],
    ["Orders", dashboard?.total_orders ?? 0],
    ["Revenue", `Rs ${dashboard?.total_revenue ?? 0}`]
  ], [dashboard, restaurants.length]);

  async function loadRestaurants() {
    const data = await api("/restaurants/");
    setRestaurants(data.restaurants);
    if (!selected && data.restaurants.length) setSelected(data.restaurants[0]);
  }

  async function loadMenu(restaurant) {
    if (!restaurant) return;
    const data = await api(`/restaurants/${restaurant.id}/menu/`);
    setSelected(data.restaurant);
    setMenu(data.items);
  }

  async function loadCart() {
    if (!isCustomer) return;
    const data = await api("/cart/");
    setCart(data.cart);
  }

  async function loadDashboard() {
    if (!isAdmin) return;
    const data = await api("/dashboard/");
    setDashboard(data);
  }

  useEffect(() => {
    api("/me/").then((data) => setUser(data.user)).catch(() => null);
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selected) loadMenu(selected);
  }, [selected?.id]);

  useEffect(() => {
    loadCart().catch(() => null);
    loadDashboard().catch(() => null);
  }, [user?.role]);

  async function submitAuth(event) {
    event.preventDefault();
    setNotice("");
    const path = mode === "signin" ? "/auth/signin/" : "/auth/signup/";

    try {
      const data = await api(path, { method: "POST", body: JSON.stringify(auth) });
      if (mode === "signup") {
        setMode("signin");
        setNotice("Account created. Sign in to continue.");
      } else {
        setUser(data.user);
      }
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function signOut() {
    await api("/auth/signout/", { method: "POST" });
    setUser(null);
    setCart({ items: [], total_price: 0 });
  }

  async function saveRestaurant(event) {
    event.preventDefault();
    const data = await api("/restaurants/", { method: "POST", body: JSON.stringify(restaurantForm) });
    setRestaurantForm(emptyRestaurant);
    setRestaurants((items) => [...items, data.restaurant]);
    setSelected(data.restaurant);
    await loadDashboard();
  }

  async function deleteRestaurant(id) {
    await api(`/restaurants/${id}/`, { method: "DELETE" });
    setSelected(null);
    await loadRestaurants();
    await loadDashboard();
  }

  async function saveMenuItem(event) {
    event.preventDefault();
    if (!selected) return;
    await api(`/restaurants/${selected.id}/menu/`, { method: "POST", body: JSON.stringify(menuForm) });
    setMenuForm(emptyMenuItem);
    await loadMenu(selected);
  }

  async function deleteMenuItem(id) {
    await api(`/menu-items/${id}/`, { method: "DELETE" });
    await loadMenu(selected);
  }

  async function addToCart(item) {
    if (!user) {
      setNotice("Sign in as customer to add food to cart.");
      return;
    }
    const data = await api(`/cart/add/${item.id}/`, { method: "POST" });
    setCart(data.cart);
  }

  async function updateCart(path) {
    const data = await api(path, { method: "POST" });
    setCart(data.cart);
  }

  async function checkout() {
    const data = await api("/orders/checkout/", { method: "POST" });
    setCart({ items: [], total_price: 0 });
    setNotice(`Order #${data.order.id} placed successfully.`);
    await loadDashboard();
  }

  return (
    <main className="app">
      <Sidebar user={user} cartCount={cart.items.length} onSignOut={signOut} />

      <section className="content">
        <Header query={query} onQueryChange={setQuery} user={user} />

        {notice && user && <div className="notice">{notice}</div>}

        {!user && (
          <AuthPanel
            mode={mode}
            auth={auth}
            notice={notice}
            onModeChange={setMode}
            onAuthChange={setAuth}
            onSubmit={submitAuth}
          />
        )}

        {isAdmin && (
          <AdminPanel
            stats={stats}
            restaurantForm={restaurantForm}
            onRestaurantFormChange={setRestaurantForm}
            onSaveRestaurant={saveRestaurant}
          />
        )}

        <div className={`workspace ${!isCustomer ? "noCart" : ""}`}>
          <RestaurantList restaurants={filteredRestaurants} selected={selected} onSelect={setSelected} />
          <MenuPanel
            selected={selected}
            menu={menu}
            isAdmin={isAdmin}
            menuForm={menuForm}
            onMenuFormChange={setMenuForm}
            onSaveMenuItem={saveMenuItem}
            onDeleteMenuItem={deleteMenuItem}
            onDeleteRestaurant={deleteRestaurant}
            onAddToCart={addToCart}
          />
          {isCustomer && <CartPanel cart={cart} onUpdateCart={updateCart} onCheckout={checkout} />}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
