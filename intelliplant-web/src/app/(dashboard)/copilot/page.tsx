"use client";

import { useState } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoningSteps?: string[];
};

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am the IntelliPlant Copilot. Ask me about equipment like C-104 or V-20, or anything regarding P&ID diagrams.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.content })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        reasoningSteps: data.reasoning_steps
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to the intelligence backend.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-primary w-full relative">
      
      {/* Chat Transcript Area */}
      <div className="flex-1 overflow-y-auto w-full px-8 py-8 flex justify-center">
        <div className="w-full max-w-[800px] flex flex-col gap-6 pb-32">
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {msg.role === 'user' ? (
                <div className="bg-background-secondary shadow-sm rounded-sm px-5 py-3 text-text-primary text-base max-w-[85%]">
                  {msg.content}
                </div>
              ) : (
                <div className="flex flex-col items-start w-full gap-2">
                  {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                    <div className="flex flex-col gap-1 mb-2">
                      {msg.reasoningSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-text-secondary text-sm font-medium">
                          <span className="w-4 h-4 shadow-sm rounded-sm flex items-center justify-center bg-background-secondary text-xs">✓</span>
                          {step}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-text-primary text-base leading-relaxed space-y-4 max-w-[90%] whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {/* Confidence Badge & Feedback - only show for AI messages */}
                  <div className="flex items-center gap-4 mt-2">
                     <div className="inline-flex items-center gap-2 px-2 py-1 bg-background-secondary shadow-sm rounded-sm text-xs font-medium text-text-primary">
                       <span className="w-2 h-2 rounded-full bg-support-success shadow-sm"></span>
                       High Confidence
                     </div>
                     <div className="flex items-center gap-2 text-text-disabled">
                        <button className="hover:text-interactive-primary transition-colors cursor-pointer">👍</button>
                        <button className="hover:text-interactive-primary transition-colors cursor-pointer">👎</button>
                     </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start w-full gap-2">
              <div className="flex items-center gap-2 text-text-secondary text-sm font-medium mb-1">
                <span className="w-4 h-4 shadow-sm rounded-sm flex items-center justify-center bg-background-secondary text-xs animate-spin">↻</span>
                Querying Knowledge Graph...
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Input Box Area (Fixed at bottom) */}
      <div className="absolute bottom-0 left-0 w-full bg-background-primary shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pt-6 pb-6 px-6 flex justify-center z-10">
        <div className="w-full max-w-[800px] relative group">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the plant, an equipment tag, or compliance..."
            className="w-full bg-white shadow-md rounded-sm px-4 py-4 pr-16 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-interactive-primary transition-all duration-300 ease-in-out"
            rows={2}
          ></textarea>
          <div className="absolute right-3 top-3 flex gap-2">
            <button aria-label="Voice input" className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-interactive-primary transition-colors disabled:opacity-50 cursor-pointer" disabled={isLoading}>
              🎤
            </button>
            <button 
              aria-label="Send message"
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className="w-8 h-8 bg-interactive-primary text-white rounded-sm flex items-center justify-center hover:bg-interactive-hover hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              ↑
            </button>
          </div>
          <div className="text-center text-xs text-text-disabled mt-3 font-medium">
            IntelliPlant Copilot can make mistakes. Check critical safety source documents.
          </div>
        </div>
      </div>
      
    </div>
  );
}
