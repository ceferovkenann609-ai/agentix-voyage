import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { runAgentChat } from "@/lib/ai.functions";
import { useAuth } from "@/contexts/AuthContext";

import { useCompany } from "@/contexts/CompanyContext";
import { queryKeys } from "@/lib/api/keys";
import * as activitiesApi from "@/lib/api/activities";
import * as notificationsApi from "@/lib/api/notifications";
import * as workflowsApi from "@/lib/api/workflows";
import * as agentsApi from "@/lib/api/agents";
import * as storageApi from "@/lib/api/storage";
import * as billingApi from "@/lib/api/billing";
import * as apiKeysApi from "@/lib/api/apiKeys";
import * as supportApi from "@/lib/api/support";
import * as conversationsApi from "@/lib/api/conversations";

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

/* --------------------------------- Billing -------------------------------- */

export function useBilling() {
  const { companyId } = useCompany();
  const enabled = !!companyId;

  const subscription = useQuery({
    queryKey: queryKeys.billing.subscription(companyId ?? undefined),
    enabled,
    queryFn: () => billingApi.fetchSubscription(companyId!),
  });
  const invoices = useQuery({
    queryKey: queryKeys.billing.invoices(companyId ?? undefined),
    enabled,
    queryFn: () => billingApi.fetchInvoices(companyId!),
  });
  const payments = useQuery({
    queryKey: queryKeys.billing.payments(companyId ?? undefined),
    enabled,
    queryFn: () => billingApi.fetchPayments(companyId!),
  });
  const usage = useQuery({
    queryKey: queryKeys.billing.usage(companyId ?? undefined),
    enabled,
    queryFn: () => billingApi.fetchUsage(companyId!),
  });

  return { subscription, invoices, payments, usage };
}

/* -------------------------------- API keys -------------------------------- */

export function useApiKeys() {
  const { companyId } = useCompany();
  return useQuery({
    queryKey: queryKeys.apiKeys.list(companyId ?? undefined),
    enabled: !!companyId,
    queryFn: () => apiKeysApi.fetchApiKeys(companyId!),
  });
}

export function useApiKeyMutations() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { companyId } = useCompany();
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: queryKeys.apiKeys.all });
  };

  const create = useMutation({
    mutationFn: async (name: string) => {
      if (!companyId || !user?.id) throw new Error("Şirkət konteksti tapılmadı.");
      const created = await apiKeysApi.createApiKey({ companyId, userId: user.id, name });
      await activitiesApi.logActivity({
        userId: user.id,
        companyId,
        type: activitiesApi.ACTIVITY_TYPES.settingsChanged,
        title: `API açarı yaradıldı: ${created.record.name}`,
        entityType: "api_key",
        entityId: created.record.id,
      });
      return created;
    },
    onSuccess: invalidate,
  });

  const revoke = useMutation({ mutationFn: apiKeysApi.revokeApiKey, onSuccess: invalidate });
  const remove = useMutation({ mutationFn: apiKeysApi.deleteApiKey, onSuccess: invalidate });

  return { create, revoke, remove };
}

/* -------------------------------- Support --------------------------------- */

export function useSupportRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.support.requests(user?.id),
    enabled: !!user?.id,
    queryFn: () => supportApi.fetchSupportRequests(user!.id),
  });
}

export function useSubmitSupportRequest() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { subject: string; message: string }) => {
      if (!user?.id || !user.email) throw new Error("Sessiya tapılmadı — yenidən daxil olun.");
      await supportApi.submitSupportRequest({
        userId: user.id,
        name: (user.user_metadata?.["full_name"] as string | undefined) ?? user.email,
        email: user.email,
        subject: input.subject,
        message: input.message,
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.support.all });
    },
  });
}

/* ------------------------------ Conversations ----------------------------- */

export function useConversations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.conversations.list(user?.id),
    enabled: !!user?.id,
    staleTime: 15_000,
    queryFn: () => conversationsApi.fetchConversations(user!.id),
  });
}

export function useSendOperatorReply() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { sessionId: string; message: string; locale?: string | null }) => {
      if (!user?.id) throw new Error("Sessiya tapılmadı — yenidən daxil olun.");
      await conversationsApi.sendOperatorReply({ ...input, userId: user.id });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.conversations.all });
    },
  });
}

/* ------------------------------- AI execution ----------------------------- */

/**
 * Runs a real AI turn through a company agent. The server function persists both
 * the user message and the AI reply into ai_chat_messages under RLS, so the
 * conversation survives a page refresh.
 */
export function useAgentChat() {
  const qc = useQueryClient();
  const call = useServerFn(runAgentChat);
  return useMutation({
    mutationFn: (input: {
      agentId: string;
      sessionId: string;
      message: string;
      locale?: string | null;
    }) => call({ data: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.conversations.all });
      void qc.invalidateQueries({ queryKey: queryKeys.billing.all });
    },
  });
}
