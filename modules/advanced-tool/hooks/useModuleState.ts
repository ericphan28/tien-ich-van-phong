import { useState } from 'react';

export function useModuleState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateState = async (newState: T) => {
    setLoading(true);
    setError(null);
    
    try {
      setState(newState);
      // Add persistence logic here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { state, loading, error, updateState };
}