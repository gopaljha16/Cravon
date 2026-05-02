import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { api } from "../../api";
import { Trash2, Plus, Minus, CreditCard, Loader2, MapPin, Phone, StickyNote, ShoppingBag, CheckCircle } from "lucide-react";

export function CartPage() {
  const { cart, updateCart, cartBusy, isCustomer, loadOrders, showNotice } = useApp();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState({ delivery_address: "", delivery_phone: "", delivery_instructions: "" });
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // default to razorpay
  const [paymentBusy, setPaymentBusy] = useState(false);

  const subtotal = Number(cart?.total_price || 0);
  const deliveryFee = subtotal > 0 ? 39 : 0;
  const taxAmount = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + deliveryFee + taxAmount).toFixed(2));

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    if (!delivery.delivery_address || !delivery.delivery_phone) {
      showNotice("Address and phone are required", "error");
      return;
    }

    setPaymentBusy(true);

    try {
      if (paymentMethod === "cod") {
        // Cash on Delivery path
        const data = await api("/orders/checkout/", { method: "POST", body: JSON.stringify(delivery) });
        await updateCart("/cart/"); 
        await loadOrders();
        showNotice(`Order #${data.order.id} placed successfully!`, "success");
        navigate("/orders");
      } else {
        // Razorpay path
        const data = await api("/payments/create-order/", { method: "POST", body: JSON.stringify(delivery) });
        
        const options = {
          key: data.key,
          amount: data.payment.amount,
          currency: data.payment.currency,
          name: "Cravon",
          description: `Order #${data.order.id}`,
          order_id: data.payment.id,
          handler: async (response) => {
            try {
              const verification = await api("/payments/verify/", {
                method: "POST",
                body: JSON.stringify({
                  order_id: data.order.id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              await updateCart("/cart/");
              await loadOrders();
              showNotice(`Payment successful! Order #${verification.order.id} is confirmed.`, "success");
              navigate("/orders");
            } catch (err) {
              showNotice("Payment verification failed: " + err.message, "error");
            }
          },
          prefill: {
            name: data.customer.name,
            email: data.customer.email,
            contact: data.customer.contact,
          },
          theme: { color: "#2d4a36" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response) => {
          showNotice("Payment failed: " + response.error.description, "error");
        });
        rzp.open();
      }
    } catch (err) {
      showNotice(err.message, "error");
    } finally {
      setPaymentBusy(false);
    }
  };

  if (!isCustomer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-serif text-4xl font-bold mb-4">Please Sign In</h2>
        <p className="text-gray-500 mb-8">You must be signed in as a customer to view and checkout your cart.</p>
        <Link to="/auth" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="font-serif text-5xl font-bold mb-12">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side - Cart Items & Delivery */}
        <div className="lg:col-span-8 space-y-8">
          {/* Cart items panel */}
          <div className="glass-panel p-8 rounded-[3rem]">
            <h3 className="font-serif text-2xl font-bold mb-6">Your Selection</h3>
            {(!cart?.items || cart.items.length === 0) ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">Your cart is empty.</p>
                <Link to="/explore" className="text-[#2d4a36] font-bold mt-4 inline-block hover:underline">Explore Menu</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b border-black/5 pb-6 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="font-serif font-bold text-gray-600 mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                        <button disabled={cartBusy} onClick={() => updateCart(`/cart/decrease/${item.id}/`)} className="p-1 hover:text-[#2d4a36] disabled:opacity-50"><Minus size={16}/></button>
                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                        <button disabled={cartBusy} onClick={() => updateCart(`/cart/add/${item.id}/`)} className="p-1 hover:text-[#2d4a36] disabled:opacity-50"><Plus size={16}/></button>
                      </div>
                      <span className="font-bold text-lg w-20 text-right">₹{item.subtotal.toFixed(2)}</span>
                      <button disabled={cartBusy} onClick={() => updateCart(`/cart/remove/${item.id}/`)} className="p-2 text-red-400 hover:text-red-600 ml-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery panel */}
          <div className="glass-panel p-8 rounded-[3rem]">
            <h3 className="font-serif text-2xl font-bold mb-6">Delivery Details</h3>
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required placeholder="Full Delivery Address" value={delivery.delivery_address} onChange={(e) => setDelivery({...delivery, delivery_address: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-black/5 outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input required placeholder="Phone Number" value={delivery.delivery_phone} onChange={(e) => setDelivery({...delivery, delivery_phone: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-black/5 outline-none" />
                </div>
                <div className="relative">
                  <StickyNote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input placeholder="Instructions (Optional)" value={delivery.delivery_instructions} onChange={(e) => setDelivery({...delivery, delivery_instructions: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-black/5 outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment method selection */}
          <div className="glass-panel p-8 rounded-[3rem]">
            <h3 className="font-serif text-2xl font-bold mb-6">Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod("razorpay")}
                className={`p-6 rounded-3xl border-2 text-left transition-all ${paymentMethod === 'razorpay' ? 'border-[#2d4a36] bg-[#2d4a36]/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">Razorpay Checkout</span>
                  {paymentMethod === 'razorpay' && <CheckCircle className="text-[#2d4a36]" size={20} />}
                </div>
                <p className="text-sm text-gray-500">Pay securely with Cards, UPI, or Netbanking.</p>
              </button>

              <button 
                onClick={() => setPaymentMethod("cod")}
                className={`p-6 rounded-3xl border-2 text-left transition-all ${paymentMethod === 'cod' ? 'border-[#d4a373] bg-[#d4a373]/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">Cash on Delivery</span>
                  {paymentMethod === 'cod' && <CheckCircle className="text-[#d4a373]" size={20} />}
                </div>
                <p className="text-sm text-gray-500">Pay the delivery partner when your order arrives.</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Summary */}
        <div className="lg:col-span-4">
          <div className="glass-panel p-8 rounded-[3rem] sticky top-32">
            <h3 className="font-serif text-2xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-black">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-bold text-black">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes (5%)</span>
                <span className="font-bold text-black">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="h-px bg-black/10 my-4"></div>
              <div className="flex justify-between text-2xl">
                <span className="font-serif font-bold">Total</span>
                <span className="font-bold text-[#d4a373]">₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout} 
              disabled={!cart?.items?.length || paymentBusy}
              className={`w-full py-5 rounded-full font-bold text-white shadow-xl transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 ${paymentMethod === 'razorpay' ? 'bg-[#2d4a36]' : 'bg-[#1a1a1a]'}`}
            >
              {paymentBusy ? <Loader2 className="spin" size={20} /> : <CreditCard size={20} />}
              {paymentMethod === 'razorpay' ? 'Pay & Confirm Order' : 'Place COD Order'}
            </button>
            
            <p className="text-[10px] text-center text-gray-400 mt-6 uppercase tracking-widest font-bold">
              Secure SSL Encrypted Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
