import React from "react";
import { Search, UserCircle } from "lucide-react";

export function Header({ query, onQueryChange, user }) {
  return (
    <header className="mainHeader">
      <div className="searchBox">
        <Search size={20} className="muted" />
        <input
          type="text"
          placeholder="Search for restaurants, cuisines, or dishes..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
      
      <div className="userProfile">
        <div className="profileInfo">
          <span>{user?.username || "Guest"}</span>
          <small>{user?.role || "Visitor"}</small>
        </div>
        <div className="profileAvatar">
          <UserCircle size={32} />
        </div>
      </div>
    </header>
  );
}
