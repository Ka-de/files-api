import { CacheModule, Global, Module } from '@nestjs/common';
import { CacheCoreService } from './cache-core.service';

@Global()
@Module({
    imports: [
        CacheModule.register()
    ],
    providers: [
        CacheCoreService
    ],
    exports: [
        CacheModule,
        CacheCoreService
    ]
})
export class CacheCoreModule {}
