import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader } from "../../components/ui/loader";
import { FormField } from "../../components/forms/form-field";
import { studentService } from "../../services/student.service";

export function StudentProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      studentId: "",
      name: "",
      email: "",
      department: "",
      intake: "",
      batch: "",
      semester: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await studentService.getProfile();
        const payload = studentService.unwrapData(response);
        const profile = payload?.student ?? payload;

        if (isMounted) {
          reset({
            studentId: profile.student_id ?? "",
            name: profile.name ?? "",
            email: profile.email ?? "",
            department: profile.department ?? "",
            intake: profile.intake ?? "",
            batch: profile.batch ?? "",
            semester: profile.semester ?? "",
          });
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message || "Unable to load profile.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [reset]);

  const onSubmit = async () => {
    setSaving(true);
    toast("Profile updates are not yet supported by the backend API.", {
      icon: "ℹ️",
    });
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Live profile information from the authenticated student record.
        </p>
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading profile…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : (
        <Card>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              label="Student ID"
              htmlFor="studentId"
              error={errors.studentId?.message}
            >
              <Input id="studentId" disabled {...register("studentId")} />
            </FormField>

            <FormField
              label="Full Name"
              htmlFor="name"
              error={errors.name?.message}
            >
              <Input id="name" {...register("name")} />
            </FormField>

            <FormField
              label="Email"
              htmlFor="email"
              error={errors.email?.message}
            >
              <Input id="email" type="email" {...register("email")} />
            </FormField>

            <FormField
              label="Department"
              htmlFor="department"
              error={errors.department?.message}
            >
              <Input id="department" {...register("department")} />
            </FormField>

            <FormField
              label="Intake"
              htmlFor="intake"
              error={errors.intake?.message}
            >
              <Input id="intake" {...register("intake")} />
            </FormField>

            <FormField
              label="Batch"
              htmlFor="batch"
              error={errors.batch?.message}
            >
              <Input id="batch" {...register("batch")} />
            </FormField>

            <FormField
              label="Semester"
              htmlFor="semester"
              error={errors.semester?.message}
            >
              <Input id="semester" {...register("semester")} />
            </FormField>

            <div className="md:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader label="Saving changes..." /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
