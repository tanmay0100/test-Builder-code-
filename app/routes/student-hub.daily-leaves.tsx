import { SchoolShell } from "@/components/school/SchoolShell";
import { StudentDailyLeavesPage } from "@/components/school/StudentDailyLeavesPage";

export function meta() {
  return [{ title: "Student Daily Leaves · Northstar Academy" }];
}

export default function StudentDailyLeavesRoute() {
  return (
    <SchoolShell page="leaves">
      <StudentDailyLeavesPage />
    </SchoolShell>
  );
}
