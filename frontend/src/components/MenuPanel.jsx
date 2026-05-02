import React from "react";
import { Plus, Trash2, Utensils } from "lucide-react";
import { fallbackFood } from "../api";

export function MenuPanel({
  selected,
  menu,
  isAdmin,
  menuForm,
  onMenuFormChange,
  onSaveMenuItem,
  onDeleteMenuItem,
  onDeleteRestaurant,
  onAddToCart,
}) {
  if (!selected) {
    return (
      <div className="panel menu empty">
        <div className="emptyContent">
          <Utensils size={48} />
          <p>Select a restaurant to view its menu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel menu">
      <div className="panelHead">
        <div>
          <span className="eyebrow">{selected.cuisine}</span>
          <h2>{selected.name}</h2>
        </div>
        {isAdmin && (
          <button className="danger" onClick={() => onDeleteRestaurant(selected.id)}>
            <Trash2 size={16} /> Delete Restaurant
          </button>
        )}
      </div>

      <div className="cards">
        {menu.map((item) => (
          <article key={item.id} className="card foodCard">
            <img src={item.image_url || fallbackFood} alt={item.name} />
            <div className="cardBody">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="cardFooter">
                <span className="priceTag">₹{item.price}</span>
                <button className="primary iconOnly" onClick={() => onAddToCart(item)}>
                  <Plus size={20} />
                </button>
              </div>
            </div>
            {isAdmin && (
              <button className="danger deleteBadge" onClick={() => onDeleteMenuItem(item.id)}>
                <Trash2 size={14} />
              </button>
            )}
          </article>
        ))}
      </div>

      {isAdmin && (
        <form className="addItemForm" onSubmit={onSaveMenuItem}>
          <h3>Add New Menu Item</h3>
          <div className="formGrid">
            <input
              placeholder="Food Name"
              value={menuForm.name}
              onChange={(e) => onMenuFormChange({ ...menuForm, name: e.target.value })}
              required
            />
            <input
              placeholder="Price (₹)"
              type="number"
              value={menuForm.price}
              onChange={(e) => onMenuFormChange({ ...menuForm, price: e.target.value })}
              required
            />
            <input
              placeholder="Image URL"
              value={menuForm.image_url}
              onChange={(e) => onMenuFormChange({ ...menuForm, image_url: e.target.value })}
            />
            <input
              placeholder="Description"
              className="fullWidth"
              value={menuForm.description}
              onChange={(e) => onMenuFormChange({ ...menuForm, description: e.target.value })}
            />
          </div>
          <button className="primary" type="submit">Add Item</button>
        </form>
      )}
    </div>
  );
}
