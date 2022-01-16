import { EnvArgs, MongoDbProvider } from '@open-template-hub/common';
import { MailActionType } from '@open-template-hub/common/lib/action/mail.action';
import { Environment } from '../../environment';
import { MailController } from '../controller/mail.controller';

export class MailQueueConsumer {
  constructor(
    private channel: any,
    private mongodbProvider: MongoDbProvider,
    private environmentArgs: EnvArgs,
    private mailController = new MailController(),
  ) {}

  onMessage = async (msg: any) => {
    if (msg !== null) {
      const msgStr = msg.content.toString();
      const msgObj = JSON.parse(msgStr);

      const message: MailActionType = msgObj.message;

      // Decide requeue in the error handling
      let requeue = false;

      /*
      if (message.contactUs) {
        var contactUsHook = async () => {
          await this.mailController.sendContactUsMail(message.contactUs.params);
        };

        await this.operate(msg, msgObj, requeue, contactUsHook);
      } else if (message.forgetPassword) {
        var forgetPasswordHook = async () => {
          await this.mailController.sendForgetPasswordMail(
            message.forgetPassword.params
          );
        };

        await this.operate(msg, msgObj, requeue, forgetPasswordHook);
      } else if (message.verifyAccount) {
        var verifyAccountHook = async () => {
          await this.mailController.sendVerifyAccountMail(
            message.verifyAccount.params
          );
        };

        await this.operate(msg, msgObj, requeue, verifyAccountHook);
      } else {
        console.log('Message will be rejected: ', msgObj);
        this.channel.reject(msg, false);
      }*/

      let key: string | undefined;
      let languageCode: string | undefined;
      let to: string | undefined;
      let params: any | undefined;
      if ( message.contactUs ) {
        key = "ContactUs";
        languageCode = "en"; // TODO Retrieve from message
        to = this.environmentArgs.mailArgs?.mailUsername as string;
        params = message.contactUs.params
      } else if ( message.forgetPassword ) {
        key = "ForgetPassword";
        languageCode = "en"; // TODO Retrieve from message
        to = message.forgetPassword.params.email;
        params = message.forgetPassword.params
      } else if ( message.verifyAccount ) {
        key = "VerifyAccount";
        languageCode = "en";
        to = message.verifyAccount.params.email;
        params = message.verifyAccount.params;
      } else {
        console.log('Message will be rejected: ', msgObj);
        this.channel.reject(msg, false);
      }

      if( key && languageCode && to && params ) {
        let hook = async() => {
          await this.mailController.sendMail(
            this.mongodbProvider,
            key as string,
            languageCode as string,
            to as string,
            params
          );
        };

        await this.operate(msg, msgObj, requeue, hook);        
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
