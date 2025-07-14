import { useState, useEffect } from 'react';
import { Tag, Field } from '@/types/flow';
import { useToast } from '@/hooks/use-toast';

export function useTagsFields(dataSourceId?: string) {
  const { toast } = useToast();
  const [tags, setTags] = useState<Tag[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTagsAndFields = async () => {
    if (!dataSourceId) {
      setTags([]);
      setFields([]);
      return;
    }

    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      // const response = await fetch(`/api/tags-fields?sourceId=${dataSourceId}`);
      // const data = await response.json();
      
      // Mock data for demonstration - this will be dynamic based on dataSourceId
      const mockTags: Tag[] = [
        { id: '1', name: 'temperature', value: 23.5, type: 'number' },
        { id: '2', name: 'humidity', value: 65.2, type: 'number' },
        { id: '3', name: 'status', value: 'active', type: 'string' },
        { id: '4', name: 'device_name', value: 'Sensor01', type: 'string' },
        { id: '5', name: 'pressure', value: 1013.25, type: 'number' },
        { id: '6', name: 'location_tag', value: 'Room-A', type: 'string' },
      ];
      
      const mockFields: Field[] = [
        { id: '1', name: 'device_id', value: 'SENSOR_001', type: 'string' },
        { id: '2', name: 'location', value: 'Building A - Floor 1', type: 'string' },
        { id: '3', name: 'max_temp', value: 35, type: 'number' },
        { id: '4', name: 'threshold', value: 50, type: 'number' },
        { id: '5', name: 'calibration_date', value: '2024-01-15', type: 'string' },
        { id: '6', name: 'maintenance_interval', value: 30, type: 'number' },
      ];
      
      setTags(mockTags);
      setFields(mockFields);
    } catch (error) {
      console.error('Failed to load tags and fields:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load tags and fields'
      });
      setTags([]);
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTagsAndFields();
  }, [dataSourceId]);

  return {
    tags,
    fields,
    loading,
    refetch: loadTagsAndFields
  };
}