import { createStore } from '@methodjs/store';
import React from 'react';

export interface Effect<T> {
  (): Promise<T>;
}

export interface EffectState {
  isLoading: boolean;
  isCanceled: boolean;
  isFromCache: boolean;
  cachedTime: Date | null;
  error: any | null;
}

export interface UseEffect<T> {
  (): [T, EffectState];
}

export interface RequestEffect {
  (notUsedCache?: boolean): Promise<void>;
}

export interface GetEffect<T> {
  (): [T, EffectState];
}

export interface CreateEffectOptions<T> {
  intializeEffect: () => T;
  requestWhenMounted: boolean;
  cacheLifeSeconds?: number;
  key?: string;
}

function initializeEffectState(): EffectState {
  return {
    isLoading: false,
    isCanceled: false,
    isFromCache: false,
    cachedTime: null,
    error: null,
  };
}

export function createEffect<T>(
  effect: Effect<T>,
  initializeEffect: InitializeEffect<T>,
): [UseEffect<T>, RequestEffect, GetEffect<T>] {
  const [useStore, setStore, getStore] = createStore<T>(initializeEffect);
  const [useState, setState, getState] = createStore<EffectState>(
    initializeEffectState,
  );

  const requestEffect: RequestEffect = async function requestEffect(
    notUsedCache = false,
  ) {
    if (getState().isLoading) {
      return;
    }
    setState(value => ({ ...value, isLoading: true }));
    try {
      const store = await effect();
      setStore(store);
      setState(value => ({ ...value, error: null, isLoading: false }));
    } catch (error) {
      setState(value => ({
        ...value,
        error,
        isCanceled: true,
        isLoading: false,
      }));
    }
  };

  const getEffect: GetEffect<T> = function getEffect() {
    const store = getStore();
    const state = getState();
    return [store, state];
  };

  const useEffect: UseEffect<T> = function useEffect() {
    const store = useStore();
    const state = useState();

    React.useEffect(() => {}, []);

    return [store, state];
  };

  return [useEffect, requestEffect, getEffect];
}
