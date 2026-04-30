import { Star } from "lucide-react";
import { fallbackRestaurant } from "../api";

export function RestaurantList({ restaurants, selected, onSelect }) {
  return (
    <section className="list">
      <div className="panelHead">
        <h2>Restaurants</h2>
        <span>{restaurants.length}</span>
      </div>
      <div className="restaurantStack">
        {restaurants.map((restaurant) => (
          <button key={restaurant.id} className={`restaurant ${selected?.id === restaurant.id ? "selected" : ""}`} onClick={() => onSelect(restaurant)}>
            <img src={restaurant.image || fallbackRestaurant} alt="" />
            <span>
              <b>{restaurant.name}</b>
              <small>{restaurant.cuisine}</small>
              <em><Star size={13} /> {restaurant.rating}</em>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
