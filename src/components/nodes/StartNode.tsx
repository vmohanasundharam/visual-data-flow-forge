import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Play } from 'lucide-react';

export const StartNode = memo(({ selected }: NodeProps) => {
  return (
    <Card className={`bg-flow-node-bg border-2 min-w-[150px] ${
      selected ? 'border-flow-primary' : 'border-flow-node-border'
    } shadow-lg hover:shadow-flow-primary/20 transition-all`}>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-flow-primary/20 flex items-center justify-center">
            <Play className="w-4 h-4 text-flow-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Start</h3>
            <p className="text-xs text-muted-foreground">Flow Entry Point</p>
          </div>
        </div>
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-flow-primary border-2 border-background"
      />
    </Card>
  );
});