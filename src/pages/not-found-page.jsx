import { useNavigate } from "react-router-dom";
import { ErrorState } from "../components/common/error-state";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorState
      code="404"
      title="Page not found"
      description="The page you are looking for does not exist or may have been moved."
      onAction={() => navigate("/")}
    />
  );
}
