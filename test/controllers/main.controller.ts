import { Controller, Get, Param } from '../../src';

@Controller()
export class MainController {
  @Get()
  getHello(): string {
    return 'Hello';
  }

  @Get(':id/posts/:postId')
  getId(@Param('id') id: string, @Param('postId') postId: string): string {
    return `${id} | ${postId}`;
  }
}
