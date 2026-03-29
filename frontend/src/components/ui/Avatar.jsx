import { getInitials } from "../../utils/helpers";
export default function Avatar({ src, name = "", size = "md", ring = false, onClick }) {
  const sizes = { xs: "w-7 h-7 text-xs", sm: "w-9 h-9 text-xs", md: "w-11 h-11 text-sm", lg: "w-16 h-16 text-base", xl: "w-24 h-24 text-xl" };
  const inner = (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : <span className="text-white font-semibold">{getInitials(name)}</span>}
    </div>
  );
  if (ring) return <div className="avatar-ring p-[2px] rounded-full flex-shrink-0" onClick={onClick}><div className="bg-white dark:bg-dark-card p-[2px] rounded-full">{inner}</div></div>;
  return inner;
}
