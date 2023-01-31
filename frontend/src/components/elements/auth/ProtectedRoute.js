import { Navigate, useLocation } from "react-router-dom";
import useAuth from '../../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  const location = useLocation();

  return isAuth === true ? children : <Navigate to="/" replace state={{ path: location.pathname }} />;
}