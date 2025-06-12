import React from 'react';
import { Wifi, WifiOff, Activity } from 'lucide-react';
import { PraxisLiveSocketConnection } from '../types/multimedia';

interface ConnectionStatusProps {
  connection: PraxisLiveSocketConnection;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connection,
  onConnect,
  onDisconnect
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {connection.connected ? (
            <div className="flex items-center gap-2 text-green-400">
              <Wifi className="w-5 h-5" />
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-400">
              <WifiOff className="w-5 h-5" />
              <span className="font-medium">Disconnected</span>
            </div>
          )}
          <span className="text-gray-400 text-sm">{connection.url}</span>
        </div>
        
        <button
          onClick={connection.connected ? onDisconnect : onConnect}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            connection.connected
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {connection.connected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
      
      {connection.lastHeartbeat && (
        <div className="mt-2 text-xs text-gray-500">
          Last heartbeat: {new Date(connection.lastHeartbeat).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};