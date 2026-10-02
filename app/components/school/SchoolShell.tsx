import {
  IconBook2,
  IconChevronDown,
  IconChevronRight,
  IconMenu2,
  IconSchool,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
import { NavLink } from "react-router";

export type SchoolPage =
  | "home"
  | "schedule"
  | "terms"
  | "marks"
  | "attendance"
  | "leaves"
  | "directory";

const pageLabels: Record<SchoolPage, string> = {
  home: "",
  schedule: "Exam Schedule",
  terms: "Term Setup",
  marks: "Offline Marks Entry",
  attendance: "Student Attendance",
  leaves: "Student Daily Leaves",
  directory: "All Student Directory",
};

export function SchoolShell({
  page,
  children,
}: {
  page: SchoolPage;
  children: ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [studentHubOpen, setStudentHubOpen] = useState(
    page === "attendance" || page === "leaves" || page === "directory",
  );
  const [examsOpen, setExamsOpen] = useState(
    page !== "attendance" && page !== "leaves" && page !== "directory",
  );
  const studentHubActive =
    page === "attendance" || page === "leaves" || page === "directory";
  const examsActive = page !== "home" && !studentHubActive;

  return (
    <div className="school-shell">
      {navOpen ? (
        <button
          aria-label="Close navigation"
          className="mobile-nav-backdrop"
          onClick={() => setNavOpen(false)}
          type="button"
        />
      ) : null}
      <aside
        aria-label="Main navigation"
        className={`school-sidebar${navOpen ? " is-open" : ""}`}
      >
        <NavLink
          aria-label="Northstar Academy home"
          className="school-brand-link"
          onClick={() => setNavOpen(false)}
          to="/"
        >
          <span className="school-brand-mark">
            <IconSchool size={20} stroke={1.8} />
          </span>
          <span>
            <span className="school-brand-name">Northstar</span>
            <span className="school-brand-caption">CBSE SCHOOL ERP</span>
          </span>
        </NavLink>

        <nav aria-label="School modules" className="school-nav">
          <span className="school-nav-label">Modules</span>
          <div className="school-nav-group">
            <button
              aria-controls="student-hub-subnav"
              aria-expanded={studentHubOpen}
              className={`school-nav-parent${studentHubActive || studentHubOpen ? " is-active" : ""}`}
              onClick={() => setStudentHubOpen((open) => !open)}
              type="button"
            >
              <IconUsers size={17} stroke={1.8} />
              <span>Student Hub</span>
              <IconChevronDown
                className={studentHubOpen ? "is-expanded" : ""}
                size={14}
                stroke={1.8}
              />
            </button>
            <div
              aria-label="Student Hub pages"
              className="school-subnav"
              hidden={!studentHubOpen}
              id="student-hub-subnav"
            >
              <NavLink
                className={({ isActive }) =>
                  `school-subnav-link${isActive ? " is-active" : ""}`
                }
                onClick={() => setNavOpen(false)}
                to="/student-hub/attendance"
              >
                Student Attendance
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `school-subnav-link${isActive ? " is-active" : ""}`
                }
                onClick={() => setNavOpen(false)}
                to="/student-hub/directory"
              >
                All Student Directory
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `school-subnav-link${isActive ? " is-active" : ""}`
                }
                onClick={() => setNavOpen(false)}
                to="/student-hub/daily-leaves"
              >
                Student Daily Leaves
              </NavLink>
            </div>
          </div>
          <div className="school-nav-group">
            <button
              aria-controls="exams-subnav"
              aria-expanded={examsOpen}
              className={`school-nav-parent${examsActive || examsOpen ? " is-active" : ""}`}
              onClick={() => setExamsOpen((open) => !open)}
              type="button"
            >
              <IconBook2 size={17} stroke={1.8} />
              <span>Exams</span>
              <IconChevronDown
                className={examsOpen ? "is-expanded" : ""}
                size={14}
                stroke={1.8}
              />
            </button>
            <div
              aria-label="Exams pages"
              className="school-subnav"
              hidden={!examsOpen}
              id="exams-subnav"
            >
              <NavLink
                className={({ isActive }) =>
                  `school-subnav-link${isActive ? " is-active" : ""}`
                }
                onClick={() => setNavOpen(false)}
                to="/exams/schedule"
              >
                Exam Schedule
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `school-subnav-link${isActive ? " is-active" : ""}`
                }
                onClick={() => setNavOpen(false)}
                to="/exams/term-setup"
              >
                Term Setup
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `school-subnav-link${isActive ? " is-active" : ""}`
                }
                onClick={() => setNavOpen(false)}
                to="/exams/offline-marks"
              >
                Offline Marks Entry
              </NavLink>
            </div>
          </div>
        </nav>
      </aside>

      <div className="school-workspace">
        <header className="school-topbar">
          <button
            aria-expanded={navOpen}
            aria-label={navOpen ? "Close navigation" : "Open navigation"}
            className="mobile-nav-trigger"
            onClick={() => setNavOpen((open) => !open)}
            type="button"
          >
            {navOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
          </button>
          <div aria-label="Breadcrumb" className="school-breadcrumb">
            <span>School</span>
            {studentHubActive ? (
              <>
                <IconChevronRight size={13} />
                <span>Student Hub</span>
                <IconChevronRight size={13} />
                <strong>{pageLabels[page]}</strong>
              </>
            ) : page !== "home" ? (
              <>
                <IconChevronRight size={13} />
                <span>Exams</span>
                <IconChevronRight size={13} />
                <strong>{pageLabels[page]}</strong>
              </>
            ) : null}
          </div>
        </header>
        <main className={`school-main${page === "home" ? " is-empty" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
