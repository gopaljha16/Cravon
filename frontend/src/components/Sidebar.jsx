import React from "react";
import { History, LayoutDashboard, LogOut, ShoppingBag, Store, User } from "lucide-react";

export function Sidebar({ user, activeView, cartCount, onNavigate, onSignOut }) {
  const isAdmin = user?.role === "admin";

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandMark">
          <ShoppingBag size={24} weight="bold" />
        </div>
        <span>Cravon</span>
      </div>

      <nav className="navStack">
        <button
          className={`nav ${activeView === "restaurants" ? "active" : ""}`}
          onClick={() => onNavigate("restaurants")}
        >
          <Store size={20} />
          <span>Explore</span>
        </button>

        {!isAdmin && (
          <>
            <button
              className={`nav ${activeView === "cart" ? "active" : ""}`}
              onClick={() => onNavigate("cart")}
            >
              <ShoppingBag size={20} />
              <span>Cart {cartCount > 0 && <b className="badge">{cartCount}</b>}</span>
            </button>
            <button
              className={`nav ${activeView === "orders" ? "active" : ""}`}
              onClick={() => onNavigate("orders")}
            >
              <History size={20} />
              <span>Orders</span>
            </button>
          </>
        )}

        {isAdmin && (
          <>
            <button
              className={`nav ${activeView === "admin" ? "active" : ""}`}
              onClick={() => onNavigate("admin")}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button
              className={`nav ${activeView === "orders" ? "active" : ""}`}
              onClick={() => onNavigate("orders")}
            >
              <History size={20} />
              <span>Manage Orders</span>
            </button>
          </>
        )}
      </nav>

      <div className="account">
        <div className="userInfo">
          <div className="avatar">
            <User size={18} />
          </div>
          <div>
            <p className="userName">{user?.username}</p>
            <small className="userRole">{user?.role}</small>
          </div>
        </div>
        <button className="nav logout" onClick={onSignOut}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
