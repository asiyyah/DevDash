import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GitBranch,
  CheckSquare,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { path: "/", name: "Dashboard", icon: LayoutDashboard },
    { path: "/github", name: "GitHub", icon: GitBranch },
    { path: "/tasks", name: "Tasks", icon: CheckSquare },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo-text">DevDash</h2>
      </div>
      <nav className="sidebar-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-badge" aria-label="Settings are not yet available">
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
