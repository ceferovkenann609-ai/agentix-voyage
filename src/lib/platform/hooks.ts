import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext";
import { queryKeys } from "@/lib/api/keys";
import * as activitiesApi from "@/lib/api/activities";
import * as notificationsApi from "@/lib/api/notifications";
import * as workflowsApi from "@/lib/api/workflows";
import * as agentsApi from "@/lib/api/agents";
import * as storageApi from "@/lib/api/storage";

/* ------------------------------- Activities ------------------------------- */

export function useActivities(limit = 20) {
  const { user } = useAuth();
  const { companyId } = useCompany();
  return useQuery({
    queryKey: queryKeys.activities.list(companyId ?? undefined, limit),
    enabled: !!user?.id,
    queryFn: () => activitiesApi.fetchActivities({ companyId, limit }),
  });
}

export function useEntityActivities(entityType: string, entityId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.activities.entity(entityType, entityId),
    enabled: !!entityId,
    queryFn: () => activitiesApi.fetchEntityActivities(entityType, entityId!),
  });
}

/* ------------------------------ Notifications ----------------------------- */

export function useNotifications(status: notificationsApi.NotificationStatus | "all" = "all") {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.notifications.list(user?.id, status),
    enabled: !!user?.id,
    queryFn: () => notificationsApi.fetchNotifications({ status }),
  });
}

export function useUnreadNotificationCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(user?.id),
    enabled: !!user?.id,
    refetchInterval: 60_000,
    queryFn: notificationsApi.fetchUnreadCount,
  });
}

export function useNotificationActions() {
  const qc = useQueryClient();
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: queryKeys.notifications.all });
  };

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: notificationsApi.NotificationStatus }) =>
      notificationsApi.setNotificationStatus(id, status),
    onSuccess: invalidate,
  });
  const markAll = useMutation({ mutationFn: notificationsApi.markAllRead, onSuccess: invalidate });
  const remove = useMutation({ mutationFn: notificationsApi.deleteNotification, onSuccess: invalidate });

  return { setStatus, markAll, remove };
}

/* -------------------------------- Workflows ------------------------------- */

export function useWorkflowRuns(limit = 20) {
  const { user } = useAuth();
  const { companyId } = useCompany();
  return useQuery({
    queryKey: queryKeys.workflows.runs(companyId ?? undefined, limit),
    enabled: !!user?.id,
    queryFn: () => workflowsApi.fetchRuns({ companyId, limit }),
  });
}

export function useWorkflowSteps(runId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.workflows.run(runId),
    enabled: !!runId,
    queryFn: () => workflowsApi.fetchRunSteps(runId!),
  });
}

/* -------------------------------- AI Agents ------------------------------- */

export function useAgents() {
  const { companyId } = useCompany();
  return useQuery({
    queryKey: queryKeys.agents.list(companyId ?? undefined),
    enabled: !!companyId,
    queryFn: () => agentsApi.fetchAgents(companyId!),
  });
}

export function useAgentMutations() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { companyId } = useCompany();
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: queryKeys.agents.all });
    void qc.invalidateQueries({ queryKey: queryKeys.activities.all });
  };

  const create = useMutation({
    mutationFn: async (input: Omit<agentsApi.CreateAgentInput, "companyId" | "userId">) => {
      if (!companyId || !user?.id) throw new Error("Şirkət konteksti tapılmadı.");
      const agent = await agentsApi.createAgent({ ...input, companyId, userId: user.id });
      await activitiesApi.logActivity({
        userId: user.id,
        companyId,
        type: activitiesApi.ACTIVITY_TYPES.agentCreated,
        title: `AI agent yaradıldı: ${agent.name}`,
        entityType: "ai_agent",
        entityId: agent.id,
      });
      return agent;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: agentsApi.AgentPatch }) => {
      await agentsApi.updateAgent(id, patch);
      await activitiesApi.logActivity({
        userId: user?.id,
        companyId,
        type: activitiesApi.ACTIVITY_TYPES.agentUpdated,
        title: "AI agent yeniləndi",
        entityType: "ai_agent",
        entityId: id,
      });
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await agentsApi.archiveAgent(id);
      await activitiesApi.logActivity({
        userId: user?.id,
        companyId,
        type: activitiesApi.ACTIVITY_TYPES.agentDeleted,
        title: "AI agent arxivləndi",
        entityType: "ai_agent",
        entityId: id,
      });
    },
    onSuccess: invalidate,
  });

  return { create, update, remove };
}

/* --------------------------------- Files ---------------------------------- */

export function useFiles(opts: { kind?: storageApi.FileKind; entityType?: string; entityId?: string } = {}) {
  const { companyId } = useCompany();
  return useQuery({
    queryKey: opts.entityId
      ? queryKeys.files.entity(opts.entityType ?? "any", opts.entityId)
      : queryKeys.files.list(companyId ?? undefined, opts.kind),
    enabled: !!companyId,
    queryFn: () => storageApi.listFiles({ companyId: companyId!, ...opts }),
  });
}

export function useFileUpload() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { companyId } = useCompany();

  return useMutation({
    mutationFn: async (input: {
      file: File;
      bucket: storageApi.BucketName;
      kind: storageApi.FileKind;
      entityType?: string | null;
      entityId?: string | null;
    }) => {
      if (!companyId || !user?.id) throw new Error("Şirkət konteksti tapılmadı.");
      const uploaded = await storageApi.uploadFile({ ...input, companyId, userId: user.id });
      await activitiesApi.logActivity({
        userId: user.id,
        companyId,
        type: activitiesApi.ACTIVITY_TYPES.fileUploaded,
        title: `Fayl yükləndi: ${uploaded.record.name}`,
        entityType: input.entityType ?? "file",
        entityId: uploaded.record.id,
      });
      return uploaded;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.files.all });
      void qc.invalidateQueries({ queryKey: queryKeys.activities.all });
    },
  });
}

export function useFileRemove() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storageApi.removeFile,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.files.all });
    },
  });
}
