import { Outlet, ScrollRestoration } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import TopLoadingBar from "../components/TopLoadingBar";

function RootLayout() {
  return (
    <ErrorBoundary>
      <ScrollRestoration />
      <TopLoadingBar />
      <Outlet />
    </ErrorBoundary>
  );
}

export default RootLayout;