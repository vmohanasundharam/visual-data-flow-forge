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
import { Trash2, Plus } from 'lucide-react';
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Data Mappings</Label>
            <Button onClick={addMapping} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Mapping
            </Button>
          </div>

          {config.mappings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No mappings configured. Click "Add Mapping" to start.
            </div>
          ) : (
            <div className="space-y-4">
              {config.mappings.map((mapping) => (
                <div key={mapping.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Mapping</Label>
                    <Button
                      onClick={() => removeMapping(mapping.id)}
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Source Type</Label>
                      <Select
                        value={mapping.sourceType}
                        onValueChange={(sourceType: 'field' | 'tag' | 'variable') =>
                          updateMapping(mapping.id, { sourceType, sourceId: '' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="field">Field</SelectItem>
                          <SelectItem value="tag">Tag</SelectItem>
                          <SelectItem value="variable">Global Variable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Source</Label>
                      <Select
                        value={mapping.sourceId}
                        onValueChange={(sourceId) => updateMapping(mapping.id, { sourceId })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${mapping.sourceType}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {getSourceOptions(mapping.sourceType).map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Key Name</Label>
                      <Input
                        placeholder="Enter key name"
                        value={mapping.keyName}
                        onChange={(e) => updateMapping(mapping.id, { keyName: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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