import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Settings, Zap, Eye, EyeOff } from 'lucide-react';
import { PraxisLiveNode, PraxisLiveProperty } from '../types/multimedia';
import { Slider } from './Slider';

interface NodeExplorerProps {
  nodes: PraxisLiveNode[];
  onPropertyUpdate: (nodeAddress: string, propertyId: string, value: any) => void;
  loading: boolean;
}

export const NodeExplorer: React.FC<NodeExplorerProps> = ({ 
  nodes, 
  onPropertyUpdate, 
  loading 
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('');

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const filteredNodes = nodes.filter(node => 
    node.info.displayName.toLowerCase().includes(filter.toLowerCase()) ||
    node.info.category.toLowerCase().includes(filter.toLowerCase()) ||
    node.address.toLowerCase().includes(filter.toLowerCase())
  );

  const renderProperty = (node: PraxisLiveNode, property: PraxisLiveProperty) => {
    const handleChange = (value: any) => {
      onPropertyUpdate(node.address, property.id, value);
    };

    switch (property.type) {
      case 'number':
        const min = property.info?.minimum ?? 0;
        const max = property.info?.maximum ?? 100;
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">{property.name}</span>
              <span className="text-xs text-gray-500">
                {property.value} {property.info?.units || ''}
              </span>
            </div>
            <Slider
              value={Number(property.value) || 0}
              onChange={handleChange}
              min={min}
              max={max}
              step={property.info?.units === 'Hz' ? 1 : 0.1}
              className="w-full"
            />
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{property.name}</span>
            <button
              onClick={() => handleChange(!property.value)}
              className={`p-1 rounded transition-colors ${
                property.value 
                  ? 'text-green-400 hover:text-green-300' 
                  : 'text-red-400 hover:text-red-300'
              }`}
              disabled={property.readOnly}
            >
              {property.value ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        );

      case 'string':
        if (property.info?.suggested && property.info.suggested.length > 0) {
          return (
            <div className="space-y-1">
              <label className="text-sm text-gray-300">{property.name}</label>
              <select
                value={property.value || ''}
                onChange={(e) => handleChange(e.target.value)}
                disabled={property.readOnly}
                className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
              >
                {property.info.suggested.map((option: any) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        } else {
          return (
            <div className="space-y-1">
              <label className="text-sm text-gray-300">{property.name}</label>
              <input
                type="text"
                value={property.value || ''}
                onChange={(e) => handleChange(e.target.value)}
                disabled={property.readOnly}
                className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
              />
            </div>
          );
        }

      default:
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{property.name}</span>
            <span className="text-xs text-gray-500 font-mono">
              {JSON.stringify(property.value)}
            </span>
          </div>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'audio':
      case 'sound':
        return '🔊';
      case 'video':
      case 'visual':
        return '🎥';
      case 'control':
        return '🎛️';
      case 'effect':
        return '✨';
      default:
        return '⚙️';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-400">Loading nodes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Praxis-Live Nodes</h2>
        <span className="text-sm text-gray-400">({nodes.length})</span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter nodes..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredNodes.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            {nodes.length === 0 ? 'No nodes found' : 'No nodes match filter'}
          </div>
        ) : (
          filteredNodes.map((node) => (
            <div key={node.id} className="bg-gray-800 rounded-lg">
              <button
                onClick={() => toggleNode(node.id)}
                className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-700 transition-colors rounded-lg"
              >
                {expandedNodes.has(node.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-lg mr-2">
                  {getCategoryIcon(node.info.category)}
                </span>
                <div className="flex-1">
                  <div className="text-white font-medium">{node.info.displayName}</div>
                  <div className="text-xs text-gray-400">
                    {node.info.category} • {node.address}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">
                    {node.properties.length} props
                  </span>
                  {node.controls.length > 0 && (
                    <Zap className="w-3 h-3 text-yellow-400" />
                  )}
                </div>
              </button>

              {expandedNodes.has(node.id) && (
                <div className="px-3 pb-3 space-y-3">
                  {node.info.description && (
                    <p className="text-sm text-gray-400 italic">
                      {node.info.description}
                    </p>
                  )}
                  
                  {node.properties.length > 0 ? (
                    <div className="space-y-3">
                      {node.properties.map((property) => (
                        <div key={property.id} className="bg-gray-700 rounded p-3">
                          {renderProperty(node, property)}
                          {property.info?.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {property.info.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No properties available
                    </div>
                  )}

                  {node.controls.length > 0 && (
                    <div className="border-t border-gray-600 pt-2">
                      <div className="text-xs text-gray-400 mb-2">Controls:</div>
                      <div className="flex flex-wrap gap-1">
                        {node.controls.map((control) => (
                          <span
                            key={control.id}
                            className="px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded text-xs"
                          >
                            {control.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};