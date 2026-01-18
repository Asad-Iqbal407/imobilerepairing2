import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSetting extends Document {
  key: string;
  logoDataUri?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    logoDataUri: { type: String, required: false },
  },
  { timestamps: true, collection: 'site_settings' }
);

const SiteSetting: Model<ISiteSetting> =
  mongoose.models.SiteSetting || mongoose.model<ISiteSetting>('SiteSetting', SiteSettingSchema);

export default SiteSetting;
