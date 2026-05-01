import { Loader2, Minus, Plus, ShoppingCart, Trash2, Utensils } from "lucide-react";

export function CartPanel({ cart, isBusy, onUpdateCart, onCheckout }) {
  return (
    <section className="cart">
      <h2><ShoppingCart size={20} /> Cart</h2>
      {cart.items.length === 0 && <p className="muted">Your cart is empty.</p>}
      {cart.items.map((item) => (
        <div className="cartRow" key={item.id}>
          <span><b>{item.name}</b><small>Rs {item.subtotal}</small></span>
          <div>
            <button disabled={isBusy} onClick={() => onUpdateCart(`/cart/decrease/${item.id}/`)} title="Decrease"><Minus size={14} /></button>
            <strong>{item.quantity}</strong>
            <button disabled={isBusy} onClick={() => onUpdateCart(`/cart/increase/${item.id}/`)} title="Increase"><Plus size={14} /></button>
            <button disabled={isBusy} onClick={() => onUpdateCart(`/cart/remove/${item.id}/`)} title="Remove"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
      <footer>
        <b>Total: Rs {cart.total_price}</b>
        <button className="primary" disabled={!cart.items.length || isBusy} onClick={onCheckout}>
          {isBusy ? <Loader2 className="spin" size={16} /> : <Utensils size={16} />}
          {isBusy ? "Processing" : "Checkout"}
        </button>
      </footer>
    </section>
  );
}
