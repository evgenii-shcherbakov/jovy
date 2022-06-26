import {
  Controller,
  Get,
  Post,
  Param,
  HandlerType,
  File,
  UploadedFile,
  Ip,
  Storage,
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
