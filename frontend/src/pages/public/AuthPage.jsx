import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { api } from "../../api";
import { User, Lock, Mail, Phone, MapPin } from "lucide-react";

export function AuthPage() {
  const { setUser, setCart, showNotice, clearNotice } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [auth, setAuth] = useState({ username: "", password: "", email: "", mobile: "", address: "" });

  const handleChange = (e) => setAuth({ ...auth, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearNotice();
    const path = mode === "signin" ? "/auth/signin/" : "/auth/signup/";

    try {
      const data = await api(path, { method: "POST", body: JSON.stringify(auth) });
      if (mode === "signup") {
        setMode("signin");
        showNotice("Account created. Please sign in.", "success");
        return;
      }
      setUser(data.user);
      setCart({ items: [], total_price: 0 });
      showNotice("Signed in successfully", "success");
      navigate(data.user.role === "admin" ? "/admin" : "/explore");
    } catch (error) {
      showNotice(error.message, "error");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-panel p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a373]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2d4a36]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 text-center mb-10">
          <h2 className="text-4xl font-serif font-bold text-[#1a1a1a]">
            {mode === "signin" ? "Welcome Back" : "Join Cravon"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {mode === "signin" ? "Sign in to continue your culinary journey" : "Create an account to order premium dishes"}
          </p>
        </div>

        <form className="relative z-10 space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input required name="username" type="text" placeholder="Username" value={auth.username} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-black/5 focus:ring-2 focus:ring-[#2d4a36] outline-none transition-all" />
          </div>

          {mode === "signup" && (
            <>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required name="email" type="email" placeholder="Email Address" value={auth.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-black/5 focus:ring-2 focus:ring-[#2d4a36] outline-none transition-all" />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required name="mobile" type="text" placeholder="Mobile Number" value={auth.mobile} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-black/5 focus:ring-2 focus:ring-[#2d4a36] outline-none transition-all" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required name="address" type="text" placeholder="Delivery Address" value={auth.address} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-black/5 focus:ring-2 focus:ring-[#2d4a36] outline-none transition-all" />
              </div>
            </>
          )}

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input required name="password" type="password" placeholder="Password" value={auth.password} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-black/5 focus:ring-2 focus:ring-[#2d4a36] outline-none transition-all" />
          </div>

          <button type="submit" className="w-full btn-primary text-lg mt-4 shadow-lg shadow-[#2d4a36]/20">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="relative z-10 mt-6 text-center text-sm text-gray-500">
          {mode === "signin" ? "New to Cravon? " : "Already have an account? "}
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-bold text-[#2d4a36] hover:underline">
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
