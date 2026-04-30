import { Search } from "lucide-react";

export function Header({ query, onQueryChange, user }) {
  return (
    <header className="hero">
      <div>
        <span className="eyebrow">Fast cravings, neatly managed</span>
        <h1>Cravon</h1>
        <p>Browse restaurants, build a cart, and manage menus from one smooth React dashboard.</p>
      </div>
      <label className="searchBox">
        <Search size={18} />
        <input
          placeholder="Search restaurants or cuisines"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      {user?.role === "admin" && <span className="rolePill">Admin workspace</span>}
    </header>
  );
}
