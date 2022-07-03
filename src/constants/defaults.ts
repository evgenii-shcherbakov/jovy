import { Application, NextFunction, Request, Response } from 'express';

export const defaultErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('---Error---\n', err, '\n---Error---');
  res.status(500).json({ message: err.message || 'unknown error' });
};

export const defaultLaunchCallback = (app: Application, port: number | string) => {
  app.listen(port, () => console.log(`Server started on port ${port}`));
};
