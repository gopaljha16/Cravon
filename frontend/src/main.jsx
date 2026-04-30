import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ChefHat,
  ClipboardList,
  LogOut,
  Minus,
  Plus,
  ShoppingCart,
  Store,
  Trash2,
  UserRound,
  Utensils
} from "lucide-react";
import "./styles.css";

const emptyRestaurant = { name: "", cuisine: "", rating: "", image_url: "" };
const emptyMenuItem = { name: "", description: "", price: "", image_url: "" };

async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    credentials: "include",
    headers: options.body instanceof FormData ? {} : { "Content-Type": "application/json" },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

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

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

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

  const stats = useMemo(() => [
    ["Users", dashboard?.total_users ?? 0],
    ["Restaurants", dashboard?.total_restaurants ?? restaurants.length],
    ["Orders", dashboard?.total_orders ?? 0],
    ["Revenue", `Rs ${dashboard?.total_revenue ?? 0}`]
  ], [dashboard, restaurants.length]);

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
      <aside className="sidebar">
        <div className="brand"><ChefHat size={28} /> <span>Servora</span></div>
        <button className="nav active"><Store size={18} /> Restaurants</button>
        {isCustomer && <button className="nav"><ShoppingCart size={18} /> Cart ({cart.items.length})</button>}
        {isAdmin && <button className="nav"><ClipboardList size={18} /> Admin</button>}
        <div className="account">
          {user ? (
            <>
              <span><UserRound size={16} /> {user.username} · {user.role}</span>
              <button className="iconText" onClick={signOut}><LogOut size={16} /> Sign out</button>
            </>
          ) : <span>Sign in for ordering and admin tools.</span>}
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <h1>Restaurant Management & Food Ordering</h1>
            <p>Manage restaurants, publish menus, and place customer orders from one React frontend.</p>
          </div>
        </header>

        {notice && <div className="notice">{notice}</div>}

        {!user && (
          <form className="authPanel" onSubmit={submitAuth}>
            <div className="tabs">
              <button type="button" className={mode === "signin" ? "selected" : ""} onClick={() => setMode("signin")}>Sign in</button>
              <button type="button" className={mode === "signup" ? "selected" : ""} onClick={() => setMode("signup")}>Sign up</button>
            </div>
            <input placeholder="Username" value={auth.username} onChange={(e) => setAuth({ ...auth, username: e.target.value })} />
            <input placeholder="Password" type="password" value={auth.password} onChange={(e) => setAuth({ ...auth, password: e.target.value })} />
            {mode === "signup" && (
              <>
                <input placeholder="Email" value={auth.email} onChange={(e) => setAuth({ ...auth, email: e.target.value })} />
                <input placeholder="Mobile" value={auth.mobile} onChange={(e) => setAuth({ ...auth, mobile: e.target.value })} />
                <input placeholder="Address" value={auth.address} onChange={(e) => setAuth({ ...auth, address: e.target.value })} />
              </>
            )}
            <button className="primary">{mode === "signin" ? "Sign in" : "Create account"}</button>
          </form>
        )}

        {isAdmin && (
          <>
            <div className="stats">{stats.map(([label, value]) => <div className="stat" key={label}><b>{value}</b><span>{label}</span></div>)}</div>
            <form className="toolbar" onSubmit={saveRestaurant}>
              <input placeholder="Restaurant name" value={restaurantForm.name} onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })} />
              <input placeholder="Cuisine" value={restaurantForm.cuisine} onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisine: e.target.value })} />
              <input placeholder="Rating" type="number" step="0.1" value={restaurantForm.rating} onChange={(e) => setRestaurantForm({ ...restaurantForm, rating: e.target.value })} />
              <input placeholder="Image URL" value={restaurantForm.image_url} onChange={(e) => setRestaurantForm({ ...restaurantForm, image_url: e.target.value })} />
              <button className="primary"><Plus size={16} /> Add</button>
            </form>
          </>
        )}

        <div className="workspace">
          <section className="list">
            <h2>Restaurants</h2>
            {restaurants.map((restaurant) => (
              <button key={restaurant.id} className={`restaurant ${selected?.id === restaurant.id ? "selected" : ""}`} onClick={() => setSelected(restaurant)}>
                <img src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80"} alt="" />
                <span><b>{restaurant.name}</b><small>{restaurant.cuisine} · {restaurant.rating}</small></span>
              </button>
            ))}
          </section>

          <section className="menu">
            <div className="sectionHead">
              <h2>{selected ? selected.name : "Menu"}</h2>
              {isAdmin && selected && <button className="danger" onClick={() => deleteRestaurant(selected.id)}><Trash2 size={16} /> Delete restaurant</button>}
            </div>

            {isAdmin && selected && (
              <form className="toolbar compact" onSubmit={saveMenuItem}>
                <input placeholder="Item name" value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} />
                <input placeholder="Description" value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} />
                <input placeholder="Price" type="number" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} />
                <input placeholder="Image URL" value={menuForm.image_url} onChange={(e) => setMenuForm({ ...menuForm, image_url: e.target.value })} />
                <button className="primary"><Plus size={16} /> Item</button>
              </form>
            )}

            <div className="cards">
              {menu.map((item) => (
                <article className="card" key={item.id}>
                  <img src={item.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80"} alt="" />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description || "Freshly prepared and ready to serve."}</p>
                    <b>Rs {item.price}</b>
                  </div>
                  {isAdmin ? (
                    <button className="danger iconOnly" onClick={() => deleteMenuItem(item.id)} title="Delete item"><Trash2 size={17} /></button>
                  ) : (
                    <button className="primary iconOnly" onClick={() => addToCart(item)} title="Add to cart"><Plus size={17} /></button>
                  )}
                </article>
              ))}
            </div>
          </section>

          {isCustomer && (
            <section className="cart">
              <h2><ShoppingCart size={20} /> Cart</h2>
              {cart.items.length === 0 && <p className="muted">Your cart is empty.</p>}
              {cart.items.map((item) => (
                <div className="cartRow" key={item.id}>
                  <span><b>{item.name}</b><small>Rs {item.subtotal}</small></span>
                  <div>
                    <button onClick={() => updateCart(`/cart/decrease/${item.id}/`)}><Minus size={14} /></button>
                    <strong>{item.quantity}</strong>
                    <button onClick={() => updateCart(`/cart/increase/${item.id}/`)}><Plus size={14} /></button>
                    <button onClick={() => updateCart(`/cart/remove/${item.id}/`)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              <footer>
                <b>Total: Rs {cart.total_price}</b>
                <button className="primary" disabled={!cart.items.length} onClick={checkout}><Utensils size={16} /> Checkout</button>
              </footer>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
