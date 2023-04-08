import { useCallback, useRef } from 'react';

// eslint-disable-next-line
export function usePreventMultipleEvent<R = any>(callback: (...props: any) => R, deps: any[], time = 2000): (...props: any) => any {
  const ref = useRef(true);

  return useCallback((...props) => {
    if (ref.current) {
      ref.current = false;

      callback(...props);

      setTimeout(() => {
        ref.current = true;
      }, time);
    }
  }, [time, ...deps]);
}
