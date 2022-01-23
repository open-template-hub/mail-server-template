import mongoose from 'mongoose';

export class ServiceProviderDataModel {
  private readonly collectionName: string = 'service_provider';
  private serviceProviderSchema: mongoose.Schema;

  constructor() {
    /**
     * Provider schema
     */
    const schema: mongoose.SchemaDefinition = {
      key: { type: String, unique: true, required: true, dropDups: true },
      payload: { type: Object }
    };

    this.serviceProviderSchema = new mongoose.Schema( schema );
  }

  getDataModel = async ( conn: mongoose.Connection ) => {
    return conn.model(
        this.collectionName,
        this.serviceProviderSchema,
        this.collectionName
    );
  };
}
