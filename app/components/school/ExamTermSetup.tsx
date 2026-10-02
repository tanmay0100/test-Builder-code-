import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

import {
  createStarterExamPattern,
  examPatternCollectionSchema,
  examPatternSchema,
  type ExamAssessment,
  type ExamPattern,
  type ExamTerm,
} from "../../../shared/exam-pattern";

const storageKey = "northstar.exam-patterns";

function nextAcademicYear(patterns: ExamPattern[]) {
  const currentYear = new Date().getFullYear();
  const nextYear = patterns.length
    ? Math.max(
        ...patterns.map((pattern) => Number(pattern.academicYear.slice(0, 4))),
      ) + 1
    : currentYear;
  return `${nextYear}-${String(nextYear + 1).slice(-2)}`;
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function yearPatternWeight(pattern: ExamPattern) {
  return pattern.terms.reduce((total, term) => total + term.weightage, 0);
}

export function TermSetupPage() {
  const [patterns, setPatterns] = useState<ExamPattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [draft, setDraft] = useState<ExamPattern | null>(null);
  const [activeTab, setActiveTab] = useState<"terms" | "assessments">("terms");
  const [validationMessage, setValidationMessage] = useState("");
  const [savedYear, setSavedYear] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = examPatternCollectionSchema.safeParse(
          JSON.parse(stored),
        );
        if (parsed.success) setPatterns(parsed.data.patterns);
        else
          setValidationMessage("Saved patterns in this browser are invalid.");
      }
    } catch {
      setValidationMessage("Could not read saved patterns from this browser.");
    }
    setIsLoading(false);
  }, []);

  const patternsByYear = useMemo(
    () =>
      [...patterns].sort((a, b) =>
        a.academicYear.localeCompare(b.academicYear),
      ),
    [patterns],
  );
  const activeYear =
    selectedYear ??
    patternsByYear[patternsByYear.length - 1]?.academicYear ??
    "";
  const savedPattern =
    patternsByYear.find((pattern) => pattern.academicYear === activeYear) ??
    null;
  const pattern = draft ?? savedPattern;
  const isCreating =
    !!draft &&
    !patternsByYear.some((item) => item.academicYear === draft.academicYear);
  const editable = !!draft;
  const totalTermWeight = pattern ? yearPatternWeight(pattern) : 0;
  const validation = useMemo(
    () => (draft ? examPatternSchema.safeParse(draft) : null),
    [draft],
  );
  const firstValidationMessage =
    validation && !validation.success
      ? [...new Set(validation.error.issues.map((issue) => issue.message))]
          .slice(0, 2)
          .join(" ")
      : "";

  function beginNewPattern() {
    const academicYear = nextAcademicYear(patterns);
    setDraft(createStarterExamPattern(academicYear));
    setSelectedYear(academicYear);
    setActiveTab("terms");
    setSavedYear(null);
    setValidationMessage("");
    setConfirmDelete(false);
  }

  function beginEdit() {
    if (!savedPattern) return;
    setDraft(structuredClone(savedPattern));
    setSavedYear(null);
    setValidationMessage("");
  }

  function cancelEdit() {
    setDraft(null);
    setValidationMessage("");
    setConfirmDelete(false);
    if (isCreating) {
      setSelectedYear(
        patternsByYear[patternsByYear.length - 1]?.academicYear ?? null,
      );
    }
  }

  function updatePattern(update: (current: ExamPattern) => ExamPattern) {
    setDraft((current) => (current ? update(current) : current));
    setSavedYear(null);
    setValidationMessage("");
  }

  function updateTerm(termId: string, patch: Partial<ExamTerm>) {
    updatePattern((current) => ({
      ...current,
      terms: current.terms.map((term) =>
        term.id === termId ? { ...term, ...patch } : term,
      ),
    }));
  }

  function updateAssessment(
    assessmentId: string,
    patch: Partial<ExamAssessment>,
  ) {
    updatePattern((current) => ({
      ...current,
      assessments: current.assessments.map((assessment) =>
        assessment.id === assessmentId
          ? { ...assessment, ...patch }
          : assessment,
      ),
    }));
  }

  function addTerm() {
    if (!draft || draft.terms.length >= 6) return;
    const termId = crypto.randomUUID();
    const year = Number(draft.academicYear.slice(0, 4));
    const termNumber = draft.terms.length + 1;
    updatePattern((current) => ({
      ...current,
      terms: [
        ...current.terms,
        {
          id: termId,
          name: `Term ${termNumber}`,
          startDate: `${year}-04-01`,
          endDate: `${year}-04-30`,
          weightage: 0,
          classFrom: 1,
          classTo: 12,
        },
      ],
      assessments: [
        ...current.assessments,
        {
          id: crypto.randomUUID(),
          termId,
          name: "New assessment",
          type: "Assignment",
          maxMarks: 20,
          weightage: 0,
          classFrom: 1,
          classTo: 12,
        },
      ],
    }));
  }

  function removeTerm(termId: string) {
    updatePattern((current) => ({
      ...current,
      terms: current.terms.filter((term) => term.id !== termId),
      assessments: current.assessments.filter(
        (assessment) => assessment.termId !== termId,
      ),
    }));
  }

  function addAssessment(termId: string) {
    updatePattern((current) => ({
      ...current,
      assessments: [
        ...current.assessments,
        {
          id: crypto.randomUUID(),
          termId,
          name: "New assessment",
          type: "Assignment",
          maxMarks: 20,
          weightage: 0,
          classFrom: 1,
          classTo: 12,
        },
      ],
    }));
  }

  function removeAssessment(assessmentId: string) {
    updatePattern((current) => ({
      ...current,
      assessments: current.assessments.filter(
        (item) => item.id !== assessmentId,
      ),
    }));
  }

  function save() {
    if (!draft) return;
    const parsed = examPatternSchema.safeParse(draft);
    if (!parsed.success) {
      setValidationMessage(
        [...new Set(parsed.error.issues.map((issue) => issue.message))]
          .slice(0, 2)
          .join(" "),
      );
      return;
    }
    const nextPatterns = [
      ...patternsByYear.filter(
        (item) => item.academicYear !== parsed.data.academicYear,
      ),
      parsed.data,
    ].sort((a, b) => a.academicYear.localeCompare(b.academicYear));
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ patterns: nextPatterns }),
      );
    } catch {
      setValidationMessage("Could not save patterns in this browser.");
      return;
    }
    setPatterns(nextPatterns);
    setSelectedYear(parsed.data.academicYear);
    setDraft(null);
    setValidationMessage("");
    setSavedYear(parsed.data.academicYear);
  }

  function removeSelectedPattern() {
    if (!savedPattern) return;
    const remainingPatterns = patternsByYear.filter(
      (item) => item.academicYear !== savedPattern.academicYear,
    );
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ patterns: remainingPatterns }),
      );
    } catch {
      setValidationMessage("Could not delete this pattern from the browser.");
      setConfirmDelete(false);
      return;
    }
    setPatterns(remainingPatterns);
    setDraft(null);
    setSelectedYear(
      remainingPatterns[remainingPatterns.length - 1]?.academicYear ?? null,
    );
    setConfirmDelete(false);
    setSavedYear(null);
  }

  if (isLoading) {
    return (
      <div aria-label="Loading term setup" className="school-loading-table">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return (
    <section className="exam-page">
      <div className="exam-page-heading">
        <h1>Term Setup</h1>
        <div className="school-heading-actions">
          {draft ? (
            <>
              <button
                className="school-button school-button-secondary"
                onClick={cancelEdit}
                type="button"
              >
                Cancel
              </button>
              <button
                className="school-button school-button-primary"
                onClick={save}
                type="button"
              >
                <IconCheck size={15} stroke={2} />
                Save setup
              </button>
            </>
          ) : (
            <>
              {savedPattern ? (
                <button
                  className="school-button school-button-secondary"
                  onClick={beginEdit}
                  type="button"
                >
                  Edit setup
                </button>
              ) : null}
              <button
                className="school-button school-button-primary"
                onClick={beginNewPattern}
                type="button"
              >
                <IconPlus size={15} stroke={2} />
                New year pattern
              </button>
            </>
          )}
        </div>
      </div>

      {patterns.length ? (
        <div className="term-session-row">
          <div className="school-field term-session-select">
            <label htmlFor="academic-session">Academic session</label>
            <select
              className="school-select"
              disabled={!!draft}
              id="academic-session"
              onChange={(event) => {
                setSelectedYear(event.target.value);
                setSavedYear(null);
                setConfirmDelete(false);
              }}
              value={activeYear}
            >
              {patternsByYear.map((item) => (
                <option key={item.academicYear} value={item.academicYear}>
                  {item.academicYear.replace("-", "–")}
                </option>
              ))}
            </select>
          </div>
          {pattern ? (
            <div aria-live="polite" className="term-weight-summary">
              <span
                className={
                  totalTermWeight === 100
                    ? "term-weight-check"
                    : "term-weight-warning"
                }
              >
                {totalTermWeight === 100 ? <IconCheck size={13} /> : null}
                {totalTermWeight}%
              </span>
              <span>Term weightage</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {pattern ? (
        <>
          {draft ? (
            <div className="pattern-year-field">
              <div className="school-field">
                <label htmlFor="pattern-year">Academic session</label>
                <input
                  className="school-input"
                  id="pattern-year"
                  maxLength={7}
                  onChange={(event) =>
                    updatePattern((current) => ({
                      ...current,
                      academicYear: event.target.value,
                    }))
                  }
                  placeholder="2027-28"
                  value={draft.academicYear}
                />
              </div>
              <span className="pattern-draft-label">
                {isCreating ? "New pattern" : "Unsaved changes"}
              </span>
            </div>
          ) : null}

          <div
            aria-label="Term setup sections"
            className="school-tabs"
            role="tablist"
          >
            <button
              aria-controls="term-panel"
              aria-selected={activeTab === "terms"}
              className="school-tab"
              onClick={() => setActiveTab("terms")}
              role="tab"
              type="button"
            >
              Terms
            </button>
            <button
              aria-controls="assessment-panel"
              aria-selected={activeTab === "assessments"}
              className="school-tab"
              onClick={() => setActiveTab("assessments")}
              role="tab"
              type="button"
            >
              Assessment pattern
            </button>
          </div>

          {activeTab === "terms" ? (
            <div
              aria-label="Academic terms"
              className="school-table-frame"
              id="term-panel"
              role="tabpanel"
            >
              <table className="school-data-table pattern-terms-table">
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Start date</th>
                    <th>End date</th>
                    <th>Weightage</th>
                    <th>Applicable classes</th>
                    {editable ? <th /> : null}
                  </tr>
                </thead>
                <tbody>
                  {pattern.terms.map((term, index) => (
                    <tr key={term.id}>
                      <td className="school-grade-band">
                        {editable ? (
                          <input
                            aria-label={`Term ${index + 1} name`}
                            className="school-input term-name-input"
                            maxLength={60}
                            onChange={(event) =>
                              updateTerm(term.id, { name: event.target.value })
                            }
                            value={term.name}
                          />
                        ) : (
                          term.name
                        )}
                      </td>
                      <td>
                        {editable ? (
                          <input
                            aria-label={`${term.name} start date`}
                            className="school-input term-date-input"
                            onChange={(event) =>
                              updateTerm(term.id, {
                                startDate: event.target.value,
                              })
                            }
                            type="date"
                            value={term.startDate}
                          />
                        ) : (
                          formatDate(term.startDate)
                        )}
                      </td>
                      <td>
                        {editable ? (
                          <input
                            aria-label={`${term.name} end date`}
                            className="school-input term-date-input"
                            onChange={(event) =>
                              updateTerm(term.id, {
                                endDate: event.target.value,
                              })
                            }
                            type="date"
                            value={term.endDate}
                          />
                        ) : (
                          formatDate(term.endDate)
                        )}
                      </td>
                      <td>
                        {editable ? (
                          <div className="pattern-weight-input">
                            <input
                              aria-label={`${term.name} term weightage`}
                              className="mark-input"
                              max="100"
                              min="0"
                              onChange={(event) =>
                                updateTerm(term.id, {
                                  weightage: Number(event.target.value),
                                })
                              }
                              type="number"
                              value={term.weightage}
                            />
                            <span>%</span>
                          </div>
                        ) : (
                          `${term.weightage}%`
                        )}
                      </td>
                      <td>
                        {editable ? (
                          <div className="class-range-input">
                            <input
                              aria-label={`${term.name} first class`}
                              className="mark-input"
                              max="12"
                              min="1"
                              onChange={(event) =>
                                updateTerm(term.id, {
                                  classFrom: Number(event.target.value),
                                })
                              }
                              type="number"
                              value={term.classFrom}
                            />
                            <span>to</span>
                            <input
                              aria-label={`${term.name} last class`}
                              className="mark-input"
                              max="12"
                              min="1"
                              onChange={(event) =>
                                updateTerm(term.id, {
                                  classTo: Number(event.target.value),
                                })
                              }
                              type="number"
                              value={term.classTo}
                            />
                          </div>
                        ) : (
                          `Classes ${term.classFrom}–${term.classTo}`
                        )}
                      </td>
                      {editable ? (
                        <td>
                          <button
                            aria-label={`Remove ${term.name}`}
                            className="pattern-remove-button"
                            disabled={pattern.terms.length === 1}
                            onClick={() => removeTerm(term.id)}
                            type="button"
                          >
                            <IconTrash size={14} />
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
              {editable ? (
                <button
                  className="pattern-add-row"
                  disabled={pattern.terms.length >= 6}
                  onClick={addTerm}
                  type="button"
                >
                  <IconPlus size={14} /> Add term
                </button>
              ) : null}
            </div>
          ) : (
            <div
              aria-label="Assessment pattern"
              className="assessment-pattern-panel"
              id="assessment-panel"
              role="tabpanel"
            >
              {pattern.terms.map((term) => {
                const termAssessments = pattern.assessments.filter(
                  (assessment) => assessment.termId === term.id,
                );
                const assessmentTotal = termAssessments.reduce(
                  (total, assessment) => total + assessment.weightage,
                  0,
                );
                const isValid =
                  Math.abs(assessmentTotal - term.weightage) <= 0.01;
                return (
                  <section className="assessment-term-section" key={term.id}>
                    <div className="assessment-term-heading">
                      <h2>{term.name}</h2>
                      <span
                        className={
                          isValid
                            ? "assessment-total"
                            : "assessment-total is-invalid"
                        }
                      >
                        {assessmentTotal}% / {term.weightage}%
                      </span>
                    </div>
                    <div className="school-table-frame">
                      <table className="school-data-table assessment-pattern-table">
                        <thead>
                          <tr>
                            <th>Assessment</th>
                            <th>Type</th>
                            <th>Max marks</th>
                            <th>Weightage</th>
                            <th>Applicable classes</th>
                            {editable ? <th /> : null}
                          </tr>
                        </thead>
                        <tbody>
                          {termAssessments.map((assessment, index) => (
                            <tr key={assessment.id}>
                              <td className="school-grade-band">
                                {editable ? (
                                  <input
                                    aria-label={`Assessment ${index + 1} name`}
                                    className="school-input assessment-name-input"
                                    maxLength={80}
                                    onChange={(event) =>
                                      updateAssessment(assessment.id, {
                                        name: event.target.value,
                                      })
                                    }
                                    value={assessment.name}
                                  />
                                ) : (
                                  assessment.name
                                )}
                              </td>
                              <td>
                                {editable ? (
                                  <>
                                    <input
                                      aria-label={`${assessment.name} type`}
                                      className="school-input assessment-type-input"
                                      list="assessment-types"
                                      maxLength={40}
                                      onChange={(event) =>
                                        updateAssessment(assessment.id, {
                                          type: event.target.value,
                                        })
                                      }
                                      value={assessment.type}
                                    />
                                    <datalist id="assessment-types">
                                      <option>Periodic test</option>
                                      <option>Assignment</option>
                                      <option>Project</option>
                                      <option>Practical</option>
                                      <option>Written examination</option>
                                      <option>Internal assessment</option>
                                    </datalist>
                                  </>
                                ) : (
                                  assessment.type
                                )}
                              </td>
                              <td>
                                {editable ? (
                                  <input
                                    aria-label={`${assessment.name} maximum marks`}
                                    className="mark-input"
                                    max="1000"
                                    min="1"
                                    onChange={(event) =>
                                      updateAssessment(assessment.id, {
                                        maxMarks: Number(event.target.value),
                                      })
                                    }
                                    type="number"
                                    value={assessment.maxMarks}
                                  />
                                ) : (
                                  assessment.maxMarks
                                )}
                              </td>
                              <td>
                                {editable ? (
                                  <div className="pattern-weight-input">
                                    <input
                                      aria-label={`${assessment.name} weightage`}
                                      className="mark-input"
                                      max="100"
                                      min="0"
                                      onChange={(event) =>
                                        updateAssessment(assessment.id, {
                                          weightage: Number(event.target.value),
                                        })
                                      }
                                      type="number"
                                      value={assessment.weightage}
                                    />
                                    <span>%</span>
                                  </div>
                                ) : (
                                  `${assessment.weightage}%`
                                )}
                              </td>
                              <td>
                                {editable ? (
                                  <div className="class-range-input">
                                    <input
                                      aria-label={`${assessment.name} first class`}
                                      className="mark-input"
                                      max="12"
                                      min="1"
                                      onChange={(event) =>
                                        updateAssessment(assessment.id, {
                                          classFrom: Number(event.target.value),
                                        })
                                      }
                                      type="number"
                                      value={assessment.classFrom}
                                    />
                                    <span>to</span>
                                    <input
                                      aria-label={`${assessment.name} last class`}
                                      className="mark-input"
                                      max="12"
                                      min="1"
                                      onChange={(event) =>
                                        updateAssessment(assessment.id, {
                                          classTo: Number(event.target.value),
                                        })
                                      }
                                      type="number"
                                      value={assessment.classTo}
                                    />
                                  </div>
                                ) : (
                                  `Classes ${assessment.classFrom}–${assessment.classTo}`
                                )}
                              </td>
                              {editable ? (
                                <td>
                                  <button
                                    aria-label={`Remove ${assessment.name}`}
                                    className="pattern-remove-button"
                                    onClick={() =>
                                      removeAssessment(assessment.id)
                                    }
                                    type="button"
                                  >
                                    <IconTrash size={14} />
                                  </button>
                                </td>
                              ) : null}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {editable ? (
                        <button
                          className="pattern-add-row"
                          disabled={pattern.assessments.length >= 60}
                          onClick={() => addAssessment(term.id)}
                          type="button"
                        >
                          <IconPlus size={14} /> Add assessment
                        </button>
                      ) : null}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {!draft && savedPattern ? (
            <div className="pattern-delete-row">
              {confirmDelete ? (
                <div
                  aria-label="Delete this academic-year pattern?"
                  className="pattern-delete-confirm"
                  role="alertdialog"
                >
                  <span>
                    Delete {savedPattern.academicYear.replace("-", "–")}{" "}
                    pattern?
                  </span>
                  <button
                    className="school-button school-button-secondary"
                    onClick={() => setConfirmDelete(false)}
                    type="button"
                  >
                    Keep
                  </button>
                  <button
                    className="school-button school-button-danger"
                    onClick={removeSelectedPattern}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  className="pattern-delete-link"
                  onClick={() => setConfirmDelete(true)}
                  type="button"
                >
                  Delete this year pattern
                </button>
              )}
            </div>
          ) : null}
        </>
      ) : (
        <div className="pattern-empty-state">
          <>
            <span>No exam patterns yet</span>
            <button
              className="school-button school-button-primary"
              onClick={beginNewPattern}
              type="button"
            >
              <IconPlus size={15} /> Create the first pattern
            </button>
          </>
        </div>
      )}

      {validationMessage || firstValidationMessage ? (
        <p aria-live="polite" className="pattern-error-message" role="alert">
          {validationMessage || firstValidationMessage}
        </p>
      ) : null}
      {savedYear ? (
        <p aria-live="polite" className="setup-saved-message">
          <IconCheck size={14} /> {savedYear.replace("-", "–")} setup saved in
          this browser.
        </p>
      ) : null}
    </section>
  );
}
