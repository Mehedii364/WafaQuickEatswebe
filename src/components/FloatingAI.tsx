import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Zap,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { AppState } from '../services/store';
import { askWafaAI } from '../services/ai';
import { getTranslation } from '../i18n/translations';

interface FloatingAIProps {
  state: AppState;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const FloatingAI: React.FC<FloatingAIProps> = ({ state }) => {
  // If AI is turned OFF globally by Super Admin, do not render anything
  if (!state.isAiEnabled) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const t = getTranslation(state.language);

  const activeOrder = state.orders.find((o) => o.id === state.activeDeliveryId);
  const activeProvider = state.aiProviders.find((p) => p.isActive);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: t.aiGreeting,
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Context-specific quick chips based on active role
  const getPromptChips = () => {
    if (state.currentRole === 'customer') {
      return state.language === 'bn'
        ? ['আজকের সেরা কাচ্চি বিরিয়ানি কোনটি?', 'আমার ডেলিভারি এখন কোথায়?', 'ঝাল কম স্বাস্থ্যকর খাবার বলুন']
        : ['What is the best Kacchi Biryani today?', 'Where is my active delivery?', 'Healthy low-spice meal recommendations'];
    } else if (state.currentRole === 'rider') {
      return state.language === 'bn'
        ? ['ডেলিভারি ট্রাফিক জ্যাম নোট তৈরিতে সাহায্য করুন', 'গ্রাহকের ওটিপি যাচাই না হলে কি করব?', 'ধানমন্ডি ২৭ এ শর্টকাট রুট']
        : ['Help me write a traffic delay note', 'What to do if customer is unreachable?', 'Quick road shortcuts for Dhanmondi'];
    } else if (state.currentRole === 'restaurant_manager') {
      return state.language === 'bn'
        ? ['আজকের সবচেয়ে বেশি বিক্রিত আইটেম কী?', 'খাবার প্রিপারেশন সময় কিভাবে অপটিমাইজ করব?']
        : ['Top selling dish insights', 'Tips to reduce food prep time'];
    } else {
      return state.language === 'bn'
        ? ['আজকের অপারেশনাল সারসংক্ষেপ দিন', 'রাইডার পারফরম্যান্স রিপোর্ট']
        : ['Give today’s operational summary', 'Rider dispatch efficiency insights'];
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askWafaAI(
        query,
        {
          role: state.currentRole,
          lang: state.language,
          activeOrder,
          restaurants: state.restaurants
        },
        activeProvider
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: state.language === 'bn'
            ? 'দুঃখিত, বর্তমানে এআই সার্ভারে সংযোগ করতে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।'
            : 'Sorry, could not connect to AI services right now. Please try again.',
          time: 'Now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Circular Button: positioned bottom-right above mobile nav */}
      <div className="fixed bottom-18 md:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Assistant"
          className="relative group w-14 h-14 rounded-full bg-linear-to-tr from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl shadow-amber-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-hidden"
        >
          {/* Animated Neon Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-amber-400 opacity-40 blur-xs group-hover:opacity-75 animate-pulse" />
          <div className="relative flex items-center justify-center">
            {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 animate-bounce" />}
          </div>
          <span className="sr-only">Wafa QuickEats AI</span>
        </button>
      </div>

      {/* Floating AI Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 md:bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-h-[580px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Chat Header */}
          <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight text-white">
                    {t.aiAssistantTitle}
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className="text-[10px] text-slate-300">
                  {activeProvider?.name || 'Google Gemini 2.5 Flash'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome',
                      sender: 'ai',
                      text: t.aiGreeting,
                      time: 'Now'
                    }
                  ])
                }
                title="Reset Chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Context Indicator */}
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1.5 text-[11px] text-amber-900 font-medium flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-600" />
              <span>Role: <strong className="capitalize">{state.currentRole.replace('_', ' ')}</strong></span>
            </span>
            <span className="text-[10px] text-amber-700">Wafa Zone ⚡</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50/60 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                    ⚡
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-amber-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-amber-200' : 'text-slate-400'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs italic">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] text-slate-500 font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {getPromptChips().map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 text-[11px] font-medium transition-colors border border-slate-200/60"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.askAi}
              className="flex-1 bg-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
