import { OfflineMarksPage } from "@/components/school/ExamPages";
import { SchoolShell } from "@/components/school/SchoolShell";

export function meta() {
  return [{ title: "Offline Marks Entry · Northstar Academy" }];
}

export default function OfflineMarksRoute() {
  return (
    <SchoolShell page="marks">
      <OfflineMarksPage />
    </SchoolShell>
  );
}
