import { appBasePath, appPath } from "@agent-native/core/client/api-path";
import { useAgentRouteState } from "@agent-native/core/client/navigation";

import { TAB_ID } from "@/lib/tab-id";

export interface NavigationState {
  view: string;
  path?: string;
  threadId?: string;
}

export function useNavigationState() {
  useAgentRouteState<NavigationState>({
    browserTabId: TAB_ID,
    requestSource: TAB_ID,
    getNavigationState: ({ pathname }) => {
      const threadId = threadIdFromPath(pathname);
      return {
        view: viewForPath(pathname),
        path: appPath(pathname),
        ...(threadId ? { threadId } : {}),
      };
    },
    getCommandPath: (command) =>
      routerPath(command.path || pathForCommand(command)),
  });
}

function threadIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/chat\/([^/]+)/);
  if (!match) return null;
  try {
    const value = decodeURIComponent(match[1]).trim();
    return value || null;
  } catch {
    return null;
  }
}

function viewForPath(pathname: string): string {
  if (pathname === "/exams/schedule") return "exam-schedule";
  if (pathname === "/exams/term-setup") return "exam-term-setup";
  if (pathname === "/exams/offline-marks") return "exam-offline-marks";
  if (pathname === "/student-hub/attendance") return "student-attendance";
  if (pathname === "/student-hub/daily-leaves") return "student-daily-leaves";
  if (pathname === "/student-hub/directory") return "student-directory";
  return "home";
}

function pathForView(view?: string): string {
  switch (view) {
    case "exam-schedule":
      return "/exams/schedule";
    case "exam-term-setup":
      return "/exams/term-setup";
    case "exam-offline-marks":
      return "/exams/offline-marks";
    case "student-attendance":
      return "/student-hub/attendance";
    case "student-daily-leaves":
      return "/student-hub/daily-leaves";
    case "student-directory":
      return "/student-hub/directory";
    case "home":
    default:
      return "/";
  }
}

function pathForCommand(command: any): string {
  const path = pathForView(command?.view);
  if (path !== "/") return path;
  const threadId =
    typeof command?.threadId === "string" ? command.threadId.trim() : "";
  return threadId ? `/chat/${encodeURIComponent(threadId)}` : "/";
}

function routerPath(path: string): string {
  const basePath = appBasePath();
  if (!basePath) return path;
  if (path === basePath) return "/";
  if (path.startsWith(`${basePath}/`)) {
    return path.slice(basePath.length) || "/";
  }
  return path;
}
