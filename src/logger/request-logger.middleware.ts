import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './winston.config';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = WinstonModule.createLogger(winstonConfig);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${ip}`,
        'HTTP',
      );
    });

    next();
  }
}