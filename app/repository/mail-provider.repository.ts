/**
 * @description holds service provider repository
 */

import { ServiceProviderDataModel } from '../data/service-provider.data';
import { ServiceProvider } from '../interface/service-provider.interface';

export class ServiceProviderRepository {
  private dataModel: any = null;

  /**
   * initializes service provider repository
   * @param connection db connection
   */
  initialize = async ( connection: any ) => {
    this.dataModel = await new ServiceProviderDataModel().getDataModel(
        connection
    );
    return this;
  };

  /**
   * creates service provider
   * @param provider service provider
   * @returns created service provider
   */
  createServiceProvider = async ( provider: ServiceProvider ) => {
    try {
      return await this.dataModel.create( provider );
    } catch ( error ) {
      console.error( '> createServiceProvider error: ', error );
      throw error;
    }
  };

  /**
   * gets service provider by key
   * @param key key
   * @returns service provider
   */
  getServiceProviderByKey = async ( key: string ) => {
    try {
      return await this.dataModel.findOne( { key } );
    } catch ( error ) {
      console.error( '> getServiceProviderByKey error: ', error );
      throw error;
    }
  };
}
 
