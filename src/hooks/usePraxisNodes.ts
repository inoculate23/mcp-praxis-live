import { useState, useEffect, useCallback } from 'react';
import { PraxisLiveNode, PraxisLiveGraph, PraxisLiveMessage } from '../types/multimedia';

export const usePraxisLiveNodes = (socket: WebSocket | null, connected: boolean) => {
  const [nodes, setNodes] = useState<PraxisLiveNode[]>([]);
  const [graph, setGraph] = useState<PraxisLiveGraph | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all nodes and their parameters
  const fetchNodes = useCallback(async () => {
    if (!socket || !connected) return;

    setLoading(true);
    setError(null);

    try {
      // Request root graph info
      const graphMessage: PraxisLiveMessage = {
        type: 'call',
        id: `graph-${Date.now()}`,
        to: '',
        body: {
          type: 'info'
        }
      };

      socket.send(JSON.stringify(graphMessage));

      // Request all child nodes
      const childrenMessage: PraxisLiveMessage = {
        type: 'call',
        id: `children-${Date.now()}`,
        to: '',
        body: {
          type: 'children'
        }
      };

      socket.send(JSON.stringify(childrenMessage));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nodes');
      setLoading(false);
    }
  }, [socket, connected]);

  // Fetch detailed info for a specific node
  const fetchNodeDetails = useCallback(async (nodeAddress: string) => {
    if (!socket || !connected) return;

    try {
      // Get node info
      const infoMessage: PraxisLiveMessage = {
        type: 'call',
        id: `info-${Date.now()}`,
        to: nodeAddress,
        body: {
          type: 'info'
        }
      };

      socket.send(JSON.stringify(infoMessage));

      // Get node properties
      const propsMessage: PraxisLiveMessage = {
        type: 'call',
        id: `props-${Date.now()}`,
        to: nodeAddress,
        body: {
          type: 'list'
        }
      };

      socket.send(JSON.stringify(propsMessage));

    } catch (err) {
      console.error('Failed to fetch node details:', err);
    }
  }, [socket, connected]);

  // Update a node property
  const updateNodeProperty = useCallback(async (nodeAddress: string, propertyId: string, value: any) => {
    if (!socket || !connected) return false;

    try {
      const message: PraxisLiveMessage = {
        type: 'call',
        id: `set-${Date.now()}`,
        to: nodeAddress,
        body: {
          type: 'invoke',
          member: propertyId,
          args: [value]
        }
      };

      socket.send(JSON.stringify(message));
      return true;
    } catch (err) {
      console.error('Failed to update property:', err);
      return false;
    }
  }, [socket, connected]);

  // Handle incoming messages from Praxis-Live
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message: PraxisLiveMessage = JSON.parse(event.data);

        switch (message.type) {
          case 'reply':
            handleReply(message);
            break;
          case 'system':
            handleSystemMessage(message);
            break;
          case 'error':
            console.error('Praxis-Live error:', message.body);
            setError(message.body?.message || 'Unknown error');
            break;
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };

    const handleReply = (message: PraxisLiveMessage) => {
      if (!message.id || !message.body) return;

      if (message.id.startsWith('children-')) {
        // Handle children list response
        const children = message.body.children || [];
        children.forEach((childAddress: string) => {
          fetchNodeDetails(childAddress);
        });
      } else if (message.id.startsWith('info-')) {
        // Handle node info response
        const nodeInfo = message.body;
        updateNodeInfo(message.from || '', nodeInfo);
      } else if (message.id.startsWith('props-')) {
        // Handle properties list response
        const properties = message.body.properties || [];
        updateNodeProperties(message.from || '', properties);
      }
    };

    const handleSystemMessage = (message: PraxisLiveMessage) => {
      // Handle system notifications (graph changes, property updates, etc.)
      console.log('System message:', message);
      
      // Refresh nodes when graph changes
      if (message.body?.systemType === 'graph-changed') {
        fetchNodes();
      }
    };

    const updateNodeInfo = (address: string, info: any) => {
      setNodes(prev => {
        const existing = prev.find(n => n.address === address);
        if (existing) {
          return prev.map(n => 
            n.address === address 
              ? { ...n, info: { ...n.info, ...info } }
              : n
          );
        } else {
          const newNode: PraxisLiveNode = {
            id: address.replace(/\//g, '_'),
            type: info.type || 'unknown',
            address,
            info: {
              type: info.type || 'unknown',
              displayName: info.displayName || address.split('/').pop() || 'Unknown',
              category: info.category || 'general',
              description: info.description
            },
            properties: [],
            controls: info.controls || [],
            ports: info.ports || []
          };
          return [...prev, newNode];
        }
      });
    };

    const updateNodeProperties = (address: string, properties: any[]) => {
      setNodes(prev => 
        prev.map(node => 
          node.address === address 
            ? { 
                ...node, 
                properties: properties.map(prop => ({
                  id: prop.id || prop.name,
                  name: prop.name || prop.id,
                  type: prop.type || 'string',
                  value: prop.value,
                  defaultValue: prop.defaultValue,
                  readOnly: prop.readOnly || false,
                  info: prop.info
                }))
              }
            : node
        )
      );
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, fetchNodeDetails, fetchNodes]);

  // Auto-fetch nodes when connected
  useEffect(() => {
    if (connected && socket) {
      fetchNodes();
    } else {
      setNodes([]);
      setGraph(null);
    }
  }, [connected, socket, fetchNodes]);

  return {
    nodes,
    graph,
    loading,
    error,
    fetchNodes,
    fetchNodeDetails,
    updateNodeProperty
  };
};