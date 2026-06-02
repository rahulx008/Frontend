import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
// import Content from "../pages/dashboard/Content";
// import DashboardLayout from "../pages/dashboard/DashboardLayout";
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
      
      
        </Route>


        <Route element={<ProtectedRoute />}>
          {/* Logout Page */ }
          <Route
              path="logout"
              lazy={() =>
                  import("../pages/auth/Logout.jsx").then(({ default: Logout }) => ({
                  Component: Logout,
                  }))
              }
          />

          <Route
              path="searchResult"
              lazy={() =>
                  import("../components/VideoGrid.jsx").then(({ default: SearchResult }) => ({
                  Component: SearchResult,
                  }))
              }
          />
        </Route>

            
      </Route>
    </Route>,
  ),
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}