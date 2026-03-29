import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import MobileHeader from "./MobileHeader";
export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <Sidebar />
      <main className="flex-1 min-w-0 md:ml-[72px] lg:ml-[240px] xl:ml-[240px] pb-16 md:pb-0">
        <MobileHeader />
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
