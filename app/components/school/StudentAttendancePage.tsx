import {
  IconCalendarEvent,
  IconChartBar,
  IconChevronRight,
  IconSearch,
  IconUserCheck,
  IconUserX,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";

const classAttendance = [
  { className: "Class 1", total: 72, present: 69, absent: 3 },
  { className: "Class 2", total: 68, present: 65, absent: 3 },
  { className: "Class 3", total: 74, present: 70, absent: 4 },
  { className: "Class 4", total: 70, present: 66, absent: 4 },
  { className: "Class 5", total: 76, present: 72, absent: 4 },
  { className: "Class 6", total: 80, present: 76, absent: 4 },
  { className: "Class 7", total: 78, present: 73, absent: 5 },
  { className: "Class 8", total: 82, present: 77, absent: 5 },
  { className: "Class 9", total: 84, present: 78, absent: 6 },
  { className: "Class 10", total: 80, present: 74, absent: 6 },
  { className: "Class 11", total: 74, present: 70, absent: 4 },
  { className: "Class 12", total: 72, present: 66, absent: 6 },
];

const firstNames = [
  "Aarav",
  "Aanya",
  "Aditya",
  "Ananya",
  "Arjun",
  "Diya",
  "Ishaan",
  "Kabir",
  "Kiara",
  "Meera",
  "Rohan",
  "Saanvi",
  "Vihaan",
  "Zoya",
  "Dev",
  "Myra",
  "Reyansh",
  "Tara",
];
const lastNames = [
  "Mehta",
  "Kapoor",
  "Nair",
  "Rao",
  "Malhotra",
  "Sharma",
  "Gupta",
  "Khanna",
  "Joshi",
  "Shah",
  "Iyer",
  "Bansal",
  "Verma",
  "Das",
  "Chopra",
  "Menon",
  "Singh",
  "Patel",
];

let rosterIndex = 0;
const absentStudentsByClass = new Map(
  classAttendance.map((item, classIndex) => [
    item.className,
    Array.from({ length: item.absent }, (_, absentIndex) => {
      const index = rosterIndex++;
      const firstNameIndex = index % firstNames.length;
      const lastNameIndex =
        (Math.floor(index / firstNames.length) + firstNameIndex * 5) %
        lastNames.length;
      return {
        name: `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`,
        rollNumber: String(
          ((classIndex * 3 + absentIndex * 11) % item.total) + 1,
        ).padStart(2, "0"),
        section: ["A", "B", "C"][(classIndex + absentIndex) % 3],
        admissionId: `NSA-${String(26001 + index)}`,
      };
    }),
  ]),
);

export function StudentAttendancePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const summary = classAttendance.reduce(
    (totals, item) => ({
      total: totals.total + item.total,
      present: totals.present + item.present,
      absent: totals.absent + item.absent,
    }),
    { total: 0, present: 0, absent: 0 },
  );
  const overallAttendance =
    Math.round((summary.present / summary.total) * 1000) / 10;
  const today = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const visibleClasses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return classAttendance.filter((item) => {
      const attendance = (item.present / item.total) * 100;
      const matchesSearch =
        !query || item.className.toLowerCase().includes(query);
      const matchesFilter = filter === "all" || attendance < 92;
      return matchesSearch && matchesFilter;
    });
  }, [filter, search]);
  const selectedAttendance = classAttendance.find(
    (item) => item.className === selectedClass,
  );
  const absentStudents = selectedClass
    ? (absentStudentsByClass.get(selectedClass) ?? [])
    : [];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedClass && !dialog.open) dialog.showModal();
    if (!selectedClass && dialog.open) dialog.close();
  }, [selectedClass]);

  return (
    <section className="attendance-page">
      <header className="attendance-page-header">
        <div>
          <span className="attendance-eyebrow">
            Principal overview · Demo data
          </span>
          <h1>Student Attendance</h1>
          <p>Daily attendance at a glance, across every class.</p>
        </div>
        <div className="attendance-date-chip">
          <IconCalendarEvent aria-hidden="true" size={17} stroke={1.8} />
          <span>
            <strong>Today</strong>
            <small>{today}</small>
          </span>
        </div>
      </header>

      <div className="attendance-summary-grid">
        <article className="attendance-summary-card">
          <span className="attendance-summary-icon">
            <IconUsers aria-hidden="true" size={18} stroke={1.8} />
          </span>
          <span className="attendance-summary-label">Total students</span>
          <strong>{summary.total.toLocaleString("en-IN")}</strong>
          <small>Across {classAttendance.length} classes</small>
        </article>
        <article className="attendance-summary-card is-present">
          <span className="attendance-summary-icon">
            <IconUserCheck aria-hidden="true" size={18} stroke={1.8} />
          </span>
          <span className="attendance-summary-label">Present today</span>
          <strong>{summary.present.toLocaleString("en-IN")}</strong>
          <small>{overallAttendance}% of all students</small>
        </article>
        <article className="attendance-summary-card is-absent">
          <span className="attendance-summary-icon">
            <IconUserX aria-hidden="true" size={18} stroke={1.8} />
          </span>
          <span className="attendance-summary-label">Absent today</span>
          <strong>{summary.absent.toLocaleString("en-IN")}</strong>
          <small>Across all classes</small>
        </article>
        <article className="attendance-summary-card is-overall">
          <span className="attendance-summary-icon">
            <IconChartBar aria-hidden="true" size={18} stroke={1.8} />
          </span>
          <span className="attendance-summary-label">Overall attendance</span>
          <strong>{overallAttendance}%</strong>
          <small>School-wide attendance rate</small>
        </article>
      </div>

      <section
        aria-labelledby="class-attendance-title"
        className="attendance-overview-card"
      >
        <div className="attendance-overview-header">
          <div>
            <h2 id="class-attendance-title">Class-wise overview</h2>
            <p>Select an absent count to view student details.</p>
          </div>
          <div className="attendance-overview-controls">
            <label className="school-search-wrap attendance-search">
              <IconSearch aria-hidden="true" size={15} stroke={1.8} />
              <input
                aria-label="Search classes"
                className="school-search-input"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search class"
                value={search}
              />
            </label>
            <select
              aria-label="Filter classes by attendance"
              className="school-select attendance-filter"
              onChange={(event) => setFilter(event.target.value)}
              value={filter}
            >
              <option value="all">All classes</option>
              <option value="attention">Needs attention</option>
            </select>
          </div>
        </div>

        <div className="attendance-table-wrap">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Total students</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {visibleClasses.map((item) => {
                const attendance =
                  Math.round((item.present / item.total) * 1000) / 10;
                const needsAttention = attendance < 92;
                return (
                  <tr key={item.className}>
                    <td className="attendance-class-name">{item.className}</td>
                    <td>{item.total}</td>
                    <td>
                      <span className="attendance-count is-present">
                        <IconUserCheck aria-hidden="true" size={14} />
                        {item.present}
                      </span>
                    </td>
                    <td>
                      <button
                        aria-label={`View ${item.absent} absent students in ${item.className}`}
                        className="attendance-count is-absent"
                        onClick={() => setSelectedClass(item.className)}
                        type="button"
                      >
                        <IconUserX aria-hidden="true" size={14} />
                        {item.absent}
                        <IconChevronRight aria-hidden="true" size={12} />
                      </button>
                    </td>
                    <td>
                      <div className="attendance-rate-cell">
                        <div
                          aria-label={`${attendance}% attendance`}
                          aria-valuemax={100}
                          aria-valuemin={0}
                          aria-valuenow={attendance}
                          className="attendance-progress"
                          role="progressbar"
                        >
                          <span style={{ width: `${attendance}%` }} />
                        </div>
                        <strong>{attendance}%</strong>
                        {needsAttention ? (
                          <span className="attendance-attention-badge">
                            Needs attention
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {visibleClasses.length === 0 ? (
                <tr>
                  <td className="attendance-empty-state" colSpan={5}>
                    No classes match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <footer className="attendance-table-footer">
          <span>
            Showing {visibleClasses.length} of {classAttendance.length} classes
          </span>
          <span className="attendance-footer-legend">
            <i className="is-present" /> Present
            <i className="is-absent" /> Absent
          </span>
        </footer>
      </section>

      <dialog
        aria-labelledby="absent-roster-title"
        className="attendance-absence-dialog"
        onCancel={(event) => {
          event.preventDefault();
          setSelectedClass(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedClass(null);
        }}
        ref={dialogRef}
      >
        {selectedAttendance ? (
          <>
            <header className="attendance-dialog-header">
              <div>
                <span className="attendance-eyebrow">
                  {selectedAttendance.className} · Daily attendance
                </span>
                <h2 id="absent-roster-title">Absent students</h2>
                <p>
                  {absentStudents.length} students marked absent on {today}.
                </p>
              </div>
              <button
                aria-label="Close absent students"
                className="attendance-dialog-close"
                onClick={() => setSelectedClass(null)}
                type="button"
              >
                <IconX aria-hidden="true" size={18} />
              </button>
            </header>
            <div className="attendance-dialog-table-wrap">
              <table className="attendance-dialog-table">
                <thead>
                  <tr>
                    <th>Student name</th>
                    <th>Roll no.</th>
                    <th>Section</th>
                    <th>Admission ID</th>
                  </tr>
                </thead>
                <tbody>
                  {absentStudents.map((student) => (
                    <tr key={student.admissionId}>
                      <td className="attendance-dialog-student-name">
                        <span>{student.name.slice(0, 1)}</span>
                        {student.name}
                      </td>
                      <td>{student.rollNumber}</td>
                      <td>{student.section}</td>
                      <td>{student.admissionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="attendance-dialog-footer">
              <span>Student details · Demo data</span>
              <button
                className="school-button school-button-secondary"
                onClick={() => setSelectedClass(null)}
                type="button"
              >
                Close
              </button>
            </footer>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
