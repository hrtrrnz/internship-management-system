import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type EvaluationFormSubmissionStatus = "pending_approval" | "approved" | "rejected";

export type EvaluationFormSubmission = {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: string;
  uploadedByMentorName: string;
  status: EvaluationFormSubmissionStatus;
  reviewedAt?: string;
  reviewedByAdminName?: string;
  rejectReason?: string;
};

/** Resolved shape shown on intern UI — only exists after mentor assigns an approved submission to that intern. */
export type ActiveApprovedEvaluationForm = {
  submissionId: string;
  fileName: string;
  fileSizeBytes: number;
  approvedAt: string;
  approvedByAdminName: string;
  uploadedByMentorName: string;
};

type WorkflowState = {
  submissions: EvaluationFormSubmission[];
  /** Intern roster id → approved submission id chosen by mentor. No implicit default — admin approval alone does not assign. */
  internFormAssignments: Record<string, string | null>;
};

type EvaluationFormWorkflowContextValue = {
  submissions: EvaluationFormSubmission[];
  internFormAssignments: Record<string, string | null>;
  uploadSubmission: (file: File, mentorName: string) => void;
  approveSubmission: (id: string, adminName: string) => void;
  rejectSubmission: (id: string, adminName: string, reason?: string) => void;
  setInternEvaluationFormAssignment: (internId: string, submissionId: string | null) => void;
};

const EvaluationFormWorkflowContext = createContext<EvaluationFormWorkflowContextValue | null>(null);

function formatNowLabel() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const initialWorkflowState: WorkflowState = {
  submissions: [],
  internFormAssignments: {},
};

export function EvaluationFormWorkflowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkflowState>(initialWorkflowState);

  const uploadSubmission = useCallback((file: File, mentorName: string) => {
    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `eval-${Date.now()}`;
    const submission: EvaluationFormSubmission = {
      id,
      fileName: file.name,
      fileSizeBytes: file.size,
      uploadedAt: formatNowLabel(),
      uploadedByMentorName: mentorName,
      status: "pending_approval",
    };
    setState((prev) => ({
      ...prev,
      submissions: [submission, ...prev.submissions],
    }));
  }, []);

  const approveSubmission = useCallback((id: string, adminName: string) => {
    const reviewedAt = formatNowLabel();
    setState((prev) => {
      const target = prev.submissions.find((s) => s.id === id && s.status === "pending_approval");
      if (!target) return prev;
      const submissions = prev.submissions.map((s) =>
        s.id === id ? { ...s, status: "approved" as const, reviewedAt, reviewedByAdminName: adminName } : s
      );
      return { ...prev, submissions };
    });
  }, []);

  const rejectSubmission = useCallback((id: string, adminName: string, reason?: string) => {
    const reviewedAt = formatNowLabel();
    setState((prev) => {
      const target = prev.submissions.find((s) => s.id === id && s.status === "pending_approval");
      if (!target) return prev;
      const submissions = prev.submissions.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "rejected" as const,
              reviewedAt,
              reviewedByAdminName: adminName,
              rejectReason: reason?.trim() || undefined,
            }
          : s
      );
      const internFormAssignments = Object.fromEntries(
        Object.entries(prev.internFormAssignments).map(([k, v]) => [k, v === id ? null : v])
      );
      return { ...prev, submissions, internFormAssignments };
    });
  }, []);

  const setInternEvaluationFormAssignment = useCallback((internId: string, submissionId: string | null) => {
    setState((prev) => {
      if (submissionId !== null) {
        const sub = prev.submissions.find((s) => s.id === submissionId && s.status === "approved");
        if (!sub) return prev;
      }
      return {
        ...prev,
        internFormAssignments: {
          ...prev.internFormAssignments,
          [internId]: submissionId,
        },
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      submissions: state.submissions,
      internFormAssignments: state.internFormAssignments,
      uploadSubmission,
      approveSubmission,
      rejectSubmission,
      setInternEvaluationFormAssignment,
    }),
    [state.submissions, state.internFormAssignments, uploadSubmission, approveSubmission, rejectSubmission, setInternEvaluationFormAssignment]
  );

  return (
    <EvaluationFormWorkflowContext.Provider value={value}>{children}</EvaluationFormWorkflowContext.Provider>
  );
}

export function useEvaluationFormWorkflow() {
  const ctx = useContext(EvaluationFormWorkflowContext);
  if (!ctx) throw new Error("useEvaluationFormWorkflow must be used within EvaluationFormWorkflowProvider");
  return ctx;
}

export function formatEvaluationFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Official intern form only when mentor assigned this approved submission to them. Admin approval alone does nothing here. */
export function resolveEvaluationFormForIntern(
  internId: string,
  submissions: EvaluationFormSubmission[],
  internFormAssignments: Record<string, string | null>
): ActiveApprovedEvaluationForm | null {
  const sid = internFormAssignments[internId];
  if (!sid) return null;
  const sub = submissions.find((s) => s.id === sid && s.status === "approved");
  if (!sub) return null;
  return {
    submissionId: sub.id,
    fileName: sub.fileName,
    fileSizeBytes: sub.fileSizeBytes,
    approvedAt: sub.reviewedAt ?? "",
    approvedByAdminName: sub.reviewedByAdminName ?? "",
    uploadedByMentorName: sub.uploadedByMentorName,
  };
}
