import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotAllowed from "./NotAllowed.jsx";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <NotAllowed />;
  }
  return children;
}
