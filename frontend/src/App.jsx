// App.jsx: Root application component with React Router v6 routes and responsive sidebar layout.
// All protected routes render inside a shared layout with brand-colored sidebar and logout button.

import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import MinutesList from "./pages/MinutesList";
import MinutesForm from "./pages/MinutesForm";
import MinutesDetail from "./pages/MinutesDetail";
import AnalyticsPage from "./pages/AnalyticsPage";

// ── Navigation items ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard",  icon: "📊" },
  { to: "/minutes",   label: "Minutes",    icon: "📋" },
  { to: "/analytics", label: "Analytics",  icon: "📈" },
];

// ── Sidebar layout component ─────────────────────────────────────────────────
function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* ── Mobile overlay ─────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-brand-500 text-white
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-0 lg:w-16 xl:w-64"}
          overflow-hidden
        `}
      >
        {/* Brand header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-brand-400 min-h-[64px]">
          <span className="text-2xl flex-shrink-0">🏛️</span>
          <span className="xl:block hidden font-bold text-sm leading-tight whitespace-nowrap">
            Board Minutes<br />
            <span className="font-normal text-blue-200">Manager</span>
          </span>
          <span className="xl:hidden lg:hidden font-bold text-sm leading-tight whitespace-nowrap block">
            Board Minutes<br />
            <span className="font-normal text-blue-200">Manager</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ` +
                (isActive
                  ? "bg-white/20 text-white"
                  : "text-blue-100 hover:bg-white/10 hover:text-white")
              }
            >
              <span className="text-lg flex-shrink-0">{icon}</span>
              <span className="xl:block hidden whitespace-nowrap">{label}</span>
              <span className="xl:hidden whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t border-brand-400 px-3 py-4 space-y-2">
          <div className="flex items-center gap-3 px-2 py-1 text-xs text-blue-200">
            <span className="text-lg">👤</span>
            <span className="xl:block hidden truncate">{user?.sub ?? "User"}</span>
          </div>
          <button
            id="btn-logout"
            onClick={logout}
            className="
              flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
              text-sm font-medium text-red-200 hover:bg-red-500/20
              transition-colors min-h-[44px]
            "
          >
            <span className="text-lg flex-shrink-0">🚪</span>
            <span className="xl:block hidden whitespace-nowrap">Sign Out</span>
            <span className="xl:hidden whitespace-nowrap">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content area ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:ml-16 xl:ml-64 min-w-0">
        {/* Top bar */}
        <header className="flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <button
            id="btn-toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="ml-3 lg:ml-0 text-gray-800 font-semibold text-sm">
            Board Meeting Minutes Manager
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ── Root App ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected routes — wrapped in sidebar layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/minutes" element={
            <ProtectedRoute>
              <AppLayout><MinutesList /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/minutes/new" element={
            <ProtectedRoute>
              <AppLayout><MinutesForm /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/minutes/:id" element={
            <ProtectedRoute>
              <AppLayout><MinutesDetail /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/minutes/:id/edit" element={
            <ProtectedRoute>
              <AppLayout><MinutesForm /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <AppLayout><AnalyticsPage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;