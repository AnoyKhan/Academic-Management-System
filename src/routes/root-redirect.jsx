import { Navigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { ROUTE_PATHS } from "./route-paths";

export function RootRedirect() {
  const session = authService.getSession();

  if (!session?.accessToken) {
    return <Navigate to={ROUTE_PATHS.login} replace />;
  }

  return <Navigate to={authService.getDashboardPath(session.role)} replace />;
}
