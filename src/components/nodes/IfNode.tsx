import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IfNodeConfigModal } from '@/components/IfNodeConfigModal';
import { Tag, Field, GlobalVariable } from '@/types/flow';

export const IfNode = memo(({ data, selected }: NodeProps) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleConfigure = () => {
    setIsConfigOpen(true);
  };

  const handleSaveConfig = (config: any) => {
    // Update node data with new configuration
    data.config = config;
  };

  return (
    <Card className={`bg-flow-node-bg border-2 min-w-[200px] ${
      selected ? 'border-flow-accent' : 'border-flow-node-border'
    } shadow-lg hover:shadow-flow-primary/20 transition-all`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-flow-accent/20 flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-flow-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">If Condition</h3>
              <p className="text-xs text-muted-foreground">Conditional Logic</p>
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
            {(data.config as any)?.conditions?.length || 0} conditions
          </Badge>
          {(data.config as any)?.grouping && (
            <Badge variant="outline" className="text-xs">
              Grouped
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
      
      {/* Output Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 bg-flow-success border-2 border-background"
        style={{ left: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 bg-flow-warning border-2 border-background"
        style={{ left: '75%' }}
      />
      
      {/* Handle Labels */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-4 text-xs text-muted-foreground">
        <span>True</span>
        <span>False</span>
      </div>

      <IfNodeConfigModal
        open={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSaveConfig}
        initialConfig={data.config}
        tags={(data as any).tags || []}
        fields={(data as any).fields || []}
        variables={(data as any).globalVariables || []}
      />
    </Card>
  );
});