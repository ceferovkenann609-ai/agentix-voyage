import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Server-only Lovable AI Gateway provider.
 * The API key never leaves the server: it is read inside server function
 * handlers and passed here, never exposed to the client bundle.
 */
export function createLovableAiGatewayProvider(lovableApiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

/** Default chat model used when an agent has no explicit model configured. */
export const DEFAULT_AGENT_MODEL = "google/gemini-3.6-flash";
