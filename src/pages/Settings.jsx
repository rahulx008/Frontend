import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Settings as SettingsIcon, Sun, Moon, Laptop, Bell, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifyOnMeow, setNotifyOnMeow] = useState(true);
  const [notifyOnLunch, setNotifyOnLunch] = useState(false);

  const handleDangerZoneAction = () => {
    toast.error("ERROR: This action will delete your account. It will not, however, delete your search history from your mom's memory. Proceed with caution!");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main text-text-main p-4 md:p-6 transition-colors duration-200 text-left">
      <div className="max-w-3xl mx-auto bg-surface border border-border-main p-8 rounded-2xl shadow-xl mt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border-main">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
            <p className="text-xs text-text-sub mt-0.5">Customize your stream settings and preferences</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Theme Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-text-sub uppercase tracking-wider">Appearance</h2>
            <p className="text-xs text-text-muted font-light">
              Select how Clipster looks on your screen. (Dark mode is recommended for developers who haven't seen sunlight since 2018).
            </p>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition cursor-pointer ${
                  theme === "light"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border-main bg-bg-main/50 hover:bg-surface-hover text-text-secondary"
                }`}
              >
                <Sun className="h-5 w-5" />
                <span className="text-xs font-semibold">Light</span>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition cursor-pointer ${
                  theme === "dark"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border-main bg-bg-main/50 hover:bg-surface-hover text-text-secondary"
                }`}
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs font-semibold">Dark</span>
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition cursor-pointer ${
                  theme === "system"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border-main bg-bg-main/50 hover:bg-surface-hover text-text-secondary"
                }`}
              >
                <Laptop className="h-5 w-5" />
                <span className="text-xs font-semibold">System</span>
              </button>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="space-y-4 pt-6 border-t border-border-main">
            <h2 className="text-sm font-semibold text-text-sub uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-text-sub" /> Notifications
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 py-1 cursor-pointer text-sm text-text-secondary transition hover:text-text-main">
                <input
                  type="checkbox"
                  checked={notifyOnMeow}
                  onChange={(e) => setNotifyOnMeow(e.target.checked)}
                  className="rounded border-border-main text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span>Notify me every time a cat meows on the server.</span>
              </label>

              <label className="flex items-center gap-3 py-1 cursor-pointer text-sm text-text-secondary transition hover:text-text-main">
                <input
                  type="checkbox"
                  checked={notifyOnLunch}
                  onChange={(e) => setNotifyOnLunch(e.target.checked)}
                  className="rounded border-border-main text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span>Send notification when backend hamsters take a lunch break.</span>
              </label>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="space-y-4 pt-6 border-t border-border-main">
            <h2 className="text-sm font-semibold text-danger uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> Danger Zone
            </h2>
            <div className="p-4 rounded-xl bg-danger/5 border border-danger/25 text-left">
              <p className="text-xs text-danger font-medium mb-3 leading-relaxed">
                Clicking the button below will permanently delete your account, your published clips, your subscription feed, and your digital footprint on our servers.
              </p>
              <button
                onClick={handleDangerZoneAction}
                className="px-4 py-2 bg-danger hover:bg-danger/80 text-white text-xs font-semibold rounded-lg transition cursor-pointer shadow-md"
              >
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
