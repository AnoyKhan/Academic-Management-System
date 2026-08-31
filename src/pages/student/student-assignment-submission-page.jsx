import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader } from "../../components/ui/loader";
import { FormField } from "../../components/forms/form-field";
import { ROUTE_PATHS } from "../../routes/route-paths";
import { studentService } from "../../services/student.service";

const formatDate = (value) => {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

export function StudentAssignmentSubmissionPage() {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [assignment, setAssignment] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAssignment = async () => {
      try {
        setFetching(true);
        const response = await studentService.getAssignments();
        const payload = studentService.unwrapData(response);
        const list = Array.isArray(payload)
          ? payload
          : (payload?.results ?? []);

        if (isMounted) {
          setAssignment(
            list.find((item) => String(item.id) === String(assignmentId)) ||
              null,
          );
        }
      } catch {
        if (isMounted) {
          setAssignment(null);
        }
      } finally {
        if (isMounted) {
          setFetching(false);
        }
      }
    };

    loadAssignment();

    return () => {
      isMounted = false;
    };
  }, [assignmentId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      file: null,
    },
  });

  const onSubmit = async (values) => {
    const uploadedFile = values.file?.[0];

    if (!uploadedFile) {
      toast.error("Please select a file to submit.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      await studentService.submitAssignment(assignmentId, formData);
      toast.success("Assignment submitted successfully.");
      navigate(ROUTE_PATHS.studentAssignments);
    } catch (submitError) {
      toast.error(
        submitError?.response?.data?.message ||
          "Submission failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Card>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Loading assignment…
        </p>
      </Card>
    );
  }

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
          {assignment.title} - {assignment.course} (Due:{" "}
          {formatDate(assignment.deadline)})
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {assignment.description ||
            "No description provided for this assignment."}
        </p>
      </Card>

      <Card>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Submission file"
            htmlFor="submission-file"
            error={errors.file?.message}
          >
            <Input
              id="submission-file"
              type="file"
              accept=".pdf,.doc,.docx,.zip,.rar,.ppt,.pptx"
              {...register("file", {
                required: "Please select a file to submit.",
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
