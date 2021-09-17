import {
  EnvArgs,
  MailArgs,
  MqArgs,
  TokenArgs,
} from '@open-template-hub/common';

export class Environment {
  constructor(private _args: EnvArgs = {} as EnvArgs) {
    var mailArgs = {
      mailHost: process.env.MAIL_HOST,
      mailPassword: process.env.MAIL_PASSWORD,
      mailPort: process.env.MAIL_PORT,
      mailUsername: process.env.MAIL_USERNAME,
    } as MailArgs;

    var mqArgs = {
      messageQueueConnectionUrl: process.env.MESSAGE_QUEUE_CONNECTION,
      mailServerMessageQueueChannel: process.env.MAIL_SERVER_QUEUE_CHANNEL,
    } as MqArgs;

    var tokenArgs = {
      responseEncryptionSecret: process.env.RESPONSE_ENCRYPTION_SECRET,
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
