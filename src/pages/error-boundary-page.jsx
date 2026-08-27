import { useNavigate, useRouteError } from "react-router-dom";
import { ErrorState } from "../components/common/error-state";

export function ErrorBoundaryPage() {
  const navigate = useNavigate();
  const error = useRouteError();
  const status = error?.status ?? "Error";

  return (
    <ErrorState
      code={status}
      title="Dashboard failed to load"
      description="Refresh the page or return to your dashboard. If this repeats, the API or route module may need attention."
      actionLabel="Back to dashboard"
      onAction={() => navigate("/")}
    />
  );
}
