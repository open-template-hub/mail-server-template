import { DbArgs, EnvArgs, MqArgs, TokenArgs } from '@open-template-hub/common';

export class Environment {
  constructor(private _args: EnvArgs = {} as EnvArgs) {
    const dbArgs = {
      mongoDbConnectionLimit: process.env.MONGODB_CONNECTION_LIMIT,
      mongoDbUri: process.env.MONGODB_URI,
      redisUri: process.env.REDISCLOUD_URL,
      redisConnectionLimit: process.env.REDIS_CONNECTION_LIMIT,
    } as DbArgs;

    const mqArgs = {
      messageQueueConnectionUrl: process.env.CLOUDAMQP_URL,
      mailServerMessageQueueChannel: process.env.MAIL_SERVER_QUEUE_CHANNEL,
      orchestrationServerMessageQueueChannel:
        process.env.ORCHESTRATION_SERVER_QUEUE_CHANNEL,
    } as MqArgs;

    const tokenArgs = {
      responseEncryptionSecret: process.env.RESPONSE_ENCRYPTION_SECRET,
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    } as TokenArgs;

    this._args = {
      dbArgs,
      mqArgs,
      tokenArgs,
    } as EnvArgs;
  }

  args = () => {
    return this._args;
  };
}
