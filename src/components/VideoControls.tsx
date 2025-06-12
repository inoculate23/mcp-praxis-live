import React from 'react';
import { Video, Eye, EyeOff, Settings, Monitor } from 'lucide-react';
import { VideoTrack } from '../types/multimedia';
import { Slider } from './Slider';
import { VideoPreview } from './VideoPreview';

interface VideoControlsProps {
  tracks: VideoTrack[];
  onTrackUpdate: (trackId: string, updates: Partial<VideoTrack>) => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({ tracks, onTrackUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Video Preview Section */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-secondary-400" />
          <h2 className="text-xl font-semibold text-white">Video Preview</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <VideoPreview 
            title="Live Preview" 
            className="w-full"
          />
          <VideoPreview 
            title="Final Output" 
            className="w-full"
          />
        </div>
      </div>

      {/* Video Controls Section */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Video className="w-5 h-5 text-secondary-400" />
          <h2 className="text-xl font-semibold text-white">Video Controls</h2>
        </div>

        <div className="space-y-4">
          {tracks.map((track) => (
            <div key={track.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">{track.name}</span>
                <button
                  onClick={() => onTrackUpdate(track.id, { visible: !track.visible })}
                  className={`p-1 rounded transition-colors ${
                    track.visible 
                      ? 'text-green-400 hover:text-green-300' 
                      : 'text-red-400 hover:text-red-300'
                  }`}
                >
                  {track.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Opacity</label>
                  <Slider
                    value={track.opacity}
                    onChange={(value) => onTrackUpdate(track.id, { opacity: value })}
                    min={0}
                    max={100}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Brightness</label>
                  <Slider
                    value={track.brightness}
                    onChange={(value) => onTrackUpdate(track.id, { brightness: value })}
                    min={-100}
                    max={100}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Contrast</label>
                  <Slider
                    value={track.contrast}
                    onChange={(value) => onTrackUpdate(track.id, { contrast: value })}
                    min={-100}
                    max={100}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Saturation</label>
                  <Slider
                    value={track.saturation}
                    onChange={(value) => onTrackUpdate(track.id, { saturation: value })}
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
    </div>
  );
};