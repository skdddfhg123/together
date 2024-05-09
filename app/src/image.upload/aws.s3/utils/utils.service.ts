import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UtilsService {
  getUUID(): string {
    return uuidv4();
  }

  extractFilename(uri): string {
    // Base URL을 제거합니다.
    const baseRemoved = uri.replace('https://s3.ap-northeast-2.amazonaws.com/together3-bucket/feeds/', '');
    
    // 파일 확장자 (.gif)를 제거합니다.
    const extensionRemoved = baseRemoved.replace(/\.[^/.]+$/, '');
    
    return extensionRemoved;
  }
}