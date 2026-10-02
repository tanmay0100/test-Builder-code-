import { SchoolShell } from "@/components/school/SchoolShell";
import { StudentEarlyAccessPage } from "@/components/school/StudentEarlyAccessPage";

export function meta() {
  return [{ title: "Early Access · Northstar Academy" }];
}

export default function StudentEarlyAccessRoute() {
  return (
    <SchoolShell page="early-access">
      <StudentEarlyAccessPage />
    </SchoolShell>
  );
}
