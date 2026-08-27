import { Navigate } from "react-router-dom";
import { dummyAuthService } from "../services/dummy-auth";
import { ROUTE_PATHS } from "./route-paths";

export function RootRedirect() {
  const session = dummyAuthService.getSession();

  if (!session) {
    return <Navigate to={ROUTE_PATHS.login} replace />;
  }

  return (
    <Navigate to={dummyAuthService.getDashboardPath(session.role)} replace />
  );
}
