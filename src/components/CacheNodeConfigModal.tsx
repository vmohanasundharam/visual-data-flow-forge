import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { GlobalVariable, Tag, Field, CacheBlockConfig } from '@/types/flow';

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
  const [config, setConfig] = useState<CacheBlockConfig>({
    operation: 'get',
    key: {
      sourceType: 'field',
    },
    ...(initialConfig || {}),
  });

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const renderSourceSelector = (
    value: { sourceType: 'field' | 'tag' | 'variable' | 'custom'; source?: string; customValue?: string },
    onChange: (newValue: { sourceType: 'field' | 'tag' | 'variable' | 'custom'; source?: string; customValue?: string }) => void,
    label: string
  ) => {
    const getSourceOptions = () => {
      switch (value.sourceType) {
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
        <Label>{label}</Label>
        <div className="space-y-2">
          <Select
            value={value.sourceType}
            onValueChange={(sourceType: 'field' | 'tag' | 'variable' | 'custom') =>
              onChange({ sourceType, source: undefined, customValue: undefined })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="field">Field</SelectItem>
              <SelectItem value="tag">Tag</SelectItem>
              <SelectItem value="variable">Variable</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {value.sourceType === 'custom' ? (
            <Input
              placeholder="Enter custom value"
              value={value.customValue || ''}
              onChange={(e) => onChange({ ...value, customValue: e.target.value })}
            />
          ) : (
            <Select
              value={value.source || ''}
              onValueChange={(source) => onChange({ ...value, source })}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${value.sourceType}`} />
              </SelectTrigger>
              <SelectContent>
                {getSourceOptions().map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    );
  };

  const needsValue = config.operation === 'add' || config.operation === 'update';
  const needsResult = config.operation === 'get';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Cache Block</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Operation Selection */}
          <div className="space-y-2">
            <Label>Operation</Label>
            <Select
              value={config.operation}
              onValueChange={(operation: 'get' | 'add' | 'update' | 'delete') =>
                setConfig({ ...config, operation })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="get">Get</SelectItem>
                <SelectItem value="add">Add</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Key Configuration */}
          {renderSourceSelector(
            config.key,
            (key) => setConfig({ ...config, key }),
            'Key'
          )}

          {/* Value Configuration (for add/update operations) */}
          {needsValue && (
            <>
              <Separator />
              {renderSourceSelector(
                config.value || { sourceType: 'field' },
                (value) => setConfig({ ...config, value }),
                'Value'
              )}
            </>
          )}

          {/* Result Variable (for get operation) */}
          {needsResult && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Result Variable</Label>
                <Select
                  value={config.resultVariable || ''}
                  onValueChange={(resultVariable) => setConfig({ ...config, resultVariable })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select variable to store result" />
                  </SelectTrigger>
                  <SelectContent>
                    {globalVariables.map((variable) => (
                      <SelectItem key={variable.id} value={variable.id}>
                        {variable.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
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