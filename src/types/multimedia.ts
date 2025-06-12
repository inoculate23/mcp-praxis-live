export interface AudioTrack {
  id: string;
  name: string;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  effects: AudioEffect[];
}

export interface VideoTrack {
  id: string;
  name: string;
  opacity: number;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  visible: boolean;
  effects: VideoEffect[];
}

export interface AudioEffect {
  id: string;
  type: 'reverb' | 'delay' | 'filter' | 'compressor' | 'distortion';
  enabled: boolean;
  parameters: Record<string, number>;
}

export interface VideoEffect {
  id: string;
  type: 'blur' | 'sharpen' | 'colorgrade' | 'chromakey' | 'transform';
  enabled: boolean;
  parameters: Record<string, number>;
}

export interface MCPCommand {
  id: string;
  command: string;
  timestamp: number;
  response?: string;
  status: 'pending' | 'success' | 'error';
  actions?: any[];
}

export interface PraxisLiveSocketConnection {
  connected: boolean;
  url: string;
  lastHeartbeat?: number;
}

// Praxis-Live specific types
export interface PraxisLiveNode {
  id: string;
  type: string;
  address: string;
  info: PraxisLiveNodeInfo;
  properties: PraxisLiveProperty[];
  controls: PraxisLiveControl[];
  ports: PraxisLivePort[];
}

export interface PraxisLiveNodeInfo {
  type: string;
  displayName: string;
  category: string;
  description?: string;
}

export interface PraxisLiveProperty {
  id: string;
  name: string;
  type: 'number' | 'string' | 'boolean' | 'array' | 'object';
  value: any;
  defaultValue?: any;
  readOnly: boolean;
  info?: PraxisLivePropertyInfo;
}

export interface PraxisLivePropertyInfo {
  minimum?: number;
  maximum?: number;
  suggested?: any[];
  units?: string;
  description?: string;
}

export interface PraxisLiveControl {
  id: string;
  name: string;
  type: 'action' | 'function' | 'property';
  info?: PraxisLiveControlInfo;
}

export interface PraxisLiveControlInfo {
  inputs?: PraxisLiveArgument[];
  outputs?: PraxisLiveArgument[];
  description?: string;
}

export interface PraxisLiveArgument {
  id: string;
  type: string;
  info?: any;
}

export interface PraxisLivePort {
  id: string;
  type: 'input' | 'output';
  dataType: string;
  info?: any;
}

export interface PraxisLiveGraph {
  id: string;
  nodes: PraxisLiveNode[];
  connections: PraxisLiveConnection[];
}

export interface PraxisLiveConnection {
  id: string;
  sourceNode: string;
  sourcePort: string;
  targetNode: string;
  targetPort: string;
}

export interface PraxisLiveMessage {
  type: 'call' | 'reply' | 'error' | 'system';
  id?: string;
  to?: string;
  from?: string;
  body?: any;
  time?: number;
}

export interface PraxisLiveSystemMessage extends PraxisLiveMessage {
  type: 'system';
  systemType: 'graph-changed' | 'node-added' | 'node-removed' | 'property-changed';
  data: any;
}