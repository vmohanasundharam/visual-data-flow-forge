import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Settings, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PushToIoTBlockConfig } from '@/types/flow';

interface PushToIoTNodeProps {
  data: {
    label: string;
    config?: PushToIoTBlockConfig;
    onConfig?: () => void;
  };
}

const PushToIoTNode = memo(({ data }: PushToIoTNodeProps) => {
  const config = data.config;
  const mappingCount = config?.mappings?.length || 0;

  return (
    <div className="bg-background border-2 border-border rounded-lg p-4 min-w-[160px] shadow-lg">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
          <Wifi className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="font-medium text-sm">Push To IoT</span>
      </div>
      
      <div className="text-xs text-muted-foreground mb-3">
        {mappingCount > 0 ? `${mappingCount} mappings` : 'No mappings'}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={data.onConfig}
        className="w-full text-xs"
      >
        <Settings className="w-3 h-3 mr-1" />
        Configure
      </Button>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary"
      />
    </div>
  );
});

PushToIoTNode.displayName = 'PushToIoTNode';

export default PushToIoTNode;