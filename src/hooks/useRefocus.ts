import { useLayoutEffect } from 'react';

export const useRefocus = (
  ref: React.RefObject<HTMLInputElement>,
  trigger: unknown,
) => {
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [trigger, ref]);
};
