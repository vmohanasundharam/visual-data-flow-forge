import { config } from '@/config';
import { Flow, DataSource, JSFunction } from '@/types/flow';

const apiCall = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

// Pipeline APIs
export const pipelineApi = {
  getAll: async (): Promise<Flow[]> => {
    const response = await apiCall('/pipelines');
    return response.pipelines;
  },

  get: async (id: string): Promise<Flow> => {
    const response = await apiCall(`/pipelines/${id}`);
    return response.pipelines;
  },

  create: async (pipeline: Omit<Flow, 'id'>): Promise<Flow> => {
    const response = await apiCall('/pipelines', {
      method: 'POST',
      body: JSON.stringify({ pipelines: pipeline }),
    });
    return response.pipelines;
  },

  update: async (id: string, pipeline: Partial<Flow>): Promise<Flow> => {
    const response = await apiCall(`/pipelines/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ pipelines: pipeline }),
    });
    return response.pipelines;
  },

  delete: async (id: string): Promise<void> => {
    await apiCall(`/pipelines/${id}`, {
      method: 'DELETE',
    });
  },
};

// JS Functions APIs
export const jsFunctionApi = {
  getAll: async (): Promise<JSFunction[]> => {
    const response = await apiCall('/js-functions');
    return response.js_functions;
  },

  get: async (id: string): Promise<JSFunction> => {
    const response = await apiCall(`/js-functions/${id}`);
    return response.js_functions;
  },

  create: async (jsFunction: Omit<JSFunction, 'id'>): Promise<JSFunction> => {
    const response = await apiCall('/js-functions', {
      method: 'POST',
      body: JSON.stringify({ js_functions: jsFunction }),
    });
    return response.js_functions;
  },

  update: async (id: string, jsFunction: Partial<JSFunction>): Promise<JSFunction> => {
    const response = await apiCall(`/js-functions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ js_functions: jsFunction }),
    });
    return response.js_functions;
  },

  delete: async (id: string): Promise<void> => {
    await apiCall(`/js-functions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Data Sources APIs
export const dataSourceApi = {
  getAll: async (): Promise<DataSource[]> => {
    const response = await apiCall('/data-sources');
    return response.data_sources;
  },

  get: async (id: string): Promise<DataSource> => {
    const response = await apiCall(`/data-sources/${id}`);
    return response.data_sources;
  },

  create: async (dataSource: Omit<DataSource, 'id'>): Promise<DataSource> => {
    const response = await apiCall('/data-sources', {
      method: 'POST',
      body: JSON.stringify({ data_sources: dataSource }),
    });
    return response.data_sources;
  },

  update: async (id: string, dataSource: Partial<DataSource>): Promise<DataSource> => {
    const response = await apiCall(`/data-sources/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data_sources: dataSource }),
    });
    return response.data_sources;
  },

  delete: async (id: string): Promise<void> => {
    await apiCall(`/data-sources/${id}`, {
      method: 'DELETE',
    });
  },
};