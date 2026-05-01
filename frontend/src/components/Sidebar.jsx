import { ChefHat, ClipboardList, LogOut, ShoppingCart, Store, UserRound } from "lucide-react";

export function Sidebar({ user, activeView, cartCount, onNavigate, onSignOut }) {
  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brandMark"><ChefHat size={24} /></span>
        <span>Cravon</span>
      </div>

      <nav className="navStack" aria-label="Main navigation">
        <button className={`nav ${activeView === "restaurants" ? "active" : ""}`} onClick={() => onNavigate("restaurants")}><Store size={18} /> Restaurants</button>
        {isCustomer && <button className={`nav ${activeView === "cart" ? "active" : ""}`} onClick={() => onNavigate("cart")}><ShoppingCart size={18} /> Cart ({cartCount})</button>}
        {isCustomer && <button className={`nav ${activeView === "orders" ? "active" : ""}`} onClick={() => onNavigate("orders")}><ClipboardList size={18} /> My orders</button>}
        {isAdmin && <button className={`nav ${activeView === "admin" ? "active" : ""}`} onClick={() => onNavigate("admin")}><ClipboardList size={18} /> Admin</button>}
        {isAdmin && <button className={`nav ${activeView === "orders" ? "active" : ""}`} onClick={() => onNavigate("orders")}><ShoppingCart size={18} /> Orders</button>}
      </nav>

      <div className="account">
        {user ? (
          <>
            <span><UserRound size={16} /> {user.username} / {user.role}</span>
            <button className="iconText" onClick={onSignOut}><LogOut size={16} /> Sign out</button>
          </>
        ) : (
          <span>Sign in to order food or manage the menu.</span>
        )}
      </div>
    </aside>
  );
}
