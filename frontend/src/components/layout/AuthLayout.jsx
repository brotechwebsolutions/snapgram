import { Outlet } from "react-router-dom";
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-black dark:via-dark-bg dark:to-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold" style={{fontFamily:"DM Serif Display",background:"linear-gradient(135deg,#405de6,#e1306c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>SnapGram</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Share your world</p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
