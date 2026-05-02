import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { ShoppingBag, User as UserIcon, LogOut, Menu, X, Search, Heart, Home } from "lucide-react";

export function CustomerLayout() {
  const { user, cart, signOut, notice, clearNotice } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f2eb", fontFamily: "Outfit, sans-serif" }}>
      
      {/* Notice Banner */}
      {notice && (
        <div className={`px-6 py-3 text-center text-xs font-bold uppercase tracking-widest z-[60] sticky top-0 ${notice.type === 'error' ? 'bg-red-500 text-white' : 'bg-[#2d4a36] text-white'} animate-in slide-in-from-top duration-300`}>
          {notice.message}
          <button onClick={clearNotice} className="ml-4 underline">Close</button>
        </div>
      )}

      {/* Modern Navigation */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${mobileMenuOpen ? 'bg-white shadow-none' : 'bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 md:h-24 flex items-center justify-between">
          
          <div className="flex items-center gap-4 lg:gap-10">
            {/* Mobile Toggle */}
            <button onClick={toggleMobileMenu} className="md:hidden p-2 -ml-2 text-gray-600 hover:text-[#2d4a36] transition-colors">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
              <span className="font-serif text-2xl md:text-3xl font-black tracking-tighter text-[#1a1a1a]">CRAVON.</span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-10 ml-6">
              <Link to="/explore" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:tracking-[0.3em] ${isActive('/explore') ? 'text-[#2d4a36]' : 'text-gray-400 hover:text-[#2d4a36]'}`}>Menu</Link>
              {user?.role === 'customer' && (
                <Link to="/orders" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:tracking-[0.3em] ${isActive('/orders') ? 'text-[#2d4a36]' : 'text-gray-400 hover:text-[#2d4a36]'}`}>My Orders</Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin?tab=dashboard" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#d4a373] hover:text-[#2d4a36] transition-all hover:tracking-[0.3em]">Admin Portal</Link>
              )}
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 md:gap-6">
            {/* Desktop Search Placeholder */}
            <div className="hidden lg:flex items-center bg-gray-100/50 rounded-full px-4 py-2 border border-black/5">
              <Search size={14} className="text-gray-400" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs ml-2 w-32 font-bold" />
            </div>

            {user ? (
              <div className="flex items-center gap-3 md:gap-5">
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-[#2d4a36] transition-all hover:scale-110">
                  <ShoppingBag size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#d4a373] text-[#1a1a1a] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="hidden sm:flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-[#f5f2eb] border border-black/5 flex items-center justify-center text-[#2d4a36] font-serif text-lg font-bold group-hover:bg-[#2d4a36] group-hover:text-white transition-all shadow-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <button onClick={signOut} className="hidden md:flex p-2 text-gray-400 hover:text-red-500 transition-colors" title="Sign Out">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/auth" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#2d4a36]">Sign In</Link>
                <Link to="/auth" className="btn-primary text-[11px] py-3 px-6 hidden sm:block">Join Cravon</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-black/5 shadow-2xl transition-all duration-300 transform origin-top ${mobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
          <div className="p-8 space-y-6">
            <Link to="/explore" onClick={toggleMobileMenu} className="flex items-center gap-4 text-xl font-serif font-bold group">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-[#2d4a36] group-hover:text-white transition-all">
                <Search size={20} />
              </div>
              Explore Menu
            </Link>
            {user?.role === 'customer' && (
              <Link to="/orders" onClick={toggleMobileMenu} className="flex items-center gap-4 text-xl font-serif font-bold group">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-[#2d4a36] group-hover:text-white transition-all">
                  <ShoppingBag size={20} />
                </div>
                My Orders
              </Link>
            )}
            <Link to="/profile" onClick={toggleMobileMenu} className="flex items-center gap-4 text-xl font-serif font-bold group">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-[#2d4a36] group-hover:text-white transition-all">
                <UserIcon size={20} />
              </div>
              Account Profile
            </Link>
            <div className="pt-6 border-t border-black/5">
              {user ? (
                <button onClick={() => { signOut(); toggleMobileMenu(); }} className="flex items-center gap-4 text-xl font-serif font-bold text-red-500">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  Sign Out
                </button>
              ) : (
                <Link to="/auth" onClick={toggleMobileMenu} className="btn-primary w-full text-center py-4 text-base">Get Started</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Luxury Footer */}
      <footer className="bg-[#1a1a1a] text-white pt-24 pb-12 px-8 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <span className="font-serif text-4xl font-black tracking-tighter">CRAVON.</span>
            </Link>
            <p className="text-gray-500 leading-relaxed mb-8 font-medium">Redefining the art of food delivery with curated excellence and artisanal passion.</p>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#d4a373] hover:text-[#1a1a1a] transition-all cursor-pointer"></div>)}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-8 text-[#d4a373]">Discover</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500 uppercase tracking-widest">
              <li><Link to="/explore" className="hover:text-white transition-colors">Restaurants</Link></li>
              <li><Link to="/explore?filter=trending" className="hover:text-white transition-colors">Trending</Link></li>
              <li><Link to="/explore?filter=healthy" className="hover:text-white transition-colors">Healthy</Link></li>
              <li><Link to="/explore?filter=offers" className="hover:text-white transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-8 text-[#d4a373]">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500 uppercase tracking-widest">
              <li><Link to="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Partner with Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Courier App</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-8 text-[#d4a373]">Stay Inspired</h4>
            <p className="text-gray-500 text-sm mb-6 font-medium">Join our curated newsletter for exclusive culinary discoveries.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm flex-1 outline-none focus:border-[#d4a373] transition-colors" />
              <button className="bg-[#d4a373] text-[#1a1a1a] p-3 rounded-xl hover:scale-105 active:scale-95 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 CRAVON SAAS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
            <Link to="#" className="hover:text-[#d4a373]">Privacy</Link>
            <Link to="#" className="hover:text-[#d4a373]">Terms</Link>
            <Link to="#" className="hover:text-[#d4a373]">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ChevronRight({ size }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
}
