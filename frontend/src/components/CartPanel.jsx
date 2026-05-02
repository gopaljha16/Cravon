import React from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

export function CartPanel({ cart, isBusy, onUpdateCart, onCheckout }) {
  if (cart.items.length === 0) {
    return (
      <div className="panel cart empty">
        <div className="emptyContent">
          <ShoppingCart size={40} className="muted" />
          <p>Your cart is empty</p>
          <small>Add some delicious food to get started!</small>
        </div>
      </div>
    );
  }

  return (
    <div className="panel cart">
      <div className="panelHead">
        <h2>Your Cart</h2>
        <span className="cartCount">{cart.items.length}</span>
      </div>
      
      <div className="cartItems">
        {cart.items.map((item) => (
          <div key={item.id} className="cartRow">
            <div className="itemMain">
              <b>{item.name}</b>
              <p>₹{item.price} x {item.quantity}</p>
            </div>
            <div className="qtyControls">
              <button 
                onClick={() => onUpdateCart(`/cart/remove/${item.id}/`)}
                disabled={isBusy}
              >
                <Minus size={14} />
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => onUpdateCart(`/cart/add/${item.id}/`)}
                disabled={isBusy}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <footer className="cartFooter">
        <div className="totalLine">
          <span>Subtotal</span>
          <b>₹{cart.total_price}</b>
        </div>
        <button className="primary fullWidth" onClick={onCheckout} disabled={isBusy}>
          Checkout Now
        </button>
      </footer>
    </div>
  );
}
