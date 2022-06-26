import { setMiddlewares } from '../dist';
import { saveNumberMiddleware } from './middlewares';

export const SavedMessage = (): MethodDecorator => setMiddlewares(saveNumberMiddleware);
