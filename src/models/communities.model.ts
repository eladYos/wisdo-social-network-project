import { model, Schema, Document } from 'mongoose';
import { Community } from '@/interfaces/entities/community.interface';
import userModel from './users.model';

const communitySchemaFields: Omit<Record<keyof Community, any>, '_id' | 'memberCount'> = {
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
  },
};

const communitySchema: Schema = new Schema(communitySchemaFields);
communitySchema.virtual('memberCount').get(async function () {
  return userModel.countDocuments({ communityIds: this._id });
});

const communityModel = model<Community & Document>('Community', communitySchema);

export default communityModel;
