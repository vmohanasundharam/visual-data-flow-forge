import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tag, Field, GlobalVariable, JSFunction } from '@/types/flow';
import { config } from '@/config';

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
  functions: JSFunction[];
}

export function JSNodeConfigModal({ open, onClose, onSave, initialConfig, tags, fields, variables, functions }: JSNodeConfigModalProps) {
  const [selectedFunction, setSelectedFunction] = useState(initialConfig?.functionName || '');
  const [argumentMappings, setArgumentMappings] = useState<ArgumentMapping[]>(
    initialConfig?.argumentMappings || []
  );
  const [returnVariable, setReturnVariable] = useState(initialConfig?.returnVariable || '');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('main');
  const { toast } = useToast();

  // Use actual functions from the functions modal instead of mock data
  const availableFunctions = functions.map(func => ({
    name: func.name,
    args: func.arguments.map(arg => ({ name: arg.name, type: arg.type })),
    returnType: func.returnType
  }));

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

  const generateAICode = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for code generation",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/js-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const data = await response.json();
      
      // Create a new function with the generated code
      const generatedFunction: JSFunction = {
        id: `ai_generated_${Date.now()}`,
        name: `ai_generated_${Date.now()}`,
        code: data.code,
        arguments: data.arguments || [],
        returnType: data.returnType || 'string'
      };

      // Add to available functions and select it
      functions.push(generatedFunction);
      handleFunctionSelect(generatedFunction.name);
      
      toast({
        title: "Success",
        description: "AI code generated successfully!",
      });

      setActiveTab('main');
      setAiPrompt('');
      
    } catch (error) {
      console.error('Error generating AI code:', error);
      toast({
        title: "Error",
        description: "Failed to generate code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure JavaScript Block</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {config.enableAICodeGeneration && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setActiveTab(activeTab === 'ai' ? 'main' : 'ai')}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {activeTab === 'ai' ? 'Back to Functions' : 'AI Generate'}
              </Button>
            </div>
          )}

          {activeTab === 'ai' ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="ai-prompt">Describe what you want the function to do</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="e.g., Create a function that calculates the distance between two coordinates..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={generateAICode} 
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Generate Code
                  </div>
                )}
              </Button>
              
              <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Describe your function requirements in plain English</li>
                  <li>AI will generate the function code and parameters</li>
                  <li>The generated function will be added to your functions list</li>
                  <li>Configure argument mapping in the main view</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="function-select">Select Function</Label>
                <Select value={selectedFunction} onValueChange={handleFunctionSelect}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a JavaScript function" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    {availableFunctions.length === 0 ? (
                      <div className="px-2 py-1 text-sm text-muted-foreground">
                        No functions available. Create functions first.
                      </div>
                    ) : (
                      availableFunctions.map(func => (
                        <SelectItem key={func.name} value={func.name}>
                          {func.name} ({func.args.length} args → {func.returnType})
                        </SelectItem>
                      ))
                    )}
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
                        <SelectContent className="bg-background border z-50">
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
                        <SelectContent className="bg-background border z-50">
                          {filteredSources.length === 0 ? (
                            <div className="px-2 py-1 text-sm text-muted-foreground">
                              No matching {mapping.sourceType}s found
                            </div>
                          ) : (
                            filteredSources.map((source: any) => (
                              <SelectItem key={source.id} value={source.id}>
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
                      <SelectContent className="bg-background border z-50">
                        {getReturnVariableOptions().length === 0 ? (
                          <div className="px-2 py-1 text-sm text-muted-foreground">
                            No matching variables found
                          </div>
                        ) : (
                          getReturnVariableOptions().map((variable) => (
                            <SelectItem key={variable.id} value={variable.id}>
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
            </>
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

export default JSNodeConfigModal;