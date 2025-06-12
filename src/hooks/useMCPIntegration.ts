import { useState, useCallback } from 'react';
import { MCPCommand } from '../types/multimedia';

export const useMCPIntegration = () => {
  const [commands, setCommands] = useState<MCPCommand[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMCPCommand = useCallback(async (command: string) => {
    const mcpCommand: MCPCommand = {
      id: Date.now().toString(),
      command,
      timestamp: Date.now(),
      status: 'pending'
    };

    setCommands(prev => [...prev, mcpCommand]);
    setIsProcessing(true);

    try {
      // Simulate MCP server communication
      // In a real implementation, this would connect to your MCP server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = `Processed: ${command}`;
      
      setCommands(prev => 
        prev.map(cmd => 
          cmd.id === mcpCommand.id 
            ? { ...cmd, response, status: 'success' as const }
            : cmd
        )
      );
    } catch (error) {
      setCommands(prev => 
        prev.map(cmd => 
          cmd.id === mcpCommand.id 
            ? { ...cmd, response: 'Error processing command', status: 'error' as const }
            : cmd
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearCommands = useCallback(() => {
    setCommands([]);
  }, []);

  return {
    commands,
    isProcessing,
    sendMCPCommand,
    clearCommands
  };
};