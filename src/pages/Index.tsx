import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Settings, Play, Download, Trash2 } from 'lucide-react';
import { FlowBuilder } from '@/components/FlowBuilder';
import { FlowDetailsModal } from '@/components/FlowDetailsModal';
import { GlobalVariablesModal } from '@/components/GlobalVariablesModal';
import { JSFunctionsModal } from '@/components/JSFunctionsModal';
import { TagsFieldsPanel } from '@/components/TagsFieldsPanel';
import { useToast } from '@/hooks/use-toast';
import { Flow, DataSource } from '@/types/flow';

const Index = () => {
  const { toast } = useToast();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showFlowModal, setShowFlowModal] = useState(false);
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [showFunctionsModal, setShowFunctionsModal] = useState(false);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [editingFlow, setEditingFlow] = useState<Flow | null>(null);

  useEffect(() => {
    loadDataSources();
    loadFlows();
  }, []);

  const loadDataSources = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockDataSources: DataSource[] = [
        { id: '1', name: 'Temperature Sensors', description: 'IoT temperature monitoring' },
        { id: '2', name: 'Pressure Gauges', description: 'Industrial pressure monitoring' },
        { id: '3', name: 'Flow Meters', description: 'Water flow measurement' }
      ];
      setDataSources(mockDataSources);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load data sources'
      });
    }
  };

  const loadFlows = () => {
    // Load flows from localStorage or API
    const savedFlows = localStorage.getItem('pipeline_flows');
    if (savedFlows) {
      const parsedFlows = JSON.parse(savedFlows).map((flow: any) => ({
        ...flow,
        createdAt: new Date(flow.createdAt),
        updatedAt: new Date(flow.updatedAt)
      }));
      setFlows(parsedFlows);
    }
  };

  const saveFlows = (updatedFlows: Flow[]) => {
    localStorage.setItem('pipeline_flows', JSON.stringify(updatedFlows));
    setFlows(updatedFlows);
  };

  const handleCreateFlow = () => {
    setEditingFlow(null);
    setShowFlowModal(true);
  };

  const handleEditFlow = (flow: Flow) => {
    setEditingFlow(flow);
    setShowFlowModal(true);
  };

  const handleDeleteFlow = (flowId: string) => {
    const updatedFlows = flows.filter(f => f.id !== flowId);
    saveFlows(updatedFlows);
    toast({
      title: 'Success',
      description: 'Flow deleted successfully'
    });
  };

  const handleSaveFlow = (flowData: Partial<Flow>) => {
    if (editingFlow) {
      // Update existing flow
      const updatedFlows = flows.map(f => 
        f.id === editingFlow.id 
          ? { ...f, ...flowData, updatedAt: new Date() }
          : f
      );
      saveFlows(updatedFlows);
    } else {
      // Create new flow
      const newFlow: Flow = {
        id: Date.now().toString(),
        name: flowData.name!,
        description: flowData.description,
        triggerType: flowData.triggerType!,
        triggerConfig: flowData.triggerConfig!,
        dataSourceId: flowData.dataSourceId,
        globalVariables: [],
        nodes: [
          {
            id: 'start',
            type: 'start',
            position: { x: 100, y: 100 },
            data: { label: 'Start' }
          }
        ],
        edges: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      saveFlows([...flows, newFlow]);
    }
    setShowFlowModal(false);
    toast({
      title: 'Success',
      description: editingFlow ? 'Flow updated successfully' : 'Flow created successfully'
    });
  };

  const handleOpenBuilder = (flow: Flow) => {
    setSelectedFlow(flow);
    setShowBuilder(true);
  };

  const handleExportFlow = (flow: Flow) => {
    const exportData = {
      ...flow,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flow.name.replace(/\s+/g, '_')}_flow.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Success',
      description: 'Flow exported successfully'
    });
  };

  if (showBuilder && selectedFlow) {
    return (
      <div className="min-h-screen bg-flow-canvas">
        <div className="flex h-screen">
          <div className="flex-1">
            <FlowBuilder 
              flow={selectedFlow}
              onSave={(updatedFlow) => {
                const updatedFlows = flows.map(f => 
                  f.id === updatedFlow.id ? updatedFlow : f
                );
                saveFlows(updatedFlows);
                setSelectedFlow(updatedFlow);
              }}
              onClose={() => setShowBuilder(false)}
              onOpenVariables={() => setShowVariablesModal(true)}
              onOpenFunctions={() => setShowFunctionsModal(true)}
            />
          </div>
          {selectedFlow.dataSourceId && (
            <TagsFieldsPanel 
              dataSourceId={selectedFlow.dataSourceId}
              onDataSourceChange={(newSourceId) => {
                const updatedFlow = { ...selectedFlow, dataSourceId: newSourceId };
                setSelectedFlow(updatedFlow);
                const updatedFlows = flows.map(f => 
                  f.id === updatedFlow.id ? updatedFlow : f
                );
                saveFlows(updatedFlows);
              }}
            />
          )}
        </div>
        
        {/* Modals */}
        <GlobalVariablesModal
          isOpen={showVariablesModal}
          onClose={() => setShowVariablesModal(false)}
          variables={selectedFlow.globalVariables}
          onSave={(variables) => {
            const updatedFlow = { ...selectedFlow, globalVariables: variables };
            setSelectedFlow(updatedFlow);
            const updatedFlows = flows.map(f => 
              f.id === updatedFlow.id ? updatedFlow : f
            );
            saveFlows(updatedFlows);
          }}
        />
        
        <JSFunctionsModal
          isOpen={showFunctionsModal}
          onClose={() => setShowFunctionsModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-flow-primary to-flow-secondary bg-clip-text text-transparent">
                Orchestrate the Blocks
              </h1>
              <p className="text-muted-foreground">Visual Pipeline Builder</p>
            </div>
            <Button 
              onClick={handleCreateFlow}
              className="bg-gradient-to-r from-flow-primary to-flow-secondary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Flow
            </Button>
          </div>
        </div>
      </div>

      {/* Flows Grid */}
      <div className="container mx-auto px-6 py-8">
        {flows.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-flow-node-bg border border-flow-node-border flex items-center justify-center">
              <Play className="w-8 h-8 text-flow-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No flows yet</h3>
            <p className="text-muted-foreground mb-4">Create your first data processing pipeline</p>
            <Button 
              onClick={handleCreateFlow}
              className="bg-gradient-to-r from-flow-primary to-flow-secondary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Flow
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((flow) => (
              <Card key={flow.id} className="bg-card/50 border-flow-node-border hover:border-flow-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{flow.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {flow.description || 'No description'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFlow(flow)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportFlow(flow)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFlow(flow.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Trigger:</span>
                      <span className="capitalize font-medium">{flow.triggerType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Nodes:</span>
                      <span className="font-medium">{flow.nodes.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Variables:</span>
                      <span className="font-medium">{flow.globalVariables.length}</span>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-flow-primary to-flow-secondary hover:opacity-90"
                      onClick={() => handleOpenBuilder(flow)}
                    >
                      Open Builder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Flow Details Modal */}
      <FlowDetailsModal
        isOpen={showFlowModal}
        onClose={() => setShowFlowModal(false)}
        onSave={handleSaveFlow}
        dataSources={dataSources}
        flow={editingFlow}
      />
    </div>
  );
};

export default Index;
