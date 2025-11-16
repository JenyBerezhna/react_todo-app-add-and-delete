import { useCallback, useState } from 'react';

export const useErrorNotification = () => {
  const [error, setError] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const showError = useCallback((message: string) => {
    setError(message);
    setIsVisible(true);
  }, []);

  const hideError = useCallback(() => {
    setIsVisible(false);
    setError('');
  }, []);

  return { error, isVisible, showError, hideError };
};
