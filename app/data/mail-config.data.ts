import mongoose from 'mongoose';

export class MailConfigDataModel {
  private readonly collectionName: string = 'mail_config';
  private mailConfigSchema: mongoose.Schema;

  constructor() {
    /**
     * Provider schema
     */
    const schema: mongoose.SchemaDefinition = {
      provider: { type: String, unique: true, required: true, dropDups: true },
      username: { type: String, required: true },
      password: { type: String, required: true }
    };

    this.mailConfigSchema = new mongoose.Schema( schema );
  }

  getDataModel = async ( conn: mongoose.Connection ) => {
    return conn.model(
        this.collectionName,
        this.mailConfigSchema,
        this.collectionName
    );
  };
}
