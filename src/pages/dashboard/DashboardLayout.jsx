import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { LayoutDashboard, Video, Settings, ArrowLeft, BarChart2 } from "lucide-react";

export default function DashboardLayout() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main text-text-main flex text-left transition-colors duration-200">
      {/* Studio Sidebar */}
      <aside className="w-64 bg-surface-sidebar border-r border-border-main flex flex-col justify-between hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white uppercase">
              {user?.username?.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-text-main truncate max-w-[150px]">{user?.fullName || user?.username}</h3>
              <p className="text-xs text-text-sub font-medium">Creator Studio</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary pl-3"
                    : "text-text-sub hover:bg-surface-hover hover:text-text-main"
                }`
              }
            >
              <Video className="h-4.5 w-4.5" />
              Content
            </NavLink>
            
            <NavLink
              to={`/channel/${user?.username}`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-text-sub hover:bg-surface-hover hover:text-text-main transition"
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              View Channel
            </NavLink>
          </nav>
        </div>

        <div className="p-6 border-t border-border-main">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-text-main transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to VidStream
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
