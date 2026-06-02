import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/authContext'

function PublicRoute() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Navigate to={'/'} /> : <Outlet />
}

export default PublicRoute