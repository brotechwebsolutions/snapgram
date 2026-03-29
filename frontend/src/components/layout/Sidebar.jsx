import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome, FiSearch, FiPlusSquare, FiMessageSquare,
  FiBell, FiUser, FiBookmark, FiSettings, FiLogOut,
  FiSun, FiMoon
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { notificationAPI } from "../../api/endpoints";
import Avatar from "../ui/Avatar";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchUnread = () => {
      notificationAPI.getUnreadCount()
        .then(r => setUnread(r.data?.data || 0))
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { to: "/", icon: FiHome, label: "Home" },
    { to: "/explore", icon: FiSearch, label: "Explore" },
    { to: "/create", icon: FiPlusSquare, label: "Create" },
    { to: "/messages", icon: FiMessageSquare, label: "Messages" },
    { to: "/notifications", icon: FiBell, label: "Notifications", badge: unread },
    { to: `/profile/${user?.username}`, icon: FiUser, label: "Profile" },
    { to: "/saved", icon: FiBookmark, label: "Saved" },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full flex-col bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border z-40 w-[72px] lg:w-[240px] transition-all duration-300 py-6 px-3">
      {/* Logo */}
      <div className="mb-8 px-1 overflow-hidden">
        <span
          className="hidden lg:block text-2xl font-bold cursor-pointer select-none"
          style={{
            fontFamily: "DM Serif Display",
            background: "linear-gradient(135deg,#405de6,#e1306c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          onClick={() => navigate("/")}
        >
          SnapGram
        </span>
        <div
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 cursor-pointer mx-auto"
          onClick={() => navigate("/")}
        >
          <span className="text-white font-bold text-lg" style={{ fontFamily: "DM Serif Display" }}>S</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <div className="relative flex-shrink-0">
              <item.icon size={22} />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </div>
            <span className="hidden lg:block">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="space-y-1 mt-4">
        <button
          onClick={toggle}
          className="nav-link w-full"
        >
          <span className="flex-shrink-0">
            {isDark ? <FiSun size={22} /> : <FiMoon size={22} />}
          </span>
          <span className="hidden lg:block">{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <FiSettings size={22} />
          <span className="hidden lg:block">Settings</span>
        </NavLink>
        <button
          onClick={logout}
          className="nav-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
        >
          <FiLogOut size={22} />
          <span className="hidden lg:block">Log Out</span>
        </button>
      </div>

      {/* Current user */}
      {user && (
        <div
          className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border cursor-pointer"
          onClick={() => navigate(`/profile/${user.username}`)}
        >
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
            <Avatar src={user.profilePic} name={user.username} size="sm" />
            <div className="hidden lg:block min-w-0">
              <p className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100">{user.username}</p>
              <p className="text-xs text-gray-500 truncate">{user.fullName}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
