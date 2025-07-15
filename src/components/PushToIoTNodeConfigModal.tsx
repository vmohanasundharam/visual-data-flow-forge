import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PushToIoTBlockConfig, Tag, Field, GlobalVariable } from '@/types/flow';

interface PushToIoTNodeConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: PushToIoTBlockConfig) => void;
  initialConfig?: PushToIoTBlockConfig;
  globalVariables: GlobalVariable[];
  tags: Tag[];
  fields: Field[];
}

export function PushToIoTNodeConfigModal({
  open,
  onClose,
  onSave,
  initialConfig,
  globalVariables,
  tags,
  fields,
}: PushToIoTNodeConfigModalProps) {
  const [config, setConfig] = useState<PushToIoTBlockConfig>(() => {
    const defaultConfig: PushToIoTBlockConfig = {
      mappings: [],
    };
    
    if (initialConfig) {
      return {
        ...defaultConfig,
        ...initialConfig,
        mappings: initialConfig.mappings || [],
      };
    }
    
    return defaultConfig;
  });

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const addMapping = () => {
    const newMapping = {
      id: `mapping_${Date.now()}`,
      sourceType: 'field' as const,
      sourceId: '',
      keyName: '',
    };
    
    setConfig(prev => ({
      ...prev,
      mappings: [...prev.mappings, newMapping],
    }));
  };

  const removeMapping = (id: string) => {
    setConfig(prev => ({
      ...prev,
      mappings: prev.mappings.filter(mapping => mapping.id !== id),
    }));
  };

  const updateMapping = (id: string, updates: Partial<typeof config.mappings[0]>) => {
    setConfig(prev => ({
      ...prev,
      mappings: prev.mappings.map(mapping =>
        mapping.id === id ? { ...mapping, ...updates } : mapping
      ),
    }));
  };

  const getSourceOptions = (sourceType: 'field' | 'tag' | 'variable') => {
    switch (sourceType) {
      case 'field':
        return fields.map(field => ({ id: field.id, name: field.name }));
      case 'tag':
        return tags.map(tag => ({ id: tag.id, name: tag.name }));
      case 'variable':
        return globalVariables.map(variable => ({ id: variable.id, name: variable.name }));
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Push To IoT</DialogTitle>
          <DialogDescription>
            Map tags, fields, and global variables to key names for IoT data transmission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Data Mappings</Label>
            {config.mappings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No mappings configured</p>
                <p className="text-sm">Add a mapping to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {config.mappings.map((mapping, index) => (
                  <div key={mapping.id} className="flex items-center gap-2 p-3 border rounded-lg">
                    <Badge variant="outline" className="min-w-8">{index + 1}</Badge>
                    
                    <Select
                      value={mapping.sourceType}
                      onValueChange={(value: 'field' | 'tag' | 'variable') => 
                        updateMapping(mapping.id, { sourceType: value, sourceId: '' })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        <SelectItem value="field">Field</SelectItem>
                        <SelectItem value="tag">Tag</SelectItem>
                        <SelectItem value="variable">Variable</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={mapping.sourceId}
                      onValueChange={(value) => updateMapping(mapping.id, { sourceId: value })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        {getSourceOptions(mapping.sourceType).length === 0 ? (
                          <div className="px-2 py-1 text-sm text-muted-foreground">
                            No {mapping.sourceType}s available
                          </div>
                        ) : (
                          getSourceOptions(mapping.sourceType).map(option => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>

                    <Input
                      value={mapping.keyName}
                      onChange={(e) => updateMapping(mapping.id, { keyName: e.target.value })}
                      placeholder="Key name"
                      className="flex-1"
                    />

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeMapping(mapping.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={addMapping}
              className="mt-3"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Mapping
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}