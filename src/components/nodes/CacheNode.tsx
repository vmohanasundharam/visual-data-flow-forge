import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Database, Settings } from 'lucide-react';
import { CacheNodeConfigModal } from '@/components/CacheNodeConfigModal';
import { CacheBlockConfig } from '@/types/flow';

export const CacheNode = memo(({ data, selected }: NodeProps) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleConfigure = () => {
    setIsConfigOpen(true);
  };

  const handleSaveConfig = (config: any) => {
    if (data.onUpdateNode && typeof data.onUpdateNode === 'function') {
      data.onUpdateNode(data.nodeId, { config });
    }
  };

  return (
    <>
      <div className={`
        relative bg-card border-2 rounded-lg p-4 min-w-[160px] transition-colors
        ${selected ? 'border-flow-accent shadow-lg' : 'border-flow-node-border hover:border-flow-accent/50'}
      `}>
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-flow-primary border-2 border-background"
        />
        
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-flow-warning" />
          <span className="font-medium text-sm">Cache</span>
        </div>
        
        <div className="text-xs text-muted-foreground mb-3">
          {(data.config as CacheBlockConfig)?.operation ? (
            <span className="capitalize">{(data.config as CacheBlockConfig).operation} Operation</span>
          ) : (
            'Not configured'
          )}
        </div>
        
        <button
          onClick={handleConfigure}
          className="flex items-center gap-1 text-xs text-flow-primary hover:text-flow-secondary transition-colors"
        >
          <Settings className="w-3 h-3" />
          Configure
        </button>
        
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-flow-primary border-2 border-background"
        />
      </div>

      <CacheNodeConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSaveConfig}
        initialConfig={data.config as CacheBlockConfig}
        globalVariables={Array.isArray(data.globalVariables) ? data.globalVariables : []}
        tags={Array.isArray(data.tags) ? data.tags : []}
        fields={Array.isArray(data.fields) ? data.fields : []}
      />
    </>
  );
});

CacheNode.displayName = 'CacheNode';