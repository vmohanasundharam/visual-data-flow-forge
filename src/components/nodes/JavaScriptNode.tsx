import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JSNodeConfigModal } from '@/components/JSNodeConfigModal';
import { Tag, Field, GlobalVariable } from '@/types/flow';

export const JavaScriptNode = memo(({ data, selected }: NodeProps) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleConfigure = () => {
    setIsConfigOpen(true);
  };

  const handleSaveConfig = (config: any) => {
    // Update node data with new configuration
    if (data.onUpdateNode && typeof data.onUpdateNode === 'function') {
      data.onUpdateNode(data.nodeId, { config });
    }
  };

  return (
    <Card className={`bg-flow-node-bg border-2 min-w-[200px] ${
      selected ? 'border-flow-secondary' : 'border-flow-node-border'
    } shadow-lg hover:shadow-flow-secondary/20 transition-all`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-flow-secondary/20 flex items-center justify-center">
              <Code className="w-4 h-4 text-flow-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">JavaScript</h3>
              <p className="text-xs text-muted-foreground">Custom Function</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleConfigure}
            className="h-6 w-6 p-0"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {(data.config as any)?.functionName || 'No function selected'}
          </Badge>
          {(data.config as any)?.argumentMappings && (
            <Badge variant="outline" className="text-xs">
              {(data.config as any).argumentMappings.length} args
            </Badge>
          )}
        </div>
      </div>
      
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-flow-primary border-2 border-background"
      />
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-flow-secondary border-2 border-background"
      />

      <JSNodeConfigModal
        open={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSaveConfig}
        initialConfig={data.config}
        tags={(data as any).tags || []}
        fields={(data as any).fields || []}
        variables={(data as any).globalVariables || []}
        functions={(data as any).functions || []}
      />
    </Card>
  );
});