import { IPathService } from '../abstractions/interfaces';

export class PathService implements IPathService {
  constructor(private readonly path: string) {}

  format(): string {
    if (this.path === '') return '/';

    const length: number = this.path.length;
    const startSymbol: string = this.path[0] !== '/' ? '/' : '';
    const endIndex: number | undefined = this.path[length - 1] === '/' ? length - 1 : undefined;

    return startSymbol + this.path.substring(0, endIndex);
  }
}
