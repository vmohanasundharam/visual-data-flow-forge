import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tag, Field, GlobalVariable } from '@/types/flow';

interface ArgumentMapping {
  argumentName: string;
  argumentType: string;
  source: string;
  sourceType: 'field' | 'tag' | 'variable';
}

interface JSNodeConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  initialConfig?: any;
  tags: Tag[];
  fields: Field[];
  variables: GlobalVariable[];
}

export function JSNodeConfigModal({ open, onClose, onSave, initialConfig, tags, fields, variables }: JSNodeConfigModalProps) {
  const [selectedFunction, setSelectedFunction] = useState(initialConfig?.functionName || '');
  const [argumentMappings, setArgumentMappings] = useState<ArgumentMapping[]>(
    initialConfig?.argumentMappings || []
  );
  const [returnVariable, setReturnVariable] = useState(initialConfig?.returnVariable || '');

  // Mock JS functions for demo - these would come from the JSFunctionsModal data
  const availableFunctions = [
    { name: 'calculateSum', args: [{ name: 'number1', type: 'number' }, { name: 'number2', type: 'number' }], returnType: 'number' },
    { name: 'formatString', args: [{ name: 'text', type: 'string' }, { name: 'prefix', type: 'string' }], returnType: 'string' },
    { name: 'filterList', args: [{ name: 'items', type: 'list' }, { name: 'criteria', type: 'string' }], returnType: 'list' },
  ];

  const selectedFunctionData = availableFunctions.find(f => f.name === selectedFunction);

  const updateArgumentMapping = (index: number, field: keyof ArgumentMapping, value: string) => {
    const updatedMappings = [...argumentMappings];
    updatedMappings[index] = { ...updatedMappings[index], [field]: value };
    setArgumentMappings(updatedMappings);
  };

  const handleFunctionSelect = (functionName: string) => {
    setSelectedFunction(functionName);
    const funcData = availableFunctions.find(f => f.name === functionName);
    if (funcData) {
      setArgumentMappings(
        funcData.args.map(arg => ({
          argumentName: arg.name,
          argumentType: arg.type,
          source: '',
          sourceType: 'field' as const
        }))
      );
    }
  };

  const getFilteredSources = (argumentType: string, sourceType: 'field' | 'tag' | 'variable') => {
    switch (sourceType) {
      case 'tag':
        return tags.filter(tag => {
          if (argumentType === 'number') return tag.type === 'number';
          if (argumentType === 'string') return tag.type === 'string';
          if (argumentType === 'list') return tag.type === 'object' && Array.isArray(tag.value);
          return true;
        });
      case 'field':
        return fields.filter(field => {
          if (argumentType === 'number') return field.type === 'number';
          if (argumentType === 'string') return field.type === 'string';
          return true;
        });
      case 'variable':
        return variables.filter(variable => {
          if (argumentType === 'number') return variable.type === 'number';
          if (argumentType === 'string') return variable.type === 'string';
          if (argumentType === 'list') return variable.type === 'list';
          if (argumentType === 'map') return variable.type === 'map';
          return true;
        });
      default:
        return [];
    }
  };

  const getReturnVariableOptions = () => {
    if (!selectedFunctionData) return [];
    return variables.filter(variable => {
      if (selectedFunctionData.returnType === 'number') return variable.type === 'number';
      if (selectedFunctionData.returnType === 'string') return variable.type === 'string';
      if (selectedFunctionData.returnType === 'list') return variable.type === 'list';
      if (selectedFunctionData.returnType === 'map') return variable.type === 'map';
      return true;
    });
  };

  const handleSave = () => {
    onSave({
      functionName: selectedFunction,
      argumentMappings,
      returnType: selectedFunctionData?.returnType,
      returnVariable
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure JavaScript Block</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="function-select">Select Function</Label>
            <Select value={selectedFunction} onValueChange={handleFunctionSelect}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a JavaScript function" />
              </SelectTrigger>
              <SelectContent>
                {availableFunctions.map(func => (
                  <SelectItem key={func.name} value={func.name}>
                    {func.name} ({func.args.length} args → {func.returnType})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFunctionData && (
            <div>
              <Label className="text-sm font-medium mb-3 block">Argument Mapping</Label>
              <div className="space-y-3">
                {argumentMappings.map((mapping, index) => {
                  const filteredSources = getFilteredSources(mapping.argumentType, mapping.sourceType);
                  
                  return (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      <div className="flex flex-col min-w-20">
                        <Badge variant="outline" className="text-xs">
                          {mapping.argumentName}
                        </Badge>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {mapping.argumentType}
                        </Badge>
                      </div>
                      
                        <Select 
                        value={mapping.sourceType} 
                        onValueChange={(value) => {
                          const newMappings = [...argumentMappings];
                          newMappings[index] = { 
                            ...newMappings[index], 
                            sourceType: value as 'field' | 'tag' | 'variable',
                            source: '' // Reset source when type changes
                          };
                          setArgumentMappings(newMappings);
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="field">Field</SelectItem>
                          <SelectItem value="tag">Tag</SelectItem>
                          <SelectItem value="variable">Variable</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={mapping.source}
                        onValueChange={(value) => updateArgumentMapping(index, 'source', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder={`Select ${mapping.sourceType}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSources.length === 0 ? (
                            <SelectItem value="" disabled>
                              No matching {mapping.sourceType}s found
                            </SelectItem>
                          ) : (
                            filteredSources.map((source: any) => (
                              <SelectItem key={source.id} value={source.name}>
                                {source.name} ({source.type})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="space-y-3">
                  <div className="text-sm">
                    <strong>Return Type:</strong> {selectedFunctionData.returnType}
                  </div>
                  
                  <div>
                    <Label className="text-sm">Map Result To Variable</Label>
                    <Select value={returnVariable} onValueChange={setReturnVariable}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select global variable" />
                      </SelectTrigger>
                      <SelectContent>
                        {getReturnVariableOptions().length === 0 ? (
                          <SelectItem value="" disabled>
                            No matching variables found
                          </SelectItem>
                        ) : (
                          getReturnVariableOptions().map((variable) => (
                            <SelectItem key={variable.id} value={variable.name}>
                              {variable.name} ({variable.type})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!selectedFunction}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}