import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Loader } from "../../components/ui/loader";
import { FormField } from "../../components/forms/form-field";
import { AUTH_ROLE_OPTIONS } from "../../data/dummy-auth";
import { dummyAuthService } from "../../services/dummy-auth";
import { ROUTE_PATHS } from "../../routes/route-paths";

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "student",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await dummyAuthService.register(values);
      toast.success("Registration complete. Please log in.");
      navigate(ROUTE_PATHS.login);
    } catch (error) {
      toast.error(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-3xl p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Create your account
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Register as Student, Teacher, or Admin with dummy data.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Full Name"
          htmlFor="register-name"
          error={errors.name?.message}
        >
          <Input
            id="register-name"
            placeholder="Your full name"
            {...register("name", {
              required: "Full name is required.",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters.",
              },
            })}
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="register-email"
          error={errors.email?.message}
        >
          <Input
            id="register-email"
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
          label="Role"
          htmlFor="register-role"
          error={errors.role?.message}
        >
          <Select
            id="register-role"
            {...register("role", { required: "Please choose a role." })}
          >
            {AUTH_ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Password"
          htmlFor="register-password"
          error={errors.password?.message}
        >
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
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

        <FormField
          label="Confirm Password"
          htmlFor="register-confirm-password"
          error={errors.confirmPassword?.message}
        >
          <div className="relative">
            <Input
              id="register-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Retype password"
              className="pr-11"
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match.",
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800 dark:hover:text-slate-100"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label="Toggle confirm password visibility"
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
          {loading ? <Loader label="Creating account..." /> : "Register"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        Already registered?{" "}
        <Link
          to={ROUTE_PATHS.login}
          className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300"
        >
          Go to login
        </Link>
      </p>
    </Card>
  );
}
