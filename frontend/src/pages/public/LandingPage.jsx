import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { Star, Search, ArrowRight, Clock, Leaf, Shield, ChevronRight, MapPin, Menu } from "lucide-react";

const FEATURES = [
  { icon: Clock, title: "Fast Delivery", desc: "Get your food delivered in under 30 minutes from top local restaurants." },
  { icon: Leaf, title: "Fresh Ingredients", desc: "Our partners source only the freshest, highest-quality local produce." },
  { icon: Shield, title: "Secure & Easy", desc: "Safe payments, live order tracking, and dedicated customer support." },
];

const TESTIMONIALS = [
  { text: "Absolutely incredible experience! The food arrived hot and tasted exactly like dining in. Cravon has completely changed how I eat.", author: "Priya Sharma", role: "Mumbai" },
  { text: "The variety of restaurants is amazing. I discover something new every week. Customer support was also super responsive.", author: "Arjun Mehta", role: "Bangalore" },
  { text: "My family loves ordering through Cravon. The interface is clean, payments are smooth, and the food is always on point.", author: "Sarah Rossi", role: "Delhi" },
];

export function LandingPage() {
  const { restaurants, loadRestaurants, user } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    loadRestaurants();
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/explore");
    }
  };

  const filteredSearch = restaurants.filter(r => 
    searchQuery && (r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 5);

  return (
    <div className="w-full overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] md:min-h-[95vh] flex items-center justify-center px-6 overflow-hidden" style={{ background: "#f5f2eb" }}>
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#d4a373] opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2d4a36] opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-10 animate-fade-up">

          <h1 className="font-serif font-black leading-[0.85] tracking-tighter mb-10" style={{ fontSize: "clamp(3.5rem, 15vw, 10rem)", color: "#1a1a1a" }}>
            CRAVE THE<br />
            <span className="relative md:left-[-100px] left-0 transition-all duration-700 block md:inline">
              <span style={{ color: "#2d4a36", fontStyle: "italic", fontWeight: 300 }}>EXTRA</span>ORDINARY
            </span>
          </h1>

          <p className="max-w-xl mx-auto mb-12 leading-relaxed text-base md:text-xl text-gray-500 font-medium">
            Bridging the gap between world-class kitchens and your dining table. Experience the gold standard of food delivery.
          </p>

          {/* Enhanced Search Bar with Dropdown */}
          <div className="relative max-w-2xl mx-auto z-50">
            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-[2rem] md:rounded-3xl shadow-2xl shadow-black/5 border border-black/5 overflow-hidden transition-all duration-300 focus-within:shadow-[#2d4a3620] focus-within:border-[#2d4a3640]">
              <Search size={22} className="ml-6 md:ml-8 flex-shrink-0 text-gray-400" />
              <input
                type="text"
                placeholder="Find a restaurant or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="flex-1 px-4 md:px-6 py-5 md:py-7 outline-none text-sm md:text-base bg-transparent font-bold"
                style={{ color: "#1a1a1a" }}
              />
              <button type="submit" className="hidden sm:block m-2 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-95 shadow-xl" style={{ background: "#2d4a36" }}>
                Search
              </button>
            </form>

            {/* Mobile search button */}
            <button type="button" onClick={handleSearch} className="sm:hidden w-full mt-4 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest text-white transition-all active:scale-95 shadow-xl" style={{ background: "#2d4a36" }}>
              Search Now
            </button>

            {/* Live Search Suggestions */}
            {isSearchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2.5rem] shadow-2xl border border-black/5 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Discovery</span>
                </div>
                {filteredSearch.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 italic font-medium">No results for "{searchQuery}"</div>
                ) : (
                  filteredSearch.map(r => (
                    <button 
                      key={r.id} 
                      onClick={() => navigate(`/explore?restaurant=${r.id}`)}
                      className="w-full flex items-center gap-5 p-5 hover:bg-[#f5f2eb] transition-colors text-left group"
                    >
                      <img src={r.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt={r.name} />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-[#2d4a36] transition-colors text-lg">{r.name}</h4>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{r.cuisine}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#d4a373] font-black text-sm">
                        {r.rating} <Star size={14} fill="#d4a373" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CUISINE TAGS BAR ── */}
      <section className="py-6 px-4 md:px-8 sticky top-20 z-30" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <div className="flex gap-4 max-w-7xl mx-auto overflow-x-auto no-scrollbar py-2">
          {["All Menu", "Trending", "Offers", "Top Rated", "Fastest", "Healthy", "Gourmet"].map(tag => (
            <button
              key={tag}
              onClick={() => navigate(`/explore?filter=${tag.toLowerCase().replace(' ', '-')}`)}
              className="flex-shrink-0 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-white border border-gray-100 shadow-sm hover:border-[#2d4a36] hover:text-[#2d4a36] hover:shadow-xl hover:-translate-y-0.5"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* ── RESTAURANTS GRID ── */}
      <section className="py-24 px-6 md:px-8" style={{ background: "#f5f2eb" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8 animate-fade-up">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-[#d4a373] rounded-full"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4a373]">Elite Selection</span>
              </div>
              <h2 className="font-serif font-black" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "#1a1a1a", lineHeight: 0.85 }}>Featured<br /><span className="text-[#2d4a36] italic font-light">Destinations</span></h2>
            </div>
            <Link to="/explore" className="flex items-center gap-4 font-black text-[10px] uppercase tracking-widest px-10 py-5 bg-[#1a1a1a] text-white rounded-2xl shadow-2xl hover:bg-[#2d4a36] transition-all hover:-translate-x-2">
              Browse Entire Menu <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {restaurants.slice(0, 6).map((r, i) => (
              <Link
                to={`/explore?restaurant=${r.id}`}
                key={r.id}
                className="group block bg-white rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 border border-black/5 animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative h-72 md:h-80 overflow-hidden">
                  <img
                    src={r.image || r.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"}
                    alt={r.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="absolute top-6 right-6">
                    <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-2xl text-[11px] font-black shadow-2xl flex items-center gap-1.5">
                      <Star size={14} fill="#d4a373" className="text-[#d4a373]" /> {r.rating}
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <span className="bg-[#2d4a36] text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl shadow-2xl">View Experience</span>
                  </div>
                </div>
                <div className="p-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4a373] mb-3 block">{r.cuisine}</span>
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#1a1a1a] group-hover:text-[#2d4a36] transition-colors mb-6 tracking-tighter leading-tight">{r.name}</h3>
                  <div className="flex items-center gap-5 text-[10px] text-gray-400 font-black tracking-widest border-t border-gray-50 pt-8">
                    <div className="flex items-center gap-2"><Clock size={16}/> 25 MIN</div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                    <div className="flex items-center gap-2"><MapPin size={16}/> GOURMET</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-32 px-6 md:px-8" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="animate-fade-up">
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-[#d4a373]">The Philosophy</span>
              <h2 className="font-serif font-black mb-10 leading-[0.9] tracking-tighter" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", color: "#1a1a1a" }}>Artisanal Dining,<br /><span className="text-[#2d4a36] italic font-light">Redefined.</span></h2>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-16 font-medium">We've reimagined the delivery journey to ensure the passion of the chef translates perfectly to your home sanctuary.</p>
              
              <div className="space-y-12">
                {[
                  { title: "Curated Partnerships", desc: "We only collaborate with kitchens that demonstrate culinary obsession." },
                  { title: "Smart Precision", desc: "Proprietary logistics ensure your meal stays at the exact intended temperature." },
                  { title: "Boutique Experience", desc: "Every touchpoint is designed to feel like a high-end concierge service." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="w-12 h-12 rounded-2xl bg-[#f5f2eb] flex items-center justify-center font-serif text-xl font-bold text-[#2d4a36] flex-shrink-0 group-hover:bg-[#2d4a36] group-hover:text-white transition-all duration-500">0{i+1}</div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 tracking-tight">{item.title}</h4>
                      <p className="text-gray-400 text-base font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-[#d4a373] rounded-[4rem] rotate-6 scale-95 opacity-5"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#2d4a3608] rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" 
                className="relative z-10 rounded-[3rem] md:rounded-[5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 transform hover:scale-[1.02]" 
                alt="Dining Experience" 
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-[2rem] shadow-2xl z-20 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#2d4a36] rounded-full flex items-center justify-center text-white font-bold">10k+</div>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Gourmet Meals<br/>Delivered Daily</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CRAVON ── */}
      <section className="py-24 px-6 md:px-8" style={{ background: "#2d4a36" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="group p-10 md:p-14 rounded-[3.5rem] transition-all hover:bg-white/5 border border-white/5 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center mb-10 transition-all group-hover:rotate-12 group-hover:scale-110 shadow-2xl" style={{ background: "#d4a373" }}>
                    <Icon size={32} color="#1a1a1a" />
                  </div>
                  <h3 className="font-bold text-2xl md:text-3xl mb-4 text-white font-serif tracking-tight">{f.title}</h3>
                  <p className="text-base md:text-lg leading-relaxed font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-32 px-6 md:px-8" style={{ background: "#f5f2eb" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif font-black mb-24 animate-fade-up" style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", color: "#1a1a1a", lineHeight: 0.85 }}>Community<br /><span className="text-[#d4a373] italic font-light">Aura</span></h2>
          <div className="relative min-h-[400px] md:min-h-[300px] flex items-center justify-center">
            {TESTIMONIALS.map((t, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
                  i === activeTestimonial 
                    ? 'opacity-100 translate-y-0 scale-100 z-10' 
                    : 'opacity-0 translate-y-8 scale-95 z-0 pointer-events-none invisible'
                }`}
              >
                <div className="text-8xl md:text-[12rem] text-[#d4a37315] font-serif mb-0 leading-none select-none absolute -top-10 md:-top-20 opacity-50">“</div>
                <p className="relative z-10 font-serif text-2xl md:text-4xl italic leading-tight mb-12 text-gray-800 tracking-tighter max-w-3xl mx-auto px-6">
                  {t.text} ”
                </p>
                <div className="flex items-center justify-center gap-5 translate-y-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center font-black text-[#1a1a1a] font-serif text-2xl shadow-2xl border-4 border-white overflow-hidden" style={{ background: "#d4a373" }}>
                    <span className="animate-pulse">{t.author.charAt(0)}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-xs md:text-sm uppercase tracking-[0.2em] text-gray-900">{t.author}</p>
                    <p className="text-[10px] font-black text-[#d4a373] uppercase tracking-[0.2em] mt-1">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-4 mt-28">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} className={`h-1.5 rounded-full transition-all duration-700 ${i === activeTestimonial ? 'w-14 bg-[#2d4a36]' : 'w-4 bg-gray-200'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 md:py-36 px-6 md:px-8 relative overflow-hidden" style={{ background: "#1a1a1a" }}>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2d4a3608] skew-x-12 translate-x-1/2"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-up">
          <h2 className="font-serif font-black mb-12 text-white leading-[0.85] tracking-tighter" style={{ fontSize: "clamp(3.5rem, 10vw, 7.5rem)" }}>
            Elevate Your<br />Dining <span style={{ color: "#d4a373", fontStyle: "italic", fontWeight: 300 }}>Ritual</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link to="/explore" className="w-full sm:w-auto px-16 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-white hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#2d4a3630]" style={{ background: "#2d4a36" }}>
              Explore The Menu
            </Link>
            {!user && (
              <Link to="/auth" className="w-full sm:w-auto px-16 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] border transition-all hover:bg-white hover:text-black" style={{ color: "#d4a373", border: "1px solid #d4a373" }}>
                Join The Circle
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
