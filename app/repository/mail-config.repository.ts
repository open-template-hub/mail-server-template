/**
 * @description holds mail config repository
 */

import { MailConfigDataModel } from '../data/mail-config.data';
import { MailConfig } from '../interface/mail-config.interface';

export class MailConfigRepository {
  private dataModel: any = null;

  /**
   * initializes mail config repository
   * @param connection db connection
   */
  initialize = async ( connection: any ) => {
    this.dataModel = await new MailConfigDataModel().getDataModel(
        connection
    );
    return this;
  };

  /**
   * creates mail config repository
   * @param config mail config
   * @returns created mail config
   */
  createMailConfig = async ( config: MailConfig ) => {
    try {
      return await this.dataModel.create( config );
    } catch ( error ) {
      console.error( '> createMailConfig error: ', error );
      throw error;
    }
  };

  /**
   * gets mail config by provider
   * @param key key
   * @returns service provider
   */
  getMailConfigByUsername = async ( username: string ) => {
    try {
      return await this.dataModel.findOne( { username } );
    } catch ( error ) {
      console.error( '> getsMailConfig error: ', error );
      throw error;
    }
  };
}
 
