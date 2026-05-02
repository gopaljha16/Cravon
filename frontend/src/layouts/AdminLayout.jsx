import React, { useState } from "react";
import { Link, Outlet, Navigate, useSearchParams } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { LayoutDashboard, LogOut, Store, Receipt, Menu, X } from "lucide-react";

export function AdminLayout() {
  const { user, isAdmin, signOut, notice, clearNotice } = useApp();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user || !isAdmin) {
    return <Navigate to="/auth" />;
  }

  const navLink = (tab, Icon, label) => {
    const isActive = activeTab === tab;
    return (
      <Link
        to={`/admin?tab=${tab}`}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive ? "bg-[#d4a373] text-[#1a1a1a] font-bold shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/10"
        }`}
      >
        <Icon size={18} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-[#1a1a1a] text-white rounded-lg shadow-lg"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside className={`w-64 bg-[#1a1a1a] text-white flex flex-col fixed h-full z-40 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/10">
          <Link to="/" className="font-serif text-3xl font-black tracking-tighter text-[#d4a373]">
            CRAVON.
          </Link>
          <span className="block mt-1 text-xs uppercase tracking-widest text-gray-500 font-bold">Admin Portal</span>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-1">
          {navLink("dashboard", LayoutDashboard, "Dashboard Overview")}
          {navLink("restaurants", Store, "Restaurants & Menus")}
          {navLink("orders", Receipt, "Order Management")}
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#d4a373] flex items-center justify-center font-serif text-xl font-bold text-[#1a1a1a]">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold truncate max-w-[120px]">{user.username}</p>
              <p className="text-xs text-gray-400">System Admin</p>
            </div>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 w-full px-2 py-2 rounded-lg hover:bg-red-400/10 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Admin Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Notice Banner */}
        {notice && (
          <div className={`px-6 py-3 text-center text-sm font-medium sticky top-0 z-20 ${
            notice.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {notice.message}
            <button onClick={clearNotice} className="ml-4 underline">Dismiss</button>
          </div>
        )}

        <div className="p-4 md:p-10 flex-grow">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
