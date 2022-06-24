import { Controller, Get, Post, Param, HandlerType, File, UploadedFile } from '../../src';

@Controller()
export class MainController {
  @Get()
  getHello(): string {
    return 'Hello';
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
