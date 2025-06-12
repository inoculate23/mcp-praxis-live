import { useState, useEffect, useCallback } from 'react';
import { PraxisLiveSocketConnection } from '../types/multimedia';

export const usePraxisLiveConnection = (url: string) => {
  const [connection, setConnection] = useState<PraxisLiveSocketConnection>({
    connected: false,
    url
  });
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 3;

  const connect = useCallback(() => {
    // Don't attempt connection if we've exceeded max attempts
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.log('Max reconnection attempts reached. Backend server may not be available.');
      return;
    }

    try {
      const ws = new WebSocket(url);
      
      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close();
          console.log('WebSocket connection timeout - backend server may not be running');
          setReconnectAttempts(prev => prev + 1);
        }
      }, 5000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        setConnection(prev => ({ 
          ...prev, 
          connected: true, 
          lastHeartbeat: Date.now() 
        }));
        setReconnectAttempts(0);
        console.log('Connected to Praxis-Live backend');
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        setConnection(prev => ({ ...prev, connected: false }));
        setSocket(null);
        
        if (event.code === 1006) {
          console.log('WebSocket connection failed - backend server is not running on port 8080');
        } else {
          console.log('Disconnected from Praxis-Live backend');
        }
      };

      ws.onerror = () => {
        clearTimeout(connectionTimeout);
        console.warn('WebSocket connection failed - this is expected if no backend server is running');
        setConnection(prev => ({ ...prev, connected: false }));
        setReconnectAttempts(prev => prev + 1);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Handle incoming messages from Praxis-Live
          console.log('Received from Praxis-Live:', data);
          
          // Update heartbeat timestamp
          setConnection(prev => ({ 
            ...prev, 
            lastHeartbeat: Date.now() 
          }));
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      setSocket(ws);
    } catch (error) {
      console.warn('Failed to create WebSocket connection:', error);
      setReconnectAttempts(prev => prev + 1);
    }
  }, [url, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    setReconnectAttempts(0);
  }, [socket]);

  const sendCommand = useCallback((command: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(command));
      return true;
    } else {
      // Log command that would be sent if connected
      console.log('Would send to Praxis-Live backend (not connected):', command);
      return false;
    }
  }, [socket]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return {
    connection,
    socket,
    connect,
    disconnect,
    sendCommand,
    canRetry: reconnectAttempts < maxReconnectAttempts
  };
};