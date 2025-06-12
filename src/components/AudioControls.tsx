import React from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { AudioTrack } from '../types/multimedia';
import { Slider } from './Slider';

interface AudioControlsProps {
  tracks: AudioTrack[];
  onTrackUpdate: (trackId: string, updates: Partial<AudioTrack>) => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ tracks, onTrackUpdate }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Volume2 className="w-5 h-5 text-primary-400" />
        <h2 className="text-xl font-semibold text-white">Audio Controls</h2>
      </div>

      <div className="space-y-4">
        {tracks.map((track) => (
          <div key={track.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">{track.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTrackUpdate(track.id, { solo: !track.solo })}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    track.solo 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  SOLO
                </button>
                <button
                  onClick={() => onTrackUpdate(track.id, { muted: !track.muted })}
                  className={`p-1 rounded transition-colors ${
                    track.muted 
                      ? 'bg-red-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {track.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Volume</label>
                <Slider
                  value={track.volume}
                  onChange={(value) => onTrackUpdate(track.id, { volume: value })}
                  min={0}
                  max={100}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Pan</label>
                <Slider
                  value={track.pan}
                  onChange={(value) => onTrackUpdate(track.id, { pan: value })}
                  min={-100}
                  max={100}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                {track.effects.length} effect{track.effects.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};