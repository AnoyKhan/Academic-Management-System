import { useNavigate } from "react-router-dom";
import { ErrorState } from "../components/common/error-state";

export function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <ErrorState
      code="403"
      title="Access denied"
      description="Your account does not have permission to open this portal area."
      actionLabel="Go back"
      onAction={() => navigate(-1)}
    />
  );
}
