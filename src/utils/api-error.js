export function getApiErrorMessage(error, fallback = "Something went wrong.") {
  if (!error?.response) {
    return "Network error. Check your connection and try again.";
  }

  const responseData = error.response.data;
  if (responseData?.message) {
    return responseData.message;
  }

  const errors = responseData?.errors;
  if (errors && typeof errors === "object") {
    const firstError = Object.values(errors).flat().find(Boolean);
    if (firstError) {
      return String(firstError);
    }
  }

  if (error.response.status === 401)
    return "Your session has expired. Please sign in again.";
  if (error.response.status === 403)
    return "You do not have permission to perform this action.";
  if (error.response.status === 404)
    return "The requested record was not found.";
  if (error.response.status === 409)
    return "This record conflicts with existing data.";
  if (error.response.status >= 500)
    return "The server could not complete the request.";

  return fallback;
}
