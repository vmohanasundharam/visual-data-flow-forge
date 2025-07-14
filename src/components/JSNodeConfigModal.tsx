import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ArgumentMapping {
  argumentName: string;
  source: string;
  sourceType: 'field' | 'tag' | 'variable';
}

interface JSNodeConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  initialConfig?: any;
}

export function JSNodeConfigModal({ open, onClose, onSave, initialConfig }: JSNodeConfigModalProps) {
  const [selectedFunction, setSelectedFunction] = useState(initialConfig?.functionName || '');
  const [argumentMappings, setArgumentMappings] = useState<ArgumentMapping[]>(
    initialConfig?.argumentMappings || []
  );

  // Mock JS functions for demo - these would come from the JSFunctionsModal data
  const availableFunctions = [
    { name: 'calculateSum', args: ['number1', 'number2'], returnType: 'number' },
    { name: 'formatString', args: ['text', 'prefix'], returnType: 'string' },
    { name: 'filterList', args: ['items', 'criteria'], returnType: 'list' },
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
        funcData.args.map(argName => ({
          argumentName: argName,
          source: '',
          sourceType: 'field' as const
        }))
      );
    }
  };

  const handleSave = () => {
    onSave({
      functionName: selectedFunction,
      argumentMappings,
      returnType: selectedFunctionData?.returnType
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
                {argumentMappings.map((mapping, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <Badge variant="outline" className="min-w-16">
                      {mapping.argumentName}
                    </Badge>
                    
                    <Select 
                      value={mapping.sourceType} 
                      onValueChange={(value) => updateArgumentMapping(index, 'sourceType', value)}
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

                    <Input
                      placeholder="Source name"
                      value={mapping.source}
                      onChange={(e) => updateArgumentMapping(index, 'source', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-sm">
                  <strong>Return Type:</strong> {selectedFunctionData.returnType}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Results will be mapped to global variables
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