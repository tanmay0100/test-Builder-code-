import { SchoolShell } from "@/components/school/SchoolShell";
import { APP_TITLE } from "@/lib/app-config";

export function meta() {
  return [
    { title: APP_TITLE },
    { name: "description", content: `${APP_TITLE} for CBSE school operations` },
  ];
}

export default function HomeRoute() {
  return (
    <SchoolShell page="home">
      <div aria-label="Home" className="h-full min-h-[calc(100vh-62px)]" />
    </SchoolShell>
  );
}
