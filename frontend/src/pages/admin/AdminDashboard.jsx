import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { api } from "../../api";
import { Users, Store, Receipt, TrendingUp, Plus, Trash2, ChevronRight, UploadCloud, PackageCheck, MapPin } from "lucide-react";

// Drag and drop image uploader
function ImageUpload({ file, setFile, url, setUrl }) {
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          setFile(e.dataTransfer.files[0]);
          setUrl("");
        }
      }}
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${drag ? 'border-[#2d4a36] bg-[#2d4a36]/10' : 'border-gray-200 bg-white'}`}
    >
      <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          setFile(e.target.files[0]);
          setUrl("");
        }
      }} />
      <UploadCloud size={32} className="mx-auto text-gray-400 mb-2" />
      {file ? (
        <div className="text-sm">
          <span className="font-bold text-[#2d4a36]">{file.name}</span>
          <button type="button" onClick={() => setFile(null)} className="ml-2 text-red-500 hover:underline">Remove</button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-2">Drag and drop image here, or <button type="button" onClick={() => fileRef.current.click()} className="text-[#2d4a36] font-bold hover:underline">browse files</button></p>
          <div className="flex items-center gap-2">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 font-bold uppercase">OR PASTE URL</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          <input placeholder="Image URL..." value={url} onChange={(e) => { setUrl(e.target.value); setFile(null); }} className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-[#2d4a36]" />
        </div>
      )}
    </div>
  );
}

export function AdminDashboard() {
  const { dashboard, restaurants, loadDashboard, loadRestaurants, orders, loadOrders, showNotice } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get("tab") || "dashboard";
  const urlRestId = searchParams.get("restaurant");
  
  const [activeTab, setActiveTab] = useState(urlTab);
  
  // Keep activeTab in sync with URL tab
  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);

  // Restaurant State
  const [restForm, setRestForm] = useState({ name: "", cuisine: "", rating: "" });
  const [restFile, setRestFile] = useState(null);
  const [restUrl, setRestUrl] = useState("");
  const [selectedRest, setSelectedRest] = useState(null);

  // Sync selectedRest with URL
  useEffect(() => {
    if (urlRestId && restaurants.length > 0) {
      const found = restaurants.find(r => r.id.toString() === urlRestId);
      if (found) {
        setSelectedRest(found);
      }
    } else {
      setSelectedRest(null);
    }
  }, [urlRestId, restaurants]);

  const handleSelectRest = (r) => {
    setSearchParams({ tab: "restaurants", restaurant: r.id });
  };

  // Menu State
  const [menuItems, setMenuItems] = useState([]);
  const [menuForm, setMenuForm] = useState({ name: "", description: "", price: "" });
  const [menuFile, setMenuFile] = useState(null);
  const [menuUrl, setMenuUrl] = useState("");

  const stats = [
    { label: "Total Users", value: dashboard?.total_users ?? 0, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Restaurants", value: dashboard?.total_restaurants ?? 0, icon: Store, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Orders", value: orders.length ?? 0, icon: Receipt, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Revenue", value: `₹${dashboard?.total_revenue ?? 0}`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadMenu = async (restaurant) => {
    try {
      const data = await api(`/restaurants/${restaurant.id}/menu/`);
      setMenuItems(data.items || []);
    } catch (err) {
      setMenuItems([]);
    }
  };

  useEffect(() => {
    if (selectedRest) loadMenu(selectedRest);
  }, [selectedRest]);

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", restForm.name);
    formData.append("cuisine", restForm.cuisine);
    formData.append("rating", restForm.rating);
    if (restFile) formData.append("image", restFile);
    if (restUrl) formData.append("image_url", restUrl);

    try {
      await api("/restaurants/", { method: "POST", body: formData });
      setRestForm({ name: "", cuisine: "", rating: "" });
      setRestFile(null);
      setRestUrl("");
      showNotice("Restaurant added.", "success");
      await loadRestaurants();
      await loadDashboard();
    } catch (err) {
      showNotice(err.message, "error");
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm("Delete this restaurant? This cannot be undone.")) return;
    try {
      await api(`/restaurants/${id}/`, { method: "DELETE" });
      if (selectedRest?.id === id) setSelectedRest(null);
      showNotice("Restaurant deleted.", "success");
      await loadRestaurants();
      await loadDashboard();
    } catch (err) {
      showNotice(err.message, "error");
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!selectedRest) return;
    
    const formData = new FormData();
    formData.append("name", menuForm.name);
    formData.append("description", menuForm.description);
    formData.append("price", menuForm.price);
    if (menuFile) formData.append("image", menuFile);
    if (menuUrl) formData.append("image_url", menuUrl);

    try {
      await api(`/restaurants/${selectedRest.id}/menu/`, { method: "POST", body: formData });
      setMenuForm({ name: "", description: "", price: "" });
      setMenuFile(null);
      setMenuUrl("");
      showNotice("Menu item added.", "success");
      await loadMenu(selectedRest);
    } catch (err) {
      showNotice(err.message, "error");
    }
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      await api(`/menu-items/${id}/`, { method: "DELETE" });
      showNotice("Menu item deleted.", "success");
      await loadMenu(selectedRest);
    } catch (err) {
      showNotice(err.message, "error");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api(`/orders/${orderId}/status/`, {
        method: "POST",
        body: JSON.stringify({ order_status: status }),
      });
      await loadOrders();
      showNotice(`Order #${orderId} marked as ${status}.`, "success");
    } catch (error) {
      showNotice(error.message, "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <h1 className="text-3xl font-bold mb-8 font-serif">Platform Overview</h1>
      
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4 border border-gray-100">
                  <div className={`p-4 rounded-xl ${stat.bg}`}>
                    <Icon className={stat.color} size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Row: Recent Orders + Restaurant Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-serif">Recent Orders</h2>
                <button onClick={() => setSearchParams({ tab: "orders" })} className="text-sm text-[#2d4a36] font-bold hover:underline">View All →</button>
              </div>
              <div className="space-y-3">
                {orders.length === 0 && <p className="text-gray-400 italic text-sm">No orders yet.</p>}
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="font-bold text-sm">Order #{order.id} <span className="font-normal text-gray-500">– {order.restaurant}</span></p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#2d4a36]">₹{order.total_price}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.order_status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{order.order_status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restaurant Quick Overview */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-serif">Restaurants</h2>
                <button onClick={() => setSearchParams({ tab: "restaurants" })} className="text-sm text-[#2d4a36] font-bold hover:underline">Manage →</button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {restaurants.map(r => (
                  <div key={r.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSearchParams({ tab: "restaurants", restaurant: r.id })}>
                    <img src={r.image || r.image_url || "https://images.unsplash.com/photo-1544025162-811114215f8a?w=100"} alt={r.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{r.name}</p>
                      <p className="text-xs text-gray-400 uppercase">{r.cuisine}</p>
                    </div>
                    <span className="text-[#d4a373] font-bold text-sm">{r.rating}★</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "restaurants" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Restaurants */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 font-serif">Add New Restaurant</h2>
              <form onSubmit={handleAddRestaurant} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Name" value={restForm.name} onChange={(e) => setRestForm({...restForm, name: e.target.value})} className="col-span-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2d4a36] outline-none" />
                  <input required placeholder="Cuisine" value={restForm.cuisine} onChange={(e) => setRestForm({...restForm, cuisine: e.target.value})} className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2d4a36] outline-none" />
                  <input required type="number" step="0.1" placeholder="Rating" value={restForm.rating} onChange={(e) => setRestForm({...restForm, rating: e.target.value})} className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2d4a36] outline-none" />
                  <div className="col-span-2">
                    <ImageUpload file={restFile} setFile={setRestFile} url={restUrl} setUrl={setRestUrl} />
                  </div>
                </div>
                <button type="submit" className="w-full btn-primary flex justify-center items-center gap-2 mt-4">
                  <Plus size={18} /> Create Restaurant
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <h2 className="text-xl font-bold mb-6 font-serif">Manage Restaurants</h2>
              <div className="space-y-3">
                {restaurants.map(r => (
                  <div key={r.id} onClick={() => handleSelectRest(r)} className={`cursor-pointer p-4 rounded-2xl border transition-all ${selectedRest?.id === r.id ? 'border-[#2d4a36] bg-[#2d4a36]/5 shadow-md' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={r.image || r.image_url || "https://images.unsplash.com/photo-1544025162-811114215f8a"} alt={r.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-sm">{r.name}</h4>
                          <p className="text-[10px] text-gray-500 uppercase font-bold">{r.cuisine}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteRestaurant(r.id); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <ChevronRight size={20} className={selectedRest?.id === r.id ? 'text-[#2d4a36]' : 'text-gray-300'} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Menu Management */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[80vh]">
              {!selectedRest ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 mt-20">
                  <Store size={64} className="mb-4 opacity-50" />
                  <h3 className="text-xl font-serif text-gray-600">Select a Restaurant</h3>
                  <p>Click on a restaurant from the left list to manage its menu items.</p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
                    <div>
                      <span className="text-[#d4a373] text-xs uppercase tracking-widest font-bold">Menu Manager</span>
                      <h2 className="text-3xl font-bold font-serif">{selectedRest.name}</h2>
                    </div>
                  </div>

                  <div className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-200 border-dashed">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Plus size={18}/> Add New Dish</h3>
                    <form onSubmit={handleAddMenuItem} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required placeholder="Dish Name" value={menuForm.name} onChange={(e) => setMenuForm({...menuForm, name: e.target.value})} className="px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                        <input required type="number" placeholder="Price (₹)" value={menuForm.price} onChange={(e) => setMenuForm({...menuForm, price: e.target.value})} className="px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                        <input required placeholder="Description..." value={menuForm.description} onChange={(e) => setMenuForm({...menuForm, description: e.target.value})} className="col-span-1 md:col-span-2 px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                        <div className="col-span-1 md:col-span-2">
                          <ImageUpload file={menuFile} setFile={setMenuFile} url={menuUrl} setUrl={setMenuUrl} />
                        </div>
                      </div>
                      <button type="submit" className="bg-[#2d4a36] text-white font-bold py-3 px-6 rounded-full hover:bg-[#1a2e22] transition-colors text-sm">Save Menu Item</button>
                    </form>
                  </div>

                  <h3 className="font-bold mb-4">Current Menu ({menuItems.length})</h3>
                  <div className="space-y-4">
                    {menuItems.length === 0 && <p className="text-gray-500 italic">No items found. Add one above.</p>}
                    {menuItems.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                        <img src={item.image || item.image_url} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-lg">{item.name}</h4>
                            <span className="font-serif font-bold text-[#2d4a36]">₹{item.price}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                          <div className="mt-3 flex justify-end">
                            <button onClick={() => handleDeleteMenuItem(item.id)} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                              <Trash2 size={14} /> Remove Dish
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold font-serif">Order Management Queue</h2>
            <button onClick={loadOrders} className="text-[#2d4a36] font-bold hover:underline text-sm">Refresh Orders</button>
          </div>
          
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No orders have been placed yet.</div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="p-6 border border-gray-100 rounded-2xl flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-lg font-serif">Order #{order.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.order_status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.order_status}
                      </span>
                    </div>
                    <p className="text-[#d4a373] font-bold mb-2">{order.restaurant}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} /> {order.delivery_address}
                    </div>
                  </div>
                  
                  <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    <p className="text-sm font-bold text-gray-600 mb-1">Customer: <span className="font-normal">{order.customer}</span></p>
                    <p className="text-sm font-bold text-gray-600 mb-2">Time: <span className="font-normal">{new Date(order.created_at).toLocaleString()}</span></p>
                    <p className="font-serif text-2xl font-bold">₹{order.total_price}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[150px]">
                    <button 
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      disabled={order.order_status !== 'placed'}
                      className="px-4 py-2 bg-yellow-100 text-yellow-800 font-bold rounded-lg text-sm hover:bg-yellow-200 disabled:opacity-50 transition-colors"
                    >
                      Start Preparing
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, "delivered")}
                      disabled={order.order_status === 'delivered'}
                      className="px-4 py-2 bg-green-100 text-green-800 font-bold rounded-lg text-sm hover:bg-green-200 disabled:opacity-50 transition-colors"
                    >
                      Mark Delivered
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
