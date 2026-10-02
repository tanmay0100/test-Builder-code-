import {
  IconCalendarEvent,
  IconChartBar,
  IconSearch,
  IconUsers,
  IconUserX,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

type LeaveRecord = {
  id: string;
  studentName: string;
  studentId: string;
  className: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  leaveType: string;
  reason: string;
  leaveDate: string;
  returnDate: string;
  reportedAt: string;
};

const demoDay = "2026-10-01";
const classNames = Array.from(
  { length: 12 },
  (_, index) => `Class ${index + 1}`,
);
const leaveRecords: LeaveRecord[] = [
  {
    id: "LR-26001",
    studentName: "Kiara Sharma",
    studentId: "NSA-26108",
    className: "Class 1",
    section: "A",
    guardianName: "Ritu Sharma",
    guardianPhone: "+91 98765 10234",
    leaveType: "Sick leave",
    reason: "Fever and rest advised by the doctor.",
    leaveDate: demoDay,
    returnDate: demoDay,
    reportedAt: "07:42 AM",
  },
  {
    id: "LR-26002",
    studentName: "Aarav Kapoor",
    studentId: "NSA-26014",
    className: "Class 2",
    section: "B",
    guardianName: "Neha Kapoor",
    guardianPhone: "+91 98765 20418",
    leaveType: "Family function",
    reason: "Attending a family ceremony in the city.",
    leaveDate: demoDay,
    returnDate: demoDay,
    reportedAt: "07:18 AM",
  },
  {
    id: "LR-26003",
    studentName: "Meera Nair",
    studentId: "NSA-26037",
    className: "Class 3",
    section: "A",
    guardianName: "Anjali Nair",
    guardianPhone: "+91 98765 31527",
    leaveType: "Medical appointment",
    reason: "Follow-up appointment at the children's clinic.",
    leaveDate: demoDay,
    returnDate: demoDay,
    reportedAt: "08:02 AM",
  },
  {
    id: "LR-26004",
    studentName: "Rohan Rao",
    studentId: "NSA-26061",
    className: "Class 5",
    section: "C",
    guardianName: "Kavita Rao",
    guardianPhone: "+91 98765 42639",
    leaveType: "Sick leave",
    reason: "Recovering at home after a stomach infection.",
    leaveDate: demoDay,
    returnDate: demoDay,
    reportedAt: "07:31 AM",
  },
  {
    id: "LR-26005",
    studentName: "Zoya Malhotra",
    studentId: "NSA-26083",
    className: "Class 7",
    section: "B",
    guardianName: "Amit Malhotra",
    guardianPhone: "+91 98765 53741",
    leaveType: "Family function",
    reason: "Out of station for a family event.",
    leaveDate: demoDay,
    returnDate: "2026-10-02",
    reportedAt: "06:54 AM",
  },
  {
    id: "LR-26006",
    studentName: "Vihaan Sharma",
    studentId: "NSA-26124",
    className: "Class 9",
    section: "A",
    guardianName: "Nikhil Sharma",
    guardianPhone: "+91 98765 64852",
    leaveType: "Sick leave",
    reason: "High fever; medical certificate to follow.",
    leaveDate: demoDay,
    returnDate: demoDay,
    reportedAt: "07:09 AM",
  },
  {
    id: "LR-26007",
    studentName: "Diya Gupta",
    studentId: "NSA-26139",
    className: "Class 10",
    section: "B",
    guardianName: "Pooja Gupta",
    guardianPhone: "+91 98765 75963",
    leaveType: "Personal leave",
    reason: "Family travel planned before the term begins.",
    leaveDate: demoDay,
    returnDate: "2026-10-02",
    reportedAt: "07:51 AM",
  },
  {
    id: "LR-26008",
    studentName: "Kabir Khanna",
    studentId: "NSA-26157",
    className: "Class 12",
    section: "A",
    guardianName: "Sonal Khanna",
    guardianPhone: "+91 98765 86074",
    leaveType: "Competition",
    reason: "Representing the school at an inter-school debate.",
    leaveDate: demoDay,
    returnDate: demoDay,
    reportedAt: "06:38 AM",
  },
  {
    id: "LR-26009",
    studentName: "Ishaan Verma",
    studentId: "NSA-26171",
    className: "Class 4",
    section: "C",
    guardianName: "Rahul Verma",
    guardianPhone: "+91 98765 97185",
    leaveType: "Sick leave",
    reason: "Cold and cough; parent has requested one day of rest.",
    leaveDate: "2026-10-02",
    returnDate: "2026-10-02",
    reportedAt: "08:14 AM",
  },
  {
    id: "LR-26010",
    studentName: "Saanvi Patel",
    studentId: "NSA-26189",
    className: "Class 8",
    section: "A",
    guardianName: "Mihir Patel",
    guardianPhone: "+91 98765 18296",
    leaveType: "Medical appointment",
    reason: "Dental appointment scheduled in the morning.",
    leaveDate: "2026-10-02",
    returnDate: "2026-10-02",
    reportedAt: "07:26 AM",
  },
];

function formatLeaveDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${value}T12:00:00+05:30`));
}

export function StudentDailyLeavesPage() {
  const [date, setDate] = useState(demoDay);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const dayRecords = leaveRecords.filter((record) => record.leaveDate === date);
  const query = search.trim().toLowerCase();
  const visibleRecords = dayRecords.filter((record) => {
    const matchesClass =
      classFilter === "all" || record.className === classFilter;
    const matchesSearch =
      !query ||
      [
        record.studentName,
        record.studentId,
        record.className,
        record.section,
        record.guardianName,
        record.leaveType,
        record.reason,
      ].some((value) => value.toLowerCase().includes(query));
    return matchesClass && matchesSearch;
  });

  const classSummary = classNames.map((className) => ({
    className,
    count: dayRecords.filter((record) => record.className === className).length,
  }));
  const classesAffected = classSummary.filter((item) => item.count > 0).length;
  const medicalCount = dayRecords.filter((record) =>
    /sick|medical/i.test(record.leaveType),
  ).length;
  const otherCount = dayRecords.length - medicalCount;
  const maxClassCount = Math.max(...classSummary.map((item) => item.count), 1);
  const reasonSummary = Object.entries(
    dayRecords.reduce<Record<string, number>>((totals, record) => {
      totals[record.leaveType] = (totals[record.leaveType] ?? 0) + 1;
      return totals;
    }, {}),
  ).sort((first, second) => second[1] - first[1]);
  const selectedRecord = leaveRecords.find(
    (record) => record.id === selectedRecordId,
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedRecord && !dialog.open) dialog.showModal();
    if (!selectedRecord && dialog.open) dialog.close();
  }, [selectedRecord]);

  const closeDetails = () => setSelectedRecordId(null);

  return (
    <section className="attendance-page leaves-page">
      <header className="attendance-page-header leaves-page-header">
        <div>
          <span className="attendance-eyebrow">Student hub · Demo data</span>
          <h1>Student Daily Leaves</h1>
          <p>See which students are away today, by class and reason.</p>
        </div>
        <label className="leaves-date-chip">
          <IconCalendarEvent aria-hidden="true" size={18} stroke={1.8} />
          <span>
            <strong>Overview date</strong>
            <input
              aria-label="Select overview date"
              onChange={(event) => setDate(event.target.value)}
              type="date"
              value={date}
            />
          </span>
        </label>
      </header>

      <div className="attendance-summary-grid leaves-summary-grid">
        <article className="attendance-summary-card is-absent">
          <span className="attendance-summary-icon">
            <IconUserX aria-hidden="true" size={18} stroke={1.8} />
          </span>
          <span className="attendance-summary-label">Students on leave</span>
          <strong>{dayRecords.length}</strong>
          <small>{formatLeaveDate(date)}</small>
        </article>
        <article className="attendance-summary-card">
          <span className="attendance-summary-icon">
            <IconUsers aria-hidden="true" size={18} stroke={1.8} />
          </span>
          <span className="attendance-summary-label">Classes affected</span>
          <strong>{classesAffected}</strong>
          <small>Of {classNames.length} classes</small>
        </article>
        <article className="attendance-summary-card is-present">
          <span className="attendance-summary-icon">
            <IconCalendarEvent aria-hidden="true" size={18} stroke={1.8} />
          </span>
          <span className="attendance-summary-label">Sick / medical</span>
          <strong>{medicalCount}</strong>
          <small>Health-related leaves</small>
        </article>
        <article className="attendance-summary-card is-overall">
          <span className="attendance-summary-icon">
            <IconChartBar aria-hidden="true" size={18} stroke={1.8} />
          </span>
          <span className="attendance-summary-label">Other reasons</span>
          <strong>{otherCount}</strong>
          <small>Family, personal and school events</small>
        </article>
      </div>

      <div className="leaves-insight-grid">
        <section
          aria-labelledby="leaves-class-overview-title"
          className="leaves-card"
        >
          <div className="leaves-card-header">
            <div>
              <h2 id="leaves-class-overview-title">Class-wise overview</h2>
              <p>Select a class to see its students on leave.</p>
            </div>
            {classFilter !== "all" ? (
              <button
                className="leaves-clear-filter"
                onClick={() => setClassFilter("all")}
                type="button"
              >
                Show all classes
              </button>
            ) : null}
          </div>
          <div className="leaves-class-grid">
            {classSummary.map((item) => (
              <button
                aria-pressed={classFilter === item.className}
                className={`leaves-class-card${classFilter === item.className ? " is-selected" : ""}`}
                key={item.className}
                onClick={() =>
                  setClassFilter((current) =>
                    current === item.className ? "all" : item.className,
                  )
                }
                type="button"
              >
                <span className="leaves-class-card-top">
                  <strong>{item.className}</strong>
                  <strong>{item.count}</strong>
                </span>
                <span className="leaves-class-meter">
                  <i
                    style={{
                      width: `${(item.count / maxClassCount) * 100}%`,
                    }}
                  />
                </span>
                <small>
                  {item.count === 1 ? "student away" : "students away"}
                </small>
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="leaves-reasons-title" className="leaves-card">
          <div className="leaves-card-header">
            <div>
              <h2 id="leaves-reasons-title">Reasons reported</h2>
              <p>Breakdown of today’s leave records.</p>
            </div>
            <span className="leaves-reason-total">
              {dayRecords.length} total
            </span>
          </div>
          {reasonSummary.length > 0 ? (
            <div className="leaves-reason-list">
              {reasonSummary.map(([reason, count]) => (
                <div className="leaves-reason-item" key={reason}>
                  <div>
                    <strong>{reason}</strong>
                    <span>{count}</span>
                  </div>
                  <span className="leaves-reason-meter">
                    <i
                      style={{ width: `${(count / dayRecords.length) * 100}%` }}
                    />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="leaves-no-reasons">No leave records for this date.</p>
          )}
        </section>
      </div>

      <section aria-labelledby="leave-register-title" className="leaves-card">
        <div className="leaves-card-header leaves-register-header">
          <div>
            <h2 id="leave-register-title">Students on leave</h2>
            <p>Daily register for the selected date.</p>
          </div>
          <div className="leaves-filter-row">
            <label className="school-search-wrap leaves-search">
              <IconSearch aria-hidden="true" size={15} stroke={1.8} />
              <input
                aria-label="Search leave records"
                className="school-search-input"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Student, ID or reason"
                value={search}
              />
            </label>
            <select
              aria-label="Filter by class"
              className="school-select leaves-filter"
              onChange={(event) => setClassFilter(event.target.value)}
              value={classFilter}
            >
              <option value="all">All classes</option>
              {classNames.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="leaves-table-wrap">
          <table className="leaves-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Leave dates</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <button
                      className="leaves-student-link"
                      onClick={() => setSelectedRecordId(record.id)}
                      type="button"
                    >
                      <span>{record.studentName.slice(0, 1)}</span>
                      <span>
                        <strong>{record.studentName}</strong>
                        <small>{record.studentId}</small>
                      </span>
                    </button>
                  </td>
                  <td>
                    <strong className="leaves-class-label">
                      {record.className}
                    </strong>
                    <small className="leaves-section-label">
                      Section {record.section}
                    </small>
                  </td>
                  <td>
                    <strong className="leaves-date-label">
                      {formatLeaveDate(record.leaveDate)}
                    </strong>
                    <small className="leaves-section-label">
                      {record.returnDate === record.leaveDate
                        ? "1 day"
                        : `Until ${formatLeaveDate(record.returnDate)}`}{" "}
                      · Reported {record.reportedAt}
                    </small>
                  </td>
                  <td className="leaves-reason-cell">
                    <strong>{record.leaveType}</strong>
                    <small>{record.reason}</small>
                  </td>
                </tr>
              ))}
              {visibleRecords.length === 0 ? (
                <tr>
                  <td className="leaves-empty-state" colSpan={4}>
                    No leave records match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <footer className="leaves-table-footer">
          <span>
            Showing {visibleRecords.length} of {dayRecords.length} students
          </span>
          <span>Leave records · Demo data</span>
        </footer>
      </section>

      <dialog
        aria-labelledby="leave-details-title"
        className="leaves-details-dialog"
        onCancel={(event) => {
          event.preventDefault();
          closeDetails();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDetails();
        }}
        ref={dialogRef}
      >
        {selectedRecord ? (
          <>
            <header className="leaves-dialog-header">
              <div>
                <span className="attendance-eyebrow">
                  {selectedRecord.id} · {selectedRecord.className} · Section{" "}
                  {selectedRecord.section}
                </span>
                <h2 id="leave-details-title">{selectedRecord.studentName}</h2>
                <p>Student ID {selectedRecord.studentId}</p>
              </div>
              <button
                aria-label="Close leave details"
                className="attendance-dialog-close"
                onClick={closeDetails}
                type="button"
              >
                <IconX aria-hidden="true" size={18} />
              </button>
            </header>
            <div className="leaves-detail-content">
              <div className="leaves-detail-grid">
                <div>
                  <span>Leave type</span>
                  <strong>{selectedRecord.leaveType}</strong>
                </div>
                <div>
                  <span>Leave dates</span>
                  <strong>
                    {formatLeaveDate(selectedRecord.leaveDate)}
                    {selectedRecord.returnDate !== selectedRecord.leaveDate
                      ? ` – ${formatLeaveDate(selectedRecord.returnDate)}`
                      : " · 1 day"}
                  </strong>
                </div>
                <div>
                  <span>Parent / guardian</span>
                  <strong>{selectedRecord.guardianName}</strong>
                </div>
                <div>
                  <span>Contact number</span>
                  <strong>{selectedRecord.guardianPhone}</strong>
                </div>
                <div className="leaves-detail-reason">
                  <span>Reason shared</span>
                  <p>{selectedRecord.reason}</p>
                </div>
                <div>
                  <span>Reported at</span>
                  <strong>{selectedRecord.reportedAt}</strong>
                </div>
              </div>
            </div>
            <footer className="leaves-dialog-footer">
              <span>Leave record · Demo data</span>
              <button
                className="school-button school-button-secondary"
                onClick={closeDetails}
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
