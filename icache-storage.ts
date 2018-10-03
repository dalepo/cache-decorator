export interface ICacheStorage {
    set(key: string, value: any): any;
    get(key: string): any;
    keys(): any;
    remove(key: string): any;
    clear(): any;
}

export interface CacheOptions {
    key: string;
    minutes: number;
}

export interface CachedValue {
    timestamp: number;
    value: any;
}
