import { z } from "zod";

export const examTermSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(60),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  weightage: z.number().min(0).max(100),
  classFrom: z.number().int().min(1).max(12),
  classTo: z.number().int().min(1).max(12),
});

export const examAssessmentSchema = z.object({
  id: z.string().uuid(),
  termId: z.string().uuid(),
  name: z.string().trim().min(1).max(80),
  type: z.string().trim().min(1).max(40),
  maxMarks: z.number().int().min(1).max(1000),
  weightage: z.number().min(0).max(100),
  classFrom: z.number().int().min(1).max(12),
  classTo: z.number().int().min(1).max(12),
});

export const examPatternSchema = z
  .object({
    academicYear: z.string().regex(/^\d{4}-\d{2}$/),
    terms: z.array(examTermSchema).min(1).max(6),
    assessments: z.array(examAssessmentSchema).min(1).max(60),
  })
  .superRefine((pattern, context) => {
    const termIds = new Set<string>();
    const termNames = new Set<string>();
    const termWeights = new Map<string, number>();

    for (const [index, term] of pattern.terms.entries()) {
      const normalizedName = term.name.toLocaleLowerCase();
      if (termIds.has(term.id)) {
        context.addIssue({
          code: "custom",
          path: ["terms", index, "id"],
          message: "Each term must have a unique id.",
        });
      }
      if (termNames.has(normalizedName)) {
        context.addIssue({
          code: "custom",
          path: ["terms", index, "name"],
          message: "Term names must be unique within the academic year.",
        });
      }
      if (term.classFrom > term.classTo) {
        context.addIssue({
          code: "custom",
          path: ["terms", index, "classTo"],
          message: "The last class must be at or above the first class.",
        });
      }
      if (term.startDate > term.endDate) {
        context.addIssue({
          code: "custom",
          path: ["terms", index, "endDate"],
          message: "The end date must be after the start date.",
        });
      }
      termIds.add(term.id);
      termNames.add(normalizedName);
      termWeights.set(term.id, term.weightage);
    }

    const sortedTerms = [...pattern.terms].sort((a, b) =>
      a.startDate.localeCompare(b.startDate),
    );
    for (let index = 1; index < sortedTerms.length; index += 1) {
      if (sortedTerms[index].startDate <= sortedTerms[index - 1].endDate) {
        context.addIssue({
          code: "custom",
          path: ["terms"],
          message: "Term dates cannot overlap.",
        });
        break;
      }
    }

    const totalTermWeight = pattern.terms.reduce(
      (total, term) => total + term.weightage,
      0,
    );
    if (Math.abs(totalTermWeight - 100) > 0.01) {
      context.addIssue({
        code: "custom",
        path: ["terms"],
        message: "Term weightages must add up to 100%.",
      });
    }

    const assessmentIds = new Set<string>();
    const assessmentWeights = new Map<string, number>();
    for (const [index, assessment] of pattern.assessments.entries()) {
      if (assessmentIds.has(assessment.id)) {
        context.addIssue({
          code: "custom",
          path: ["assessments", index, "id"],
          message: "Each assessment must have a unique id.",
        });
      }
      if (!termIds.has(assessment.termId)) {
        context.addIssue({
          code: "custom",
          path: ["assessments", index, "termId"],
          message: "Choose an existing term for every assessment.",
        });
      }
      if (assessment.classFrom > assessment.classTo) {
        context.addIssue({
          code: "custom",
          path: ["assessments", index, "classTo"],
          message: "The last class must be at or above the first class.",
        });
      }
      assessmentIds.add(assessment.id);
      assessmentWeights.set(
        assessment.termId,
        (assessmentWeights.get(assessment.termId) ?? 0) + assessment.weightage,
      );
    }

    for (const term of pattern.terms) {
      const weight = assessmentWeights.get(term.id) ?? 0;
      if (Math.abs(weight - (termWeights.get(term.id) ?? 0)) > 0.01) {
        context.addIssue({
          code: "custom",
          path: ["assessments"],
          message: `Assessments for ${term.name} must add up to its ${term.weightage}% term weightage.`,
        });
      }
    }
  });

export const examPatternCollectionSchema = z.object({
  patterns: z.array(examPatternSchema).max(100),
});

export type ExamTerm = z.infer<typeof examTermSchema>;
export type ExamAssessment = z.infer<typeof examAssessmentSchema>;
export type ExamPattern = z.infer<typeof examPatternSchema>;

export function createStarterExamPattern(academicYear: string): ExamPattern {
  const firstYear = Number(academicYear.slice(0, 4));
  const secondYear = firstYear + 1;
  const firstTermId = crypto.randomUUID();
  const secondTermId = crypto.randomUUID();

  return {
    academicYear,
    terms: [
      {
        id: firstTermId,
        name: "Term 1",
        startDate: `${firstYear}-04-01`,
        endDate: `${firstYear}-09-30`,
        weightage: 40,
        classFrom: 1,
        classTo: 12,
      },
      {
        id: secondTermId,
        name: "Term 2",
        startDate: `${firstYear}-10-01`,
        endDate: `${secondYear}-03-31`,
        weightage: 60,
        classFrom: 1,
        classTo: 12,
      },
    ],
    assessments: [
      {
        id: crypto.randomUUID(),
        termId: firstTermId,
        name: "Periodic Assessment 1",
        type: "Periodic test",
        maxMarks: 20,
        weightage: 10,
        classFrom: 3,
        classTo: 10,
      },
      {
        id: crypto.randomUUID(),
        termId: firstTermId,
        name: "Subject Assignment",
        type: "Assignment",
        maxMarks: 20,
        weightage: 10,
        classFrom: 3,
        classTo: 12,
      },
      {
        id: crypto.randomUUID(),
        termId: firstTermId,
        name: "Half-yearly Examination",
        type: "Written examination",
        maxMarks: 80,
        weightage: 20,
        classFrom: 3,
        classTo: 12,
      },
      {
        id: crypto.randomUUID(),
        termId: secondTermId,
        name: "Periodic Assessment 2",
        type: "Periodic test",
        maxMarks: 20,
        weightage: 15,
        classFrom: 3,
        classTo: 10,
      },
      {
        id: crypto.randomUUID(),
        termId: secondTermId,
        name: "Subject Assignment",
        type: "Assignment",
        maxMarks: 20,
        weightage: 15,
        classFrom: 3,
        classTo: 12,
      },
      {
        id: crypto.randomUUID(),
        termId: secondTermId,
        name: "Annual Examination",
        type: "Written examination",
        maxMarks: 80,
        weightage: 30,
        classFrom: 3,
        classTo: 12,
      },
    ],
  };
}
