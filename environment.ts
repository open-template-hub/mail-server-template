import { EnvArgs } from '@open-template-hub/common';

export class Environment {
  constructor( private _args: EnvArgs = {} as EnvArgs ) {
    this._args = {
      mailHost: process.env.MAIL_HOST,
      mailPassword: process.env.MAIL_PASSWORD,
      mailPort: process.env.MAIL_PORT,
      mailUsername: process.env.MAIL_USERNAME,
      messageQueueConnectionUrl: process.env.MESSAGE_QUEUE_CONNECTION,
      responseEncryptionSecret: process.env.RESPONSE_ENCRYPTION_SECRET,
    } as EnvArgs;
  }

  args = () => {
    return this._args;
  };
}
