import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import AppSidebar, { TopBar } from "./AppSidebar";
import FloatingMessagesLauncher from "./FloatingMessagesLauncher";
import { cn } from "@/lib/utils";

export default function AppLayout() {
  const { pathname } = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AppSidebar collapsed={isSidebarCollapsed} />
      <main
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-[margin] duration-300",
          isSidebarCollapsed ? "ml-20" : "ml-60"
        )}
      >
        <TopBar
          collapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        />
        <div className="min-h-0 flex-1 px-6 py-6">
          <Outlet key={pathname} />
        </div>
        <FloatingMessagesLauncher />
      </main>
    </div>
  );
}
