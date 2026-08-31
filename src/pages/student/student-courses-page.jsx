import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { studentService } from "../../services/student.service";

export function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        setLoading(true);
        const response = await studentService.getCourses();
        const payload = studentService.unwrapData(response);

        if (isMounted) {
          setCourses(
            Array.isArray(payload) ? payload : (payload?.results ?? []),
          );
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message || "Unable to load courses.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Course List
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Enrolled courses with instructor and credit information from the live
          backend.
        </p>
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Loading courses…
          </p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : courses.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500">
            No courses are available for this student yet.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.course_code || course.id}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {course.course_code}
              </p>
              <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">
                {course.course_name}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Instructor: {course.teacher?.name || "—"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {course.teacher?.department || "Department not available"}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <Badge tone="neutral">{course.credit ?? 0} Credits</Badge>
                <Badge tone="success">
                  {course.teacher?.designation || "Course"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
