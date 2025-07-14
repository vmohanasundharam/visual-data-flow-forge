import { useState, useEffect } from 'react';
import { JSFunction } from '@/types/flow';
import { mockJSFunctions } from '@/data/mockData';

export function useJSFunctions() {
  const [functions, setFunctions] = useState<JSFunction[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFunctions = () => {
    setLoading(true);
    try {
      // Load from localStorage (same as JSFunctionsModal)
      const saved = localStorage.getItem('js_functions');
      if (saved) {
        setFunctions(JSON.parse(saved));
      } else {
        // Initialize with mock data if no saved functions
        localStorage.setItem('js_functions', JSON.stringify(mockJSFunctions));
        setFunctions(mockJSFunctions);
      }
    } catch (error) {
      console.error('Failed to load JS functions:', error);
      // Fallback to mock data
      setFunctions(mockJSFunctions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunctions();
    
    // Listen for storage changes to sync across components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'js_functions') {
        loadFunctions();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    const handleCustomUpdate = () => {
      loadFunctions();
    };
    
    window.addEventListener('js_functions_updated', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('js_functions_updated', handleCustomUpdate);
    };
  }, []);

  return {
    functions,
    loading,
    refetch: loadFunctions
  };
}