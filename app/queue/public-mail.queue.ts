export class PublicMailQueue {
  onMessage = (msg: any) => {
    console.log('Message Received: ', msg);
  }
}