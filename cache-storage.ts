import { CachedValue, ICacheStorage } from './icache-storage';
import { Plugins } from '@capacitor/core';
const Storage = Plugins.Storage;

export class IonicCacheStorage implements ICacheStorage {
    private static instance: IonicCacheStorage;

    private constructor() {

    }

    static getInstance(): IonicCacheStorage {
        if (!IonicCacheStorage.instance) {
            IonicCacheStorage.instance = new IonicCacheStorage();
        }
        return IonicCacheStorage.instance;
    }

    async clear(): Promise<void> {
        return Storage.clear();
    }

    async get(key: string): Promise<CachedValue> {
        const keyValue = await Storage.get({key});
        if (keyValue.value) {
            return JSON.parse(keyValue.value);
        }
        return undefined;
    }

    async set(key: string, value: any): Promise<any> {
        const storedValue: CachedValue = {
            timestamp: new Date().getTime(),
            value
        };
        return Storage.set({key, value: JSON.stringify(storedValue)});
    }

    async remove(key: string): Promise<void> {
        return Storage.remove({key});
    }

    async keys(): Promise<{keys: Array<string>}> {
        return Storage.keys();
    }
}
