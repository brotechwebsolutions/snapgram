export default function Button({ children, variant = "primary", size = "md", loading, disabled, className = "", ...props }) {
  const variants = { primary: "btn-primary", secondary: "btn-secondary", ghost: "btn-ghost", danger: "bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-all active:scale-95" };
  const sizes = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2", lg: "text-base px-6 py-3" };
  return (
    <button disabled={disabled || loading} className={`${variants[variant]} ${sizes[size]} ${className} flex items-center justify-center gap-2`} {...props}>
      {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}
