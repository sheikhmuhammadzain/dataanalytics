import React, { useState } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { getChatCompletion } from '../services/groq';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const DataChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { processedData } = useDataStore();

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
      const response = await getChatCompletion(input, getDataContext());
      const assistantMessage = { role: 'assistant' as const, content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error while processing your request.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!processedData) return null;

  return (
    <div className="h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask questions about your data..."
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};