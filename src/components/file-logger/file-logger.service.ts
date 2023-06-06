import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class FileLoggerService {
  async saveToFile(
    filePath: string,
    data: string,
    appendFile: boolean = false,
  ) {
    const fn = appendFile ? fs.appendFile : fs.writeFile;
    await fn(filePath, data);
  }
}
