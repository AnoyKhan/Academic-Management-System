import { FileUp, UploadCloud } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { teacherCourses, teacherMaterials } from "../../data/teacher-portal-data";

export function TeacherMaterialsPage() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Upload Study Materials
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Publish lecture notes, worksheets, templates, and reference files to students.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Material Upload
          </h2>
          <div className="mt-4 space-y-3">
            <Input placeholder="Material title" />
            <Select defaultValue="">
              <option value="" disabled>Select course</option>
              {teacherCourses.map((course) => (
                <option key={course.id}>{course.title}</option>
              ))}
            </Select>
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60">
              <UploadCloud className="mb-2 h-8 w-8 text-brand-600" />
              Select PDF, DOCX, ZIP, or slide deck
              <input type="file" className="sr-only" />
            </label>
            <Button>
              <FileUp className="h-4 w-4" />
              Upload Material
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
            Published Materials
          </h2>
          <Table
            columns={[
              { key: "title", header: "Title" },
              { key: "course", header: "Course" },
              { key: "type", header: "Type", render: (value) => <Badge>{value}</Badge> },
              { key: "size", header: "Size" },
              { key: "uploaded", header: "Uploaded" },
            ]}
            data={teacherMaterials}
          />
        </Card>
      </div>
    </div>
  );
}
