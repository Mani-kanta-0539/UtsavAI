'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Namaste! I am Utsav Mitra, your Consequence-Aware Event Copilot. Ask me anything about budget trade-offs, timeline delays, or cultural menus!',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const samplePrompts = [
    'How do I handle 50 surprise guests?',
    'What are hidden catering costs?',
    'Elder-friendly celebration layout',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const newMsgs: ChatMessage[] = [...messages, { sender: 'user', text }];
    setMessages(newMsgs);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHAT',
          message: text,
          contextSummary: 'Celebration planning event assistant',
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages([...newMsgs, { sender: 'assistant', text: data.reply }]);
      } else {
        setMessages([
          ...newMsgs,
          {
            sender: 'assistant',
            text: 'I recommend using our What-If simulator in the dashboard to model exact cost ripples for your event.',
          },
        ]);
      }
    } catch {
      setMessages([
        ...newMsgs,
        {
          sender: 'assistant',
          text: 'Consequence Tip: Whenever guest count shifts, catering scales per-plate while venue remains fixed.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Celebration Copilot Chatbot"
          className="w-14 h-14 rounded-full btn-glow-purple flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-105"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-label="Utsav Mitra AI Chatbot"
          className="w-88 sm:w-96 rounded-3xl glass-panel border border-white/20 shadow-2xl overflow-hidden flex flex-col h-[480px] animate-fade-in"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Utsav Mitra <Sparkles className="w-3 h-3 text-amber-400" />
                </h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Gemini 2.5 Flash Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chatbot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white/[0.02] border-b border-white/5 flex gap-1.5 overflow-x-auto text-[10px]">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-300 text-[10px] mt-0.5">
                    AI
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-br-none'
                      : 'bg-white/10 text-slate-200 border border-white/10 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex space-x-2 items-center text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>Utsav Mitra is reasoning...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-white/10 bg-black/40 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about budget trade-offs, timelines..."
              className="flex-1 bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
