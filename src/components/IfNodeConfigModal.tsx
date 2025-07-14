import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface Condition {
  id: string;
  source: string;
  operator: string;
  value: string;
  sourceType: 'field' | 'tag' | 'variable';
}

interface IfNodeConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  initialConfig?: any;
}

export function IfNodeConfigModal({ open, onClose, onSave, initialConfig }: IfNodeConfigModalProps) {
  const [conditions, setConditions] = useState<Condition[]>(
    initialConfig?.conditions || [{ id: '1', source: '', operator: '=', value: '', sourceType: 'field' }]
  );
  const [grouping, setGrouping] = useState(initialConfig?.grouping || '');

  const operators = [
    { value: '=', label: 'equals' },
    { value: '!=', label: 'not equals' },
    { value: '<', label: 'less than' },
    { value: '>', label: 'greater than' },
    { value: 'contains', label: 'contains' },
    { value: 'is', label: 'is' },
    { value: "isn't", label: "isn't" },
  ];

  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      source: '',
      operator: '=',
      value: '',
      sourceType: 'field'
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(c => c.id !== id));
    }
  };

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleSave = () => {
    onSave({
      conditions,
      grouping: grouping.trim() || undefined
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure If Block</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Conditions</Label>
            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <div key={condition.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <Badge variant="outline" className="min-w-8">{index + 1}</Badge>
                  
                  <Select 
                    value={condition.sourceType} 
                    onValueChange={(value) => updateCondition(condition.id, 'sourceType', value)}
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
                    value={condition.source}
                    onChange={(e) => updateCondition(condition.id, 'source', e.target.value)}
                    className="flex-1"
                  />

                  <Select 
                    value={condition.operator} 
                    onValueChange={(value) => updateCondition(condition.id, 'operator', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map(op => (
                        <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Value"
                    value={condition.value}
                    onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                    className="flex-1"
                  />

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCondition(condition.id)}
                    disabled={conditions.length === 1}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button
              size="sm"
              variant="outline"
              onClick={addCondition}
              className="mt-3"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Condition
            </Button>
          </div>

          <div>
            <Label htmlFor="grouping">Grouping (Optional)</Label>
            <Input
              id="grouping"
              placeholder="e.g., (1 AND 2) OR 3"
              value={grouping}
              onChange={(e) => setGrouping(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use numbers to reference conditions and parentheses for grouping
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}