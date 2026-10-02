import { SchoolShell } from "@/components/school/SchoolShell";
import { StudentAttendancePage } from "@/components/school/StudentAttendancePage";

export function meta() {
  return [{ title: "Student Attendance · Northstar Academy" }];
}

export default function StudentAttendanceRoute() {
  return (
    <SchoolShell page="attendance">
      <StudentAttendancePage />
    </SchoolShell>
  );
}
