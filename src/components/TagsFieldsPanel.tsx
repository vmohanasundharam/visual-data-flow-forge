import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, Tag as TagIcon, AlertTriangle } from 'lucide-react';
import { Tag, Field } from '@/types/flow';
import { useToast } from '@/hooks/use-toast';
import { useTagsFields } from '@/hooks/useTagsFields';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TagsFieldsPanelProps {
  dataSourceId: string;
  onDataSourceChange: (newSourceId: string) => void;
}

export function TagsFieldsPanel({ dataSourceId, onDataSourceChange }: TagsFieldsPanelProps) {
  const { toast } = useToast();
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [pendingSourceId, setPendingSourceId] = useState<string>('');
  
  // Use the shared hook for tags and fields
  const { tags, fields, loading, refetch } = useTagsFields(dataSourceId);


  const handleDataSourceChange = (sourceId: string) => {
    setPendingSourceId(sourceId);
    setShowChangeDialog(true);
  };

  const confirmDataSourceChange = () => {
    onDataSourceChange(pendingSourceId);
    setShowChangeDialog(false);
    toast({
      title: 'Data Source Changed',
      description: 'All builder blocks have been cleared'
    });
  };

  const formatValue = (value: any, type: string) => {
    if (type === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number':
        return 'bg-blue-500/20 text-blue-400';
      case 'string':
        return 'bg-green-500/20 text-green-400';
      case 'boolean':
        return 'bg-purple-500/20 text-purple-400';
      case 'object':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <>
      <div className="w-80 border-l border-flow-node-border bg-card/30 backdrop-blur-sm flex flex-col h-full">
        <div className="p-4 border-b border-flow-node-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Data Source</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={refetch}
              disabled={loading}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-flow-primary" />
            <span className="text-sm font-medium">Source ID: {dataSourceId}</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="tags" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
              <TabsTrigger value="tags" className="text-xs">
                Tags ({tags.length})
              </TabsTrigger>
              <TabsTrigger value="fields" className="text-xs">
                Fields ({fields.length})
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="tags" className="mt-0 space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <TagIcon className="w-4 h-4 text-flow-accent" />
                  <span className="text-sm font-medium">Sensor Tags</span>
                  <Badge variant="outline" className="text-xs">
                    Live Data
                  </Badge>
                </div>
                
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-flow-node-bg/50 rounded animate-pulse" />
                    ))}
                  </div>
                ) : tags.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <TagIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tags available</p>
                  </div>
                ) : (
                  tags.map((tag) => (
                    <Card key={tag.id} className="bg-flow-node-bg/50 border-flow-node-border">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{tag.name}</h4>
                          <Badge className={`text-xs ${getTypeColor(tag.type)}`}>
                            {tag.type}
                          </Badge>
                        </div>
                        <p className="text-sm font-mono text-muted-foreground">
                          {formatValue(tag.value, tag.type)}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="fields" className="mt-0 space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-flow-secondary" />
                  <span className="text-sm font-medium">Static Fields</span>
                  <Badge variant="outline" className="text-xs">
                    Metadata
                  </Badge>
                </div>
                
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-flow-node-bg/50 rounded animate-pulse" />
                    ))}
                  </div>
                ) : fields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No fields available</p>
                  </div>
                ) : (
                  fields.map((field) => (
                    <Card key={field.id} className="bg-flow-node-bg/50 border-flow-node-border">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{field.name}</h4>
                          <Badge className={`text-xs ${getTypeColor(field.type)}`}>
                            {field.type}
                          </Badge>
                        </div>
                        <p className="text-sm font-mono text-muted-foreground">
                          {formatValue(field.value, field.type)}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Data Source Change Confirmation */}
      <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
        <DialogContent className="sm:max-w-[400px] bg-card border-flow-node-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-flow-warning" />
              Confirm Data Source Change
            </DialogTitle>
            <DialogDescription>
              Changing the data source will clear all blocks in the flow builder. 
              This action cannot be undone. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowChangeDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmDataSourceChange}
              className="bg-flow-warning hover:bg-flow-warning/90"
            >
              Change Source
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}