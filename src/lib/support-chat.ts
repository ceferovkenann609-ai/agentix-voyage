/**
 * Single integration point for opening the Agentix support chat.
 *
 * Today this opens the built-in Agentix AI chat widget (see
 * `src/components/site/AIChatWidget.tsx`). When a third-party provider is
 * connected later (Crisp, Tawk.to, Intercom), extend `openSupportChat()` to
 * call that provider's API first and fall back to the built-in widget.
 */
export const AGENTIX_CHAT_OPEN_EVENT = "agentix:open-chat";

type ProviderWindow = Window & {
  $crisp?: { push: (args: unknown[]) => void };
  Tawk_API?: { maximize?: () => void };
  Intercom?: (command: string) => void;
};

export function openSupportChat(): void {
  if (typeof window === "undefined") return;
  const w = window as ProviderWindow;

  if (w.$crisp) {
    w.$crisp.push(["do", "chat:open"]);
    return;
  }
  if (w.Tawk_API?.maximize) {
    w.Tawk_API.maximize();
    return;
  }
  if (typeof w.Intercom === "function") {
    w.Intercom("show");
    return;
  }

  window.dispatchEvent(new Event(AGENTIX_CHAT_OPEN_EVENT));
}
