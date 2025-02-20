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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">Chat with Your Data</h3>
      </div>

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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
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
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};