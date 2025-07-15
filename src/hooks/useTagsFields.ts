import { useState, useEffect } from 'react';
import { Tag, Field } from '@/types/flow';
import { useToast } from '@/hooks/use-toast';
import { mockDataSources } from '@/data/mockData';
import { config } from '@/config';
import { dataSourceApi } from '@/services/api';

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
      if (config.useApi) {
        // Use real API
        const dataSource = await dataSourceApi.get(dataSourceId);
        setTags(dataSource.tags);
        setFields(dataSource.fields);
      } else {
        // Use mock data
        const dataSource = mockDataSources.data_sources.find(ds => ds.id === dataSourceId);
        
        if (dataSource) {
          setTags(dataSource.tags);
          setFields(dataSource.fields);
        } else {
          setTags([]);
          setFields([]);
        }
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