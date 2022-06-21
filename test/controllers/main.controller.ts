import { Controller, Get, Request, Response } from '../../src';

@Controller()
export class MainController {
  @Get()
  getHello(req: Request, res: Response) {
    res.json('Hello');
  }
}
