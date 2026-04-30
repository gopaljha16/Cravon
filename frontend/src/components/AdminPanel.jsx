import { Plus, ReceiptText, Store, UsersRound, WalletCards } from "lucide-react";

const icons = [UsersRound, Store, ReceiptText, WalletCards];

export function AdminPanel({ stats, restaurantForm, onRestaurantFormChange, onSaveRestaurant }) {
  return (
    <section className="adminPanel">
      <div className="stats">
        {stats.map(([label, value], index) => {
          const Icon = icons[index];
          return (
            <div className="stat" key={label}>
              <Icon size={20} />
              <b>{value}</b>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      <form className="toolbar" onSubmit={onSaveRestaurant}>
        <input placeholder="Restaurant name" value={restaurantForm.name} onChange={(e) => onRestaurantFormChange({ ...restaurantForm, name: e.target.value })} />
        <input placeholder="Cuisine" value={restaurantForm.cuisine} onChange={(e) => onRestaurantFormChange({ ...restaurantForm, cuisine: e.target.value })} />
        <input placeholder="Rating" type="number" step="0.1" value={restaurantForm.rating} onChange={(e) => onRestaurantFormChange({ ...restaurantForm, rating: e.target.value })} />
        <input placeholder="Image URL" value={restaurantForm.image_url} onChange={(e) => onRestaurantFormChange({ ...restaurantForm, image_url: e.target.value })} />
        <button className="primary"><Plus size={16} /> Add restaurant</button>
      </form>
    </section>
  );
}
