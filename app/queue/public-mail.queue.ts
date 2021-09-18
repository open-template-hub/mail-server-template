import { Actions, MessageQueueProvider } from '@open-template-hub/common';

export class PublicMailQueue {
  constructor(private mq: MessageQueueProvider, private channel: string) {}
  onMessage = async (msg: any) => { 
    if (msg !== null) {
      var msgStr = msg.content.toString();
      var msgObj = JSON.parse(msgStr);
      if (msgObj.action === Actions.MailActions.CONTACT_US) {
        try {
          await this.mq.acceptAck(this.channel, msg);
          console.log('Message Processed: ', msgObj);
        } catch (e) {
          console.log('Error while processing message: ', msgObj);
        }
      } else {
        console.log('Message will be rejected: ', msgObj);
        await this.mq.rejectAck(this.channel, msg, false);
      }
    }
  };
}
