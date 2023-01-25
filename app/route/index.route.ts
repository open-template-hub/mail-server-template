/**
 * @description holds index routes
 */

import {
  ContextArgs,
  mount as mountApp,
  MountArgs,
  MountAssets,
  Route,
  RouteArgs,
} from '@open-template-hub/common';
import { Environment } from '../../environment';
import { MailQueueConsumer } from '../consumer/mail-queue.consumer';
import { router as mailRouter } from './mail.route';
import { router as monitorRouter } from './monitor.route';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  mail: '/mail',
};

export namespace Routes {
  export function mount(app: any) {
    const envArgs = new Environment().args();

    const ctxArgs = {
      envArgs,
      providerAvailability: {
        mongo_enabled: true,
        postgre_enabled: false,
        mq_enabled: true,
        redis_enabled: true,
      },
    } as ContextArgs;

    const assets = {
      mqChannelTag: envArgs.mqArgs?.mailServerMessageQueueChannel as string,
      queueConsumer: new MailQueueConsumer(),
      applicationName: 'MailServer',
    } as MountAssets;

    const routes: Array<Route> = [];

    routes.push({ name: subRoutes.monitor, router: monitorRouter });
    routes.push({ name: subRoutes.mail, router: mailRouter });

    const routeArgs = { routes } as RouteArgs;

    const args = {
      app,
      ctxArgs,
      routeArgs,
      assets,
    } as MountArgs;

    mountApp(args);
  }
}
