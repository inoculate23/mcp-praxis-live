import { useState } from 'react';
import { AudioControls } from './components/AudioControls';
import { VideoControls } from './components/VideoControls';
import { MCPChat } from './components/MCPChat';
import { ConnectionStatus } from './components/ConnectionStatus';
import { NodeExplorer } from './components/NodeExplorer';
import { usePraxisLiveConnection } from './hooks/usePraxisConnection';
import { usePraxisLiveNodes } from './hooks/usePraxisNodes';
import { AudioTrack, VideoTrack } from './types/multimedia';
import { Headphones, Video, Bot, Settings, Network } from 'lucide-react';

function App() {
  const { connection, socket, connect, disconnect, sendCommand, canRetry } = usePraxisLiveConnection('ws://localhost:8080/ws');
  const { nodes, loading, fetchNodes, updateNodeProperty } = usePraxisLiveNodes(socket, connection.connected);
  
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([
    {
      id: '1',
      name: 'Master Audio',
      volume: 75,
      pan: 0,
      muted: false,
      solo: false,
      effects: []
    },
    {
      id: '2',
      name: 'Track 1',
      volume: 60,
      pan: -25,
      muted: false,
      solo: false,
      effects: []
    },
    {
      id: '3',
      name: 'Track 2',
      volume: 80,
      pan: 25,
      muted: false,
      solo: false,
      effects: []
    }
  ]);

  const [videoTracks, setVideoTracks] = useState<VideoTrack[]>([
    {
      id: '1',
      name: 'Main Video',
      opacity: 100,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hue: 0,
      visible: true,
      effects: []
    },
    {
      id: '2',
      name: 'Overlay 1',
      opacity: 75,
      brightness: 10,
      contrast: 5,
      saturation: 0,
      hue: 0,
      visible: true,
      effects: []
    }
  ]);

  const [activeTab, setActiveTab] = useState<'audio' | 'video' | 'nodes' | 'ai'>('nodes');

  const handleAudioTrackUpdate = (trackId: string, updates: Partial<AudioTrack>) => {
    setAudioTracks(prev => 
      prev.map(track => 
        track.id === trackId ? { ...track, ...updates } : track
      )
    );
    
    // Send command to Praxis-Live backend (will log if not connected)
    sendCommand({
      type: 'audio_update',
      trackId,
      updates
    });
  };

  const handleVideoTrackUpdate = (trackId: string, updates: Partial<VideoTrack>) => {
    setVideoTracks(prev => 
      prev.map(track => 
        track.id === trackId ? { ...track, ...updates } : track
      )
    );
    
    // Send command to Praxis-Live backend (will log if not connected)
    sendCommand({
      type: 'video_update',
      trackId,
      updates
    });
  };

  const handleNodePropertyUpdate = async (nodeAddress: string, propertyId: string, value: any) => {
    const success = await updateNodeProperty(nodeAddress, propertyId, value);
    if (!success) {
      console.warn('Failed to update node property - not connected to backend');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Praxis-Live Multimedia Control Center
          </h1>
          <p className="text-gray-400">
            AI-powered audio and video processing with intelligent control
          </p>
          {!connection.connected && (
            <div className="mt-2 p-3 bg-yellow-900/50 border border-yellow-600 rounded-lg">
              <p className="text-yellow-200 text-sm">
                <strong>Note:</strong> Backend server is not running. The interface will work in demo mode.
                {canRetry && " You can try connecting to a Praxis-Live backend server."}
              </p>
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="mb-6">
          <ConnectionStatus
            connection={connection}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('nodes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'nodes'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Network className="w-4 h-4" />
            Nodes
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'audio'
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Headphones className="w-4 h-4" />
            Audio
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'video'
                ? 'bg-secondary-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Video className="w-4 h-4" />
            Video
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'ai'
                ? 'bg-green-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Bot className="w-4 h-4" />
            AI Assistant
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'nodes' && (
              <NodeExplorer
                nodes={nodes}
                onPropertyUpdate={handleNodePropertyUpdate}
                loading={loading}
              />
            )}
            {activeTab === 'audio' && (
              <AudioControls
                tracks={audioTracks}
                onTrackUpdate={handleAudioTrackUpdate}
              />
            )}
            {activeTab === 'video' && (
              <VideoControls
                tracks={videoTracks}
                onTrackUpdate={handleVideoTrackUpdate}
              />
            )}
            {activeTab === 'ai' && (
              <div className="h-[600px]">
                <MCPChat
                  audioTracks={audioTracks}
                  videoTracks={videoTracks}
                  nodes={nodes}
                  onAudioUpdate={handleAudioTrackUpdate}
                  onVideoUpdate={handleVideoTrackUpdate}
                  onNodeUpdate={handleNodePropertyUpdate}
                />
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {activeTab !== 'ai' && (
              <div className="h-[400px]">
                <MCPChat
                  audioTracks={audioTracks}
                  videoTracks={videoTracks}
                  nodes={nodes}
                  onAudioUpdate={handleAudioTrackUpdate}
                  onVideoUpdate={handleVideoTrackUpdate}
                  onNodeUpdate={handleNodePropertyUpdate}
                />
              </div>
            )}
            
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-white">System Status</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Praxis-Live Nodes:</span>
                  <span className="text-white">{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Audio Tracks:</span>
                  <span className="text-white">{audioTracks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Video Tracks:</span>
                  <span className="text-white">{videoTracks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Connection:</span>
                  <span className={connection.connected ? 'text-green-400' : 'text-red-400'}>
                    {connection.connected ? 'Active' : 'Demo Mode'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Status:</span>
                  <span className={import.meta.env.VITE_OPENAI_API_KEY ? 'text-green-400' : 'text-yellow-400'}>
                    {import.meta.env.VITE_OPENAI_API_KEY ? 'Connected' : 'Demo Mode'}
                  </span>
                </div>
              </div>
              
              {connection.connected && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={fetchNodes}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 text-sm transition-colors"
                  >
                    Refresh Nodes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;