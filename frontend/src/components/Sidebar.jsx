import { ChefHat, ClipboardList, LogOut, ShoppingCart, Store, UserRound } from "lucide-react";

export function Sidebar({ user, cartCount, onSignOut }) {
  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brandMark"><ChefHat size={24} /></span>
        <span>Cravon</span>
      </div>

      <nav className="navStack" aria-label="Main navigation">
        <button className="nav active"><Store size={18} /> Restaurants</button>
        {isCustomer && <button className="nav"><ShoppingCart size={18} /> Cart ({cartCount})</button>}
        {isAdmin && <button className="nav"><ClipboardList size={18} /> Admin</button>}
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
