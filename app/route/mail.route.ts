import { ContactUsMailActionParams, ResponseCode } from "@open-template-hub/common";
import { Request, Response } from 'express';
import Router from "express-promise-router";
import { MailController } from "../controller/mail.controller";

const subRoutes = {
    root: '/'
};

export const router = Router()

const mailController = new MailController()

router.post( subRoutes.root, async (req: Request, res: Response) => {
    await mailController.sendMail(
        res.locals.ctx.mongodb_provider,
        req.body.mailKey,
        req.body.languageCode,
        req.body.to,
        req.body.params
    )
    res.status( ResponseCode.OK ).json({});
} );