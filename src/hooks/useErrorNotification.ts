import { useCallback, useState } from 'react';

export const useErrorNotification = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const showError = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
  }, []);

  const hideError = useCallback(() => {
    setVisible(false);
  }, []);

  return { message, visible, showError, hideError };
};
