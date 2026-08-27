import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader } from "../../components/ui/loader";
import { FormField } from "../../components/forms/form-field";
import { ROUTE_PATHS } from "../../routes/route-paths";
import { dummyAuthService } from "../../services/dummy-auth";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromQuery = useMemo(
    () => searchParams.get("email") ?? "",
    [searchParams],
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: emailFromQuery,
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await dummyAuthService.resetPassword(values);
      toast.success("Password updated. Please login.");
      navigate(ROUTE_PATHS.login);
    } catch (error) {
      toast.error(error.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-3xl p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Reset Password
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Use the dummy token from the toast message to set a new password.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Email"
          htmlFor="reset-email"
          error={errors.email?.message}
        >
          <Input
            id="reset-email"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            })}
          />
        </FormField>

        <FormField
          label="Reset Token"
          htmlFor="reset-token"
          error={errors.token?.message}
        >
          <Input
            id="reset-token"
            placeholder="AMS-XXXXXX"
            {...register("token", {
              required: "Reset token is required.",
              minLength: {
                value: 6,
                message: "Token looks too short.",
              },
            })}
          />
        </FormField>

        <FormField
          label="New Password"
          htmlFor="reset-password"
          error={errors.newPassword?.message}
        >
          <div className="relative">
            <Input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="pr-11"
              {...register("newPassword", {
                required: "New password is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters.",
                },
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800 dark:hover:text-slate-100"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle new password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </FormField>

        <FormField
          label="Confirm New Password"
          htmlFor="reset-confirm-password"
          error={errors.confirmPassword?.message}
        >
          <div className="relative">
            <Input
              id="reset-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="pr-11"
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "Passwords do not match.",
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800 dark:hover:text-slate-100"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label="Toggle confirm new password visibility"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </FormField>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader label="Updating password..." /> : "Reset password"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        Back to{" "}
        <Link
          to={ROUTE_PATHS.login}
          className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300"
        >
          login
        </Link>
      </p>
    </Card>
  );
}
