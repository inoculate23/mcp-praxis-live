import React, { useState } from 'react';
import { Send, Bot, User, Trash2, Settings, AlertCircle } from 'lucide-react';
import { useMCPIntegration } from '../hooks/useMCPIntegration';
import { AudioTrack, VideoTrack, PraxisLiveNode } from '../types/multimedia';

interface MCPChatProps {
  audioTracks?: AudioTrack[];
  videoTracks?: VideoTrack[];
  nodes?: PraxisLiveNode[];
  onAudioUpdate?: (trackId: string, updates: Partial<AudioTrack>) => void;
  onVideoUpdate?: (trackId: string, updates: Partial<VideoTrack>) => void;
  onNodeUpdate?: (nodeAddress: string, propertyId: string, value: any) => void;
}

export const MCPChat: React.FC<MCPChatProps> = ({
  audioTracks = [],
  videoTracks = [],
  nodes = [],
  onAudioUpdate,
  onVideoUpdate,
  onNodeUpdate
}) => {
  const [input, setInput] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENAI_API_KEY || '');

  const { commands, isProcessing, sendMCPCommand, clearCommands } = useMCPIntegration({
    audioTracks,
    videoTracks,
    nodes,
    onAudioUpdate: onAudioUpdate || (() => {}),
    onVideoUpdate: onVideoUpdate || (() => {}),
    onNodeUpdate: onNodeUpdate || (() => {})
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      sendMCPCommand(input.trim());
      setInput('');
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      // In a real app, you'd want to securely store this
      localStorage.setItem('openai_api_key', apiKey);
      setShowApiKeyInput(false);
    }
  };

  const hasApiKey = !!(import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai_api_key'));

  return (
    <div className="bg-gray-900 rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
          {!hasApiKey && (
            <span title="API key not configured">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Configure API Key"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={clearCommands}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* API Key Configuration */}
      {showApiKeyInput && (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white font-medium">OpenAI API Configuration</span>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key..."
              className="flex-1 bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleApiKeySubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm transition-colors"
            >
              Save
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">OpenAI Platform</a>
          </p>
        </div>
      )}

      {/* Status Banner */}
      {!hasApiKey && (
        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-200 text-sm">
              Demo mode - Configure OpenAI API key for full AI functionality
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {commands.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Start a conversation with the AI assistant</p>
            <div className="text-sm mt-2 space-y-1">
              <p>Try commands like:</p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>"Set volume of track 1 to 80"</p>
                <p>"Increase video brightness by 20"</p>
                <p>"Mute all audio tracks"</p>
                <p>"Make the video more saturated"</p>
              </div>
            </div>
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
                    {command.actions && command.actions.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-600">
                        <p className="text-xs text-gray-400 mb-1">Actions performed:</p>
                        <div className="space-y-1">
                          {command.actions.map((action: any, index: number) => (
                            <div key={index} className="text-xs text-gray-300 bg-gray-800/50 rounded px-2 py-1">
                              {action.description}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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