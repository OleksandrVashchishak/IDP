import {
  DependencyList, EffectCallback, useEffect, useRef,
} from 'react';

export default function useComponentDidUpdate(
  effect: EffectCallback,
  dependencies: DependencyList,
): void {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      return effect();
    }
    mounted.current = true;

    return undefined;
  }, dependencies);
}
