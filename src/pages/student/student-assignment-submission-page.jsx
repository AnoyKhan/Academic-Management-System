import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader } from "../../components/ui/loader";
import { FormField } from "../../components/forms/form-field";
import { assignmentItems } from "../../data/student-portal-data";
import { ROUTE_PATHS } from "../../routes/route-paths";

export function StudentAssignmentSubmissionPage() {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const [loading, setLoading] = useState(false);

  const assignment = useMemo(
    () => assignmentItems.find((item) => item.id === assignmentId),
    [assignmentId],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      submissionLink: "",
      note: "",
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Assignment submitted successfully (mock).");
    setLoading(false);
    navigate(ROUTE_PATHS.studentAssignments);
  };

  if (!assignment) {
    return (
      <Card>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Assignment not found
        </h1>
        <Link
          to={ROUTE_PATHS.studentAssignments}
          className="mt-3 inline-block text-sm font-semibold text-brand-700 dark:text-brand-300"
        >
          Back to assignments
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Submit Assignment
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {assignment.title} - {assignment.course} (Due: {assignment.dueDate})
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {assignment.description}
        </p>
      </Card>

      <Card>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Repository / Drive Link"
            htmlFor="submission-link"
            error={errors.submissionLink?.message}
          >
            <Input
              id="submission-link"
              placeholder="https://"
              {...register("submissionLink", {
                required: "Submission link is required.",
                pattern: {
                  value: /^https?:\/\/.+/i,
                  message: "Enter a valid URL starting with http or https.",
                },
              })}
            />
          </FormField>

          <FormField
            label="Submission Note"
            htmlFor="submission-note"
            error={errors.note?.message}
          >
            <textarea
              id="submission-note"
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Add a short note for instructor..."
              {...register("note", {
                required: "Please add a submission note.",
                minLength: {
                  value: 20,
                  message: "Note must be at least 20 characters.",
                },
              })}
            />
          </FormField>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader label="Submitting..." /> : "Submit Assignment"}
            </Button>
            <Link to={ROUTE_PATHS.studentAssignments}>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
