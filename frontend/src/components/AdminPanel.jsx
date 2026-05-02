import React from "react";
import { Plus, TrendingUp, Users, Utensils, Wallet } from "lucide-react";

export function AdminPanel({ stats, restaurantForm, onRestaurantFormChange, onSaveRestaurant }) {
  return (
    <div className="adminPanel">
      <div className="stats">
        {stats.map((stat, i) => (
          <div key={i} className="stat" style={{ borderTop: `4px solid ${stat.color}` }}>
            <div className="statIcon" style={{ color: stat.color }}>
              {i === 0 && <Users size={20} />}
              {i === 1 && <Utensils size={20} />}
              {i === 2 && <TrendingUp size={20} />}
              {i === 3 && <Wallet size={20} />}
            </div>
            <span>{stat.label}</span>
            <b>{stat.value}</b>
          </div>
        ))}
      </div>

      <div className="panel toolbar">
        <div className="panelHead">
          <h2>Register New Restaurant</h2>
          <p className="muted">Enter restaurant details to add them to the platform.</p>
        </div>
        <form className="restaurantForm" onSubmit={onSaveRestaurant}>
          <div className="formGrid">
            <input
              placeholder="Restaurant Name"
              value={restaurantForm.name}
              onChange={(e) => onRestaurantFormChange({ ...restaurantForm, name: e.target.value })}
              required
            />
            <input
              placeholder="Cuisine Type (e.g. Italian, North Indian)"
              value={restaurantForm.cuisine}
              onChange={(e) => onRestaurantFormChange({ ...restaurantForm, cuisine: e.target.value })}
              required
            />
            <input
              placeholder="Rating (1-5)"
              type="number"
              step="0.1"
              max="5"
              value={restaurantForm.rating}
              onChange={(e) => onRestaurantFormChange({ ...restaurantForm, rating: e.target.value })}
              required
            />
            <input
              placeholder="Logo/Image URL"
              value={restaurantForm.image_url}
              onChange={(e) => onRestaurantFormChange({ ...restaurantForm, image_url: e.target.value })}
            />
          </div>
          <button className="primary" type="submit">
            <Plus size={18} /> Register Restaurant
          </button>
        </form>
      </div>
    </div>
  );
}
