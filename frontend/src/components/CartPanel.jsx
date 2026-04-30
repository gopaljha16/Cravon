import { Minus, Plus, ShoppingCart, Trash2, Utensils } from "lucide-react";

export function CartPanel({ cart, onUpdateCart, onCheckout }) {
  return (
    <section className="cart">
      <h2><ShoppingCart size={20} /> Cart</h2>
      {cart.items.length === 0 && <p className="muted">Your cart is empty.</p>}
      {cart.items.map((item) => (
        <div className="cartRow" key={item.id}>
          <span><b>{item.name}</b><small>Rs {item.subtotal}</small></span>
          <div>
            <button onClick={() => onUpdateCart(`/cart/decrease/${item.id}/`)} title="Decrease"><Minus size={14} /></button>
            <strong>{item.quantity}</strong>
            <button onClick={() => onUpdateCart(`/cart/increase/${item.id}/`)} title="Increase"><Plus size={14} /></button>
            <button onClick={() => onUpdateCart(`/cart/remove/${item.id}/`)} title="Remove"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
      <footer>
        <b>Total: Rs {cart.total_price}</b>
        <button className="primary" disabled={!cart.items.length} onClick={onCheckout}><Utensils size={16} /> Checkout</button>
      </footer>
    </section>
  );
}
