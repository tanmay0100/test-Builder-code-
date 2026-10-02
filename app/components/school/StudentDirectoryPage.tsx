import {
  IconCalendarEvent,
  IconChartBar,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconUser,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";

const studentsPerClass = [72, 68, 74, 70, 76, 80, 78, 82, 84, 80, 74, 72];
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
const guardianNames = [
  "Ritu",
  "Neha",
  "Anjali",
  "Kavita",
  "Amit",
  "Nikhil",
  "Pooja",
  "Sonal",
  "Rahul",
  "Mihir",
  "Sunita",
  "Rajesh",
  "Kiran",
  "Deepa",
];
const neighborhoods = [
  "Shastri Nagar",
  "Gandhi Colony",
  "New Market Road",
  "Lake View Colony",
  "Station Road",
  "Teachers Enclave",
];

const allStudents = studentsPerClass.flatMap((total, classIndex) =>
  Array.from({ length: total }, (_, studentIndex) => {
    const index = allStudentsOffset(classIndex) + studentIndex;
    const admissionId = `NSA-${String(26001 + index)}`;
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[(index * 7 + classIndex) % lastNames.length];
    const guardianFirstName = guardianNames[index % guardianNames.length];
    const gender = index % 2 === 0 ? "Female" : "Male";
    const year = 2020 - classIndex;
    const month = String(((index * 7 + classIndex) % 12) + 1).padStart(2, "0");
    const day = String(((index * 11 + classIndex) % 28) + 1).padStart(2, "0");

    return {
      admissionId,
      name: `${firstName} ${lastName}`,
      className: `Class ${classIndex + 1}`,
      classNumber: classIndex + 1,
      section: ["A", "B", "C"][studentIndex % 3],
      rollNumber: String(Math.floor(studentIndex / 3) + 1).padStart(2, "0"),
      gender,
      dateOfBirth: `${year}-${month}-${day}`,
      guardianName: `${guardianFirstName} ${lastName}`,
      guardianRelationship: index % 2 === 0 ? "Mother" : "Father",
      guardianPhone: `+91 ${90000 + (index % 10000)} ${String(
        26000 + index,
      ).slice(-5)}`,
      guardianEmail: `parent.${admissionId.toLowerCase()}@example.com`,
      address: `Ward ${(index % 12) + 1}, ${neighborhoods[index % neighborhoods.length]}`,
    };
  }),
);

function allStudentsOffset(classIndex: number) {
  return studentsPerClass
    .slice(0, classIndex)
    .reduce((total, count) => total + count, 0);
}

const classNames = studentsPerClass.map((_, index) => `Class ${index + 1}`);
const sections = ["A", "B", "C"];
const pageSize = 15;

function formatStudentDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${value}T12:00:00+05:30`));
}

export function StudentDirectoryPage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string | null>(
    null,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allStudents.filter((student) => {
      const matchesClass =
        classFilter === "all" || student.className === classFilter;
      const matchesSection =
        sectionFilter === "all" || student.section === sectionFilter;
      const matchesGender =
        genderFilter === "all" || student.gender.toLowerCase() === genderFilter;
      const matchesSearch =
        !query ||
        [
          student.name,
          student.admissionId,
          student.className,
          student.section,
          student.rollNumber,
          student.guardianName,
          student.guardianPhone,
          student.guardianEmail,
        ].some((value) => value.toLowerCase().includes(query));
      return matchesClass && matchesSection && matchesGender && matchesSearch;
    });
  }, [classFilter, genderFilter, search, sectionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const femaleCount = filteredStudents.filter(
    (student) => student.gender === "Female",
  ).length;
  const maleCount = filteredStudents.length - femaleCount;
  const classCount = new Set(
    filteredStudents.map((student) => student.className),
  ).size;
  const sectionCount = new Set(
    filteredStudents.map(
      (student) => `${student.className}-${student.section}`,
    ),
  ).size;
  const selectedStudent = allStudents.find(
    (student) => student.admissionId === selectedAdmissionId,
  );

  useEffect(() => {
    setPage(1);
  }, [classFilter, genderFilter, search, sectionFilter]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedStudent && !dialog.open) dialog.showModal();
    if (!selectedStudent && dialog.open) dialog.close();
  }, [selectedStudent]);

  const closeDetails = () => setSelectedAdmissionId(null);

  return (
    <section className="attendance-page directory-page">
      <header className="attendance-page-header directory-page-header">
        <div>
          <span className="attendance-eyebrow">Student hub · Demo data</span>
          <h1>All Student Directory</h1>
          <p>
            Find every student across classes, sections and guardian contacts.
          </p>
        </div>
        <div className="attendance-date-chip directory-year-chip">
          <IconCalendarEvent aria-hidden="true" size={17} stroke={1.8} />
          <span>
            <strong>Academic year</strong>
            <small>2026–27</small>
          </span>
        </div>
      </header>

      <div className="attendance-summary-grid directory-summary-grid">
        <article className="attendance-summary-card">
          <span className="attendance-summary-icon">
            <IconUsers aria-hidden="true" size={18} stroke={1.8} />
          </span>
          <span className="attendance-summary-label">Students in view</span>
          <strong>{filteredStudents.length.toLocaleString("en-IN")}</strong>
          <small>Matching current filters</small>
        </article>
        <article className="attendance-summary-card is-present">
          <span className="attendance-summary-icon">
            <IconUsers aria-hidden="true" size={18} stroke={1.8} />
          </span>
          <span className="attendance-summary-label">Classes</span>
          <strong>{classCount}</strong>
          <small>With matching students</small>
        </article>
        <article className="attendance-summary-card is-overall">
          <span className="attendance-summary-icon">
            <IconUsers aria-hidden="true" size={18} stroke={1.8} />
          </span>
          <span className="attendance-summary-label">Sections</span>
          <strong>{sectionCount}</strong>
          <small>Class and section groups</small>
        </article>
        <article className="attendance-summary-card is-absent">
          <span className="attendance-summary-icon">
            <IconUsers aria-hidden="true" size={18} stroke={1.8} />
          </span>
          <span className="attendance-summary-label">Female / male</span>
          <strong className="directory-gender-count">
            {femaleCount} <i>/</i> {maleCount}
          </strong>
          <small>Gender distribution</small>
        </article>
      </div>

      <section
        aria-labelledby="student-directory-title"
        className="leaves-card"
      >
        <div className="leaves-card-header directory-card-header">
          <div>
            <h2 id="student-directory-title">Student records</h2>
            <p>
              Select a student to view their full profile and guardian details.
            </p>
          </div>
          <div className="directory-filter-row">
            <label className="school-search-wrap directory-search">
              <IconSearch aria-hidden="true" size={15} stroke={1.8} />
              <input
                aria-label="Search students and guardians"
                className="school-search-input"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, admission no. or guardian"
                value={search}
              />
            </label>
            <select
              aria-label="Filter by class"
              className="school-select directory-filter"
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
            <select
              aria-label="Filter by section"
              className="school-select directory-filter"
              onChange={(event) => setSectionFilter(event.target.value)}
              value={sectionFilter}
            >
              <option value="all">All sections</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  Section {section}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by gender"
              className="school-select directory-filter"
              onChange={(event) => setGenderFilter(event.target.value)}
              value={genderFilter}
            >
              <option value="all">All genders</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
        </div>

        <div className="directory-table-wrap">
          <table className="directory-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class & section</th>
                <th>Roll no.</th>
                <th>Gender</th>
                <th>Parent / guardian</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map((student) => (
                <tr key={student.admissionId}>
                  <td>
                    <button
                      className="directory-student-link"
                      onClick={() =>
                        setSelectedAdmissionId(student.admissionId)
                      }
                      type="button"
                    >
                      <span className="directory-student-avatar">
                        <IconUser aria-hidden="true" size={16} stroke={1.8} />
                      </span>
                      <span>
                        <strong>{student.name}</strong>
                        <small>{student.admissionId}</small>
                      </span>
                    </button>
                  </td>
                  <td>
                    <strong className="leaves-class-label">
                      {student.className}
                    </strong>
                    <small className="leaves-section-label">
                      Section {student.section}
                    </small>
                  </td>
                  <td>{student.rollNumber}</td>
                  <td>
                    <span className="directory-gender-label">
                      {student.gender}
                    </span>
                  </td>
                  <td>
                    <strong className="leaves-class-label">
                      {student.guardianName}
                    </strong>
                    <small className="leaves-section-label">
                      {student.guardianRelationship}
                    </small>
                  </td>
                  <td className="directory-contact-cell">
                    {student.guardianPhone}
                  </td>
                </tr>
              ))}
              {visibleStudents.length === 0 ? (
                <tr>
                  <td className="leaves-empty-state" colSpan={6}>
                    No students match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <footer className="directory-table-footer">
          <span>
            Showing{" "}
            {visibleStudents.length ? (currentPage - 1) * pageSize + 1 : 0}–
            {Math.min(currentPage * pageSize, filteredStudents.length)} of{" "}
            {filteredStudents.length.toLocaleString("en-IN")} students
          </span>
          <div className="directory-pagination">
            <button
              aria-label="Previous page"
              className="directory-page-button"
              disabled={currentPage === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              type="button"
            >
              <IconChevronLeft aria-hidden="true" size={15} />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              aria-label="Next page"
              className="directory-page-button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              type="button"
            >
              <IconChevronRight aria-hidden="true" size={15} />
            </button>
          </div>
        </footer>
      </section>

      <dialog
        aria-labelledby="student-profile-title"
        className="directory-details-dialog"
        onCancel={(event) => {
          event.preventDefault();
          closeDetails();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDetails();
        }}
        ref={dialogRef}
      >
        {selectedStudent ? (
          <>
            <header className="directory-dialog-header">
              <div className="directory-profile-avatar">
                <IconUser aria-hidden="true" size={22} stroke={1.7} />
              </div>
              <div className="directory-profile-heading">
                <span className="attendance-eyebrow">
                  {selectedStudent.className} · Section{" "}
                  {selectedStudent.section}
                </span>
                <h2 id="student-profile-title">{selectedStudent.name}</h2>
                <p>Admission no. {selectedStudent.admissionId}</p>
              </div>
              <button
                aria-label="Close student profile"
                className="attendance-dialog-close"
                onClick={closeDetails}
                type="button"
              >
                <IconX aria-hidden="true" size={18} />
              </button>
            </header>
            <div className="directory-profile-content">
              <section className="directory-student-section">
                <h3>Student information</h3>
                <div className="directory-detail-grid">
                  <div>
                    <span>Class & section</span>
                    <strong>
                      {selectedStudent.className} · {selectedStudent.section}
                    </strong>
                  </div>
                  <div>
                    <span>Roll number</span>
                    <strong>{selectedStudent.rollNumber}</strong>
                  </div>
                  <div>
                    <span>Date of birth</span>
                    <strong>
                      {formatStudentDate(selectedStudent.dateOfBirth)}
                    </strong>
                  </div>
                  <div>
                    <span>Gender</span>
                    <strong>{selectedStudent.gender}</strong>
                  </div>
                </div>
              </section>
              <section className="directory-guardian-section">
                <h3>Parent / guardian</h3>
                <div className="directory-detail-grid">
                  <div>
                    <span>Name</span>
                    <strong>
                      {selectedStudent.guardianName} ·{" "}
                      {selectedStudent.guardianRelationship}
                    </strong>
                  </div>
                  <div>
                    <span>Phone number</span>
                    <strong>{selectedStudent.guardianPhone}</strong>
                  </div>
                  <div className="directory-detail-wide">
                    <span>Email</span>
                    <strong>{selectedStudent.guardianEmail}</strong>
                  </div>
                  <div className="directory-detail-wide">
                    <span>Address</span>
                    <strong>{selectedStudent.address}</strong>
                  </div>
                </div>
              </section>
              <section className="directory-attendance-section">
                <div className="directory-profile-section-heading">
                  <div>
                    <h3>Attendance</h3>
                    <p>Current academic year</p>
                  </div>
                  <span className="directory-attendance-status">
                    Satisfactory
                  </span>
                </div>
                <div className="directory-attendance-summary">
                  <IconChartBar aria-hidden="true" size={19} stroke={1.8} />
                  <strong>96%</strong>
                  <span>Attendance</span>
                </div>
              </section>
              <section className="directory-promotion-section">
                <h3>Promotion History</h3>
                <div className="directory-promotion-empty">
                  <span aria-hidden="true" />
                  <div>
                    <strong>No promotion records available</strong>
                    <p>
                      Previous academic-year records are not included in this
                      demo profile.
                    </p>
                  </div>
                </div>
              </section>
            </div>
            <footer className="directory-dialog-footer">
              <span>Student profile · Demo data</span>
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
