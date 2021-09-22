import { EnvArgs, MailArgs, MqArgs, TokenArgs, } from '@open-template-hub/common';

export class Environment {
  constructor( private _args: EnvArgs = {} as EnvArgs ) {
    const mailArgs = {
      mailHost: process.env.MAIL_HOST,
      mailPassword: process.env.MAIL_PASSWORD,
      mailPort: process.env.MAIL_PORT,
      mailUsername: process.env.MAIL_USERNAME,
    } as MailArgs;

    const mqArgs = {
      messageQueueConnectionUrl: process.env.CLOUDAMQP_URL,
      mailServerMessageQueueChannel: process.env.MAIL_SERVER_QUEUE_CHANNEL,
    } as MqArgs;

    const tokenArgs = {
      responseEncryptionSecret: process.env.RESPONSE_ENCRYPTION_SECRET,
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
    } as TokenArgs;

    this._args = {
      mailArgs,
      mqArgs,
      tokenArgs,
    } as EnvArgs;
  }

  args = () => {
    return this._args;
  };
}
