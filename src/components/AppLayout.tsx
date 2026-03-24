import { Outlet } from "react-router-dom";
import AppSidebar, { TopBar } from "./AppSidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 ml-60">
        <TopBar />
        <div className="px-8 pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
