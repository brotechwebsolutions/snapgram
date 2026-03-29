import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiLock, FiLogOut, FiTrash2, FiChevronRight } from "react-icons/fi";

export default function Settings() {
  const { logout } = useAuth(); const { isDark, toggle } = useTheme(); const navigate = useNavigate();
  const items = [
    { icon: FiLock, label: "Change password", action: () => {} },
    { icon: isDark ? FiSun : FiMoon, label: isDark ? "Switch to light mode" : "Switch to dark mode", action: toggle },
    { icon: FiLogOut, label: "Log out", action: logout, danger: true },
  ];
  return (
    <div className="max-w-xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-3 mb-8"><button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">←</button><h1 className="font-bold text-xl text-gray-900 dark:text-gray-100">Settings</h1></div>
      <div className="space-y-2">{items.map((item, i) => (
        <button key={i} onClick={item.action} className={`w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors ${item.danger ? "text-red-500 border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10" : "text-gray-700 dark:text-gray-300"}`}>
          <div className="flex items-center gap-3"><item.icon size={20} /><span className="font-medium text-sm">{item.label}</span></div>
          <FiChevronRight size={16} />
        </button>
      ))}</div>
    </div>
  );
}
