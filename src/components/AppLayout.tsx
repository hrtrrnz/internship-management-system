import { Outlet } from "react-router-dom";
import AppSidebar, { TopBar } from "./AppSidebar";
import { RoleProvider } from "@/contexts/RoleContext";

export default function AppLayout() {
  return (
    <RoleProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 ml-60">
          <TopBar />
          <div className="px-8 pb-8">
            <Outlet />
          </div>
        </main>
      </div>
    </RoleProvider>
  );
}
