import { Plus, Trash2 } from "lucide-react";
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
  onAddToCart
}) {
  return (
    <section className="menu">
      <div className="sectionHead">
        <div>
          <span className="eyebrow">Menu board</span>
          <h2>{selected ? selected.name : "Choose a restaurant"}</h2>
        </div>
        {isAdmin && selected && <button className="danger" onClick={() => onDeleteRestaurant(selected.id)}><Trash2 size={16} /> Delete restaurant</button>}
      </div>

      {isAdmin && selected && (
        <form className="toolbar compact" onSubmit={onSaveMenuItem}>
          <input placeholder="Item name" value={menuForm.name} onChange={(e) => onMenuFormChange({ ...menuForm, name: e.target.value })} />
          <input placeholder="Description" value={menuForm.description} onChange={(e) => onMenuFormChange({ ...menuForm, description: e.target.value })} />
          <input placeholder="Price" type="number" value={menuForm.price} onChange={(e) => onMenuFormChange({ ...menuForm, price: e.target.value })} />
          <input placeholder="Image URL" value={menuForm.image_url} onChange={(e) => onMenuFormChange({ ...menuForm, image_url: e.target.value })} />
          <button className="primary"><Plus size={16} /> Add item</button>
        </form>
      )}

      <div className="cards">
        {menu.map((item) => (
          <article className="card" key={item.id}>
            <img src={item.image || fallbackFood} alt="" />
            <div className="cardBody">
              <h3>{item.name}</h3>
              <p>{item.description || "Freshly prepared and ready to serve."}</p>
              <b>Rs {item.price}</b>
            </div>
            {isAdmin ? (
              <button className="danger iconOnly" onClick={() => onDeleteMenuItem(item.id)} title="Delete item"><Trash2 size={17} /></button>
            ) : (
              <button className="primary iconOnly" onClick={() => onAddToCart(item)} title="Add to cart"><Plus size={17} /></button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
