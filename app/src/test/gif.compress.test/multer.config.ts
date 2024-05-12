// src/config/multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); // 파일이 저장될 서버 내 경로
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + extname(file.originalname)); // 파일 이름 설정
    }
  })
};