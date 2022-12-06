export interface Effect<T> {
    (old: T): Promise<T>;
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
export declare function createEffect<T>(effect: Effect<T>, options: CreateEffectOptions<T>): [UseEffect<T>, RequestEffect, GetEffect<T>];
