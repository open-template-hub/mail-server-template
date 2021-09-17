export class PublicMailQueue {
  onMessage = (msg: any) => {
    var msgStr = msg.content.toString();
    var msgObj = JSON.parse(msgStr);
    console.log('Message Received: ', msgObj);
  };
}
