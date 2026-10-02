import { ExamSchedulePage } from "@/components/school/ExamPages";
import { SchoolShell } from "@/components/school/SchoolShell";

export function meta() {
  return [{ title: "Exam Schedule · Northstar Academy" }];
}

export default function ExamScheduleRoute() {
  return (
    <SchoolShell page="schedule">
      <ExamSchedulePage />
    </SchoolShell>
  );
}
