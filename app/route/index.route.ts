/**
 * @description holds index routes
 */

import {
  context,
  EncryptionUtil,
  ErrorHandlerUtil,
  MessageQueueProvider,
} from '@open-template-hub/common';
import { NextFunction, Request, Response } from 'express';
import { Environment } from '../../environment';
import { MailQueueConsumer } from '../consumer/mail-queue.consumer';
import {
  publicRoutes as monitorPublicRoutes,
  router as monitorRouter,
} from './monitor.route';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  mail: '/mail',
};

export namespace Routes {
  var environment: Environment;
  var message_queue_provider: MessageQueueProvider;
  const errorHandlerUtil = new ErrorHandlerUtil();

  var publicRoutes: string[] = [];
  var adminRoutes: string[] = [];

  function populateRoutes(mainRoute: string, routes: Array<string>) {
    var populated = Array<string>();
    for (const s of routes) {
      populated.push(mainRoute + (s === '/' ? '' : s));
    }

    return populated;
  }

  export function mount(app: any) {
    environment = new Environment();

    message_queue_provider = new MessageQueueProvider(environment.args());

    const channelTag = new Environment().args().mqArgs
      ?.mailServerMessageQueueChannel as string;
    message_queue_provider.getChannel(channelTag).then((channel: any) => {
      const mailQueueConsumer = new MailQueueConsumer(channel);
      message_queue_provider.consume(
        channel,
        channelTag,
        mailQueueConsumer.onMessage,
        1
      );
    });

    publicRoutes = [...populateRoutes(subRoutes.monitor, monitorPublicRoutes)];
    console.log('Public Routes: ', publicRoutes);

    adminRoutes = [];
    console.log('Admin Routes: ', adminRoutes);

    const responseInterceptor = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      var originalSend = res.send;
      const encryptionUtil = new EncryptionUtil(environment.args());
      res.send = function () {
        console.log('Starting Encryption: ', new Date());
        let encrypted_arguments = encryptionUtil.encrypt(arguments);
        console.log('Encryption Completed: ', new Date());

        originalSend.apply(res, encrypted_arguments as any);
      } as any;

      next();
    };

    // Use this interceptor before routes
    app.use(responseInterceptor);

    // INFO: Keep this method at top at all times
    app.all('/*', async (req: Request, res: Response, next: NextFunction) => {
      try {
        // create context
        res.locals.ctx = await context(
          req,
          environment.args(),
          publicRoutes,
          adminRoutes,
          undefined,
          undefined,
          message_queue_provider
        );

        next();
      } catch (err) {
        let error = errorHandlerUtil.handle(err);
        res.status(error.code).json({ message: error.message });
      }
    });

    // INFO: Add your routes here
    app.use(subRoutes.monitor, monitorRouter);

    // Use for error handling
    app.use(function (
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      let error = errorHandlerUtil.handle(err);
      res.status(error.code).json({ message: error.message });
    });
  }
}
