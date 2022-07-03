import {
  Body,
  Controller,
  File,
  Get,
  HandlerType,
  Ip,
  Param,
  Post,
  Req,
  Request,
  Storage,
  UploadedFile,
  Response,
} from '../../src';
import { SavedMessage } from '../decorators';

@Controller()
export class MainController {
  @Get()
  getHello(): string {
    return 'Hello';
  }

  @Get('ip')
  getIp(@Ip() ip: string): string {
    return ip;
  }

  @Post('body')
  setBody(@Body() dto: any, @Req() req: Request): any {
    return dto || 'empty body';
  }

  @Post('lol', HandlerType.CLASSIC)
  setLol(req: Request, res: Response): any {
    res.json(req.body);
  }

  @Get('middlewares')
  @SavedMessage()
  getMiddlewares(@Storage('message') message?: string): string {
    return message || `Can't get message from middleware`;
  }

  @Get(':id/posts/:postId', HandlerType.RENDER)
  getId(@Param('id') id: string, @Param('postId') postId: string): string {
    return `
      <div>
        <h2>Id: ${id}</h2>
        <p>PostId: ${postId}</p>
      </div>
    `;
  }

  @Post('upload')
  upload(@File('file') file?: UploadedFile) {
    if (!file) throw new Error();

    return {
      name: file.name,
      size: file.size,
    };
  }
}
