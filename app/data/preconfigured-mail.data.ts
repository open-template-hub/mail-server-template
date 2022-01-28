import mongoose from 'mongoose';

export class PreconfiguredMailDataModel {
  private readonly collectionName: string = 'preconfigured_mail';
  private preconfiguredMailSchema: mongoose.Schema;

  constructor() {
    /**
     * Provider schema
     */
    const schema: mongoose.SchemaDefinition = {
      key: { type: String, unique: true, required: true, dropDups: true },
      from: { type: String, required: true },
      to: { type: String, required: false },
      mails: { type: Array, required: true }
    };

    this.preconfiguredMailSchema = new mongoose.Schema( schema );
  }

  getDataModel = async ( conn: mongoose.Connection ) => {
    return conn.model(
        this.collectionName,
        this.preconfiguredMailSchema,
        this.collectionName
    );
  };
}
