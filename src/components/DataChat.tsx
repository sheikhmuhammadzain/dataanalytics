import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, MessageSquare, X } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { getChatCompletion } from '../services/groq';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

// Add a helper function to format markdown-style text
const formatMessage = (content: string) => {
  // First replace headers (###)
  let formattedContent = content.replace(
    /###\s*(.*?)(?:\n|$)/g,
    '<h3 class="text-lg font-semibold text-white/90 mt-3 mb-2">$1</h3>'
  );

  // Then replace bold text (**)
  formattedContent = formattedContent.replace(
    /\*\*(.*?)\*\*/g,
    '<span class="font-semibold text-white">$1</span>'
  );

  // Replace newlines with line breaks
  formattedContent = formattedContent.replace(/\n/g, '<br />');
  
  return (
    <span 
      dangerouslySetInnerHTML={{ 
        __html: formattedContent
      }} 
    />
  );
};

export const DataChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { processedData } = useDataStore();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getDataContext = () => {
    if (!processedData) return '';
    
    const { summary } = processedData;
    return `
      Dataset Summary:
      - Total rows: ${summary.rowCount}
      - Total columns: ${summary.columnCount}
      - Numerical columns: ${summary.numericalColumns.join(', ')}
      - Categorical columns: ${summary.categoricalColumns.join(', ')}
      
      Column Statistics:
      ${Object.entries(summary.columnStats)
        .map(([col, stats]) => {
          const statInfo = [];
          if (stats.min !== undefined) statInfo.push(`min: ${stats.min}`);
          if (stats.max !== undefined) statInfo.push(`max: ${stats.max}`);
          if (stats.mean !== undefined) statInfo.push(`mean: ${stats.mean.toFixed(2)}`);
          return `${col}: ${statInfo.join(', ')}`;
        })
        .join('\n')}
    `;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !processedData) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }]);

      await getChatCompletion(
        input,
        getDataContext(),
        (chunk) => {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content += chunk;
            }
            return newMessages;
          });
        }
      );

      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'assistant') {
          lastMessage.isStreaming = false;
        }
        return newMessages;
      });
    } catch (error) {
      console.error('Failed to get response:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error while processing your request.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!processedData) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="w-[450px] rounded-2xl border border-indigo-500/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 p-4 border-b border-indigo-500/10">
            <Bot className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white/90">Chat with your data</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-white/50 hover:text-white/90 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div 
            ref={chatContainerRef}
            className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-500/10 scrollbar-track-transparent"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-indigo-500/20 text-white/90'
                      : 'bg-white/10 text-white/80'
                  }`}
                >
                  <div className="prose prose-invert max-w-none [&>h3]:mt-4 [&>h3]:mb-2 [&>br]:my-2">
                    {formatMessage(message.content)}
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-indigo-500/10">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your data..."
                disabled={isLoading}
                className="flex-1 bg-white/5 text-white/90 placeholder-white/30 rounded-lg px-4 py-2.5 border border-indigo-500/10 focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-indigo-500/20 hover:bg-indigo-500/30 text-white/90 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-white/90 rounded-full shadow-lg transition-colors"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="font-medium">Chat with Data</span>
        </button>
      )}
    </div>
  );
};