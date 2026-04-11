import type { ComponentType } from 'react';
import { createHashRouter, Outlet, useLocation } from 'react-router';
import { Search } from 'lucide-react';
import { Navbar } from './components/Navbar';

const NO_TOP_PADDING_ROUTES = new Set([
  '/messages',
  '/island',
  '/profile',
  '/settings',
  '/edit-profile',
  '/my-tasks',
  '/my-applications',
  '/create-task',
]);

function lazyRoute<TModule extends Record<string, unknown>>(
  loader: () => Promise<TModule>,
  exportName: keyof TModule,
) {
  return async () => {
    const routeModule = await loader();

    return {
      Component: routeModule[exportName] as ComponentType,
    };
  };
}

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Search className="mb-3 h-10 w-10 text-muted-foreground/50" />
      <p className="text-sm">页面未找到</p>
    </div>
  );
}

function Layout() {
  const location = useLocation();

  const noTopPadding = NO_TOP_PADDING_ROUTES.has(location.pathname)
    || location.pathname.startsWith('/task/')
    || location.pathname.startsWith('/talent/');

  return (
    <div className="min-h-screen font-sans overflow-x-clip bg-background">
      <Navbar />
      <main className="pb-16" style={noTopPadding ? undefined : { paddingTop: 'calc(var(--safe-top) + 3.5rem)' }}>
        <Outlet />
      </main>
    </div>
  );
}

export const router = createHashRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, lazy: lazyRoute(() => import('./pages/Home'), 'Home') },
      { path: 'talents', lazy: lazyRoute(() => import('./pages/Talents'), 'Talents') },
      { path: 'island', lazy: lazyRoute(() => import('./pages/Island'), 'Island') },
      { path: 'messages', lazy: lazyRoute(() => import('./pages/Messages'), 'Messages') },
      { path: 'task/:id', lazy: lazyRoute(() => import('./pages/TaskDetail'), 'TaskDetail') },
      { path: 'talent/:id', lazy: lazyRoute(() => import('./pages/TalentDetail'), 'TalentDetail') },
      { path: 'create-task', lazy: lazyRoute(() => import('./pages/CreateTask'), 'CreateTask') },
      { path: 'profile', lazy: lazyRoute(() => import('./pages/Profile'), 'Profile') },
      { path: 'settings', lazy: lazyRoute(() => import('./pages/Settings'), 'Settings') },
      { path: 'edit-profile', lazy: lazyRoute(() => import('./pages/EditProfile'), 'EditProfile') },
      { path: 'my-tasks', lazy: lazyRoute(() => import('./pages/MyTasks'), 'MyTasks') },
      { path: 'my-applications', lazy: lazyRoute(() => import('./pages/MyApplications'), 'MyApplications') },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
]);
