import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/contexts/RoleContext";
import { MessagesThreadProvider } from "@/contexts/MessagesThreadContext";
import { EvaluationFormWorkflowProvider } from "@/contexts/EvaluationFormWorkflowContext";
import AppLayout from "./components/AppLayout";
import Landing from "./pages/Landing";

// Auth pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

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

function RootLayout() {
  return (
    <RoleProvider>
      <MessagesThreadProvider>
        <EvaluationFormWorkflowProvider>
          <ScrollRestoration />
          <Outlet />
        </EvaluationFormWorkflowProvider>
      </MessagesThreadProvider>
    </RoleProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> },
      {
        element: <AppLayout />,
        children: [
          { path: "/portal", element: <Dashboard /> },
          { path: "/attendance", element: <Attendance /> },
          { path: "/tasks", element: <Tasks /> },
          { path: "/daily-reports", element: <DailyReports /> },
          { path: "/learning-modules", element: <LearningModules /> },
          { path: "/my-mentor", element: <MyMentor /> },
          { path: "/evaluations", element: <Evaluations /> },
          { path: "/my-profile", element: <MyProfile /> },
          { path: "/settings", element: <Settings /> },
          { path: "/documents", element: <Documents /> },
          { path: "/messages", element: <Messages /> },
          { path: "/mentor", element: <MentorDashboard /> },
          { path: "/mentor/interns", element: <MentorInterns /> },
          { path: "/mentor/attendance-review", element: <MentorAttendanceReview /> },
          { path: "/mentor/report-review", element: <MentorReportReview /> },
          { path: "/mentor/task-assignments", element: <MentorTaskAssignments /> },
          { path: "/mentor/evaluations", element: <MentorEvaluations /> },
          { path: "/mentor/learning-paths", element: <MentorLearningPaths /> },
          { path: "/mentor/profile", element: <MentorProfile /> },
          { path: "/mentor/settings", element: <MentorSettings /> },
          { path: "/mentor/messages", element: <Messages /> },
          { path: "/admin", element: <AdminDashboard /> },
          { path: "/admin/analytics", element: <AdminAnalytics /> },
          { path: "/admin/users", element: <AdminUsers /> },
          { path: "/admin/departments", element: <AdminDepartments /> },
          { path: "/admin/mentors", element: <AdminMentors /> },
          { path: "/admin/interns", element: <AdminInterns /> },
          { path: "/admin/attendance", element: <AdminAttendanceLogs /> },
          { path: "/admin/reports", element: <AdminReports /> },
          { path: "/admin/evaluations", element: <AdminEvaluations /> },
          { path: "/admin/tasks", element: <AdminTasks /> },
          { path: "/admin/settings", element: <AdminSettings /> },
          { path: "/admin/roles", element: <AdminRoles /> },
          { path: "/admin/profile", element: <AdminProfile /> },
          { path: "/admin/messages", element: <Messages /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
