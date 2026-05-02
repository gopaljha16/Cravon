import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { Search, MapPin, Plus, Loader2, Star, X, Info, ShoppingBag, ArrowLeft } from "lucide-react";
import { api } from "../../api";

export function ExplorePage() {
  const { restaurants, addToCart, cartBusy } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  
  const selectedId = searchParams.get("restaurant");
  const selectedRestaurant = restaurants.find(r => r.id.toString() === selectedId) || null;
  
  const [menu, setMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    if (selectedRestaurant) {
      setMenuLoading(true);
      api(`/restaurants/${selectedRestaurant.id}/menu/`)
        .then(data => setMenu(data.items || []))
        .catch(() => setMenu([]))
        .finally(() => setMenuLoading(false));
    } else {
      setMenu([]);
    }
  }, [selectedRestaurant?.id]);

  const filteredRestaurants = restaurants.filter(r => 
    `${r.name} ${r.cuisine}`.toLowerCase().includes(query.toLowerCase())
  );

  const resetSelection = () => setSearchParams({});

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Sidebar - Restaurant List */}
        <div className={`lg:col-span-4 space-y-6 md:space-y-8 ${selectedRestaurant ? 'hidden lg:block' : 'block'}`}>
          <div className="relative animate-fade-up">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search restaurants or cuisines..." 
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white border-none shadow-sm focus:ring-2 focus:ring-[#2d4a36] outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center px-2">
              <h3 className="font-serif text-2xl font-bold">Restaurants</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filteredRestaurants.length} partners</span>
            </div>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              {filteredRestaurants.length === 0 ? (
                <div className="text-center py-10 text-gray-400 italic">No restaurants match your search.</div>
              ) : (
                filteredRestaurants.map(restaurant => (
                  <button 
                    key={restaurant.id}
                    onClick={() => setSearchParams({ restaurant: restaurant.id, q: query })}
                    className={`w-full text-left p-4 rounded-[2rem] transition-all duration-300 border ${
                      selectedRestaurant?.id === restaurant.id 
                        ? 'bg-white border-[#2d4a36] shadow-xl scale-[1.02]' 
                        : 'bg-transparent border-transparent hover:bg-white/50'
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <div className="relative flex-shrink-0">
                        <img src={restaurant.image || "https://images.unsplash.com/photo-1544025162-811114215f8a?w=200"} alt={restaurant.name} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover shadow-sm" />
                        <div className="absolute -top-2 -right-2 bg-white px-1.5 py-0.5 rounded-lg text-[10px] font-bold shadow flex items-center gap-0.5">
                          {restaurant.rating} <Star size={8} fill="#d4a373" className="text-[#d4a373]" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-base md:text-lg truncate">{restaurant.name}</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1 truncate">{restaurant.cuisine}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Content - Menu */}
        <div className={`lg:col-span-8 ${!selectedRestaurant ? 'hidden lg:block' : 'block'}`}>
          {selectedRestaurant ? (
            <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] min-h-[70vh] animate-fade-up">
              {/* Back button for mobile */}
              <button 
                onClick={resetSelection}
                className="lg:hidden flex items-center gap-2 text-sm font-bold text-gray-500 mb-6 hover:text-[#2d4a36]"
              >
                <ArrowLeft size={16} /> Back to Restaurants
              </button>

              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 pb-8 border-b border-black/5">
                <div className="flex gap-4 md:gap-8 items-center">
                  <img src={selectedRestaurant.image} className="w-20 h-20 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] object-cover shadow-2xl" alt={selectedRestaurant.name} />
                  <div className="min-w-0">
                    <span className="text-[#d4a373] text-[10px] md:text-xs uppercase tracking-[0.2em] font-black block mb-1">{selectedRestaurant.cuisine}</span>
                    <h2 className="font-serif text-3xl md:text-6xl font-bold leading-tight truncate">{selectedRestaurant.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-3">
                      <div className="flex items-center gap-1.5 text-xs md:text-sm font-black">
                        <Star size={16} fill="#d4a373" className="text-[#d4a373]" />
                        <span>{selectedRestaurant.rating}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                      <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-400 font-bold">
                        <MapPin size={14} />
                        <span>PREMIUM DELIVERY</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {menuLoading ? (
                <div className="flex flex-col justify-center items-center h-96 gap-4">
                  <Loader2 className="spin text-[#2d4a36]" size={48} />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Preparing Menu...</p>
                </div>
              ) : menu.length === 0 ? (
                <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                  <ShoppingBag size={64} className="mb-4 opacity-10" />
                  <p className="text-xl font-serif italic">This kitchen is currently preparing something special.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                  {menu.map((item, i) => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedDish(item)}
                      className="group bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer border border-transparent hover:border-black/5 animate-fade-up"
                      style={{ animationDelay: `${0.1 + (i * 0.05)}s` }}
                    >
                      <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] mb-5 aspect-video sm:aspect-square md:aspect-video">
                        <img 
                          src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                        <div className="absolute bottom-4 right-4 translate-y-20 group-hover:translate-y-0 transition-all duration-500 ease-out">
                          <button 
                            onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                            disabled={cartBusy}
                            className="bg-white text-[#2d4a36] w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-2xl hover:bg-[#2d4a36] hover:text-white transition-all active:scale-90"
                          >
                            <Plus size={24} />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 px-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-lg md:text-xl group-hover:text-[#2d4a36] transition-colors line-clamp-1">{item.name}</h4>
                          <span className="font-serif text-lg md:text-xl font-bold ml-2">₹{item.price}</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full hidden lg:flex flex-col items-center justify-center text-center p-20 glass-panel rounded-[4rem] min-h-[70vh] animate-fade-up">
              <div className="w-32 h-32 bg-[#d4a37315] rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 rounded-full animate-ping bg-[#d4a37320]"></div>
                <MapPin size={64} className="text-[#d4a373] relative z-10" />
              </div>
              <h2 className="font-serif text-5xl md:text-6xl font-bold mb-4 tracking-tighter">Crave More?</h2>
              <p className="text-gray-400 max-w-sm text-lg font-medium">Select an artisan restaurant to explore their signature creations.</p>
            </div>
          )}
        </div>
      </div>

      {/* Dish Detail Modal - Responsive */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#1a1a1acc]/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedDish(null)}>
          <div 
            className="bg-[#f5f2eb] w-full max-w-4xl rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto no-scrollbar" 
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedDish(null)} className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg active:scale-90">
              <X size={20} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
              <div className="h-64 md:h-auto relative">
                <img src={selectedDish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"} className="w-full h-full object-cover" alt={selectedDish.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f5f2eb] via-transparent to-transparent md:hidden"></div>
              </div>
              <div className="p-8 md:p-14 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#2d4a36] text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg">{selectedRestaurant?.cuisine}</span>
                    <span className="text-[#d4a373] text-[10px] font-bold uppercase tracking-widest">{selectedRestaurant?.name}</span>
                  </div>
                  <h3 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tighter">{selectedDish.name}</h3>
                  <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8 font-medium">{selectedDish.description || "An extraordinary dish prepared with the finest seasonal ingredients and artisanal passion."}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-10">
                    <div className="flex items-center gap-2 text-xs bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
                      <Clock size={16} className="text-[#2d4a36]" />
                      <span className="font-bold">25-30 MIN</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
                      <Info size={16} className="text-[#d4a373]" />
                      <span className="font-bold">GLUTEN FREE</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-black/5">
                  <div className="flex flex-col items-center sm:items-start">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Price</span>
                    <span className="font-serif text-4xl font-bold text-[#1a1a1a]">₹{selectedDish.price}</span>
                  </div>
                  <button 
                    onClick={() => { addToCart(selectedDish); setSelectedDish(null); }}
                    disabled={cartBusy}
                    className="w-full sm:w-auto btn-primary px-12 py-5 flex items-center justify-center gap-3 text-lg shadow-2xl active:scale-95"
                  >
                    {cartBusy ? <Loader2 className="spin" size={20}/> : <ShoppingBag size={20} />}
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
