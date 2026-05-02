import React from "react";
import { Star } from "lucide-react";
import { fallbackRestaurant } from "../api";

export function RestaurantList({ restaurants, selected, onSelect }) {
  return (
    <div className="panel list">
      <div className="panelHead">
        <h2>Restaurants</h2>
        <span>{restaurants.length}</span>
      </div>
      <div className="restaurantStack">
        {restaurants.map((item) => (
          <button
            key={item.id}
            className={`restaurant ${selected?.id === item.id ? "selected" : ""}`}
            onClick={() => onSelect(item)}
          >
            <img src={item.image_url || fallbackRestaurant} alt={item.name} />
            <div className="restaurantInfo">
              <h3>{item.name}</h3>
              <small>{item.cuisine}</small>
              <div className="ratingBadge">
                <Star size={14} fill="currentColor" />
                <span>{item.rating || "New"}</span>
              </div>
            </div>
          </button>
        ))}
        {restaurants.length === 0 && (
          <div className="emptyState">
            <p>No restaurants found</p>
          </div>
        )}
      </div>
    </div>
  );
}
