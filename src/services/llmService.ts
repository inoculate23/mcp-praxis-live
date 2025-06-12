import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export interface LLMResponse {
  message: string;
  actions?: MultimediaAction[];
  success: boolean;
  error?: string;
}

export interface MultimediaAction {
  type: 'audio' | 'video' | 'node';
  target: string;
  property: string;
  value: any;
  description: string;
}

export class LLMService {
  private systemPrompt = `You are an AI assistant for a multimedia control system called Praxis-Live. You help users control audio and video parameters through natural language commands.

Available Controls:
- Audio tracks: volume (0-100), pan (-100 to 100), mute (true/false), solo (true/false)
- Video tracks: opacity (0-100), brightness (-100 to 100), contrast (-100 to 100), saturation (-100 to 100), hue (-100 to 100), visible (true/false)
- Praxis-Live nodes: various properties depending on node type

When users request changes, respond with:
1. A friendly confirmation message
2. JSON actions array with specific parameter changes

Example response format:
{
  "message": "I've increased the volume of Track 1 to 80 and added some reverb.",
  "actions": [
    {
      "type": "audio",
      "target": "1",
      "property": "volume",
      "value": 80,
      "description": "Set Track 1 volume to 80"
    }
  ]
}

Be conversational and helpful. If a request is unclear, ask for clarification.`;

  async processCommand(
    userMessage: string,
    context: {
      audioTracks: any[];
      videoTracks: any[];
      nodes: any[];
    }
  ): Promise<LLMResponse> {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        return this.getMockResponse(userMessage);
      }

      const contextInfo = `
Current System State:
Audio Tracks: ${context.audioTracks.map(t => `${t.name} (vol: ${t.volume}, pan: ${t.pan}, muted: ${t.muted})`).join(', ')}
Video Tracks: ${context.videoTracks.map(t => `${t.name} (opacity: ${t.opacity}, brightness: ${t.brightness})`).join(', ')}
Nodes: ${context.nodes.length} Praxis-Live nodes available
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: `${contextInfo}\n\nUser request: ${userMessage}` }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from LLM');
      }

      // Try to parse JSON response
      try {
        const parsed = JSON.parse(response);
        return {
          message: parsed.message,
          actions: parsed.actions || [],
          success: true
        };
      } catch {
        // If not JSON, treat as plain text response
        return {
          message: response,
          actions: this.extractActionsFromText(userMessage, context),
          success: true
        };
      }

    } catch (error) {
      console.error('LLM Service Error:', error);
      return {
        message: "I'm having trouble processing your request right now. Please try again or check your API configuration.",
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private getMockResponse(userMessage: string): LLMResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple pattern matching for demo purposes
    if (lowerMessage.includes('volume') || lowerMessage.includes('loud')) {
      return {
        message: "I've adjusted the audio volume as requested. Note: This is a demo response - connect your OpenAI API key for full AI functionality.",
        actions: [{
          type: 'audio',
          target: '1',
          property: 'volume',
          value: 75,
          description: 'Adjusted volume'
        }],
        success: true
      };
    }
    
    if (lowerMessage.includes('bright') || lowerMessage.includes('video')) {
      return {
        message: "I've adjusted the video brightness. Note: This is a demo response - connect your OpenAI API key for full AI functionality.",
        actions: [{
          type: 'video',
          target: '1',
          property: 'brightness',
          value: 20,
          description: 'Increased brightness'
        }],
        success: true
      };
    }

    return {
      message: "I understand you want to control multimedia parameters. This is a demo response - please add your OpenAI API key to the environment variables for full AI functionality.",
      actions: [],
      success: true
    };
  }

  private extractActionsFromText(userMessage: string, context: any): MultimediaAction[] {
    // Simple extraction logic for common commands
    const actions: MultimediaAction[] = [];
    const lowerMessage = userMessage.toLowerCase();

    // Find target track by name or number
    const findAudioTrack = (message: string) => {
      // Look for track numbers first
      const trackNumMatch = message.match(/track\s*(\d+)/i);
      if (trackNumMatch) {
        const trackNum = parseInt(trackNumMatch[1]) - 1; // Convert to 0-based index
        return context.audioTracks[trackNum]?.id || '1';
      }
      
      // Look for track names
      for (const track of context.audioTracks) {
        if (message.includes(track.name.toLowerCase())) {
          return track.id;
        }
      }
      
      // Default to first track
      return context.audioTracks[0]?.id || '1';
    };

    const findVideoTrack = (message: string) => {
      // Look for track numbers first
      const trackNumMatch = message.match(/track\s*(\d+)/i);
      if (trackNumMatch) {
        const trackNum = parseInt(trackNumMatch[1]) - 1; // Convert to 0-based index
        return context.videoTracks[trackNum]?.id || '1';
      }
      
      // Look for track names
      for (const track of context.videoTracks) {
        if (message.includes(track.name.toLowerCase())) {
          return track.id;
        }
      }
      
      // Default to first track
      return context.videoTracks[0]?.id || '1';
    };

    // Audio volume commands
    if (lowerMessage.includes('volume')) {
      const volumeMatch = lowerMessage.match(/volume.*?(\d+)/);
      if (volumeMatch) {
        const targetTrack = findAudioTrack(lowerMessage);
        actions.push({
          type: 'audio',
          target: targetTrack,
          property: 'volume',
          value: parseInt(volumeMatch[1]),
          description: `Set volume to ${volumeMatch[1]}`
        });
      }
    }

    // Video brightness commands
    if (lowerMessage.includes('brightness')) {
      const brightnessMatch = lowerMessage.match(/brightness.*?(-?\d+)/);
      if (brightnessMatch) {
        const targetTrack = findVideoTrack(lowerMessage);
        actions.push({
          type: 'video',
          target: targetTrack,
          property: 'brightness',
          value: parseInt(brightnessMatch[1]),
          description: `Set brightness to ${brightnessMatch[1]}`
        });
      }
    }

    return actions;
  }
}

export const llmService = new LLMService();