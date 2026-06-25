import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, AlertCircle, RefreshCw, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  offlineMode?: boolean;
}

const SAMPLE_QUESTIONS = [
  "What do I need to register a Boda Boda motorcycle?",
  "How long does a Certificate of Good Conduct take?",
  "What is the cost for a new National ID Card?",
  "How do I renew my driving license?"
];

export default function AiAssistant({ isOpen, onClose }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      text: "Habari Mwananchi! I am Sema, your smart assistant. I can guide you step-by-step through any civil registry service, explain document requirements, fees, processing timelines, or help check your application tracker. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Build a historical chain for context
      const chatHistory = messages
        .filter(m => m.id !== "init")
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, chatHistory })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          id: `reply_${Date.now()}`,
          role: "assistant",
          text: data.reply,
          offlineMode: data.offlineMode
        }
      ]);

      if (data.offlineMode) {
        setDemoMode(true);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          text: "Mambo, I ran into a minor connection glitch. Please ensure the dev server is active and try again in a moment!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-white dark:bg-neutral-900 shadow-2xl border-l border-gray-200 dark:border-neutral-850 z-50 flex flex-col transition-colors"
          >
            {/* Drawer Header */}
            <div className="p-4 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white flex items-center justify-between border-b border-gray-200 dark:border-neutral-850 relative">
              {/* Patriotic stripe accent inside */}
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="bg-black flex-1" />
                <div className="bg-[#006600] w-2" />
                <div className="bg-red-600 w-2" />
                <div className="bg-white flex-1" />
              </div>

              <div className="flex items-center space-x-2.5 mt-1">
                <div className="w-8 h-8 rounded-sm bg-green-50/50 dark:bg-green-950/20 border border-gray-200 dark:border-neutral-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#006600]" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-widest leading-none">
                    Sema AI Assistant
                  </h3>
                  <span className="text-[9px] text-gray-400 font-mono tracking-wider block font-bold uppercase mt-1">
                    ONLINE • HELPDESK AGENT
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-sm hover:bg-gray-150 dark:hover:bg-neutral-800 text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Offline/Demo mode disclaimer banner */}
            {demoMode && (
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border-b border-gray-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] flex items-center space-x-2 px-4">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  <strong>Demo Mode active.</strong> Advanced Gemini logic is simulated locally. Provide <code>GEMINI_API_KEY</code> in Secrets for deep AI routing.
                </span>
              </div>
            )}

            {/* Message Feed list */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-neutral-950/20"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                    
                    {/* Icon indicator */}
                    <div className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs shrink-0 border ${
                      m.role === "user" 
                        ? "bg-[#006600] text-white border-green-700" 
                        : "bg-gray-100 dark:bg-neutral-800 text-[#006600] dark:text-green-400 border-gray-200 dark:border-neutral-700"
                    }`}>
                      {m.role === "user" ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    </div>

                    {/* Text container */}
                    <div className={`p-3 rounded-md text-xs sm:text-sm leading-relaxed border ${
                      m.role === "user"
                        ? "bg-gray-900 dark:bg-neutral-800 text-white border-gray-950"
                        : "bg-white dark:bg-neutral-900 text-gray-850 dark:text-neutral-200 border-gray-200 dark:border-neutral-800"
                    }`}>
                      <div className="whitespace-pre-line font-sans">{m.text}</div>
                    </div>

                  </div>
                </div>
              ))}

              {/* Pulsing loading state */}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="w-6 h-6 rounded-sm bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 flex items-center justify-center shrink-0">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#006600]" />
                    </div>
                    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-3 rounded-md shadow-xs flex space-x-1.5 items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006600] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006600] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006600] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Shortcuts Area */}
            {messages.length < 3 && (
              <div className="p-3 bg-gray-50 dark:bg-neutral-950/40 border-t border-gray-200 dark:border-neutral-850">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">
                  Click to Ask Sema
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(q)}
                      className="text-[10px] text-gray-600 dark:text-neutral-300 hover:text-[#006600] dark:hover:text-green-400 bg-white dark:bg-neutral-850 hover:bg-green-50/20 border border-gray-200 dark:border-neutral-800 px-2.5 py-1.5 rounded-sm transition-colors text-left uppercase tracking-tight font-bold cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-neutral-850 bg-white dark:bg-neutral-900 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Uliza chochote... (Ask Sema anything)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
                disabled={loading}
                className="flex-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md placeholder-gray-400 font-sans"
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || loading}
                className="p-2.5 bg-[#006600] text-white rounded-md hover:bg-green-800 disabled:bg-gray-300 dark:disabled:bg-neutral-800 disabled:text-gray-400 transition-all shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
