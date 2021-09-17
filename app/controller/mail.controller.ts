/**
 * @description holds mail controller
 */

import { Mail } from '../interface/mail.interface';

export class MailController {
  /**
   * send public email
   * @param db database
   * @param mail mail
   */
  public = async (mail: Mail) => {
    return { success: true };
  };
}
