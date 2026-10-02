import { SchoolShell } from "@/components/school/SchoolShell";
import { StudentDirectoryPage } from "@/components/school/StudentDirectoryPage";

export function meta() {
  return [{ title: "All Student Directory · Northstar Academy" }];
}

export default function StudentDirectoryRoute() {
  return (
    <SchoolShell page="directory">
      <StudentDirectoryPage />
    </SchoolShell>
  );
}
