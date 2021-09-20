import { MailActionType } from '@open-template-hub/common/lib/action/mail.action';
import { MailController } from '../controller/mail.controller';

export class MailQueueConsumer {
  constructor(
    private channel: any,
    private mailController = new MailController()
  ) {}

  onMessage = async (msg: any) => {
    if (msg !== null) {
      const msgStr = msg.content.toString();
      const msgObj = JSON.parse(msgStr);

      const message: MailActionType = msgObj.message;

      if (message.contactUs) {
        let requeue = false;

        try {
          console.log(
            'Message Received with deliveryTag: ' + msg.fields.deliveryTag,
            msgObj
          );

          await this.mailController.sendContactUsMail(message.contactUs.params);

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

          // Decide requeue in the error handling
          this.channel.nack(msg, false, requeue);
        }
      } else if (message.forgetPassword) {
      } else if (message.verifyAccount) {
      } else {
        console.log('Message will be rejected: ', msgObj);
        this.channel.reject(msg, false);
      }
    }
  };
}
