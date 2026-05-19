import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useMemo, useRef, useState } from "react";
import { apiPost } from "../api/client";
import { cn } from "../utils/cn";
import { Button } from "./ui/Button";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  source?: "deepseek" | "fallback";
};

type PlatformChatResponse = {
  response: {
    answer?: string;
    suggestedNextStep?: string;
    relatedArea?: string;
    modelText?: string;
  };
  is_fallback: boolean | number | string;
};

const starters = [
  "How do I test AI recommendations?",
  "Where do I create a support case?",
  "How should I demo privacy controls?"
];

export function PlatformChatHelper() {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Ask me how to use the CRM demo. I can guide customer, campaign, support, dashboard, and privacy workflows."
    }
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  const history = useMemo(
    () =>
      messages
        .filter((message) => message.role === "user" || message.role === "assistant")
        .map((message) => ({ role: message.role, content: message.content })),
    [messages]
  );

  const sendMessage = async (event?: FormEvent, starter?: string) => {
    event?.preventDefault();
    const question = (starter || input).trim();
    if (!question || loading) return;

    const userMessage: ChatMessage = { role: "user", content: question };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const result = await apiPost<PlatformChatResponse>("/api/ai/platform-chat", {
        question,
        history
      });
      const response = result.response || {};
      const answer = [response.answer || response.modelText, response.suggestedNextStep && `Next: ${response.suggestedNextStep}`]
        .filter(Boolean)
        .join("\n\n");
      const isFallback = result.is_fallback === true || result.is_fallback === 1 || result.is_fallback === "true";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: answer || "I could not produce a guide response. Try asking about a specific CRM workflow.",
          source: isFallback ? "fallback" : "deepseek"
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "The guide helper is unavailable.",
          source: "fallback"
        }
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <section className="mb-3 flex h-[min(640px,calc(100vh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-blue-50 p-2 text-blue-700">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-950">Power User Guide</h2>
                <p className="text-xs text-slate-500">Backend-only DeepSeek helper</p>
              </div>
            </div>
            <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100" onClick={() => setOpen(false)} aria-label="Close guide helper">
              <X className="h-4 w-4" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={index} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-line rounded-lg px-3 py-2 text-sm leading-6",
                    message.role === "user" ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-800"
                  )}
                >
                  <p>{message.content}</p>
                  {message.source && (
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {message.source === "fallback" ? "Fallback guide" : "DeepSeek guide"}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {starters.map((starter) => (
                <button
                  key={starter}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  onClick={() => sendMessage(undefined, starter)}
                  disabled={loading}
                >
                  {starter}
                </button>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={sendMessage}>
              <input
                className="min-w-0 flex-1 rounded-md border-slate-300 text-sm"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask how to use this CRM..."
              />
              <Button type="submit" disabled={loading || !input.trim()} aria-label="Send guide question">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>
      )}

      <button
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-soft transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open power user guide"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
