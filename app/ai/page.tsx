"use client";
import { useState, useRef, useEffect } from "react";
import { useClaroStore } from "@/lib/store";
import { businessConfig } from "@/lib/data";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Which service was our biggest revenue generator?",
  "Who are my top 5 customers by total spend?",
  "Which employee has the most loyal customers?",
  "How many customers are from Downtown?",
  "Which customers haven't visited in over 30 days?",
];

export default function AIPage() {
  const { customers, employees, businessType, businessName } = useClaroStore();
  const cfg = businessType ? businessConfig[businessType] : null;
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm your Claro AI assistant for **${businessName || "your business"}**. I have access to all your customer records, service history, and employee data. Ask me anything about your business — in plain English.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function buildContext() {
    const serviceCount: Record<string, { count: number; revenue: number }> = {};
    customers.forEach((c) =>
      c.serviceHistory.forEach((h) => {
        if (!serviceCount[h.service]) serviceCount[h.service] = { count: 0, revenue: 0 };
        serviceCount[h.service].count++;
        serviceCount[h.service].revenue += h.price;
      })
    );

    const empStats: Record<string, { loyal: number; revenue: number }> = {};
    employees.forEach((e) => {
      const loyal = customers.filter((c) => c.preferredEmployee === e.name).length;
      const rev = customers.reduce((s, c) => s + c.serviceHistory.filter((h) => h.employee === e.name).reduce((a, h) => a + h.price, 0), 0);
      empStats[e.name] = { loyal, revenue: rev };
    });

    return `
Business: ${businessName} (${cfg?.label})
Total customers: ${customers.length}
Total revenue on record: $${customers.reduce((s, c) => s + c.totalSpend, 0).toLocaleString()}

Top customers by spend:
${[...customers].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 5).map((c) => `- ${c.name}: $${c.totalSpend} (${c.visits} visits, prefers ${c.preferredEmployee || "anyone"})`).join("\n")}

Service performance:
${Object.entries(serviceCount).sort((a, b) => b[1].revenue - a[1].revenue).map(([s, d]) => `- ${s}: ${d.count} bookings, $${d.revenue} revenue`).join("\n")}

Employee performance:
${Object.entries(empStats).map(([name, s]) => `- ${name}: ${s.loyal} loyal clients, $${s.revenue} revenue`).join("\n")}

Customer areas:
${[...new Set(customers.map((c) => c.area))].map((area) => `- ${area}: ${customers.filter((c) => c.area === area).length} customers`).join("\n")}

Customers by last visit (most overdue first):
${[...customers].sort((a, b) => a.lastVisit.localeCompare(b.lastVisit)).slice(0, 5).map((c) => `- ${c.name}: last visited ${c.lastVisit}`).join("\n")}
    `.trim();
  }

  async function sendMessage(text?: string) {
    const userText = text || input.trim();
    if (!userText) return;

    const userMsg: Message = { role: "user", content: userText };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          context: buildContext(),
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't connect to the AI service. Please check your API key configuration." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <div className="px-8 py-5 border-b border-slate-100 bg-white flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">Claro AI Assistant</div>
            <div className="text-xs text-slate-400">Powered by Claude · Knows your business data</div>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-teal-600 font-medium">
            <Sparkles size={12} /> Essentials Plan
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "assistant" ? "bg-teal-100 text-teal-700" : "bg-slate-200 text-slate-600"}`}>
                {m.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div className={`max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "assistant" ? "bg-white border border-slate-100 text-slate-700" : "bg-teal-600 text-white"}`}>
                {m.content.split("**").map((part, j) =>
                  j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                <Bot size={14} className="text-teal-700" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => <div key={i} className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-8 pb-2">
            <p className="text-xs text-slate-400 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => sendMessage(s)} className="text-xs bg-white border border-slate-200 text-slate-600 rounded-full px-3 py-1.5 hover:border-teal-300 hover:text-teal-600 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-8 py-4 border-t border-slate-100 bg-white flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask anything about your business..."
            className="flex-1 resize-none border-slate-200 text-sm min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <Button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="bg-teal-600 hover:bg-teal-700 self-end">
            <Send size={14} />
          </Button>
        </div>
      </main>
    </div>
  );
}
