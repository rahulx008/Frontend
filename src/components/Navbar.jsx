import {
  DesktopIcon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon
} from '@radix-ui/react-icons'
import {
  Box,
  IconButton,
  Text
} from '@radix-ui/themes'
import { useTheme } from 'next-themes'
import { useRef, useState } from 'react'
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
      <div className={`w-full h-16 px-4 flex items-center justify-between `}>
        <div className="flex items-center">
          <IconButton>

            <HamburgerMenuIcon
              onClick={handleSidebarToggle}
              style={{ transform: showSearchBar ? 'translateX(-50px)' : 'none' }}
            >

            </HamburgerMenuIcon>
          </IconButton>
          
            <Text size="3" weight="bold " style={{ marginLeft: '8px' }}>
              <Link to="/">VidStream</Link>
            </Text>
          
        </div>

        <div>
          <form
            onSubmit={handleSearch}
            className="relative"
          >
            <div className="flex items-center border rounded-full px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500">
              
              <MagnifyingGlassIcon className="h-5 w-5 ml-3 text-gray-500" />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onSubmit={handleSearch}
                placeholder="Search"
                className="flex-1 px-3 py-3 outline-none"
              />

              <button
                type="submit"
                disabled={isFetching}
                onClick={handleSearch}
                className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:opacity-50"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

            </div>
          </form>
        </div>

        {isAuthenticated && (
           <button onClick={handleLogout} disabled={logoutLoading}>
             Logout
           </button>
        )}

        <div className="flex items-center space-x-4">
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            <ThemeIcon />
          </button>

          <Box>
            {isAuthenticated ? (
              <Box>
                <Text>{user.username}</Text>
              </Box>
            ) : (
              <Box>
                <Link to="/login">
                  <Text>Login</Text>
                </Link>
              </Box>
            )}
          </Box>
        </div>
      </div>

        
      
    </>

  )
}

export default Navbar