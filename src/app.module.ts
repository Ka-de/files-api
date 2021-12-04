import { HttpModule, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheCoreModule } from './cache-core/cache-core.module';
import { CacheCoreService } from './cache-core/cache-core.service';
import { HttpCacheInterceptor } from './shared/cache.interceptor';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logger.interceptor';

@Module({
  imports: [
    HttpModule,
    CacheCoreModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    CacheCoreService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor
    }
  ],
})
export class AppModule {}
