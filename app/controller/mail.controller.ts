/**
 * @description holds mail controller
 */

import {
  BuilderUtil,
  ContactUsMailActionParams,
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
   * send public email
   * @param db database
   * @param mail mail
   */
  sendContactUsMail = async (params: ContactUsMailActionParams) => {
    var templateParams = this.objectToMap(params);
    var subject = 'New Interaction';

    var body = this.builderUtil.buildTemplateFromFile(
      MailTemplateFilePath.ContactUs,
      templateParams
    );

    this.mailUtil.send(
      this.environment.args().mailArgs?.mailUsername as string,
      subject,
      body
    );
  };

  private objectToMap = (obj: object) => {
    var m = new Map<string, string>();
    for (const [key, value] of Object.entries(obj)) {
      m.set('${' + key + '}', value.toString());
    }
    return m;
  };
}
