import { NavLink } from "react-router-dom";
import { FiHome, FiSearch, FiPlusSquare, FiMessageSquare, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
export default function MobileNav() {
  const { user } = useAuth();
  const items = [
    { to: "/", icon: FiHome },
    { to: "/explore", icon: FiSearch },
    { to: "/create", icon: FiPlusSquare },
    { to: "/messages", icon: FiMessageSquare },
    { to: `/profile/${user?.username}`, icon: FiUser },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border z-40 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `flex items-center justify-center p-3 rounded-xl transition-colors ${isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>
            {({ isActive }) => <item.icon size={24} strokeWidth={isActive ? 2.5 : 1.8} />}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
