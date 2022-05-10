import { createBehavior, createStore } from '@methodjs/store';
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
  initializeStore: () => T;
  isPreventReact?: boolean;
  isPreventCache?: boolean;
  reactDependecies?: string[];
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
  options: CreateEffectOptions<T>,
): [UseEffect<T>, RequestEffect, GetEffect<T>] {
  const {
    initializeStore,
    isPreventReact = false,
    isPreventCache = false,
    reactDependecies = [],
    cacheLifeSeconds,
    key,
  } = options;
  const [useStore, setStore, getStore] = createStore<T>(initializeStore, {
    key,
  });
  const [useState, setState, getState] = createStore<EffectState>(
    initializeEffectState,
  );

  const requestEffect: RequestEffect = async function requestEffect() {
    coreRequestEffect(true);
  };

  async function coreRequestEffect(notUsedCache: boolean = false) {
    const { cachedTime, isLoading } = getState();
    if (isLoading) {
      return;
    }
    setState(value => ({ ...value, isLoading: true }));
    if (
      notUsedCache !== true &&
      isPreventCache !== true &&
      cachedTime !== null &&
      cacheLifeSeconds !== undefined
    ) {
      const cacheLimitTime = new Date(Date.now() + cacheLifeSeconds * 1000);
      if (cacheLimitTime > new Date()) {
        setState(value => ({
          ...value,
          error: null,
          isLoading: false,
          isFromCache: true,
        }));
      }
      return;
    }
    try {
      const store = await effect();
      setStore(store);
      if (isPreventCache === true) {
        setState(value => ({
          ...value,
          error: null,
          isLoading: false,
          isFromCache: false,
        }));
      } else {
        setState(value => ({
          ...value,
          error: null,
          isLoading: false,
          cachedTime: new Date(),
          isFromCache: false,
        }));
      }
    } catch (error) {
      setState(value => ({
        ...value,
        error,
        isCanceled: true,
        isLoading: false,
      }));
    }
  }

  const [startReact] = createBehavior(
    key => {
      return reactDependecies.includes(key);
    },
    {
      setValueCallback: () => {
        coreRequestEffect(true);
      },
    },
  );

  const getEffect: GetEffect<T> = function getEffect() {
    const store = getStore();
    const state = getState();
    return [store, state];
  };

  const useEffect: UseEffect<T> = function useEffect() {
    const store = useStore();
    const state = useState();

    React.useEffect(() => {
      if (isPreventReact !== true) {
        coreRequestEffect();
        startReact();
      }
    }, []);

    return [store, state];
  };

  return [useEffect, requestEffect, getEffect];
}
