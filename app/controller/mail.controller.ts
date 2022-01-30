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
import { Context } from '@open-template-hub/common';
import { PreconfiguredMail } from '../interface/preconfigured-mail.interface';
import { PreconfiguredMailRepository } from '../repository/preconfigured-mail.repository';
import { ServiceProviderRepository } from '../repository/mail-provider.repository';
import { MailConfigRepository } from '../repository/mail-config.repository';
import { MailConfig } from '../interface/mail-config.interface';
import { ServiceProvider } from '../interface/service-provider.interface';

export class MailController {
  constructor(
    private builderUtil: BuilderUtil = new BuilderUtil()
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
    mailKey: string,
    languageCode: string | undefined,
    to: string | undefined,
    params: ContactUsMailActionParams | ForgetPasswordMailActionParams | AccountVerificationMailActionParams
    ) => {
      languageCode = languageCode ?? process.env.DEFAULT_LANGUAGE ?? 'en';

      var preconfiguredMail = await this.getPreconfiguredMail( mongodb_provider, mailKey, languageCode );

      // overwrite 'to' if preconfiguredMail model contains
      if( preconfiguredMail.to ) {
        to = preconfiguredMail.to
      }

      if ( to === undefined ) {
        throw new Error( "'To' not found")
      }

      const mailConfig = await this.getMailConfig(
        mongodb_provider,
        preconfiguredMail.from
      );

      const username = mailConfig.username;
      const password = mailConfig.password;
      if( username === undefined || password === undefined ) {
        throw new Error('Host or Port can not be found');
      }

      const serviceProvider = await this.getServiceProvider(
        mongodb_provider,
        mailConfig.provider
      );

      const host = serviceProvider.payload.host
      const port = serviceProvider.payload.port
      if( host === undefined ) {
        throw new Error('Host can not be found');
      }

      var templateParams = this.objectToMap( params );
      const mail = preconfiguredMail.mails[0] 
      const mailBody = this.builderUtil.buildTemplateFromString( mail.body, templateParams );

      let mailUtil = new MailUtil(
        username,
        password,
        host,
        port
      );

      mailUtil.send(
        to as string,
        mail.subject,
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

  private getServiceProvider = async (
    provider: MongoDbProvider,
    key: string
  ): Promise<ServiceProvider> => {
    const conn = provider.getConnection();

    const serviceProviderRepository = await new ServiceProviderRepository().initialize( conn );

    let serviceProvider: any = await serviceProviderRepository.getServiceProviderByKey( key );

    if( serviceProvider === undefined ) {
      throw new Error( 'Service can not be found' );
    }

    return serviceProvider;
  }

  private getMailConfig = async (
    provider: MongoDbProvider,
    username: string
  ): Promise<MailConfig> => {
    const conn = provider.getConnection();

    const mailConfigRepository = await new MailConfigRepository().initialize( conn );

    let mailConfig: any = await mailConfigRepository.getMailConfigByUsername( username );

    if( mailConfig === null ) {
      throw new Error( 'Service can not be found' );
    }

    return mailConfig;
  }

  private getPreconfiguredMail = async (
    provider: MongoDbProvider,
    mailKey: string,
    languageCode: string
  ): Promise<PreconfiguredMail> => {
    const conn = provider.getConnection();

    const preconfiguredMailRepository = await new PreconfiguredMailRepository().initialize( conn );

    const preconfiguredMail: PreconfiguredMail = await preconfiguredMailRepository.getPreconfiguredMail( mailKey, languageCode );

    if( preconfiguredMail === null || preconfiguredMail?.mails?.length < 1 ) {
      throw new Error( 'Preconfigured mail not found' );
    }

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
