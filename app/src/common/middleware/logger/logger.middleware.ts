import { Injectable, Module, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from 'src/utils/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[Request] ${req.method} - ${req.url}`);
    res.on('finish', () => {
      console.log(`[Response] ${req.method} - ${req.url} - Status: ${res.statusCode}`);
    });
    next();
  }

  // constructor(
  //   private readonly loggerService: CustomLoggerService,
  // ) { }

  // use(req: Request, res: Response, next: NextFunction) {
  //   this.loggerService.logRequestResponse(req, res, '1237047183753347174', '1237643537047355453');
  //   next();
  // }
}

@Injectable()
export class AuthLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly loggerService: CustomLoggerService,
  ) { }

  use(req: Request, res: Response, next: NextFunction) {
    this.loggerService.logRequestResponse(req, res, '1237047183753347174', '1237643537047355453');
    next();
  }
}

@Injectable()
export class CalendarLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly loggerService: CustomLoggerService,
  ) { }

  use(req: Request, res: Response, next: NextFunction) {
    this.loggerService.logRequestResponse(req, res, '1237047690798305353', '1237643537047355453');
    next();
  }
}

@Injectable()
export class GroupEventLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly loggerService: CustomLoggerService,
  ) { }

  use(req: Request, res: Response, next: NextFunction) {
    this.loggerService.logRequestResponse(req, res, '1237050219649175552', '1237643537047355453');
    next();
  }
}

@Injectable()
export class PlatformLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly loggerService: CustomLoggerService,
  ) { }

  use(req: Request, res: Response, next: NextFunction) {
    this.loggerService.logRequestResponse(req, res, '1237047898651496510', '1237643537047355453');
    next();
  }
}

@Injectable()
export class KakaoLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly loggerService: CustomLoggerService,
  ) { }

  use(req: Request, res: Response, next: NextFunction) {
    this.loggerService.logRequestResponse(req, res, '1237050494921211985', '1237643537047355453');
    next();
  }
}

@Injectable()
export class FeedLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly loggerService: CustomLoggerService,
  ) { }

  use(req: Request, res: Response, next: NextFunction) {
    this.loggerService.logRequestResponse(req, res, '1237048051798118451', '1237643537047355453');
    next();
  }
}
