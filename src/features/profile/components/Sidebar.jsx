  import React, { useState, useRef, useEffect } from "react";
import avatarPlaceholder from "../../../assets/avatarPlaceholder.png";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar({ user, logout }) {
  const [sidebarHover, setSidebarHover] = useState(false);
  const sidebarRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: "✏️", label: "Edit", route: "/edit-profile", variant: "outline-primary" },
    { icon: "⚙️", label: "Settings", route: "/settings", variant: "outline-secondary" },
    { icon: "🚪", label: "Logout", route: "/", variant: "outline-danger", isLogout: true },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        setSidebarHover(e.clientX < rect.right);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${sidebarHover ? "expanded" : "collapsed"}`}
    >
      <div className="avatar-container">
        <img
          src={user?.avatarUrl || avatarPlaceholder}
          alt="User avatar"
          className="avatar"
        />
        <span className="avatar-status" />
      </div>

      {sidebarHover && (
        <div className={`sidebar-hover-info${sidebarHover ? " show" : ""}`}>
            <h6 className="mb-0">{user?.name || "User"}</h6>
            <small className="text-muted d-block">{user?.email}</small>
        </div>
      )}

      <nav className="nav-buttons">
        {navItems.map(({ icon, label, route, variant, isLogout }) => (
          <button
            key={route}
            className={`btn btn-${variant} nav-button ${
              sidebarHover ? "btn-start" : "btn-center"
            } ${location.pathname === route ? "active" : ""}`}
            onClick={isLogout ? handleLogout : () => navigate(route)}
          >
            <span className="icon">{icon}</span>
            {sidebarHover && <span>{label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}
