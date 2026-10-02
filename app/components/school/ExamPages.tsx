import {
  IconCalendarEvent,
  IconChevronDown,
  IconCheck,
  IconDownload,
  IconFileSpreadsheet,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

type ExamStatus = "Scheduled" | "In progress" | "Completed";
type ExamRecord = {
  id: number;
  name: string;
  term: string;
  subject: string;
  grades: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ExamStatus;
};

const halfYearlyClasses = [
  {
    grade: "Class 9",
    subjects: ["English", "Mathematics", "Science", "Social Science"],
  },
  {
    grade: "Class 10",
    subjects: ["English", "Mathematics", "Science", "Social Science"],
  },
  {
    grade: "Class 11",
    subjects: ["English", "Physics", "Chemistry", "Biology"],
  },
  {
    grade: "Class 12",
    subjects: ["English", "Physics", "Chemistry"],
  },
];

const halfYearlyPapers = halfYearlyClasses.flatMap(
  ({ grade, subjects }, classIndex) =>
    subjects.map((subject, subjectIndex) => ({
      id: 100 + classIndex * 10 + subjectIndex,
      name: "Half-yearly Examination",
      term: "Term 1",
      subject,
      grades: grade,
      date: `2026-09-${String(14 + subjectIndex * 2).padStart(2, "0")}`,
      startTime: "09:00",
      endTime: "12:00",
      status: "In progress" as const,
    })),
);

const annualSubjectSets = {
  primary: [
    "English",
    "Hindi",
    "Mathematics",
    "EVS",
    "Computer",
    "General Knowledge",
    "Art",
    "Music",
  ],
  upperPrimary: [
    "English",
    "Hindi",
    "Mathematics",
    "EVS",
    "Computer",
    "Social Studies",
    "Art",
    "General Knowledge",
  ],
  middle: [
    "English",
    "Hindi",
    "Mathematics",
    "Science",
    "Social Science",
    "Sanskrit",
    "Computer",
    "Art",
  ],
};

const annualPapers = Array.from({ length: 8 }, (_, index) => index + 1).flatMap(
  (classNumber) => {
    const subjects =
      classNumber <= 2
        ? annualSubjectSets.primary
        : classNumber <= 5
          ? annualSubjectSets.upperPrimary
          : annualSubjectSets.middle;
    return subjects.map((subject, subjectIndex) => ({
      id: 1000 + classNumber * 10 + subjectIndex,
      name: "Annual Examination",
      term: "Term 2",
      subject,
      grades: `Class ${classNumber}`,
      date: `2027-03-${String(8 + subjectIndex * 2).padStart(2, "0")}`,
      startTime: "09:00",
      endTime: classNumber <= 2 ? "10:30" : "12:00",
      status: "Scheduled" as const,
    }));
  },
);

const initialExams: ExamRecord[] = [
  {
    id: 1,
    name: "Periodic Assessment 1",
    term: "Term 1",
    subject: "Hindi",
    grades: "Class 6",
    date: "2026-07-20",
    startTime: "09:00",
    endTime: "10:30",
    status: "Completed",
  },
  ...halfYearlyPapers,
  {
    id: 2,
    name: "Periodic Assessment 2",
    term: "Term 1",
    subject: "English",
    grades: "Class 4",
    date: "2026-10-05",
    startTime: "09:00",
    endTime: "10:30",
    status: "Scheduled",
  },
  {
    id: 3,
    name: "Unit Test 2",
    term: "Term 1",
    subject: "Mathematics",
    grades: "Class 2",
    date: "2026-10-12",
    startTime: "08:30",
    endTime: "10:00",
    status: "Scheduled",
  },
  {
    id: 4,
    name: "Pre-board Examination 1",
    term: "Term 2",
    subject: "Physics",
    grades: "Class 12",
    date: "2026-12-07",
    startTime: "09:00",
    endTime: "12:00",
    status: "Scheduled",
  },
  ...annualPapers,
];

const students = [
  { id: "01", name: "Aarav Mehta", admission: "NSA-24081", marks: "72" },
  { id: "02", name: "Aanya Kapoor", admission: "NSA-24094", marks: "76" },
  { id: "03", name: "Aditya Nair", admission: "NSA-24102", marks: "64" },
  { id: "04", name: "Ananya Rao", admission: "NSA-24118", marks: "" },
  { id: "05", name: "Arjun Malhotra", admission: "NSA-24126", marks: "69" },
  { id: "06", name: "Diya Sharma", admission: "NSA-24139", marks: "78" },
  { id: "07", name: "Ishaan Gupta", admission: "NSA-24151", marks: "58" },
  { id: "08", name: "Kabir Khanna", admission: "NSA-24167", marks: "71" },
];

function PageHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="exam-page-heading">
      <h1>{title}</h1>
      {action}
    </div>
  );
}

function statusClass(status: ExamStatus) {
  if (status === "Completed") return "completed";
  if (status === "In progress") return "in-progress";
  return "scheduled";
}

function formatExamDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return {
    day: new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(date),
    date: date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
}

function formatExamTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function examDuration(start: string, end: string) {
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);
  const totalMinutes =
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return [
    hours ? `${hours} hr${hours === 1 ? "" : "s"}` : "",
    minutes ? `${minutes} min` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function DownloadButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="school-button school-button-secondary"
      onClick={onClick}
      type="button"
    >
      <IconDownload size={15} stroke={1.8} />
      Export
    </button>
  );
}

export function ExamSchedulePage() {
  const [exams, setExams] = useState(initialExams);
  const [activeFilter, setActiveFilter] = useState("All exams");
  const [activeTerm, setActiveTerm] = useState("All terms");
  const [activeClass, setActiveClass] = useState("All classes");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [expandedExams, setExpandedExams] = useState([
    "Term 1::Half-yearly Examination",
  ]);
  const [expandedClasses, setExpandedClasses] = useState([
    "Term 1::Half-yearly Examination::Class 10",
  ]);

  const availableTerms = useMemo(
    () => [...new Set(exams.map((exam) => exam.term))].sort(),
    [exams],
  );
  const availableClasses = useMemo(
    () =>
      [...new Set(exams.map((exam) => exam.grades))].sort((a, b) =>
        a.localeCompare(b, "en", { numeric: true }),
      ),
    [exams],
  );

  const filteredExams = useMemo(() => {
    const query = search.trim().toLowerCase();
    return exams.filter((exam) => {
      const matchesFilter =
        activeFilter === "All exams" || exam.status === activeFilter;
      const matchesTerm =
        activeTerm === "All terms" || exam.term === activeTerm;
      const matchesClass =
        activeClass === "All classes" || exam.grades === activeClass;
      const matchesSearch =
        !query ||
        `${exam.name} ${exam.term} ${exam.subject} ${exam.grades} ${exam.date}`
          .toLowerCase()
          .includes(query);
      return matchesFilter && matchesTerm && matchesClass && matchesSearch;
    });
  }, [activeClass, activeFilter, activeTerm, exams, search]);

  const termGroups = useMemo(() => {
    const terms = new Map<string, Map<string, ExamRecord[]>>();
    for (const exam of filteredExams) {
      const term = terms.get(exam.term) ?? new Map<string, ExamRecord[]>();
      const papers = term.get(exam.name) ?? [];
      papers.push(exam);
      term.set(exam.name, papers);
      terms.set(exam.term, term);
    }

    return [...terms.entries()].map(([term, examMap]) => ({
      term,
      exams: [...examMap.entries()].map(([name, papers]) => {
        const sortedPapers = [...papers].sort((a, b) =>
          a.date.localeCompare(b.date),
        );
        const classes = [...new Set(sortedPapers.map((paper) => paper.grades))]
          .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
          .map((grade) => ({
            grade,
            papers: sortedPapers.filter((paper) => paper.grades === grade),
          }));
        return { name, papers: sortedPapers, classes };
      }),
    }));
  }, [filteredExams]);

  function addExam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("exam-name") ?? "").trim();
    const subject = String(data.get("exam-subject") ?? "");
    const date = String(data.get("exam-date") ?? "");
    const startTime = String(data.get("exam-start-time") ?? "");
    const endTime = String(data.get("exam-end-time") ?? "");
    if (
      !name ||
      !subject ||
      !date ||
      !startTime ||
      !endTime ||
      endTime <= startTime
    )
      return;
    setExams((current) => [
      {
        id: Date.now(),
        name,
        term: String(data.get("exam-term") ?? "Term 1"),
        subject,
        grades: String(data.get("exam-grades") ?? "Class 10"),
        date,
        startTime,
        endTime,
        status: "Scheduled",
      },
      ...current,
    ]);
    event.currentTarget.reset();
    setShowCreate(false);
    setActiveFilter("All exams");
    setActiveTerm("All terms");
    setActiveClass("All classes");
  }

  function exportExams() {
    const csv = [
      [
        "Exam",
        "Term",
        "Subject",
        "Class",
        "Date",
        "Start time",
        "End time",
        "Duration",
        "Status",
      ],
      ...filteredExams.map((exam) => [
        exam.name,
        exam.term,
        exam.subject,
        exam.grades,
        formatExamDate(exam.date).date,
        formatExamTime(exam.startTime),
        formatExamTime(exam.endTime),
        examDuration(exam.startTime, exam.endTime),
        exam.status,
      ]),
    ]
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "northstar-exam-schedule.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="exam-page">
      <PageHeading
        title="Exam Schedule"
        action={
          <button
            aria-expanded={showCreate}
            className="school-button school-button-primary"
            onClick={() => setShowCreate((visible) => !visible)}
            type="button"
          >
            <IconPlus size={15} stroke={2} />
            Add exam
          </button>
        }
      />

      <p className="exam-schedule-description">
        Academic year 2026–27 · Subject-wise dates, paper timings and duration
      </p>

      {showCreate ? (
        <form className="school-create-panel" onSubmit={addExam}>
          <h2>New examination</h2>
          <div className="school-form-grid">
            <div className="school-field">
              <label htmlFor="exam-name">Examination name</label>
              <input
                className="school-input"
                id="exam-name"
                name="exam-name"
                placeholder="e.g. Unit Test 3"
                required
              />
            </div>
            <div className="school-field">
              <label htmlFor="exam-term">Term</label>
              <select className="school-select" id="exam-term" name="exam-term">
                <option>Term 1</option>
                <option>Term 2</option>
              </select>
            </div>
            <div className="school-field">
              <label htmlFor="exam-subject">Subject</label>
              <select
                className="school-select"
                id="exam-subject"
                name="exam-subject"
              >
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
                <option>Hindi</option>
                <option>Social Science</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
              </select>
            </div>
            <div className="school-field">
              <label htmlFor="exam-grades">Class</label>
              <select
                className="school-select"
                id="exam-grades"
                name="exam-grades"
              >
                {Array.from(
                  { length: 12 },
                  (_, index) => `Class ${index + 1}`,
                ).map((grade) => (
                  <option key={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div className="school-field">
              <label htmlFor="exam-date">Exam date</label>
              <input
                className="school-input"
                id="exam-date"
                name="exam-date"
                type="date"
                required
              />
            </div>
            <div className="school-field">
              <label htmlFor="exam-start-time">Start time</label>
              <input
                className="school-input"
                id="exam-start-time"
                name="exam-start-time"
                type="time"
                defaultValue="09:00"
                required
              />
            </div>
            <div className="school-field">
              <label htmlFor="exam-end-time">End time</label>
              <input
                className="school-input"
                id="exam-end-time"
                name="exam-end-time"
                type="time"
                defaultValue="12:00"
                required
              />
            </div>
          </div>
          <div className="school-form-actions">
            <button
              className="school-button school-button-secondary"
              onClick={() => setShowCreate(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="school-button school-button-primary"
              type="submit"
            >
              Create exam
            </button>
          </div>
        </form>
      ) : null}

      <div className="schedule-filter-row">
        <label className="school-field schedule-select-field">
          <span>Term</span>
          <select
            className="school-select"
            onChange={(event) => setActiveTerm(event.target.value)}
            value={activeTerm}
          >
            <option>All terms</option>
            {availableTerms.map((term) => (
              <option key={term}>{term}</option>
            ))}
          </select>
        </label>
        <label className="school-field schedule-select-field">
          <span>Class</span>
          <select
            className="school-select"
            onChange={(event) => setActiveClass(event.target.value)}
            value={activeClass}
          >
            <option>All classes</option>
            {availableClasses.map((grade) => (
              <option key={grade}>{grade}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="exam-toolbar">
        <div
          aria-label="Filter examinations"
          className="school-filter-tabs"
          role="group"
        >
          {["All exams", "Scheduled", "In progress", "Completed"].map(
            (filter) => (
              <button
                aria-pressed={activeFilter === filter}
                className="school-filter-tab"
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ),
          )}
        </div>
        <label className="school-search-wrap">
          <IconSearch aria-hidden="true" size={15} stroke={1.8} />
          <input
            aria-label="Search exams, classes or subjects"
            className="school-search-input"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search exam, class or subject"
            value={search}
          />
        </label>
      </div>

      <div className="schedule-term-list">
        {termGroups.map((termGroup) => {
          const termPaperCount = termGroup.exams.reduce(
            (total, exam) => total + exam.papers.length,
            0,
          );
          const termClasses = new Set(
            termGroup.exams.flatMap((exam) =>
              exam.classes.map(({ grade }) => grade),
            ),
          );
          return (
            <section className="schedule-term-section" key={termGroup.term}>
              <div className="schedule-term-heading">
                <div>
                  <span className="schedule-eyebrow">Academic term</span>
                  <h2>{termGroup.term}</h2>
                </div>
                <span>
                  {termPaperCount} papers <span aria-hidden="true">·</span>{" "}
                  {termClasses.size} classes
                </span>
              </div>

              <div className="schedule-exam-list">
                {termGroup.exams.map((examGroup) => {
                  const examKey = `${termGroup.term}::${examGroup.name}`;
                  const examExpanded = expandedExams.includes(examKey);
                  return (
                    <article className="schedule-exam-card" key={examKey}>
                      <button
                        aria-expanded={examExpanded}
                        className="schedule-exam-trigger"
                        onClick={() =>
                          setExpandedExams((current) =>
                            examExpanded
                              ? current.filter((item) => item !== examKey)
                              : [...current, examKey],
                          )
                        }
                        type="button"
                      >
                        <span
                          className={`schedule-chevron${examExpanded ? " is-expanded" : ""}`}
                        >
                          <IconChevronDown size={16} stroke={1.8} />
                        </span>
                        <span className="schedule-exam-title">
                          <strong>{examGroup.name}</strong>
                          <span>
                            {examGroup.classes.length} classes ·{" "}
                            {examGroup.papers.length} papers
                          </span>
                        </span>
                        <span
                          className={`school-status ${statusClass(examGroup.papers[0].status)}`}
                        >
                          {examGroup.papers[0].status}
                        </span>
                      </button>

                      {examExpanded ? (
                        <div className="schedule-class-list">
                          {examGroup.classes.map((classGroup) => {
                            const classKey = `${examKey}::${classGroup.grade}`;
                            const classExpanded =
                              expandedClasses.includes(classKey);
                            return (
                              <section
                                className="schedule-class-card"
                                key={classKey}
                              >
                                <button
                                  aria-expanded={classExpanded}
                                  className="schedule-class-trigger"
                                  onClick={() =>
                                    setExpandedClasses((current) =>
                                      classExpanded
                                        ? current.filter(
                                            (item) => item !== classKey,
                                          )
                                        : [...current, classKey],
                                    )
                                  }
                                  type="button"
                                >
                                  <span
                                    className={`schedule-chevron${classExpanded ? " is-expanded" : ""}`}
                                  >
                                    <IconChevronDown size={14} stroke={1.8} />
                                  </span>
                                  <strong>{classGroup.grade}</strong>
                                  <span>{classGroup.papers.length} papers</span>
                                </button>

                                {classExpanded ? (
                                  <div className="schedule-paper-list">
                                    <div className="schedule-paper-header">
                                      <span>Subject</span>
                                      <span>Date</span>
                                      <span>Exam timing</span>
                                      <span>Status</span>
                                    </div>
                                    {classGroup.papers.map((paper) => {
                                      const examDate = formatExamDate(
                                        paper.date,
                                      );
                                      return (
                                        <div
                                          className="schedule-paper-row"
                                          key={paper.id}
                                        >
                                          <strong>{paper.subject}</strong>
                                          <span className="schedule-paper-date">
                                            {examDate.date}
                                            <small>{examDate.day}</small>
                                          </span>
                                          <span className="schedule-paper-time">
                                            {formatExamTime(paper.startTime)} –{" "}
                                            {formatExamTime(paper.endTime)}
                                            <small>
                                              {examDuration(
                                                paper.startTime,
                                                paper.endTime,
                                              )}{" "}
                                              paper
                                            </small>
                                          </span>
                                          <span
                                            className={`school-status ${statusClass(paper.status)}`}
                                          >
                                            {paper.status}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : null}
                              </section>
                            );
                          })}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
        {termGroups.length === 0 ? (
          <div className="school-empty-state schedule-empty-state">
            No papers match these filters.
          </div>
        ) : null}
      </div>
      <div className="exam-table-footer">
        <span>
          {filteredExams.length} papers across {termGroups.length} terms
        </span>
        <DownloadButton onClick={exportExams} />
      </div>
    </section>
  );
}

export function OfflineMarksPage() {
  const [selectedExam, setSelectedExam] = useState("Half-yearly Examination");
  const [selectedClass, setSelectedClass] = useState("Class 10");
  const [selectedSection, setSelectedSection] = useState("A");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [marks, setMarks] = useState<Record<string, string>>(
    Object.fromEntries(students.map((student) => [student.id, student.marks])),
  );
  const [absentStudents, setAbsentStudents] = useState<string[]>(["04"]);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(true);

  function updateMarks(id: string, value: string) {
    setMarks((current) => ({ ...current, [id]: value }));
    setSaved(false);
  }

  function toggleAbsent(id: string) {
    const willBeAbsent = !absentStudents.includes(id);
    setAbsentStudents((current) =>
      willBeAbsent
        ? [...current, id]
        : current.filter((studentId) => studentId !== id),
    );
    if (willBeAbsent) setMarks((current) => ({ ...current, [id]: "" }));
    setSaved(false);
  }

  function saveMarks() {
    setSaved(true);
    setEditing(false);
  }

  return (
    <section className="exam-page">
      <PageHeading
        title="Offline Marks Entry"
        action={
          <div className="school-heading-actions">
            <button
              className="school-button school-button-secondary"
              onClick={() => setEditing((current) => !current)}
              type="button"
            >
              {editing ? "Review marks" : "Edit marks"}
            </button>
            <button
              className="school-button school-button-primary"
              disabled={!editing}
              onClick={saveMarks}
              type="button"
            >
              <IconCheck size={15} stroke={2} /> Save marks
            </button>
          </div>
        }
      />

      <div className="marks-toolbar">
        <div className="marks-selectors">
          <div className="school-field">
            <label htmlFor="marks-exam">Examination</label>
            <select
              className="school-select"
              id="marks-exam"
              onChange={(event) => setSelectedExam(event.target.value)}
              value={selectedExam}
            >
              <option>Half-yearly Examination</option>
              <option>Periodic Assessment 2</option>
              <option>Unit Test 2</option>
            </select>
          </div>
          <div className="school-field">
            <label htmlFor="marks-class">Class</label>
            <select
              className="school-select"
              id="marks-class"
              onChange={(event) => setSelectedClass(event.target.value)}
              value={selectedClass}
            >
              {["Class 9", "Class 10", "Class 11", "Class 12"].map((grade) => (
                <option key={grade}>{grade}</option>
              ))}
            </select>
          </div>
          <div className="school-field">
            <label htmlFor="marks-section">Section</label>
            <select
              className="school-select"
              id="marks-section"
              onChange={(event) => setSelectedSection(event.target.value)}
              value={selectedSection}
            >
              {["A", "B", "C"].map((section) => (
                <option key={section}>{section}</option>
              ))}
            </select>
          </div>
          <div className="school-field">
            <label htmlFor="marks-subject">Subject</label>
            <select
              className="school-select"
              id="marks-subject"
              onChange={(event) => setSelectedSubject(event.target.value)}
              value={selectedSubject}
            >
              {[
                "Mathematics",
                "English",
                "Science",
                "Social Science",
                "Hindi",
              ].map((subject) => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="marks-save-area">
          {saved ? (
            <span aria-live="polite" className="marks-saved-label">
              <IconCheck size={13} /> Saved
            </span>
          ) : null}
          <span className="marks-max-label">
            Maximum marks <strong>80</strong>
          </span>
        </div>
      </div>

      <div className="marks-register-heading">
        <div className="marks-register-title">
          <IconFileSpreadsheet aria-hidden="true" size={16} stroke={1.8} />
          <span>
            {selectedClass} – Section {selectedSection}
          </span>
        </div>
        <span className="marks-subject-name">{selectedSubject}</span>
      </div>

      <div className="school-table-frame">
        <table className="school-data-table marks-table">
          <thead>
            <tr>
              <th>Roll no.</th>
              <th>Student</th>
              <th>Admission no.</th>
              <th>Marks / 80</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const isAbsent = absentStudents.includes(student.id);
              return (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>
                    <div className="student-cell">
                      <span aria-hidden="true" className="student-initials">
                        {student.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </span>
                      <span className="student-name">{student.name}</span>
                    </div>
                  </td>
                  <td>{student.admission}</td>
                  <td>
                    <input
                      aria-label={`Marks for ${student.name} out of 80`}
                      className="mark-input"
                      disabled={!editing || isAbsent}
                      max="80"
                      min="0"
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === "" || Number(value) <= 80)
                          updateMarks(student.id, value);
                      }}
                      type="number"
                      value={isAbsent ? "" : marks[student.id]}
                    />
                  </td>
                  <td>
                    <button
                      aria-label={`${isAbsent ? "Mark present" : "Mark absent"}: ${student.name}`}
                      className={`attendance-toggle${isAbsent ? " is-absent" : ""}`}
                      disabled={!editing}
                      onClick={() => toggleAbsent(student.id)}
                      type="button"
                    >
                      <span className="attendance-toggle-dot" />
                      {isAbsent ? "Absent" : "Present"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="marks-register-footer">
        <span>
          {students.length} students{" "}
          <span className="marks-footer-divider">·</span>{" "}
          {absentStudents.length} absent
        </span>
        <div className="marks-footer-right">
          <span>Draft marks</span>
          <IconCalendarEvent aria-hidden="true" size={14} stroke={1.8} />
        </div>
      </div>
    </section>
  );
}
