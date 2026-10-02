import { IconCalendarEvent, IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";

const earlyAccessStudents = [
  {
    admissionId: "NSA-26018",
    name: "Aarav Mehta",
    className: "Class 8",
    section: "A",
    accessArea: "Learning Lab",
    status: "Active",
    accessDate: "12 Aug 2026",
  },
  {
    admissionId: "NSA-26042",
    name: "Aanya Kapoor",
    className: "Class 10",
    section: "B",
    accessArea: "Exam Prep Portal",
    status: "Active",
    accessDate: "18 Aug 2026",
  },
  {
    admissionId: "NSA-26067",
    name: "Ishaan Nair",
    className: "Class 7",
    section: "A",
    accessArea: "Digital Library",
    status: "Invitation pending",
    accessDate: "Sent 02 Sep 2026",
  },
  {
    admissionId: "NSA-26089",
    name: "Diya Sharma",
    className: "Class 9",
    section: "C",
    accessArea: "Learning Lab",
    status: "Active",
    accessDate: "24 Aug 2026",
  },
  {
    admissionId: "NSA-26103",
    name: "Kabir Rao",
    className: "Class 11",
    section: "A",
    accessArea: "Exam Prep Portal",
    status: "Scheduled",
    accessDate: "Starts 14 Sep 2026",
  },
  {
    admissionId: "NSA-26128",
    name: "Meera Joshi",
    className: "Class 6",
    section: "B",
    accessArea: "Digital Library",
    status: "Active",
    accessDate: "29 Aug 2026",
  },
];

export function StudentEarlyAccessPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const visibleStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return earlyAccessStudents.filter((student) => {
      const matchesSearch =
        !query ||
        `${student.name} ${student.admissionId} ${student.className} ${student.accessArea}`
          .toLowerCase()
          .includes(query);
      const matchesStatus =
        statusFilter === "all" || student.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <section className="attendance-page early-access-page">
      <header className="attendance-page-header">
        <div>
          <span className="attendance-eyebrow">Student hub · Demo data</span>
          <h1>Early Access</h1>
        </div>
        <div className="attendance-date-chip early-access-year-chip">
          <IconCalendarEvent aria-hidden="true" size={17} stroke={1.8} />
          <span>
            <strong>Academic year</strong>
            <small>2026–27</small>
          </span>
        </div>
      </header>

      <section
        aria-labelledby="early-access-roster-title"
        className="leaves-card"
      >
        <div className="leaves-card-header early-access-card-header">
          <h2 id="early-access-roster-title">Access roster</h2>
          <div className="early-access-controls">
            <label className="school-search-wrap early-access-search">
              <IconSearch aria-hidden="true" size={15} stroke={1.8} />
              <input
                aria-label="Search early access students"
                className="school-search-input"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Student, class or access area"
                value={search}
              />
            </label>
            <select
              aria-label="Filter by access status"
              className="school-select early-access-filter"
              onChange={(event) => setStatusFilter(event.target.value)}
              value={statusFilter}
            >
              <option value="all">All statuses</option>
              <option value="Active">Active</option>
              <option value="Invitation pending">Invitation pending</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
        </div>
        <div className="early-access-table-wrap">
          <table className="early-access-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class & section</th>
                <th>Access area</th>
                <th>Status</th>
                <th>Access date</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map((student) => (
                <tr key={student.admissionId}>
                  <td>
                    <span className="early-access-student">
                      <strong>{student.name}</strong>
                      <small>{student.admissionId}</small>
                    </span>
                  </td>
                  <td>
                    <strong className="early-access-class">
                      {student.className}
                    </strong>
                    <small className="early-access-section">
                      Section {student.section}
                    </small>
                  </td>
                  <td className="early-access-area">{student.accessArea}</td>
                  <td>
                    <span
                      className={`early-access-status ${student.status === "Active" ? "is-active" : student.status === "Scheduled" ? "is-scheduled" : "is-pending"}`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="early-access-date">{student.accessDate}</td>
                </tr>
              ))}
              {visibleStudents.length === 0 ? (
                <tr>
                  <td className="early-access-empty" colSpan={5}>
                    No students match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <footer className="early-access-table-footer">
          Showing {visibleStudents.length} of {earlyAccessStudents.length}{" "}
          students
        </footer>
      </section>
    </section>
  );
}
