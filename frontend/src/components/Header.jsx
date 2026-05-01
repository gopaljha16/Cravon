import { Search } from "lucide-react";

export function Header({ query, onQueryChange, user }) {
  return (
    <header className="hero">
      <div>
        <span className="eyebrow">Restaurant ordering platform</span>
        <h1>Cravon</h1>
        <p>Discover restaurants, manage your cart, pay through checkout, and track every order from a structured workspace.</p>
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
