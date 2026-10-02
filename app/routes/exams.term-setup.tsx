import { TermSetupPage } from "@/components/school/ExamTermSetup";
import { SchoolShell } from "@/components/school/SchoolShell";

export function meta() {
  return [{ title: "Term Setup · Northstar Academy" }];
}

export default function TermSetupRoute() {
  return (
    <SchoolShell page="terms">
      <TermSetupPage />
    </SchoolShell>
  );
}
