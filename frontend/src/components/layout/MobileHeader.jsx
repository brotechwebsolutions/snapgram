import { useLocation } from "react-router-dom";
import { FiBell, FiMessageSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
export default function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname !== "/") return null;
  return (
    <header className="md:hidden sticky top-0 z-30 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-4 py-3 flex items-center justify-between">
      <span className="text-2xl font-bold" style={{fontFamily:"DM Serif Display",background:"linear-gradient(135deg,#405de6,#e1306c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>SnapGram</span>
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/notifications")} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full"><FiBell size={22} /></button>
        <button onClick={() => navigate("/messages")} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full"><FiMessageSquare size={22} /></button>
      </div>
    </header>
  );
}
