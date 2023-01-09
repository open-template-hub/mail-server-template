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

  getPreconfiguredMail = async ( key: string, languageCode: string | undefined, defaultLanguageCode: string ) => {
    try {
      let dataModel = await this.dataModel.aggregate( [
        { $match: { key } },
        {
          $project: {
            from: 1,
            to: 1,
            mails: {
              $filter: {
                input: '$mails',
                as: 'mail',
                cond: {
                  $or: [
                    { $eq: [ '$$mail.language', languageCode ] },
                    { $eq: [ '$$mail.language', defaultLanguageCode ] }
                  ],
                }
              }
            }
          }
        }
      ] );

      let newMailsArray: string[] = [];
      if ( dataModel.length > 0 && dataModel[ 0 ].mails?.length > 1 ) {
        for ( const mail of dataModel[ 0 ].mails ) {
          if ( mail.language === languageCode ) {
            newMailsArray.push( mail );
          }
        }

        if ( newMailsArray.length > 0 ) {
          dataModel[ 0 ].mails = newMailsArray;
        }
      }

      return dataModel;

    } catch ( error ) {
      console.error( '> getPreconfiguredMessage error: ', error );
      throw error;
    }
  };
}
