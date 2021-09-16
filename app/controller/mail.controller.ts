/**
 * @description holds mail controller
 */

import {} from '@open-template-hub/common';
import { MessageQueueProvider } from '@open-template-hub/common/lib/provider/message-queue.provider';
import { Mail } from '../interface/mail.interface';

export class MailController {
  /**
   * send public email
   * @param db database
   * @param mail mail
   */
  public = async (message_queue_provider: MessageQueueProvider, mail: Mail) => {
    return { success: true };
  };
}
