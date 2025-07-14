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
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { GlobalVariable } from '@/types/flow';
import { useToast } from '@/hooks/use-toast';

interface GlobalVariablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  variables: GlobalVariable[];
  onSave: (variables: GlobalVariable[]) => void;
}

export function GlobalVariablesModal({ isOpen, onClose, variables, onSave }: GlobalVariablesModalProps) {
  const { toast } = useToast();
  const [localVariables, setLocalVariables] = useState<GlobalVariable[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newVariable, setNewVariable] = useState({
    name: '',
    value: '',
    type: 'string' as GlobalVariable['type']
  });

  useEffect(() => {
    setLocalVariables([...variables]);
  }, [variables, isOpen]);

  const handleAddVariable = () => {
    if (!newVariable.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Variable name is required'
      });
      return;
    }

    // Check for duplicate names
    if (localVariables.some(v => v.name === newVariable.name)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Variable name must be unique'
      });
      return;
    }

    const variable: GlobalVariable = {
      id: Date.now().toString(),
      name: newVariable.name,
      value: parseValue(newVariable.value, newVariable.type),
      type: newVariable.type
    };

    setLocalVariables([...localVariables, variable]);
    setNewVariable({ name: '', value: '', type: 'string' });
  };

  const handleUpdateVariable = (id: string, field: keyof GlobalVariable, value: any) => {
    setLocalVariables(vars => 
      vars.map(v => 
        v.id === id 
          ? { ...v, [field]: field === 'value' ? parseValue(value, v.type) : value }
          : v
      )
    );
  };

  const handleDeleteVariable = (id: string) => {
    setLocalVariables(vars => vars.filter(v => v.id !== id));
  };

  const parseValue = (value: string, type: GlobalVariable['type']) => {
    switch (type) {
      case 'number':
        return isNaN(Number(value)) ? 0 : Number(value);
      case 'list':
        try {
          return JSON.parse(value || '[]');
        } catch {
          return [];
        }
      case 'map':
        try {
          return JSON.parse(value || '{}');
        } catch {
          return {};
        }
      default:
        return value;
    }
  };

  const formatValue = (value: any, type: string) => {
    if (type === 'list' || type === 'map') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const handleSave = () => {
    onSave(localVariables);
    onClose();
    toast({
      title: 'Success',
      description: 'Global variables updated successfully'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-card border-flow-node-border">
        <DialogHeader>
          <DialogTitle className="text-xl">Global Variables</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add New Variable */}
          <div className="bg-flow-node-bg/50 p-4 rounded-lg border border-flow-node-border">
            <h3 className="text-sm font-semibold mb-3">Add New Variable</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <Label htmlFor="varName">Name</Label>
                <Input
                  id="varName"
                  value={newVariable.name}
                  onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                  placeholder="variable_name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="varType">Type</Label>
                <Select 
                  value={newVariable.type} 
                  onValueChange={(value) => setNewVariable({ ...newVariable, type: value as GlobalVariable['type'] })}
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
              <div>
                <Label htmlFor="varValue">Initial Value</Label>
                <Input
                  id="varValue"
                  value={newVariable.value}
                  onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                  placeholder={
                    newVariable.type === 'list' ? '["item1", "item2"]' :
                    newVariable.type === 'map' ? '{"key": "value"}' :
                    newVariable.type === 'number' ? '0' : 'value'
                  }
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddVariable} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Variables Table */}
          <div className="border border-flow-node-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-flow-node-border">
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localVariables.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No variables defined
                    </TableCell>
                  </TableRow>
                ) : (
                  localVariables.map((variable) => (
                    <TableRow key={variable.id} className="border-flow-node-border">
                      <TableCell className="font-medium">{variable.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-flow-primary/20 text-flow-primary">
                          {variable.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        {editingId === variable.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={formatValue(variable.value, variable.type)}
                              onChange={(e) => handleUpdateVariable(variable.id, 'value', e.target.value)}
                              className="h-8"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingId(null)}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="w-3 h-3 text-flow-success" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-mono">
                              {formatValue(variable.value, variable.type)}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingId(variable.id)}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteVariable(variable.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
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
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-flow-primary to-flow-secondary hover:opacity-90"
            >
              Save Variables
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}