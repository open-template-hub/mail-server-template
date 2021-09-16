/**
 * @description holds mail controller
 */

import {} from '@open-template-hub/common';
import { MessageQueueProvider } from '@open-template-hub/common/lib/provider/message-queue.provider';
import { PUBLIC_MAIL_QUEUE } from '../../app.constant';
import { Mail } from '../interface/mail.interface';

export class MailController {
  /**
   * send public email
   * @param db database
   * @param mail mail
   */
  public = async (message_queue_provider: MessageQueueProvider, mail: Mail) => {
    await message_queue_provider.publish(mail, PUBLIC_MAIL_QUEUE);
    return { success: true };
  };
}
