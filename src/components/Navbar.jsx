import {
  DesktopIcon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon
} from '@radix-ui/react-icons'
import {
  IconButton
} from '@radix-ui/themes'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import useDebounce from '../hooks/useDebounce'
import { useGetAllVideos } from '../queries/videoQueries.js'

const VIDEO_ROUTE_PATTERN = /^\/watch/
const DASHBOARD_ROUTE_PATTERN = /^\/dashboard/

function Navbar({ toggleMenu, toggleDashboardSidebar }) {
  const [searchParams, setSearchParams] = useSearchParams('')
  const [query, setQuery] = useState(searchParams.get('query') || '')
  const [showSearchBar, setShowSearchBar] = useState(false)

  useEffect(() => {
    setQuery(searchParams.get('query') || '')
  }, [searchParams])

  const debouncedQuery = useDebounce(query)
  const navigate = useNavigate()
  const { logout, isAuthenticated, user, logoutLoading } = useAuth()
  const { pathname } = useLocation()
  const { theme, setTheme } = useTheme()
  const inputRef = useRef()
  const { isFetching } = useGetAllVideos()

  const isVideoRoute = VIDEO_ROUTE_PATTERN.test(pathname)
  const dashboardRoute = DASHBOARD_ROUTE_PATTERN.test(pathname)

  const themeIcon = { light: SunIcon, dark: MoonIcon, system: DesktopIcon }
  const ThemeIcon = themeIcon[theme] ?? DesktopIcon



  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      return
    }

    const nextParams = new URLSearchParams({ query: trimmedQuery })
    navigate(`/searchresult?${nextParams.toString()}`)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSidebarToggle = () => {
    if (dashboardRoute) {
      toggleDashboardSidebar?.()
    } else {
      toggleMenu?.()
    }
  }

  // console.log("Navbar user:", user);
  // console.log("Navbar isAuthenticated:", isAuthenticated);



  return (

    <>
      <header className="sticky top-0 z-50 bg-surface border-b border-border-main shadow-sm transition-colors duration-200">
        <div className="h-16 px-6 flex items-center justify-between">

          {/* Left Section */}
          <div className="flex items-center gap-4">

            <IconButton
              variant="ghost"
              radius="full"
              onClick={handleSidebarToggle}
              className="text-text-main hover:bg-surface-hover"
            >
              <HamburgerMenuIcon width={20} height={20} />
            </IconButton>

            <Link
              to="/Searchresult"
              className="text-2xl font-bold text-primary tracking-tight"
            >
              Clipster
            </Link>

          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-10">

            <form
              onSubmit={handleSearch}
              className="w-full"
            >
              <div className="flex items-center bg-bg-main rounded-full overflow-hidden border border-border-main focus-within:border-primary transition-colors">

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="flex-1 px-5 py-3 bg-transparent outline-none text-text-main placeholder-text-muted"
                />

                <button
                  type="submit"
                  disabled={isFetching}
                  className="px-6 py-3 bg-primary hover:bg-primary-hover text-white transition-colors duration-150 cursor-pointer"
                >
                  <MagnifyingGlassIcon width={24} height={24} />
                </button>

              </div>
            </form>

          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <button
              onClick={() =>
                setTheme(theme === "light" ? "dark" : "light")
              }
              className="w-10 h-10 rounded-full hover:bg-surface-hover flex items-center justify-center transition-colors text-text-main cursor-pointer"
            >
              <ThemeIcon />
            </button>

            {isAuthenticated ? (
              <>
                {/* Username */}
                <span className="hidden md:block text-sm font-medium text-text-main">
                  {user.username}
                </span>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold uppercase">
                  {user.username?.charAt(0)}
                </div>

                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="px-4 py-2 rounded-lg bg-danger hover:opacity-90 text-white transition cursor-pointer text-sm font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="px-5 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition cursor-pointer text-sm font-semibold">
                  Login
                </button>
              </Link>
            )}

          </div>

        </div>
      </header>
    </>

  )
}

export default Navbar