import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Root from "../pages/Root.jsx";
import RootLayout from "../pages/RootLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<Root />}>
        {/* Home Page */}
        <Route
          index
          lazy={() =>
            import("../pages/Home.jsx").then(({ default: Home }) => ({
              Component: Home,
            }))
          }
        />

        {/* Login Page */}
        <Route element={<PublicRoute />}>
          <Route
            path="login"
            lazy={() =>
              import("../pages/auth/Login.jsx").then(({ default: Login }) => ({
                Component: Login,
              }))
            }
          />
          <Route
            path="signup"
            lazy={() =>
              import("../pages/auth/signup.jsx").then(({ default: Signup }) => ({
                Component: Signup,
              }))
            }
          />
        </Route>

        <Route
          path="searchresult"
          lazy={() =>
            import("../components/VideoGrid.jsx").then(({ default: SearchResult }) => ({
              Component: SearchResult,
            }))
          }
        />

        {/* Public Video Watch and Channel pages */}
        <Route
          path="watch/:videoId"
          lazy={() =>
            import("../pages/Watch.jsx").then(({ default: Watch }) => ({
              Component: Watch,
            }))
          }
        />
        <Route
          path="channel/:username"
          lazy={() =>
            import("../pages/Channel.jsx").then(({ default: Channel }) => ({
              Component: Channel,
            }))
          }
        />

        <Route
          path="privacy"
          lazy={() =>
            import("../pages/Privacy.jsx").then(({ default: Privacy }) => ({
              Component: Privacy,
            }))
          }
        />

        <Route
          path="help"
          lazy={() =>
            import("../pages/Help.jsx").then(({ default: Help }) => ({
              Component: Help,
            }))
          }
        />

        <Route
          path="terms-of-services"
          lazy={() =>
            import("../pages/TermsOfService.jsx").then(({ default: TermsOfService }) => ({
              Component: TermsOfService,
            }))
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Logout Page */}
          <Route
            path="logout"
            lazy={() =>
              import("../pages/auth/Logout.jsx").then(({ default: Logout }) => ({
                Component: Logout,
              }))
            }
          />

          <Route
            path="subscriptions"
            lazy={() =>
              import("../pages/Subscriptions.jsx").then(({ default: Subscriptions }) => ({
                Component: Subscriptions,
              }))
            }
          />

          <Route
            path="history"
            lazy={() =>
              import("../pages/History.jsx").then(({ default: History }) => ({
                Component: History,
              }))
            }
          />

          <Route
            path="liked-videos"
            lazy={() =>
              import("../pages/LikedVideos.jsx").then(({ default: LikedVideos }) => ({
                Component: LikedVideos,
              }))
            }
          />

          <Route
            path="playlists"
            lazy={() =>
              import("../pages/Playlists.jsx").then(({ default: Playlists }) => ({
                Component: Playlists,
              }))
            }
          />

          <Route
            path="playlist/:playlistId"
            lazy={() =>
              import("../pages/PlaylistDetail.jsx").then(({ default: PlaylistDetail }) => ({
                Component: PlaylistDetail,
              }))
            }
          />

          <Route
            path="settings"
            lazy={() =>
              import("../pages/Settings.jsx").then(({ default: Settings }) => ({
                Component: Settings,
              }))
            }
          />

          {/* Creator Studio Dashboard */}
          <Route
            path="dashboard"
            lazy={() =>
              import("../pages/dashboard/DashboardLayout.jsx").then(({ default: DashboardLayout }) => ({
                Component: DashboardLayout,
              }))
            }
          >
            <Route
              index
              lazy={() =>
                import("../pages/dashboard/Content.jsx").then(({ default: Content }) => ({
                  Component: Content,
                }))
              }
            />
          </Route>
        </Route>

      </Route>
    </Route>,
  ),
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}