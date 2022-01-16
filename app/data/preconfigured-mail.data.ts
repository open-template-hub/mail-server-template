import mongoose from 'mongoose';

export class PreconfiguredMailDataModel {
  private readonly collectionName: string = 'preconfigured-mail';
  private productSchema: mongoose.Schema;

  constructor() {
    /**
     * Provider schema
     */
    const schema: mongoose.SchemaDefinition = {
      key: { type: String, unique: true, required: true, dropDups: true },
      languageCode: { type: String, required: true },
      body: { type: String, required: true }
    };

    this.productSchema = new mongoose.Schema( schema );
  }

  getDataModel = async ( conn: mongoose.Connection ) => {
    return conn.model(
        this.collectionName,
        this.productSchema,
        this.collectionName
    );
  };
}
