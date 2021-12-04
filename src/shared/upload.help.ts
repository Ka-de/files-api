import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from 'multer';
import { v4 as uuidV4 } from 'uuid';
import { promises as fsPromises } from 'fs';
import { URL } from 'url';

export function uploadFile(name: string, nFiles: number) {

    const store = {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const url = new URL(`https://site.com/${req.url}`).searchParams.get('path');
                const destination = `./files/${url}`;

                fsPromises.mkdir(destination, { recursive: true }).then(() => {
                    cb(null, destination);
                })
            },
            filename: (req, file, cb) => {
                const filename: string = file.originalname.slice(0, file.originalname.lastIndexOf('.')) + `-${uuidV4()}`;
                const extention: string = file.originalname.slice(file.originalname.lastIndexOf('.'));

                cb(null, `${filename}${extention}`);
            }
        })
    } as MulterOptions;

    if (nFiles > 1) {
        return FilesInterceptor(name, nFiles, store);
    }
    else {
        return FileInterceptor(name, store);
    }
}

export function filePathToUrl(pathToFile: string) {
    const [root, ...rest] = pathToFile.split("\\").join('/').split('/');    
    const path = rest.slice(0, rest.length - 1).join('/');
    const name = rest[rest.length - 1];

    return `file?path=${path}&name=${name}`;
}