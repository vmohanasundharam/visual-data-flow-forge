import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit2, Code, Save, X, Sparkles } from 'lucide-react';
import { JSFunction } from '@/types/flow';
import { useToast } from '@/hooks/use-toast';
import { config } from '@/config';
import { jsFunctionApi } from '@/services/api';

interface JSFunctionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JSFunctionsModal({ isOpen, onClose }: JSFunctionsModalProps) {
  const { toast } = useToast();
  const [functions, setFunctions] = useState<JSFunction[]>([]);
  const [editingFunction, setEditingFunction] = useState<JSFunction | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFunctions();
    }
  }, [isOpen]);

  const loadFunctions = async () => {
    try {
      if (config.useApi) {
        // Use real API
        console.log('Loading JS functions from API...');
        const functions = await jsFunctionApi.getAll();
        console.log('JS functions received:', functions);
        setFunctions(functions);
      } else {
        // Load from localStorage for demo
        const saved = localStorage.getItem('js_functions');
        if (saved) {
          setFunctions(JSON.parse(saved));
        }
      }
    } catch (error) {
      console.error('Failed to load JS functions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load JS functions'
      });
    }
  };

  const saveFunctions = async (updatedFunctions: JSFunction[]) => {
    if (config.useApi) {
      // When using API, functions are saved individually via handleSaveFunction
      setFunctions(updatedFunctions);
    } else {
      // Use localStorage
      localStorage.setItem('js_functions', JSON.stringify(updatedFunctions));
      setFunctions(updatedFunctions);
    }
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('js_functions_updated'));
  };

  const handleCreateFunction = () => {
    const newFunction: JSFunction = {
      id: Date.now().toString(),
      name: '',
      description: '',
      arguments: [],
      returnType: 'string',
      code: '// Write your JavaScript code here\nfunction process() {\n  // Your logic here\n  return result;\n}'
    };
    setEditingFunction(newFunction);
    setShowEditor(true);
  };

  const handleEditFunction = (func: JSFunction) => {
    setEditingFunction({ ...func });
    setShowEditor(true);
  };

  const handleSaveFunction = async () => {
    if (!editingFunction) return;

    if (!editingFunction.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Function name is required'
      });
      return;
    }

    try {
      if (config.useApi) {
        // Use API
        const isNew = !functions.find(f => f.id === editingFunction.id);
        
        if (isNew) {
          await jsFunctionApi.create(editingFunction);
        } else {
          await jsFunctionApi.update(editingFunction.id, editingFunction);
        }
        
        // Reload functions from API
        await loadFunctions();
        
        toast({
          title: 'Success',
          description: `Function ${isNew ? 'created' : 'updated'} successfully`
        });
      } else {
        // Use localStorage
        const isNew = !functions.find(f => f.id === editingFunction.id);
        let updatedFunctions;

        if (isNew) {
          updatedFunctions = [...functions, editingFunction];
        } else {
          updatedFunctions = functions.map(f => 
            f.id === editingFunction.id ? editingFunction : f
          );
        }

        saveFunctions(updatedFunctions);
        
        toast({
          title: 'Success',
          description: `Function ${isNew ? 'created' : 'updated'} successfully`
        });
      }
      
      setShowEditor(false);
      setEditingFunction(null);
    } catch (error) {
      console.error('Failed to save function:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save function'
      });
    }
  };

  const handleDeleteFunction = async (id: string) => {
    try {
      if (config.useApi) {
        // Use API
        await jsFunctionApi.delete(id);
        
        // Reload functions from API
        await loadFunctions();
        
        toast({
          title: 'Success',
          description: 'Function deleted successfully'
        });
      } else {
        // Use localStorage
        const updatedFunctions = functions.filter(f => f.id !== id);
        saveFunctions(updatedFunctions);
        
        toast({
          title: 'Success',
          description: 'Function deleted successfully'
        });
      }
    } catch (error) {
      console.error('Failed to delete function:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete function'
      });
    }
  };

  const addArgument = () => {
    if (!editingFunction) return;
    
    setEditingFunction({
      ...editingFunction,
      arguments: [
        ...editingFunction.arguments,
        { name: '', type: 'string' }
      ]
    });
  };

  const updateArgument = (index: number, field: 'name' | 'type', value: string) => {
    if (!editingFunction) return;
    
    const updatedArgs = [...editingFunction.arguments];
    updatedArgs[index] = { ...updatedArgs[index], [field]: value };
    
    setEditingFunction({
      ...editingFunction,
      arguments: updatedArgs
    });
  };

  const removeArgument = (index: number) => {
    if (!editingFunction) return;
    
    setEditingFunction({
      ...editingFunction,
      arguments: editingFunction.arguments.filter((_, i) => i !== index)
    });
  };

  const generateAIFunction = async () => {
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
      // Mock AI API response for development
      const mockResponse = await new Promise<any>((resolve) => {
        setTimeout(() => {
          const prompt = aiPrompt.toLowerCase();
          
          if (prompt.includes('sum') && prompt.includes('two')) {
            resolve({
              name: 'sumOfTwoNumbers',
              description: 'Calculates the sum of two numbers',
              code: `function sumOfTwoNumbers(a, b) {
  // Validate inputs
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  
  // Calculate and return the sum
  return a + b;
}`,
              arguments: [
                { name: 'a', type: 'number' },
                { name: 'b', type: 'number' }
              ],
              returnType: 'number'
            });
          } else if (prompt.includes('factorial')) {
            resolve({
              name: 'factorial',
              description: 'Calculates the factorial of a non-negative integer',
              code: `function factorial(n) {
  // Validate input
  if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
    throw new Error('Input must be a non-negative integer');
  }
  
  // Base cases
  if (n === 0 || n === 1) {
    return 1;
  }
  
  // Calculate factorial iteratively for better performance
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  
  return result;
}`,
              arguments: [
                { name: 'n', type: 'number' }
              ],
              returnType: 'number'
            });
          } else {
            // Generic function for other prompts
            resolve({
              name: `generatedFunction_${Date.now()}`,
              description: 'AI generated function based on your prompt',
              code: `function generatedFunction() {
  // Generated based on: ${aiPrompt}
  // TODO: Implement your logic here
  
  return "Function generated successfully";
}`,
              arguments: [],
              returnType: 'string'
            });
          }
        }, 1500); // Simulate API delay
      });

      // Create a new function with the generated code
      const generatedFunction: JSFunction = {
        id: `ai_generated_${Date.now()}`,
        name: mockResponse.name,
        description: mockResponse.description,
        code: mockResponse.code,
        arguments: mockResponse.arguments || [],
        returnType: mockResponse.returnType || 'string'
      };

      // Set it for editing
      setEditingFunction(generatedFunction);
      setShowAIGenerator(false);
      setShowEditor(true);
      setAiPrompt('');
      
      toast({
        title: "Success",
        description: "AI code generated successfully! Review and save the function.",
      });
      
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

  if (showAIGenerator) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {
        setShowAIGenerator(false);
        setAiPrompt('');
        onClose();
      }}>
        <DialogContent className="sm:max-w-[600px] bg-card border-flow-node-border">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-flow-secondary" />
              AI Function Generator
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="ai-prompt">Describe what you want the function to do</Label>
              <Textarea
                id="ai-prompt"
                placeholder="e.g., Create a function that calculates the distance between two coordinates..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="mt-1 min-h-[120px]"
              />
            </div>
            
            <Button 
              onClick={generateAIFunction} 
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
                  Generate Function
                </div>
              )}
            </Button>
            
            <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
              <p className="font-medium mb-2">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Describe your function requirements in plain English</li>
                <li>AI will generate the function code, parameters, and documentation</li>
                <li>You can review and edit the generated function before saving</li>
                <li>The function will be available in your flow blocks</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-flow-node-border">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAIGenerator(false);
                  setAiPrompt('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showEditor && editingFunction) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {
        setShowEditor(false);
        setEditingFunction(null);
        onClose();
      }}>
        <DialogContent className="sm:max-w-[900px] bg-card border-flow-node-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Code className="w-5 h-5 text-flow-secondary" />
              {editingFunction.id && functions.find(f => f.id === editingFunction.id) ? 'Edit' : 'Create'} JavaScript Function
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="funcName">Function Name *</Label>
                <Input
                  id="funcName"
                  value={editingFunction.name}
                  onChange={(e) => setEditingFunction({ ...editingFunction, name: e.target.value })}
                  placeholder="processData"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="returnType">Return Type</Label>
                <Select 
                  value={editingFunction.returnType} 
                  onValueChange={(value) => setEditingFunction({ 
                    ...editingFunction, 
                    returnType: value as JSFunction['returnType'] 
                  })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="map">Map</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="funcDesc">Description</Label>
              <Input
                id="funcDesc"
                value={editingFunction.description}
                onChange={(e) => setEditingFunction({ ...editingFunction, description: e.target.value })}
                placeholder="Brief description of what this function does"
                className="mt-1"
              />
            </div>

            {/* Arguments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Arguments</Label>
                <Button size="sm" onClick={addArgument}>
                  <Plus className="w-3 h-3 mr-1" />
                  Add Argument
                </Button>
              </div>
              
              <div className="space-y-2">
                {editingFunction.arguments.map((arg, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={arg.name}
                      onChange={(e) => updateArgument(index, 'name', e.target.value)}
                      placeholder="argumentName"
                      className="flex-1"
                    />
                    <Select 
                      value={arg.type} 
                      onValueChange={(value) => updateArgument(index, 'type', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                        <SelectItem value="map">Map</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeArgument(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {editingFunction.arguments.length === 0 && (
                  <p className="text-sm text-muted-foreground">No arguments defined</p>
                )}
              </div>
            </div>

            {/* Code Editor */}
            <div>
              <Label htmlFor="funcCode">JavaScript Code</Label>
              <Textarea
                id="funcCode"
                value={editingFunction.code}
                onChange={(e) => setEditingFunction({ ...editingFunction, code: e.target.value })}
                placeholder="Write your JavaScript code here..."
                className="mt-1 h-64 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Code will be executed server-side using Rhino runtime
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-flow-node-border">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowEditor(false);
                  setEditingFunction(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveFunction}
                className="bg-gradient-to-r from-flow-secondary to-flow-primary hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Function
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-card border-flow-node-border">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Code className="w-5 h-5 text-flow-secondary" />
            JavaScript Functions
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Create reusable JavaScript functions for your flows
            </p>
            <div className="flex gap-2">
              {config.enableAICodeGeneration && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowAIGenerator(true)}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Generate
                </Button>
              )}
              <Button onClick={handleCreateFunction}>
                <Plus className="w-4 h-4 mr-2" />
                New Function
              </Button>
            </div>
          </div>

          {/* Functions Table */}
          <div className="border border-flow-node-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-flow-node-border">
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Arguments</TableHead>
                  <TableHead>Return Type</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {functions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No functions defined
                    </TableCell>
                  </TableRow>
                ) : (
                  functions.map((func) => (
                    <TableRow key={func.id} className="border-flow-node-border">
                      <TableCell className="font-medium">{func.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {func.description || 'No description'}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-flow-secondary/20 text-flow-secondary">
                          {func.arguments.length} args
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-flow-primary/20 text-flow-primary">
                          {func.returnType}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditFunction(func)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteFunction(func.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-flow-node-border">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}