/**
 * @description holds mail controller
 */

import {
  AccountVerificationMailActionParams,
  BuilderUtil,
  ContactUsMailActionParams,
  Context,
  ForgetPasswordMailActionParams,
  JoinTeamMailActionParams,
  MailUtil,
  MongoDbProvider,
  RedisProvider,
} from '@open-template-hub/common';
import { MailConfig } from '../interface/mail-config.interface';
import { PreconfiguredMail } from '../interface/preconfigured-mail.interface';
import { ServiceProvider } from '../interface/service-provider.interface';
import { MailConfigRepository } from '../repository/mail-config.repository';
import { ServiceProviderRepository } from '../repository/mail-provider.repository';
import { PreconfiguredMailRepository } from '../repository/preconfigured-mail.repository';

export class MailController {
  constructor(private builderUtil: BuilderUtil = new BuilderUtil()) {}

  /**
   * send mail
   * @param context Context
   * @param key string
   * @param languageCode string
   * @param to string
   * @param params ContactUsMailActionParams | ForgetPasswordMailActionParams | AccountVerificationMailActionParams
   */
  sendMail = async (
    redis_provider: RedisProvider,
    mongodb_provider: MongoDbProvider,
    mailKey: string,
    languageCode: string | undefined,
    to: string | undefined,
    params:
      | ContactUsMailActionParams
      | ForgetPasswordMailActionParams
      | AccountVerificationMailActionParams
      | JoinTeamMailActionParams
  ) => {
    const defaultLanguageCode = process.env.DEFAULT_LANGUAGE ?? 'en';

    let preconfiguredMail = await this.getPreconfiguredMail(
      redis_provider,
      mongodb_provider,
      mailKey,
      languageCode,
      defaultLanguageCode
    );

    // overwrite 'to' if preconfiguredMail model contains
    if (preconfiguredMail.to) {
      to = preconfiguredMail.to;
    }

    if (!to) {
      throw new Error("'To' not found");
    }

    const mailConfig = await this.getMailConfig(
      mongodb_provider,
      preconfiguredMail.from
    );

    const username = mailConfig.username;
    const password = mailConfig.password;
    if (!username || !password) {
      throw new Error('Host or Port can not be found');
    }

    const serviceProvider = await this.getServiceProvider(
      mongodb_provider,
      mailConfig.provider
    );

    const host = serviceProvider.payload.host;
    const port = serviceProvider.payload.port;
    if (!host) {
      throw new Error('Host can not be found');
    }

    let templateParams = this.objectToMap(params);
    const mail = preconfiguredMail.mails[0];
    const mailBody = this.builderUtil.buildTemplateFromString(
      mail.body,
      templateParams
    );

    let mailUtil = new MailUtil(
      username,
      password,
      host,
      serviceProvider.payload.sslV3 ?? false,
      port
    );

    mailUtil.send(to, mail.subject, mailBody);
  };

  createPreconfiguredMail = async (
    context: Context,
    preconfiguredMail: PreconfiguredMail
  ) => {
    const conn = context.mongodb_provider.getConnection();
    const preconfiguredMailRepository =
      await new PreconfiguredMailRepository().initialize(conn);
    return await preconfiguredMailRepository.createPreconfiguredMail(
      preconfiguredMail
    );
  };

  private getServiceProvider = async (
    provider: MongoDbProvider,
    key: string
  ): Promise<ServiceProvider> => {
    const conn = provider.getConnection();

    const serviceProviderRepository =
      await new ServiceProviderRepository().initialize(conn);

    let serviceProvider: any =
      await serviceProviderRepository.getServiceProviderByKey(key);

    if (!serviceProvider) {
      throw new Error('Service can not be found');
    }

    return serviceProvider;
  };

  private getMailConfig = async (
    provider: MongoDbProvider,
    username: string
  ): Promise<MailConfig> => {
    const conn = provider.getConnection();

    const mailConfigRepository = await new MailConfigRepository().initialize(
      conn
    );

    let mailConfig: any = await mailConfigRepository.getMailConfigByUsername(
      username
    );

    if (!mailConfig) {
      throw new Error('MailConfig can not be found');
    }

    return mailConfig;
  };

  private getPreconfiguredMail = async (
    redis_provider: RedisProvider,
    mongodb_provider: MongoDbProvider,
    mailKey: string,
    languageCode: string | undefined,
    defaultLanguageCode: string
  ): Promise<PreconfiguredMail> => {
    var preconfiguredMail: PreconfiguredMail | undefined;

    const cacheKey = "MAIL_" + mailKey + '_' + languageCode ?? defaultLanguageCode;

    preconfiguredMail = await this.getPreconfiguredMailFromCache(
      redis_provider,
      cacheKey
    );

    if (!preconfiguredMail) {
      preconfiguredMail = await this.getPreconfiguredMailFromDb(
        mongodb_provider,
        mailKey,
        languageCode,
        defaultLanguageCode
      );

      await this.putPreconfiguredMailIntoCache(
        redis_provider,
        cacheKey,
        preconfiguredMail
      );

      console.log('Preconfigured mail loaded from db');
    } else {
      console.log('Preconfigured mail loaded from cache');
    }

    return preconfiguredMail;
  };

  private getPreconfiguredMailFromCache = async (
    redis_provider: RedisProvider,
    cacheKey: string
  ) => {
    const cache = redis_provider.getConnection();
    const preconfiguredMailString = await cache.get(cacheKey);
    if (preconfiguredMailString) {
      return JSON.parse(preconfiguredMailString);
    } else {
      return null;
    }
  };

  private putPreconfiguredMailIntoCache = async (
    redis_provider: RedisProvider,
    cacheKey: string,
    preconfiguredMail: PreconfiguredMail
  ) => {
    const cache = redis_provider.getConnection();
    await cache.set(cacheKey, JSON.stringify(preconfiguredMail));

    const dailyExpireInSeconds = 60 * 60 * 24;
    await cache.expire(cacheKey, dailyExpireInSeconds);
  };

  private getPreconfiguredMailFromDb = async (
    mongodb_provider: MongoDbProvider,
    mailKey: string,
    languageCode: string | undefined,
    defaultLanguageCode: string
  ) => {
    const conn = mongodb_provider.getConnection();

    const preconfiguredMailRepository =
      await new PreconfiguredMailRepository().initialize(conn);

    const preconfiguredMail: PreconfiguredMail[] =
      await preconfiguredMailRepository.getPreconfiguredMail(
        mailKey,
        languageCode,
        defaultLanguageCode
      );

    if (
      preconfiguredMail.length === 0 ||
      preconfiguredMail[0].mails?.length < 1
    ) {
      throw new Error('Preconfigured mail not found');
    }

    return preconfiguredMail[0];
  };

  private objectToMap = (obj: object) => {
    var m = new Map<string, string>();
    for (const [key, value] of Object.entries(obj)) {
      m.set('${' + key + '}', value.toString());
    }
    return m;
  };
}
