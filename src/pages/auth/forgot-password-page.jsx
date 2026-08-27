import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader } from "../../components/ui/loader";
import { FormField } from "../../components/forms/form-field";
import { ROUTE_PATHS } from "../../routes/route-paths";
import { dummyAuthService } from "../../services/dummy-auth";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await dummyAuthService.requestReset(values);
      toast.success(`Dummy reset token: ${response.token}`);
      navigate(
        `${ROUTE_PATHS.resetPassword}?email=${encodeURIComponent(values.email)}`,
      );
    } catch (error) {
      toast.error(error.message || "Could not request password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-3xl p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Forgot Password
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Enter your email. A dummy reset token will be generated.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Email"
          htmlFor="forgot-email"
          error={errors.email?.message}
        >
          <Input
            id="forgot-email"
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <Loader label="Generating token..." />
          ) : (
            "Send reset token"
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        Remembered your password?{" "}
        <Link
          to={ROUTE_PATHS.login}
          className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300"
        >
          Back to login
        </Link>
      </p>
    </Card>
  );
}
