import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Tasks from "./pages/Tasks";
import DailyReports from "./pages/DailyReports";
import Accomplishments from "./pages/Accomplishments";
import LearningModules from "./pages/LearningModules";
import MyMentor from "./pages/MyMentor";
import Evaluations from "./pages/Evaluations";
import MyProfile from "./pages/MyProfile";
import Documents from "./pages/Documents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/daily-reports" element={<DailyReports />} />
            <Route path="/accomplishments" element={<Accomplishments />} />
            <Route path="/learning-modules" element={<LearningModules />} />
            <Route path="/my-mentor" element={<MyMentor />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/documents" element={<Documents />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
