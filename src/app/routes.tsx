import { createHashRouter, Outlet, useLocation } from "react-router";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Talents } from "./pages/Talents";
import { Island } from "./pages/Island";
import { Messages } from "./pages/Messages";
import { TaskDetail } from "./pages/TaskDetail";
import { CreateTask } from "./pages/CreateTask";
import { Profile } from "./pages/Profile";
import { TalentDetail } from "./pages/TalentDetail";
import { Settings } from "./pages/Settings";
import { EditProfile } from "./pages/EditProfile";
import { MyTasks } from "./pages/MyTasks";
import { MyApplications } from "./pages/MyApplications";
import { Search } from "lucide-react";

function Layout() {
  const location = useLocation();
  const isProfile = location.pathname === '/profile';

  // Pages that have their own header (no top navbar padding needed)
  const noTopPadding = ['/messages', '/island', '/profile', '/settings', '/edit-profile', '/my-tasks', '/my-applications', '/create-task'].includes(location.pathname)
    || location.pathname.startsWith('/task/')
    || location.pathname.startsWith('/talent/');

  return (
    <div className="min-h-screen font-sans overflow-x-hidden bg-background">
      <Navbar />
      <main className="pb-16" style={noTopPadding ? undefined : { paddingTop: 'calc(var(--safe-top) + 3.5rem)' }}>
        <Outlet />
      </main>
    </div>
  );
}

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "talents", Component: Talents },
      { path: "island", Component: Island },
      { path: "messages", Component: Messages },
      { path: "task/:id", Component: TaskDetail },
      { path: "talent/:id", Component: TalentDetail },
      { path: "create-task", Component: CreateTask },
      { path: "profile", Component: Profile },
      { path: "settings", Component: Settings },
      { path: "edit-profile", Component: EditProfile },
      { path: "my-tasks", Component: MyTasks },
      { path: "my-applications", Component: MyApplications },
      {
        path: "*",
        Component: () => (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Search className="h-10 w-10 mb-3 text-muted-foreground/50" />
            <p className="text-sm">页面未找到</p>
          </div>
        ),
      },
    ],
  },
]);
