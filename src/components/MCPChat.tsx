import React, { useState } from 'react';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { useMCPIntegration } from '../hooks/useMCPIntegration';

export const MCPChat: React.FC = () => {
  const [input, setInput] = useState('');
  const { commands, isProcessing, sendMCPCommand, clearCommands } = useMCPIntegration();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      sendMCPCommand(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
        </div>
        <button
          onClick={clearCommands}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {commands.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Start a conversation with the AI assistant</p>
            <p className="text-sm mt-1">Try: "Add reverb to track 1" or "Increase video brightness"</p>
          </div>
        ) : (
          commands.map((command) => (
            <div key={command.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div className="bg-blue-900/30 rounded-lg p-3 flex-1">
                  <p className="text-white">{command.command}</p>
                </div>
              </div>
              {command.response && (
                <div className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div className={`rounded-lg p-3 flex-1 ${
                    command.status === 'success' 
                      ? 'bg-green-900/30' 
                      : 'bg-red-900/30'
                  }`}>
                    <p className="text-white">{command.response}</p>
                  </div>
                </div>
              )}
              {command.status === 'pending' && (
                <div className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0 animate-pulse" />
                  <div className="bg-yellow-900/30 rounded-lg p-3 flex-1">
                    <p className="text-white">Processing...</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI to control audio/video..."
          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isProcessing}
        />
        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};