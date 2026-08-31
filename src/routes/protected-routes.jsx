import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../services/auth.service";
import { ROUTE_PATHS } from "./route-paths";

export function RequireAuth() {
  const location = useLocation();
  const session = authService.getSession();

  if (!session?.accessToken) {
    return (
      <Navigate to={ROUTE_PATHS.login} replace state={{ from: location }} />
    );
  }

  return <Outlet />;
}

export function RequireRole({ role }) {
  const session = authService.getSession();

  if (!session?.accessToken) {
    return <Navigate to={ROUTE_PATHS.login} replace />;
  }

  if (session.role !== role) {
    return <Navigate to={ROUTE_PATHS.forbidden} replace />;
  }

  return <Outlet />;
}

export function RedirectIfAuthenticated() {
  const session = authService.getSession();

  if (session?.accessToken) {
    return <Navigate to={authService.getDashboardPath(session.role)} replace />;
  }

  return <Outlet />;
}
