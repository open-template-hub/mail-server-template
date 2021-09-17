/**
 * @description holds mail routes
 */

import { ResponseCode } from '@open-template-hub/common';
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
    req.body as Mail
  );
  res.status(ResponseCode.CREATED).json(response);
});
