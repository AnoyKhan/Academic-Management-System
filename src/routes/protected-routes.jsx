import { Navigate, Outlet, useLocation } from "react-router-dom";
import { dummyAuthService } from "../services/dummy-auth";
import { ROUTE_PATHS } from "./route-paths";

export function RequireAuth() {
  const location = useLocation();
  const session = dummyAuthService.getSession();

  if (!session) {
    return (
      <Navigate to={ROUTE_PATHS.login} replace state={{ from: location }} />
    );
  }

  return <Outlet />;
}

export function RequireRole({ role }) {
  const session = dummyAuthService.getSession();

  if (!session) {
    return <Navigate to={ROUTE_PATHS.login} replace />;
  }

  if (session.role !== role) {
    return <Navigate to={ROUTE_PATHS.forbidden} replace />;
  }

  return <Outlet />;
}

export function RedirectIfAuthenticated() {
  const session = dummyAuthService.getSession();

  if (session) {
    return (
      <Navigate to={dummyAuthService.getDashboardPath(session.role)} replace />
    );
  }

  return <Outlet />;
}
