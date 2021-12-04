import { Body, CacheKey, CacheTTL, Controller, Get, Param, Post, Query, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheCoreService } from './cache-core/cache-core.service';
import { GET_FILE_CACHE_KEY } from './shared/cache.keys';
import { filePathToUrl, uploadFile } from './shared/upload.help';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cacheService: CacheCoreService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @CacheKey(GET_FILE_CACHE_KEY)
  @CacheTTL(parseInt(process.env.CACHE_TTL) || 300)
  @Get('file')
  getFile(@Query('path') path, @Query('name') name: string, @Res() res) {
    res.sendFile(name, { root: `files/${path}` });
  }

  @Post('upload/many')
  @UseInterceptors(uploadFile('files', 20))
  uploadFiles(@UploadedFiles() files) {
    this.cacheService.clearCache(GET_FILE_CACHE_KEY);
    return files.map((file: any) => filePathToUrl(file.path));
  }

  @Post('upload/single')
  @UseInterceptors(uploadFile('file', 1))
  postFile(@UploadedFile() file) {
    this.cacheService.clearCache(GET_FILE_CACHE_KEY);
    return filePathToUrl(file.path);
  }

  @Post('download')
  async downloadFile(
    @Body('path') path: string,
    @Body('url') url: string
  ) {
    const file = await this.appService.downloadFile(url, path);        
    return file;
  }
}
