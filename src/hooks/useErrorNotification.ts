import { useCallback, useState } from 'react';

export const useErrorNotification = () => {
  const [error, setError] = useState<string | null>(null);

  const showError = useCallback((message: string) => {
    setError(message);
  }, []);

  const hideError = useCallback(() => {
    setError(null);
  }, []);

  const isVisible = error !== null;

  return { error, isVisible, showError, hideError };
};
