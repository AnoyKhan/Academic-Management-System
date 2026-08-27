import { BookOpen, Clock, MapPin, Users } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { teacherCourses } from "../../data/teacher-portal-data";

export function TeacherCoursesPage() {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
              Course Management
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Manage active courses, sections, schedules, rooms, and class progress.
            </p>
          </div>
          <Button size="sm">
            <BookOpen className="h-4 w-4" />
            New Course
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teacherCourses.map((course) => (
          <Card key={course.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {course.id} · Section {course.section}
                </p>
                <h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
                  {course.title}
                </h2>
              </div>
              <Badge tone="success">{course.status}</Badge>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-600" />
                {course.students} students
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-600" />
                {course.schedule}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-600" />
                {course.room}
              </p>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
                <span>Syllabus progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-2 rounded-full bg-brand-600"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
