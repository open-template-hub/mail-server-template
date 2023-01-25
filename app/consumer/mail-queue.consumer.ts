import {
  AbstractQueueConsumer,
  ContextArgs,
  MessageQueueChannelType,
  MongoDbProvider,
  QueueConsumer,
  RedisProvider,
} from '@open-template-hub/common';
import { MailActionType } from '@open-template-hub/common/lib/action/mail.action';
import { MailController } from '../controller/mail.controller';

export class MailQueueConsumer
  extends AbstractQueueConsumer
  implements QueueConsumer
{
  private mailController: MailController;

  constructor() {
    super();
    this.mailController = new MailController();
    this.ownerChannelType = MessageQueueChannelType.MAIL;
  }

  init = (channel: string, ctxArgs: ContextArgs) => {
    this.channel = channel;
    this.ctxArgs = ctxArgs;
    return this;
  };

  onMessage = async (msg: any) => {
    if (msg !== null) {
      const msgStr = msg.content.toString();
      const msgObj = JSON.parse(msgStr);

      const message: MailActionType = msgObj.message;

      // Decide requeue in the error handling
      let requeue = false;

      let key: string | undefined;
      let to: string | undefined;
      let params: any | undefined;

      if (
        message &&
        message?.mailType &&
        Object.keys(message.mailType)?.length > 0
      ) {
        key = Object.keys(message.mailType)[0];
        params = (message.mailType as any)[key]?.params;
        to = params?.email;
      } else {
        console.log('Message will be rejected: ', msgObj);
        this.channel.reject(msg, false);
        return;
      }

      if (key && params) {
        let hook = async () => {
          await this.mailController.sendMail(
            this.ctxArgs.redis_provider as RedisProvider,
            this.ctxArgs.mongodb_provider as MongoDbProvider,
            key as string,
            message.language,
            to as string,
            params
          );
        };

        await this.operate(msg, msgObj, requeue, hook);
      } else {
        console.log('Message will be rejected: ', msgObj);
        this.channel.reject(msg, false);
        return;
      }
    }
  };
}
