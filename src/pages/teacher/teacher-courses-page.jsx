import { useEffect, useState } from "react";
import { BookOpen, Clock, MapPin, Users } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { teacherService } from "../../services/teacher.service";

export function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        setLoading(true);
        const response = await teacherService.getCourses({ page_size: 100 });
        const payload = teacherService.unwrapData(response);

        if (isMounted) {
          setCourses(
            Array.isArray(payload) ? payload : (payload?.results ?? []),
          );
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.message ||
              "Unable to load teacher courses.",
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
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
              Course Management
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Live courses assigned to your teacher account from the backend.
            </p>
          </div>
          <Button size="sm" disabled>
            <BookOpen className="h-4 w-4" />
            New Course
          </Button>
        </div>
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
            No courses are assigned to this teacher yet.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {course.course_code}
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
                    {course.course_name}
                  </h2>
                </div>
                <Badge tone="success">Active</Badge>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-600" />
                  {course.teacher?.name || "Teacher"}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-600" />
                  {course.credit ?? 0} credit(s)
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-600" />
                  {course.description || "No description provided."}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
