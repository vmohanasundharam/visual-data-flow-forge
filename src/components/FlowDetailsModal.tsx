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
import { DataSource, Flow, TriggerType, CronOption } from '@/types/flow';

const cronOptions: CronOption[] = [
  { label: 'Every minute', value: '* * * * *', description: 'Runs every minute' },
  { label: 'Every 5 minutes', value: '*/5 * * * *', description: 'Runs every 5 minutes' },
  { label: 'Hourly', value: '0 * * * *', description: 'Runs at the start of every hour' },
  { label: 'Daily at midnight', value: '0 0 * * *', description: 'Runs daily at 00:00' },
  { label: 'Every Sunday', value: '0 0 * * 0', description: 'Runs every Sunday at midnight' },
  { label: 'Custom', value: 'custom', description: 'Define your own cron expression' },
];

interface FlowDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (flow: Partial<Flow>) => void;
  dataSources: DataSource[];
  flow?: Flow | null;
}

export function FlowDetailsModal({ isOpen, onClose, onSave, dataSources, flow }: FlowDetailsModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<TriggerType>('polling');
  const [dataSourceId, setDataSourceId] = useState('');
  const [cronExpression, setCronExpression] = useState('* * * * *');
  const [customCron, setCustomCron] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    if (flow) {
      setName(flow.name);
      setDescription(flow.description || '');
      setTriggerType(flow.triggerType);
      setDataSourceId(flow.dataSourceId || '');
      setCronExpression(flow.triggerConfig.cronExpression || '* * * * *');
      setWebhookUrl(flow.triggerConfig.webhookUrl || '');
    } else {
      // Reset form for new flow
      setName('');
      setDescription('');
      setTriggerType('polling');
      setDataSourceId('');
      setCronExpression('* * * * *');
      setCustomCron('');
      setWebhookUrl('');
    }
  }, [flow, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const triggerConfig: any = {};
    
    if (triggerType === 'polling') {
      triggerConfig.dataSourceId = dataSourceId;
    } else if (triggerType === 'schedule') {
      triggerConfig.cronExpression = cronExpression === 'custom' ? customCron : cronExpression;
    } else if (triggerType === 'webhook') {
      triggerConfig.webhookUrl = webhookUrl;
    }

    onSave({
      name,
      description,
      triggerType,
      dataSourceId: triggerType === 'polling' ? dataSourceId : undefined,
      triggerConfig,
    });
  };

  const isFormValid = () => {
    if (!name.trim()) return false;
    
    if (triggerType === 'polling' && !dataSourceId) return false;
    if (triggerType === 'schedule' && cronExpression === 'custom' && !customCron.trim()) return false;
    if (triggerType === 'webhook' && !webhookUrl.trim()) return false;
    
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-flow-node-border">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {flow ? 'Edit Flow' : 'Create New Flow'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Flow Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter flow name"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Trigger Configuration */}
          <div className="space-y-4">
            <div>
              <Label>Trigger Type *</Label>
              <Select value={triggerType} onValueChange={(value) => setTriggerType(value as TriggerType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="polling">Data Polling</SelectItem>
                  <SelectItem value="schedule">Scheduling</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {triggerType === 'polling' && (
              <div>
                <Label>Data Source *</Label>
                <Select value={dataSourceId} onValueChange={setDataSourceId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {triggerType === 'schedule' && (
              <div className="space-y-3">
                <div>
                  <Label>Schedule *</Label>
                  <Select value={cronExpression} onValueChange={setCronExpression}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cronOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {cronExpression === 'custom' && (
                  <div>
                    <Label htmlFor="customCron">Custom Cron Expression *</Label>
                    <Input
                      id="customCron"
                      value={customCron}
                      onChange={(e) => setCustomCron(e.target.value)}
                      placeholder="0 */6 * * *"
                      className="mt-1"
                      required={cronExpression === 'custom'}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: minute hour day month dayOfWeek
                    </p>
                  </div>
                )}
              </div>
            )}

            {triggerType === 'webhook' && (
              <div>
                <Label htmlFor="webhookUrl">Webhook URL *</Label>
                <Input
                  id="webhookUrl"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://example.com/webhook"
                  className="mt-1"
                  type="url"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only GET requests are supported, no headers
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-flow-node-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid()}
              className="bg-gradient-to-r from-flow-primary to-flow-secondary hover:opacity-90"
            >
              {flow ? 'Update Flow' : 'Create Flow'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}