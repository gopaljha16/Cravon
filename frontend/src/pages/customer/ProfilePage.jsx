import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { User, MapPin, Phone, Mail, ShoppingBag, PackageCheck, ChevronRight } from "lucide-react";

export function ProfilePage() {
  const { user, orders, isCustomer, signOut } = useApp();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <h2 className="font-serif text-4xl font-bold mb-4">Please Sign In</h2>
        <p className="text-gray-500 mb-8">You must be signed in to view your profile.</p>
        <Link to="/auth" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  const delivered = orders.filter(o => o.order_status === "delivered").length;
  const pending = orders.filter(o => o.order_status !== "delivered").length;
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
      {/* Hero profile card */}
      <div className="glass-panel rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 mb-8 md:mb-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 relative overflow-hidden animate-fade-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a373]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#2d4a36] flex items-center justify-center text-white font-serif text-3xl md:text-5xl font-bold flex-shrink-0 shadow-2xl">
          {user.username.charAt(0).toUpperCase()}
        </div>

        <div className="text-center md:text-left flex-1">
          <span className="text-[#d4a373] text-[10px] md:text-xs uppercase tracking-[0.2em] font-black">
            {user.role === "admin" ? "Platform Administrator" : "Elite Member"}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-1 tracking-tighter">{user.username}</h1>
          {user.email && (
            <div className="flex items-center gap-2 mt-3 justify-center md:justify-start text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest">
              <Mail size={14} /> <span>{user.email}</span>
            </div>
          )}
        </div>

        <div className="w-full md:w-auto flex justify-center">
          <button
            onClick={() => { signOut(); window.location.href = "/"; }}
            className="w-full md:w-auto text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-100 px-8 py-3.5 rounded-full hover:bg-red-50 transition-all active:scale-95"
          >
            Sign Out
          </button>
        </div>
      </div>

      {isCustomer && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white p-6 rounded-[2rem] text-center shadow-sm border border-black/5">
              <ShoppingBag className="mx-auto text-[#d4a373] mb-3" size={28} />
              <p className="text-3xl font-bold font-serif">{orders.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Total Orders</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] text-center shadow-sm border border-black/5">
              <PackageCheck className="mx-auto text-[#2d4a36] mb-3" size={28} />
              <p className="text-3xl font-bold font-serif">{delivered}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Completed</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] text-center shadow-sm border border-black/5">
              <span className="block text-[#2d4a36] font-serif text-3xl font-bold">₹{totalSpent.toFixed(0)}</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Investment</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
              <h2 className="font-serif text-3xl font-bold tracking-tighter">Dining History</h2>
              <Link to="/orders" className="text-[10px] font-black uppercase tracking-widest text-[#d4a373] hover:text-[#2d4a36] transition-colors flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm">
                View Entire Timeline <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ShoppingBag size={64} className="mx-auto mb-6 opacity-10" />
                  <p className="text-xl font-serif italic mb-8">No memories captured yet.</p>
                  <Link to="/explore" className="btn-primary px-10 py-4 text-xs">Begin Exploration</Link>
                </div>
              ) : (
                orders.slice(0, 4).map(order => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/50 rounded-[1.5rem] border border-black/5 hover:bg-white hover:shadow-xl transition-all group">
                    <div className="mb-4 sm:mb-0">
                      <p className="font-bold text-lg group-hover:text-[#2d4a36] transition-colors">{order.restaurant}</p>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                        <MapPin size={12} className="text-[#d4a373]" /> <span>{order.delivery_address}</span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col justify-between items-center sm:items-end gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 border-black/5">
                      <p className="font-serif font-bold text-xl">₹{order.total_price}</p>
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-lg ${
                        order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.order_status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-[#f5f2eb] text-[#2d4a36]'
                      }`}>{order.order_status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
