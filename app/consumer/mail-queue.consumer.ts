import { Actions, MessageQueueProvider } from '@open-template-hub/common';

export class MailQueueConsumer {
  constructor(private channel: any) {}

  onMessage = async (msg: any) => {
    if (msg !== null) {
      const msgStr = msg.content.toString();
      const msgObj = JSON.parse(msgStr);
      if (msgObj.action === Actions.MailActions.CONTACT_US) {
        try {
          console.log('Message Received: ', msgObj);
          await this.channel.ack(msg);
          console.log('Message Processed: ', msgObj);
        } catch (e) {
          console.log('Error while processing message: ', msgObj);
          console.log('Stacktrace: ', e);
        }
      } else {
        console.log('Message will be rejected: ', msgObj);
        //await this.mq.rejectAck( this.channel, msg, false );
      }
    }
  };
}
