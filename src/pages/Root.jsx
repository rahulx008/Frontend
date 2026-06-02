import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomBar from "../components/BottomBar.jsx";
import Navbar from "../components/Navbar.jsx";
import OfflineBanner from "../components/OfflineBanner.jsx";
import Sidebar from "../components/Sidebar.jsx";
import useIsOnline from "../hooks/useIsOnline.js";

function Root() {
  const { pathname } = useLocation();
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isVideoRoute = pathname.startsWith("/watch");

  const [showMenu, setShowMenu] = useState(
    isDashboardRoute ? false : window.innerWidth < 1024 ? false : true,
  );
  const toggleDashboardSidebar = () => setOpenDashboardSidebar((prev) => !prev);

  const [openDashboardSidebar, setOpenDashboardSidebar] = useState(
    isDashboardRoute ? (window.innerWidth < 1024 ? false : true) : false,
  );
  const toggleMenu = () => setShowMenu(!showMenu);

  const isOnline = useIsOnline();

  useEffect(() => {
    if (showMenu && window.innerWidth < 768) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`; // Add padding to match scrollbar width
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = ""; // Reset padding
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = ""; // Reset padding
    };
  }, [showMenu]);

  return (
    <div>
      <Navbar
        toggleMenu={toggleMenu}
        toggleDashboardSidebar={toggleDashboardSidebar}
      />
      

        

      <Outlet/>
      
      {/* {!isDashboardRoute && <BottomBar />} */}

      {!isOnline && <OfflineBanner />}
    </div>
  );
}

export default Root;
