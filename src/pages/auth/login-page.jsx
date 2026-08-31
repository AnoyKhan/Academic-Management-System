import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader } from "../../components/ui/loader";
import { FormField } from "../../components/forms/form-field";
import { authService } from "../../services/auth.service";
import { ROUTE_PATHS } from "../../routes/route-paths";

const REMEMBER_KEY = "ams-remember-email";

export function LoginPage() {
  const navigate = useNavigate();
  const rememberedEmail = useMemo(
    () => localStorage.getItem(REMEMBER_KEY) ?? "",
    [],
  );

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: rememberedEmail,
      password: "",
      rememberMe: Boolean(rememberedEmail),
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const session = await authService.login(values);

      if (values.rememberMe) {
        localStorage.setItem(REMEMBER_KEY, values.email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      toast.success(`Welcome back, ${session.name}!`);

      if (session.role === "student") {
        navigate(ROUTE_PATHS.student);
      } else if (session.role === "teacher") {
        navigate(ROUTE_PATHS.teacher);
      } else {
        navigate(ROUTE_PATHS.admin);
      }
    } catch (error) {
      const message =
        error?.response?.data?.detail || error.message || "Login failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-3xl p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Login to AMS
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Sign in with your AMS email and password.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Email"
          htmlFor="login-email"
          error={errors.email?.message}
        >
          <Input
            id="login-email"
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
          label="Password"
          htmlFor="login-password"
          error={errors.password?.message}
        >
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="pr-11"
              {...register("password", {
                required: "Password is required.",
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
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </FormField>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              {...register("rememberMe")}
            />
            Remember me
          </label>

          <Link
            to={ROUTE_PATHS.forgotPassword}
            className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader label="Signing in..." /> : "Sign In"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        New here?{" "}
        <Link
          to={ROUTE_PATHS.register}
          className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300"
        >
          Create account
        </Link>
      </p>
    </Card>
  );
}
