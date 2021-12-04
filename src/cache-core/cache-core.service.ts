import { CACHE_MANAGER, Global, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from "cache-manager"

@Global()
@Injectable()
export class CacheCoreService {

    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache
    ) { }

    async clearCache(name: string) {
        const keys: string[] = await this.cache.store.keys();
        
        keys.forEach(key => {
            Logger.log(`Deleting cache key--- ${key}`);
            if (key.startsWith(name)) {
                this.cache.del(key);
            }
        });
    }
}
