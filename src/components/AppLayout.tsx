import { Outlet } from "react-router-dom";
import { useState } from "react";
import AppSidebar, { TopBar } from "./AppSidebar";
import { cn } from "@/lib/utils";

export default function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AppSidebar collapsed={isSidebarCollapsed} />
      <main
        className={cn(
          "flex-1 transition-[margin] duration-300",
          isSidebarCollapsed ? "ml-20" : "ml-60"
        )}
      >
        <TopBar
          collapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        />
        <div className="px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
