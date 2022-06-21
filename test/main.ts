import { App, AppConfiguration, Application } from '../src';
import controllers from './controllers';

const appConfig: AppConfiguration = {
  port: 5555,
  controllers,
};

new App(appConfig).launch((app: Application, port: string | number) => {
  app.listen(port, () => console.log(`Test environment started on ${port} port`));
});
