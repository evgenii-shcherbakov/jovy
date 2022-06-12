import { NextFunction, Request, Response } from 'express';
import http from 'http';

export const defaultErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(500).json({ message: 'unknown error' });
};

export const defaultLaunchCallback = async (server: http.Server, port: number | string) => {
  server.listen(port, () => console.log(`Server started on port ${port}`));
};
