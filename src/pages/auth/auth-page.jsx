import { Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../routes/route-paths";

export function AuthPage() {
  return <Navigate to={ROUTE_PATHS.login} replace />;
}
