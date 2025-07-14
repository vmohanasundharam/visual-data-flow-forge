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
      // const response = await fetch(`/api/data-sources`);
      // const data = await response.json();
      
      // Mock data matching server format
      const mockServerResponse = {
        "data_sources": [
          {
            "id": "1234",
            "name": "Device1",
            "tags": [
              { "id": "1234", "name": "device_name", "type": "string" as const, "value": "Aaaa" },
              { "id": "1235", "name": "temperature", "type": "number" as const, "value": 23.5 },
              { "id": "1236", "name": "humidity", "type": "number" as const, "value": 65.2 },
              { "id": "1237", "name": "status", "type": "string" as const, "value": "active" },
              { "id": "1238", "name": "pressure", "type": "number" as const, "value": 1013.25 },
              { "id": "1239", "name": "location_tag", "type": "string" as const, "value": "Room-A" }
            ],
            "fields": [
              { "id": "1234", "name": "current_shift", "type": "string" as const, "value": "Shift 1" },
              { "id": "1235", "name": "device_id", "type": "string" as const, "value": "SENSOR_001" },
              { "id": "1236", "name": "location", "type": "string" as const, "value": "Building A - Floor 1" },
              { "id": "1237", "name": "max_temp", "type": "number" as const, "value": 35 },
              { "id": "1238", "name": "threshold", "type": "number" as const, "value": 50 },
              { "id": "1239", "name": "maintenance_interval", "type": "number" as const, "value": 30 }
            ]
          }
        ]
      };
      
      // Find the data source by ID
      const dataSource = mockServerResponse.data_sources.find(ds => ds.id === dataSourceId);
      
      if (dataSource) {
        setTags(dataSource.tags);
        setFields(dataSource.fields);
      } else {
        setTags([]);
        setFields([]);
      }
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