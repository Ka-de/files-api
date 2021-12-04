import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { createWriteStream, promises as fsPromises } from 'fs';

@Injectable()
export class AppService {

  constructor(
    private httpService: HttpService
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async downloadFile(url: string, path: string) {
    try {
      const pathToFile = `files/${path}`;
      await fsPromises.mkdir(pathToFile, { recursive: true });

      const extention: string = url.slice(url.lastIndexOf('.'));
      const name = `${uuidV4()}-${uuidV4()}.${extention}`;
      
      const writer = createWriteStream(`${pathToFile}/${name}`);

      const res = await this.httpService.get(url, {
        responseType: 'stream'
      }).toPromise();

      return await new Promise((resolve, reject) => {
        res.data.pipe(writer);

        writer.on('error', err => {
          reject(err);
        });

        writer.on('finish', () => {
          resolve(`file?path=${path}&name=${name}`);
        });
      });
    } catch (error) {
      return new HttpException(error, HttpStatus.AMBIGUOUS);
    }
  }

  filePathToUrl(pathToFile: string) {
    const [root, ...rest] = pathToFile.split("\\").join('/').split('/');
    const path = rest.slice(0, rest.length - 1).join('/');
    const name = rest[rest.length - 1];

    return `?path=${path}&name=${name}`;
  }
}
