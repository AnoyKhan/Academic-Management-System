import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader } from "../../components/ui/loader";
import { FormField } from "../../components/forms/form-field";
import { studentProfile } from "../../data/student-portal-data";

export function StudentProfileSettingsPage() {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: studentProfile,
  });

  const onSubmit = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success("Profile updated successfully (mock).");
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Manage contact details and guardian information. Changes are stored
          only in mock state.
        </p>
      </Card>

      <Card>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            label="Student ID"
            htmlFor="student-id"
            error={errors.studentId?.message}
          >
            <Input id="student-id" disabled {...register("studentId")} />
          </FormField>

          <FormField
            label="Full Name"
            htmlFor="name"
            error={errors.name?.message}
          >
            <Input
              id="name"
              {...register("name", {
                required: "Name is required.",
              })}
            />
          </FormField>

          <FormField
            label="Email"
            htmlFor="email"
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required.",
              })}
            />
          </FormField>

          <FormField
            label="Phone"
            htmlFor="phone"
            error={errors.phone?.message}
          >
            <Input
              id="phone"
              {...register("phone", { required: "Phone is required." })}
            />
          </FormField>

          <FormField
            label="Department"
            htmlFor="department"
            error={errors.department?.message}
          >
            <Input id="department" {...register("department")} />
          </FormField>

          <FormField
            label="Semester"
            htmlFor="semester"
            error={errors.semester?.message}
          >
            <Input id="semester" {...register("semester")} />
          </FormField>

          <FormField
            label="Guardian Name"
            htmlFor="guardianName"
            error={errors.guardianName?.message}
          >
            <Input id="guardianName" {...register("guardianName")} />
          </FormField>

          <FormField
            label="Guardian Phone"
            htmlFor="guardianPhone"
            error={errors.guardianPhone?.message}
          >
            <Input id="guardianPhone" {...register("guardianPhone")} />
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Address"
              htmlFor="address"
              error={errors.address?.message}
            >
              <textarea
                id="address"
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                {...register("address")}
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader label="Saving changes..." /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
