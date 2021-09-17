import { MessageQueueProvider } from '@open-template-hub/common';
import { PUBLIC_MAIL_MQ_ACTION } from '../../app.constant';

export class PublicMailQueue {
  constructor(private mq: MessageQueueProvider, private channel: string) {}
  onMessage = (msg: any) => {
    var msgStr = msg.content.toString();
    var msgObj = JSON.parse(msgStr);
    if (msgObj.action === PUBLIC_MAIL_MQ_ACTION) {
      console.log('Message Received: ', msgObj);
      this.mq.acknowledge(this.channel, msg);
    }
  };
}
