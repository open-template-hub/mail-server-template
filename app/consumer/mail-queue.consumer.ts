import { MailActionType } from '@open-template-hub/common/lib/action/mail.action';

export class MailQueueConsumer {

  constructor( private channel: any ) {
  }

  onMessage = async ( msg: any ) => {
    if ( msg !== null ) {
      const msgStr = msg.content.toString();
      const msgObj = JSON.parse( msgStr );

      const message: MailActionType = msgObj.message;

      console.log( msgObj.message );
      console.log( message );

      if ( message.contactUs ) {
        let requeue = false;

        try {
          console.log( 'Message Received with deliveryTag: ' + msg.fields.deliveryTag, msgObj );

          // TODO: send contact us mail

          await this.channel.ack( msg );
          console.log( 'Message Processed with deliveryTag: ' + msg.fields.deliveryTag, msgObj );
        } catch ( e ) {
          console.log( 'Error with processing deliveryTag: ' + msg.fields.deliveryTag, msgObj, e );

          // Decide requeue in the error handling
          this.channel.nack( msg, false, requeue );
        }
      } else {
        console.log( 'Message will be rejected: ', msgObj );
        this.channel.reject( msg, false );
      }
    }
  };
}