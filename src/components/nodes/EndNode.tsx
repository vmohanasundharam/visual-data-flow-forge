import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Square } from 'lucide-react';

export const EndNode = memo(({ selected }: NodeProps) => {
  return (
    <Card className={`bg-flow-node-bg border-2 min-w-[150px] ${
      selected ? 'border-flow-warning' : 'border-flow-node-border'
    } shadow-lg hover:shadow-flow-warning/20 transition-all`}>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-flow-warning/20 flex items-center justify-center">
            <Square className="w-4 h-4 text-flow-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">End</h3>
            <p className="text-xs text-muted-foreground">Flow Termination</p>
          </div>
        </div>
      </div>
      
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-flow-primary border-2 border-background"
      />
    </Card>
  );
});