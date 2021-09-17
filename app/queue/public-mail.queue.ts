import { MessageQueueProvider } from '@open-template-hub/common';
import { PUBLIC_MAIL_MQ_ACTION } from '../../app.constant';

export class PublicMailQueue {
  constructor(private mq: MessageQueueProvider, private channel: string) {}
  onMessage = async(msg: any) => {
    var msgStr = msg.content.toString();
    var msgObj = JSON.parse(msgStr);
    if (msgObj.action === PUBLIC_MAIL_MQ_ACTION) {
      console.log('Message Received: ', msgObj);
      // Manual ACK should be fixed
      // await this.mq.acknowledge(this.channel, msg);
      // console.log('Message Processed: ', msgObj);
    }
  };
}
