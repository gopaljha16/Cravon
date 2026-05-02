import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { ShoppingBag, MapPin, Clock, CreditCard, ChevronRight } from "lucide-react";

export function OrdersPage() {
  const { orders, isCustomer } = useApp();

  if (!isCustomer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <h2 className="font-serif text-4xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-500 mb-8">Please sign in as a customer to view your order history.</p>
        <Link to="/auth" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 animate-fade-up">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-[#d4a373] rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4a373]">Gourmet Log</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter">Your <span className="text-[#2d4a36] italic font-light">Journey</span></h1>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Total {orders.length} orders placed
        </div>
      </div>

      <div className="space-y-6 md:space-y-10">
        {orders.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-[3rem] animate-fade-up">
            <ShoppingBag size={80} className="mx-auto mb-8 opacity-10" />
            <h3 className="font-serif text-3xl font-bold mb-4">No Orders Yet</h3>
            <p className="text-gray-400 mb-10 font-medium">Your culinary diary is waiting for its first entry.</p>
            <Link to="/explore" className="btn-primary px-12 py-5 text-sm">Explore Restaurants</Link>
          </div>
        ) : (
          orders.map((order, i) => (
            <div 
              key={order.id} 
              className="glass-panel rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-black/5 hover:border-[#2d4a3620] transition-all duration-500 hover:shadow-2xl animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 bg-white p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-black/5">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4a373] block mb-2">Order #{order.id}</span>
                  <h3 className="font-serif text-3xl font-bold mb-6 text-[#1a1a1a]">{order.restaurant}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-500 font-medium">
                      <Clock size={16} className="text-[#2d4a36]" />
                      <span className="text-sm">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-start gap-3 text-gray-500 font-medium">
                      <MapPin size={16} className="text-[#2d4a36] mt-1" />
                      <span className="text-sm line-clamp-2">{order.delivery_address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 font-medium">
                      <CreditCard size={16} className="text-[#2d4a36]" />
                      <span className="text-sm uppercase tracking-widest text-[10px] font-bold">{order.payment_status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-8 md:p-12 flex flex-col justify-between bg-white/30 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-10">
                    <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${
                      order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.order_status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-white text-[#2d4a36] shadow-sm'
                    }`}>
                      {order.order_status}
                    </div>
                    <span className="font-serif text-3xl font-bold">₹{order.total_price}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link to={`/explore?restaurant=${order.restaurant_id}`} className="w-full sm:flex-1 py-4 text-center bg-white border border-black/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2d4a36] hover:text-white transition-all shadow-sm">
                      Reorder Experience
                    </Link>
                    <button className="w-full sm:w-auto p-4 bg-white border border-black/5 rounded-2xl hover:bg-[#d4a373] transition-all shadow-sm">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
