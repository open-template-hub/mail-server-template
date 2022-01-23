import { PreconfiguredMailDataModel } from '../data/preconfigured-mail.data';
import { PreconfiguredMail } from '../interface/preconfigured-mail.interface';

export class PreconfiguredMailRepository {
  private dataModel: any = null;

  initialize = async ( connection: any ) => {
    this.dataModel = await new PreconfiguredMailDataModel().getDataModel(
        connection
    );
    return this;
  };

  createPreconfiguredMail = async ( message: PreconfiguredMail ) => {
    try {
      return await this.dataModel.create( message );
    } catch ( error ) {
      console.error( '> createPreconfiguredMail error: ', error );
      throw error;
    }
  };

  getPreconfiguredMail = async ( key: string, languageCode: string ) => {
    try {
      return await this.dataModel.findOne( 
        { key },
        { mails: { $elemMatch: { language: languageCode } }, from: 1 } 
      );
    } catch ( error ) {
      console.error( '> getPreconfiguredMessage error: ', error );
      throw error;
    }
  };
}
