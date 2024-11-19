import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Building2,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Entrepreneurs", path: "/dashboard/entrepreneurs" },
  { icon: FileText, label: "Reports", path: "/dashboard/reports" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform bg-white shadow-lg",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-100">
            <Building2 className="h-8 w-8 text-blue-600 flex-shrink-0" />
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">SEDCO</span>
                <span className="text-xs text-gray-500">Admin Dashboard</span>
              </div>
            )}
          </div>

          {/* Toggle button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-3 top-6 h-6 w-6 rounded-full border shadow-sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="h-3 w-3" />
            ) : (
              <Menu className="h-3 w-3" />
            )}
          </Button>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const isActive = window.location.pathname === item.path;
              return (
                <Button
                  key={item.label}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 mb-1",
                    !isSidebarOpen && "justify-center px-2",
                    isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "text-blue-600")} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.[0] || "A"}
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50",
                !isSidebarOpen && "justify-center px-2"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-200 ease-in-out",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Top navbar */}
        <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}