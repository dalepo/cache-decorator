import { IonicCacheStorage } from './cache-storage';
import * as moment from 'moment';
import { switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { CacheOptions } from './icache-storage';

/* tslint:disable:no-invalid-this typedef */
export function CachedPromise(options: CacheOptions): any {

    return (target: Object, method: string, descriptor: TypedPropertyDescriptor<any>) => {
        const originMethod = descriptor.value;
        descriptor.value = async function(...args) {
            const storage = IonicCacheStorage.getInstance();
            const cacheValue = await storage.get(options.key);
            if (cacheValue && cacheValue.value && !timeHasPassed(options.minutes, cacheValue.timestamp)) {
                return cacheValue.value;
            }
            try {
                const value = await originMethod.apply(this, args);
                storage.set(options.key, value);
                return value;
            } catch (e) {
                throw(e);
            }
        };
    };

}

/* tslint:disable:no-invalid-this typedef
 */
export function CachedObservable(options: CacheOptions): any {
    return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const original = descriptor.value;
        const storage = IonicCacheStorage.getInstance();
        descriptor.value = function(...args) {
            const key = options.key;
            return from(storage.get(key))
                .pipe(
                    switchMap(cacheValue => {
                        if (!cacheValue || timeHasPassed(options.minutes, cacheValue.timestamp)) {
                            return original.apply(this, args)
                                .pipe(
                                    tap(data => {
                                        console.log('Cache miss');
                                        storage.set(options.key, data);
                                    })
                                );
                        } else {
                            console.log('Cache hit');
                            return of(cacheValue.value);
                        }
                    })
                );
        };
        return descriptor;
    };
}

function timeHasPassed(minutes: number, timestamp: number): boolean {
    const date = moment(timestamp);
    const now = moment();
    const duration = moment.duration(now.diff(date));
    return duration.asMinutes() >= minutes;
}
