import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/contexts/RoleContext";
import AppLayout from "./components/AppLayout";
import Landing from "./pages/Landing";

// Auth pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import DemoSelect from "./pages/DemoSelect";

// Student pages
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Tasks from "./pages/Tasks";
import DailyReports from "./pages/DailyReports";
import LearningModules from "./pages/LearningModules";
import MyMentor from "./pages/MyMentor";
import Evaluations from "./pages/Evaluations";
import MyProfile from "./pages/MyProfile";
import Documents from "./pages/Documents";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";

// Mentor pages
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorInterns from "./pages/mentor/MentorInterns";
import MentorAttendanceReview from "./pages/mentor/MentorAttendanceReview";
import MentorReportReview from "./pages/mentor/MentorReportReview";
import MentorTaskAssignments from "./pages/mentor/MentorTaskAssignments";
import MentorEvaluations from "./pages/mentor/MentorEvaluations";
import MentorLearningPaths from "./pages/mentor/MentorLearningPaths";
import MentorProfile from "./pages/mentor/MentorProfile";
import MentorSettings from "./pages/mentor/MentorSettings";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminMentors from "./pages/admin/AdminMentors";
import AdminInterns from "./pages/admin/AdminInterns";
import AdminAttendanceLogs from "./pages/admin/AdminAttendanceLogs";
import AdminReports from "./pages/admin/AdminReports";
import AdminEvaluations from "./pages/admin/AdminEvaluations";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminTasks from "./pages/admin/AdminTasks";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RoleProvider>
          <Routes>
            {/* Auth routes (outside layout) */}
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/demo" element={<DemoSelect />} />

            <Route element={<AppLayout />}>
              {/* Student routes */}
              <Route path="/portal" element={<Dashboard />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/daily-reports" element={<DailyReports />} />
              <Route path="/learning-modules" element={<LearningModules />} />
              <Route path="/my-mentor" element={<MyMentor />} />
              <Route path="/evaluations" element={<Evaluations />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/messages" element={<Messages />} />

              {/* Mentor routes */}
              <Route path="/mentor" element={<MentorDashboard />} />
              <Route path="/mentor/interns" element={<MentorInterns />} />
              <Route path="/mentor/attendance-review" element={<MentorAttendanceReview />} />
              <Route path="/mentor/report-review" element={<MentorReportReview />} />
              <Route path="/mentor/task-assignments" element={<MentorTaskAssignments />} />
              <Route path="/mentor/evaluations" element={<MentorEvaluations />} />
              <Route path="/mentor/learning-paths" element={<MentorLearningPaths />} />
              <Route path="/mentor/profile" element={<MentorProfile />} />
              <Route path="/mentor/settings" element={<MentorSettings />} />
              <Route path="/mentor/messages" element={<Messages />} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/departments" element={<AdminDepartments />} />
              <Route path="/admin/mentors" element={<AdminMentors />} />
              <Route path="/admin/interns" element={<AdminInterns />} />
              <Route path="/admin/attendance" element={<AdminAttendanceLogs />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/evaluations" element={<AdminEvaluations />} />
              <Route path="/admin/tasks" element={<AdminTasks />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/roles" element={<AdminRoles />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/messages" element={<Messages />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RoleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
