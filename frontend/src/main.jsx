import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { CreditCard, Loader2, MapPin, PackageCheck, Phone, StickyNote } from "lucide-react";
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
const emptyCart = { items: [], total_price: 0 };
const emptyDelivery = { delivery_address: "", delivery_phone: "", delivery_instructions: "" };

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("signin");
  const [view, setView] = useState("restaurants");
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState(emptyCart);
  const [orders, setOrders] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [auth, setAuth] = useState({ username: "", password: "", email: "", mobile: "", address: "" });
  const [restaurantForm, setRestaurantForm] = useState(emptyRestaurant);
  const [menuForm, setMenuForm] = useState(emptyMenuItem);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [cartBusy, setCartBusy] = useState(false);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [delivery, setDelivery] = useState(emptyDelivery);
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
    ["Orders", dashboard?.total_orders ?? orders.length],
    ["Revenue", `Rs ${dashboard?.total_revenue ?? 0}`]
  ], [dashboard, orders.length, restaurants.length]);

  const pricing = useMemo(() => {
    const subtotal = Number(cart.total_price || 0);
    const deliveryFee = subtotal > 0 ? 39 : 0;
    const taxAmount = Math.round(subtotal * 5) / 100;
    return {
      subtotal,
      deliveryFee,
      taxAmount,
      total: Math.round((subtotal + deliveryFee + taxAmount) * 100) / 100,
    };
  }, [cart.total_price]);

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

  async function loadOrders() {
    if (!user) return;
    const data = await api("/orders/");
    setOrders(data.orders);
  }

  async function loadDashboard() {
    if (!isAdmin) return;
    const data = await api("/dashboard/");
    setDashboard(data);
  }

  function showNotice(message, type = "info") {
    setNotice(message);
    setNoticeType(type);
  }

  function navigate(nextView) {
    setView(nextView);
    setNotice("");
    if (nextView === "orders") loadOrders().catch((error) => showNotice(error.message, "error"));
    if (nextView === "admin") {
      loadDashboard().catch((error) => showNotice(error.message, "error"));
      loadOrders().catch(() => null);
    }
  }

  useEffect(() => {
    api("/me/").then((data) => {
      setUser(data.user);
      if (data.user?.role === "admin") setView("admin");
    }).catch(() => null);
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selected) loadMenu(selected);
  }, [selected?.id]);

  useEffect(() => {
    loadCart().catch(() => null);
    loadDashboard().catch(() => null);
    loadOrders().catch(() => null);
  }, [user?.role]);

  async function submitAuth(event) {
    event.preventDefault();
    setNotice("");
    const path = mode === "signin" ? "/auth/signin/" : "/auth/signup/";

    try {
      const data = await api(path, { method: "POST", body: JSON.stringify(auth) });
      if (mode === "signup") {
        setMode("signin");
        showNotice("Account created. Sign in to continue.", "success");
        return;
      }

      setUser(data.user);
      setCart(emptyCart);
      setDelivery({
        delivery_address: auth.address || "",
        delivery_phone: auth.mobile || "",
        delivery_instructions: "",
      });
      setView(data.user.role === "admin" ? "admin" : "restaurants");
      setNotice("");
    } catch (error) {
      showNotice(error.message, "error");
    }
  }

  async function signOut() {
    await api("/auth/signout/", { method: "POST" });
    setUser(null);
    setCart(emptyCart);
    setOrders([]);
    setDelivery(emptyDelivery);
    setView("restaurants");
  }

  async function saveRestaurant(event) {
    event.preventDefault();
    const data = await api("/restaurants/", { method: "POST", body: JSON.stringify(restaurantForm) });
    setRestaurantForm(emptyRestaurant);
    setRestaurants((items) => [...items, data.restaurant]);
    setSelected(data.restaurant);
    await loadDashboard();
    showNotice("Restaurant added.", "success");
  }

  async function deleteRestaurant(id) {
    await api(`/restaurants/${id}/`, { method: "DELETE" });
    setSelected(null);
    await loadRestaurants();
    await loadDashboard();
    showNotice("Restaurant deleted.", "success");
  }

  async function saveMenuItem(event) {
    event.preventDefault();
    if (!selected) return;
    await api(`/restaurants/${selected.id}/menu/`, { method: "POST", body: JSON.stringify(menuForm) });
    setMenuForm(emptyMenuItem);
    await loadMenu(selected);
    showNotice("Menu item added.", "success");
  }

  async function deleteMenuItem(id) {
    await api(`/menu-items/${id}/`, { method: "DELETE" });
    await loadMenu(selected);
    showNotice("Menu item deleted.", "success");
  }

  async function addToCart(item) {
    if (!user) {
      showNotice("Sign in as customer to add food to cart.", "error");
      return;
    }
    if (!isCustomer) {
      showNotice("Use a customer account to add food to cart.", "error");
      return;
    }

    setCartBusy(true);
    setNotice("");
    try {
      const data = await api(`/cart/add/${item.id}/`, { method: "POST" });
      setCart(data.cart);
      showNotice(`${item.name} added to cart.`, "success");
    } catch (error) {
      showNotice(error.message, "error");
    } finally {
      setCartBusy(false);
    }
  }

  async function updateCart(path) {
    setCartBusy(true);
    setNotice("");
    try {
      const data = await api(path, { method: "POST" });
      setCart(data.cart);
    } catch (error) {
      showNotice(error.message, "error");
      await loadCart().catch(() => null);
    } finally {
      setCartBusy(false);
    }
  }

  async function placeCashOrder() {
    if (!cart.items.length) {
      showNotice("Your cart is empty.", "error");
      return;
    }
    if (!delivery.delivery_address.trim() || !delivery.delivery_phone.trim()) {
      showNotice("Delivery address and phone number are required.", "error");
      return;
    }

    setPaymentBusy(true);
    setNotice("");
    try {
      const data = await api("/orders/checkout/", { method: "POST", body: JSON.stringify(delivery) });
      setCart(emptyCart);
      showNotice(`Order #${data.order.id} placed. Payment status: ${data.order.payment_status}.`, "success");
      await loadOrders();
      setView("orders");
    } catch (error) {
      showNotice(error.message, "error");
      await loadCart().catch(() => null);
    } finally {
      setPaymentBusy(false);
    }
  }

  async function payWithRazorpay() {
    if (!cart.items.length) {
      showNotice("Your cart is empty.", "error");
      return;
    }
    if (!delivery.delivery_address.trim() || !delivery.delivery_phone.trim()) {
      showNotice("Delivery address and phone number are required.", "error");
      return;
    }

    setPaymentBusy(true);
    setNotice("");
    try {
      const ready = await loadRazorpay();
      if (!ready) throw new Error("Unable to load Razorpay checkout.");

      const data = await api("/payments/create-order/", { method: "POST", body: JSON.stringify(delivery) });
      const payment = data.payment;
      const options = {
        key: data.key,
        amount: payment.amount,
        currency: payment.currency,
        name: "Cravon",
        description: `Order #${data.order.id}`,
        order_id: payment.id,
        prefill: {
          name: data.customer.name,
          email: data.customer.email,
          contact: data.customer.contact,
        },
        handler: async (response) => {
          const verified = await api("/payments/verify/", {
            method: "POST",
            body: JSON.stringify({
              order_id: data.order.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          setCart(emptyCart);
          showNotice(`Payment successful. Order #${verified.order.id} confirmed.`, "success");
          await loadOrders();
          setView("orders");
        },
        modal: {
          ondismiss: () => showNotice("Payment was cancelled. Your cart is still saved.", "info"),
        },
      };

      const checkout = new window.Razorpay(options);
      checkout.open();
    } catch (error) {
      showNotice(error.message, "error");
      await loadCart().catch(() => null);
    } finally {
      setPaymentBusy(false);
    }
  }

  async function updateOrderStatus(orderId, orderStatus) {
    try {
      await api(`/orders/${orderId}/status/`, {
        method: "POST",
        body: JSON.stringify({ order_status: orderStatus }),
      });
      await loadOrders();
      showNotice("Order status updated.", "success");
    } catch (error) {
      showNotice(error.message, "error");
    }
  }

  const cartSummary = (
    <div className="summaryPanel">
      <h2>Order summary</h2>
      {cart.items.map((item) => (
        <div className="summaryRow" key={item.id}>
          <span>{item.name} x {item.quantity}</span>
          <b>Rs {item.subtotal}</b>
        </div>
      ))}
      <div className="summaryTotal">
        <span>Items subtotal</span>
        <b>Rs {pricing.subtotal}</b>
      </div>
      <div className="summaryRow">
        <span>Delivery partner fee</span>
        <b>Rs {pricing.deliveryFee}</b>
      </div>
      <div className="summaryRow">
        <span>Taxes</span>
        <b>Rs {pricing.taxAmount}</b>
      </div>
      <div className="summaryTotal payable">
        <span>Total payable</span>
        <b>Rs {pricing.total}</b>
      </div>
    </div>
  );

  return (
    <main className="app">
      <Sidebar user={user} activeView={view} cartCount={cart.items.length} onNavigate={navigate} onSignOut={signOut} />

      <section className="content">
        <Header query={query} onQueryChange={setQuery} user={user} />

        {notice && user && <div className={`notice ${noticeType}`}>{notice}</div>}

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

        {user && view === "restaurants" && (
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
            {isCustomer && <CartPanel cart={cart} isBusy={cartBusy} onUpdateCart={updateCart} onCheckout={() => setView("checkout")} />}
          </div>
        )}

        {isCustomer && view === "cart" && (
          <section className="pageGrid">
            <CartPanel cart={cart} isBusy={cartBusy} onUpdateCart={updateCart} onCheckout={() => setView("checkout")} />
            {cartSummary}
          </section>
        )}

        {isCustomer && view === "checkout" && (
          <section className="checkoutPage">
            <div className="checkoutPanel">
              <span className="eyebrow">Checkout</span>
              <h2>Delivery and payment</h2>
              <p className="muted">Confirm where the order should be delivered before payment.</p>
              <label className="fieldLabel">
                <span><MapPin size={16} /> Delivery address</span>
                <input placeholder="House, street, area, city" value={delivery.delivery_address} onChange={(e) => setDelivery({ ...delivery, delivery_address: e.target.value })} />
              </label>
              <label className="fieldLabel">
                <span><Phone size={16} /> Phone number</span>
                <input placeholder="Delivery contact number" value={delivery.delivery_phone} onChange={(e) => setDelivery({ ...delivery, delivery_phone: e.target.value })} />
              </label>
              <label className="fieldLabel">
                <span><StickyNote size={16} /> Delivery instructions</span>
                <input placeholder="Optional: gate code, landmark, no-contact delivery" value={delivery.delivery_instructions} onChange={(e) => setDelivery({ ...delivery, delivery_instructions: e.target.value })} />
              </label>
              <div className="actionRow">
                <button className="primary" disabled={!cart.items.length || paymentBusy} onClick={payWithRazorpay}>
                  {paymentBusy ? <Loader2 className="spin" size={16} /> : <CreditCard size={16} />}
                  Pay with Razorpay
                </button>
                <button className="secondary" disabled={!cart.items.length || paymentBusy} onClick={placeCashOrder}>
                  Place test order
                </button>
              </div>
            </div>
            {cartSummary}
          </section>
        )}

        {user && view === "orders" && (
          <section className="ordersPage">
            <div className="sectionHead">
              <div>
                <span className="eyebrow">{isAdmin ? "Operations" : "Order history"}</span>
                <h2>{isAdmin ? "All orders" : "My orders"}</h2>
              </div>
              <button className="secondary" onClick={loadOrders}>Refresh</button>
            </div>
            <div className="orderStack">
              {orders.length === 0 && <p className="muted">No orders yet.</p>}
              {orders.map((order) => (
                <article className="orderCard" key={order.id}>
                  <PackageCheck size={22} />
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p>{order.restaurant} / Rs {order.total_price}</p>
                    <small>{order.delivery_address || "Delivery address not saved"}</small>
                    {order.delivery_instructions && <small>{order.delivery_instructions}</small>}
                    <div className="statusTrack">
                      {["placed", "preparing", "delivered"].map((step) => (
                        <i key={step} className={["placed", "preparing", "delivered"].indexOf(order.order_status) >= ["placed", "preparing", "delivered"].indexOf(step) ? "done" : ""}>{step}</i>
                      ))}
                    </div>
                  </div>
                  <span>{order.payment_status}</span>
                  <span>{order.order_status}</span>
                  {isAdmin && (
                    <div className="orderActions">
                      <button className="secondary" onClick={() => updateOrderStatus(order.id, "preparing")}>Preparing</button>
                      <button className="secondary" onClick={() => updateOrderStatus(order.id, "delivered")}>Delivered</button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {isAdmin && view === "admin" && (
          <>
            <AdminPanel
              stats={stats}
              restaurantForm={restaurantForm}
              onRestaurantFormChange={setRestaurantForm}
              onSaveRestaurant={saveRestaurant}
            />
            <div className="workspace noCart">
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
            </div>
          </>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
