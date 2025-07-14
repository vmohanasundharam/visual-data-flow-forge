import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ConnectionMode,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Settings, Code, Plus } from 'lucide-react';
import { Flow, FlowNode, FlowEdge } from '@/types/flow';
import { IfNode } from '@/components/nodes/IfNode';
import { JavaScriptNode } from '@/components/nodes/JavaScriptNode';
import { StartNode } from '@/components/nodes/StartNode';
import { EndNode } from '@/components/nodes/EndNode';
import { useToast } from '@/hooks/use-toast';

const nodeTypes = {
  if: IfNode,
  javascript: JavaScriptNode,
  start: StartNode,
  end: EndNode,
};

const edgeOptions = {
  animated: true,
  style: { stroke: 'hsl(var(--flow-primary))' },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'hsl(var(--flow-primary))',
  },
};

interface FlowBuilderProps {
  flow: Flow;
  onSave: (flow: Flow) => void;
  onClose: () => void;
  onOpenVariables: () => void;
  onOpenFunctions: () => void;
}

export function FlowBuilder({ flow, onSave, onClose, onOpenVariables, onOpenFunctions }: FlowBuilderProps) {
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(true);
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge: FlowEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        ...edgeOptions,
      } as FlowEdge;
      setEdges((eds) => addEdge(edge, eds) as FlowEdge[]);
    },
    [setEdges]
  );

  const handleSave = () => {
    const updatedFlow: Flow = {
      ...flow,
      nodes: nodes as FlowNode[],
      edges: edges as FlowEdge[],
      updatedAt: new Date(),
    };
    onSave(updatedFlow);
    setHasChanges(false);
    toast({
      title: 'Success',
      description: 'Flow saved successfully',
    });
  };

  const addNode = (type: 'if' | 'javascript' | 'end') => {
    const newNode: FlowNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400 + 200, y: Math.random() * 400 + 200 },
      data: {
        label: type === 'if' ? 'If Condition' : type === 'javascript' ? 'JavaScript' : 'End',
        config: {},
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="flex flex-col h-screen bg-flow-canvas">
      {/* Toolbar */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-flow-node-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="font-semibold text-lg">{flow.name}</h2>
            <p className="text-sm text-muted-foreground">Flow Builder</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onOpenVariables}>
            <Settings className="w-4 h-4 mr-2" />
            Variables
          </Button>
          <Button variant="outline" onClick={onOpenFunctions}>
            <Code className="w-4 h-4 mr-2" />
            Functions
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-gradient-to-r from-flow-primary to-flow-secondary hover:opacity-90"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Node Palette */}
      <div className="bg-card/50 border-b border-flow-node-border p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Add Block:</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addNode('if')}
            className="hover:border-flow-accent"
          >
            <Plus className="w-3 h-3 mr-1" />
            If Block
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addNode('javascript')}
            className="hover:border-flow-secondary"
          >
            <Plus className="w-3 h-3 mr-1" />
            JavaScript
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addNode('end')}
            className="hover:border-flow-warning"
          >
            <Plus className="w-3 h-3 mr-1" />
            End Block
          </Button>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              globalVariables: flow.globalVariables,
              tags: [], // TODO: Get from data source
              fields: [], // TODO: Get from data source
            }
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={edgeOptions}
          fitView
          className="bg-flow-canvas"
        >
          <Background 
            color="hsl(var(--flow-grid))" 
            gap={20} 
            size={1}
            variant={BackgroundVariant.Dots}
          />
          <Controls 
            className="bg-card/80 backdrop-blur-sm border border-flow-node-border"
          />
          <MiniMap 
            className="bg-card/80 backdrop-blur-sm border border-flow-node-border"
            nodeColor="hsl(var(--flow-primary))"
            maskColor="hsl(var(--flow-canvas) / 0.8)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}