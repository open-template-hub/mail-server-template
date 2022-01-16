/**
 * @description holds mail controller
 */

import {
  AccountVerificationMailActionParams,
  BuilderUtil,
  ContactUsMailActionParams,
  ForgetPasswordMailActionParams,
  MailUtil,
  MongoDbProvider,
} from '@open-template-hub/common';
import { MailTemplateFilePath } from '../../app.constant';
import { Environment } from '../../environment';
import { Context } from '@open-template-hub/common';
import { PreconfiguredMail } from '../interface/preconfigured-mail.interface';
import { PreconfiguredMailRepository } from '../repository/preconfigured-mail.repository';

export class MailController {
  constructor(
    private builderUtil: BuilderUtil = new BuilderUtil(),
    private environment: Environment = new Environment(),
    private mailUtil: MailUtil = new MailUtil(environment.args())
  ) {}

  /**
   * send mail
   * @param context Context
   * @param key string
   * @param languageCode string
   * @param to string
   * @param params ContactUsMailActionParams | ForgetPasswordMailActionParams | AccountVerificationMailActionParams
   */
  sendMail = async (
    mongodb_provider: MongoDbProvider, 
    key: string,
    languageCode: string,
    to: string,
    params: ContactUsMailActionParams | ForgetPasswordMailActionParams | AccountVerificationMailActionParams
    ) => {
      var templateParams = this.objectToMap( params );

      var preconfiguredMail = await this.getPreconfiguredMail( mongodb_provider, key, languageCode );

      const mailBody = this.builderUtil.buildTemplateFromString( preconfiguredMail.body, templateParams );

      this.mailUtil.send(
        to,
        preconfiguredMail.subject,
        mailBody
      )
    };

  createPreconfiguredMail = async (
      context: Context,
      preconfiguredMail: PreconfiguredMail
  ) => {
    const conn = context.mongodb_provider.getConnection()
    const preconfiguredMailRepository = await new PreconfiguredMailRepository().initialize(conn);
    return await preconfiguredMailRepository.createPreconfiguredMail(preconfiguredMail)
  }

  private getPreconfiguredMail = async (
    provider: MongoDbProvider,
    mailKey: string,
    languageCode: string
  ): Promise<PreconfiguredMail> => {
    const conn = provider.getConnection();

    const preconfiguredMailRepository = await new PreconfiguredMailRepository().initialize( conn );

    const preconfiguredMail: PreconfiguredMail = await preconfiguredMailRepository.getPreconfiguredMail( mailKey, languageCode );

    return preconfiguredMail;
  }

  private objectToMap = (obj: object) => {
    var m = new Map<string, string>();
    for (const [key, value] of Object.entries(obj)) {
      m.set('${' + key + '}', value.toString());
    }
    return m;
  };
}
