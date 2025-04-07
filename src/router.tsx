import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import JobsPage from './pages/JobsPage.jsx';
import ProposalsPage from './pages/ProposalsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AdminPage from './pages/AdminPage';
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'jobs',
        element: <JobsPage />
      },
      {
        path: 'proposals',
        element: <ProposalsPage />
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />
      }
    ]
  }
]);

export default router;
