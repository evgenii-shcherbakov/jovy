export const formatPath = (path: string): string => {
  if (path === '') return '/';

  const length: number = path.length;
  const pathArr: string[] = path.split('');

  const startSymbol: string = pathArr[0] !== '/' ? '/' : '';
  const endIndex: number | undefined = pathArr[length - 1] === '/' ? length - 1 : undefined;

  return startSymbol + path.substring(0, endIndex);
};
