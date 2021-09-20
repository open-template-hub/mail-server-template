/**
 * @description holds mail controller
 */

import {
  AccountVerificationMailActionParams,
  BuilderUtil,
  ContactUsMailActionParams,
  ForgetPasswordMailActionParams,
  MailUtil,
} from '@open-template-hub/common';
import { MailTemplateFilePath } from '../../app.constant';
import { Environment } from '../../environment';

export class MailController {
  constructor(
    private builderUtil: BuilderUtil = new BuilderUtil(),
    private environment: Environment = new Environment(),
    private mailUtil: MailUtil = new MailUtil(environment.args())
  ) {}

  /**
   * send contact us email
   * @param params ContactUsMailActionParams
   */
  sendContactUsMail = async (params: ContactUsMailActionParams) => {
    var templateParams = this.objectToMap(params);
    var subject = 'New Interaction';

    var body = this.builderUtil.buildTemplateFromFile(
      MailTemplateFilePath.ContactUs,
      templateParams
    );

    await this.mailUtil.send(
      this.environment.args().mailArgs?.mailUsername as string,
      subject,
      body
    );
  };

  /**
   * send forget password email
   * @param params ForgetPasswordMailActionParams
   */
  sendForgetPasswordMail = async (params: ForgetPasswordMailActionParams) => {
    var templateParams = this.objectToMap(params);
    var subject = 'Forget Password';

    var body = this.builderUtil.buildTemplateFromFile(
      MailTemplateFilePath.ContactUs,
      templateParams
    );

    await this.mailUtil.send(params.email, subject, body);
  };

  /**
   * send verify account email
   * @param params AccountVerificationMailActionParams
   */
  sendVerifyAccountMail = async (
    params: AccountVerificationMailActionParams
  ) => {
    var templateParams = this.objectToMap(params);
    var subject = 'Verify Account';

    var body = this.builderUtil.buildTemplateFromFile(
      MailTemplateFilePath.ContactUs,
      templateParams
    );

    await this.mailUtil.send(params.email, subject, body);
  };

  private objectToMap = (obj: object) => {
    var m = new Map<string, string>();
    for (const [key, value] of Object.entries(obj)) {
      m.set('${' + key + '}', value.toString());
    }
    return m;
  };
}
