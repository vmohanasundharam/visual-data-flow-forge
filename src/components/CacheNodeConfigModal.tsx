import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus } from 'lucide-react';
import { GlobalVariable, Tag, Field, CacheBlockConfig } from '@/types/flow';

interface CacheOperation {
  operation: 'get' | 'add' | 'update' | 'delete';
  value?: {
    sourceType: 'field' | 'tag' | 'variable' | 'custom';
    source?: string;
    customValue?: string;
  };
  resultVariable?: string;
}

interface CacheNodeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: CacheBlockConfig) => void;
  initialConfig?: CacheBlockConfig;
  globalVariables: GlobalVariable[];
  tags: Tag[];
  fields: Field[];
}

export function CacheNodeConfigModal({
  isOpen,
  onClose,
  onSave,
  initialConfig,
  globalVariables,
  tags,
  fields,
}: CacheNodeConfigModalProps) {
  const [keys, setKeys] = useState<Array<{
    key: {
      sourceType: 'field' | 'tag' | 'variable' | 'custom';
      source?: string;
      customValue?: string;
    };
    operation: CacheOperation;
  }>>(() => {
    if (initialConfig) {
      // Convert old format to new format
      const operation: CacheOperation = {
        operation: initialConfig.operation,
        value: initialConfig.value,
        resultVariable: initialConfig.resultVariable,
      };
      
      return [{
        key: initialConfig.key || { sourceType: 'field' },
        operation: operation
      }];
    }
    
    return [{
      key: { sourceType: 'field' },
      operation: { operation: 'get' }
    }];
  });

  const handleSave = () => {
    // Convert back to original format for compatibility (use first key/operation)
    const firstKey = keys[0];
    const firstOperation = firstKey?.operation;
    
    if (firstKey && firstOperation) {
      const config: CacheBlockConfig = {
        operation: firstOperation.operation,
        key: firstKey.key,
        value: firstOperation.value,
        resultVariable: firstOperation.resultVariable,
      };
      onSave(config);
    }
    onClose();
  };

  const addKey = () => {
    setKeys([...keys, {
      key: { sourceType: 'field' },
      operation: { operation: 'get' }
    }]);
  };

  const removeKey = (keyIndex: number) => {
    setKeys(keys.filter((_, i) => i !== keyIndex));
  };

  const updateKey = (keyIndex: number, key: any) => {
    const updatedKeys = [...keys];
    updatedKeys[keyIndex].key = key;
    setKeys(updatedKeys);
  };

  const updateOperation = (keyIndex: number, operation: CacheOperation) => {
    const updatedKeys = [...keys];
    updatedKeys[keyIndex].operation = operation;
    setKeys(updatedKeys);
  };

  const renderSourceSelector = (
    value: { sourceType: 'field' | 'tag' | 'variable' | 'custom'; source?: string; customValue?: string } | undefined,
    onChange: (newValue: { sourceType: 'field' | 'tag' | 'variable' | 'custom'; source?: string; customValue?: string }) => void,
    label: string
  ) => {
    const safeValue = value || { sourceType: 'field' as const };
    
    const getSourceOptions = () => {
      switch (safeValue.sourceType) {
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
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <Select
          value={safeValue.sourceType}
          onValueChange={(sourceType: 'field' | 'tag' | 'variable' | 'custom') =>
            onChange({ sourceType, source: undefined, customValue: undefined })
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border z-50">
            <SelectItem value="field">Field</SelectItem>
            <SelectItem value="tag">Tag</SelectItem>
            <SelectItem value="variable">Variable</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>

        {safeValue.sourceType === 'custom' ? (
          <Input
            placeholder="Enter custom value"
            value={safeValue.customValue || ''}
            onChange={(e) => onChange({ ...safeValue, customValue: e.target.value })}
            className="h-8"
          />
        ) : (
          <Select
            value={safeValue.source || ''}
            onValueChange={(source) => onChange({ ...safeValue, source })}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder={`Select ${safeValue.sourceType}`} />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              {getSourceOptions().map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-card border-flow-node-border">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Configure Cache Block
          </DialogTitle>
          <DialogDescription>
            Configure cache operations for your data pipeline. Each cache key supports one operation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {keys.map((keyConfig, keyIndex) => (
            <div 
              key={keyIndex} 
              className="border border-flow-node-border rounded-lg p-4 space-y-4"
            >
              {/* Header with key number and remove button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-flow-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {keyIndex + 1}
                  </div>
                  <span className="text-sm font-medium">Cache Key</span>
                </div>
                {keys.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeKey(keyIndex)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Key Configuration */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground border-b border-flow-node-border pb-1">
                    Source Selection
                  </h4>
                  {renderSourceSelector(
                    keyConfig.key,
                    (key) => updateKey(keyIndex, key),
                    'Key Source'
                  )}
                </div>

                {/* Right Column - Operations */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground border-b border-flow-node-border pb-1">
                    Operations & Result Mapping
                  </h4>

                  {/* Single Operation */}
                  <div className="space-y-3 p-3 bg-muted/30 rounded border border-muted">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-flow-secondary text-secondary-foreground text-xs flex items-center justify-center font-medium">
                        1
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        Operation
                      </span>
                    </div>

                    {/* Operation Type */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Operation Type</Label>
                      <Select
                        value={keyConfig.operation.operation}
                        onValueChange={(op: 'get' | 'add' | 'update' | 'delete') =>
                          updateOperation(keyIndex, { ...keyConfig.operation, operation: op })
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border z-50">
                          <SelectItem value="get">Get</SelectItem>
                          <SelectItem value="add">Add</SelectItem>
                          <SelectItem value="update">Update</SelectItem>
                          <SelectItem value="delete">Delete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Value Configuration (for add/update operations) */}
                    {(keyConfig.operation.operation === 'add' || keyConfig.operation.operation === 'update') && (
                      <div>
                        <Label className="text-xs font-medium mb-2 block">Value Source</Label>
                        {renderSourceSelector(
                          keyConfig.operation.value || { sourceType: 'field' },
                          (value) => updateOperation(keyIndex, { ...keyConfig.operation, value }),
                          'Value Selection'
                        )}
                      </div>
                    )}

                    {/* Result Variable (for get operation) */}
                    {keyConfig.operation.operation === 'get' && (
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Result Mapping</Label>
                        <div className="p-2 bg-background/50 rounded border border-border/50">
                          <Label className="text-xs text-muted-foreground mb-1 block">
                            Store result in variable:
                          </Label>
                          <Select
                            value={keyConfig.operation.resultVariable || ''}
                            onValueChange={(resultVariable) => 
                              updateOperation(keyIndex, { ...keyConfig.operation, resultVariable })
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select variable to store result" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border border-border z-50">
                              {globalVariables.map((variable) => (
                                <SelectItem key={variable.id} value={variable.id}>
                                  {variable.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Key Button */}
          <Button
            variant="outline"
            onClick={addKey}
            className="w-full border-dashed border-flow-node-border hover:border-flow-primary hover:bg-flow-primary/5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Cache Key
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-flow-secondary to-flow-primary hover:opacity-90">
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CacheNodeConfigModal;