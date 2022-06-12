import { Application, NextFunction, Request, Response } from 'express';

export const defaultErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ message: 'unknown error' });
};

export const defaultLaunchCallback = (app: Application, port: number | string) => {
  app.listen(port, () => console.log(`Server started on port ${port}`));
};
