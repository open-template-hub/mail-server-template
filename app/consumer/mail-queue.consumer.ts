import { EnvArgs, MongoDbProvider } from '@open-template-hub/common';
import { MailActionType } from '@open-template-hub/common/lib/action/mail.action';
import { MailController } from '../controller/mail.controller';

export class MailQueueConsumer {
  constructor(
    private channel: any,
    private mongodbProvider: MongoDbProvider,
    private environmentArgs: EnvArgs,
    private mailController = new MailController()
  ) {}

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
            this.mongodbProvider,
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

  private operate = async (
    msg: any,
    msgObj: any,
    requeue: boolean,
    hook: Function
  ) => {
    try {
      console.log(
        'Message Received with deliveryTag: ' + msg.fields.deliveryTag,
        msgObj
      );
      await hook();
      await this.channel.ack(msg);
      console.log(
        'Message Processed with deliveryTag: ' + msg.fields.deliveryTag,
        msgObj
      );
    } catch (e) {
      console.log(
        'Error with processing deliveryTag: ' + msg.fields.deliveryTag,
        msgObj,
        e
      );

      this.channel.nack(msg, false, requeue);
    }
  };
}
