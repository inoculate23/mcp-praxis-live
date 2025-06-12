import { useState, useCallback } from 'react';
import { MCPCommand, AudioTrack, VideoTrack, PraxisLiveNode } from '../types/multimedia';
import { llmService, MultimediaAction } from '../services/llmService';

interface MCPIntegrationProps {
  audioTracks: AudioTrack[];
  videoTracks: VideoTrack[];
  nodes: PraxisLiveNode[];
  onAudioUpdate: (trackId: string, updates: Partial<AudioTrack>) => void;
  onVideoUpdate: (trackId: string, updates: Partial<VideoTrack>) => void;
  onNodeUpdate: (nodeAddress: string, propertyId: string, value: any) => void;
}

export const useMCPIntegration = (props?: MCPIntegrationProps) => {
  const [commands, setCommands] = useState<MCPCommand[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const executeActions = useCallback((actions: MultimediaAction[]) => {
    if (!props) return;

    actions.forEach(action => {
      switch (action.type) {
        case 'audio':
          const audioUpdate: Partial<AudioTrack> = {
            [action.property]: action.value
          };
          props.onAudioUpdate(action.target, audioUpdate);
          break;

        case 'video':
          const videoUpdate: Partial<VideoTrack> = {
            [action.property]: action.value
          };
          props.onVideoUpdate(action.target, videoUpdate);
          break;

        case 'node':
          props.onNodeUpdate(action.target, action.property, action.value);
          break;
      }
    });
  }, [props]);

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
      const context = {
        audioTracks: props?.audioTracks || [],
        videoTracks: props?.videoTracks || [],
        nodes: props?.nodes || []
      };

      const response = await llmService.processCommand(command, context);
      
      if (response.success) {
        // Execute any actions returned by the LLM
        if (response.actions && response.actions.length > 0) {
          executeActions(response.actions);
        }

        setCommands(prev => 
          prev.map(cmd => 
            cmd.id === mcpCommand.id 
              ? { 
                  ...cmd, 
                  response: response.message,
                  status: 'success' as const,
                  actions: response.actions
                }
              : cmd
          )
        );
      } else {
        setCommands(prev => 
          prev.map(cmd => 
            cmd.id === mcpCommand.id 
              ? { 
                  ...cmd, 
                  response: response.message || 'Error processing command',
                  status: 'error' as const
                }
              : cmd
          )
        );
      }
    } catch (error) {
      setCommands(prev => 
        prev.map(cmd => 
          cmd.id === mcpCommand.id 
            ? { 
                ...cmd, 
                response: 'Error processing command: ' + (error instanceof Error ? error.message : 'Unknown error'),
                status: 'error' as const
              }
            : cmd
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, [props, executeActions]);

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