import { useEffect } from "react";
import { FiX } from "react-icons/fi";
export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => { if (isOpen) document.body.style.overflow = "hidden"; else document.body.style.overflow = ""; return () => { document.body.style.overflow = ""; }; }, [isOpen]);
  if (!isOpen) return null;
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl", full: "max-w-screen-lg" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={`relative w-full ${sizes[size]} bg-white dark:bg-dark-card rounded-2xl shadow-2xl animate-slide-up max-h-[90vh] overflow-auto`} onClick={e => e.stopPropagation()}>
        {title && <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-border"><h2 className="font-semibold text-lg">{title}</h2><button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full"><FiX size={20} /></button></div>}
        {children}
      </div>
    </div>
  );
}
