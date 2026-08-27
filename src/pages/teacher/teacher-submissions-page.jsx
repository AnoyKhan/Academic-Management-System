import { CheckCircle2, MessageSquareText } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { teacherCourses, teacherSubmissions } from "../../data/teacher-portal-data";

export function TeacherSubmissionsPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Student Submission Review
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Review student submissions, assign marks, and leave feedback.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_220px_160px]">
          <Input placeholder="Search by student or assignment" />
          <Select defaultValue="all">
            <option value="all">All courses</option>
            {teacherCourses.map((course) => (
              <option key={course.id}>{course.title}</option>
            ))}
          </Select>
          <Select defaultValue="review">
            <option value="review">Needs Review</option>
            <option value="reviewed">Reviewed</option>
          </Select>
        </div>
      </Card>

      <Card>
        <Table
          columns={[
            { key: "student", header: "Student" },
            { key: "assignment", header: "Assignment" },
            { key: "course", header: "Course" },
            { key: "submitted", header: "Submitted" },
            { key: "score", header: "Score" },
            { key: "status", header: "Status", render: (value) => <Badge tone={value === "Reviewed" ? "success" : "warning"}>{value}</Badge> },
            { key: "id", header: "Action", render: () => (
              <div className="flex gap-2">
                <Button size="sm" variant="secondary"><CheckCircle2 className="h-4 w-4" />Grade</Button>
                <Button size="sm" variant="ghost"><MessageSquareText className="h-4 w-4" /></Button>
              </div>
            ) },
          ]}
          data={teacherSubmissions}
        />
      </Card>
    </div>
  );
}
