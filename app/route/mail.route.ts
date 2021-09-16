/**
 * @description holds auth routes
 */

import { ResponseCode, User } from '@open-template-hub/common';
import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { MailController } from '../controller/mail.controller';
import { Mail } from '../interface/mail.interface';

const subRoutes = {
  root: '/',
  public: '/public',
  private: '/private',
};

export const publicRoutes = [subRoutes.public];

export const adminRoutes = [];

export const router = Router();

router.post(subRoutes.public, async (req: Request, res: Response) => {
  // send public mail
  const mailController = new MailController();
  const context = res.locals.ctx;
  const response = await mailController.public(
    context.message_queue_provider,
    req.body as Mail
  );
  res.status(ResponseCode.CREATED).json(response);
});
