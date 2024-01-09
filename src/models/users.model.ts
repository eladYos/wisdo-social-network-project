import { model, Schema, Document } from 'mongoose';
import { User } from '@/interfaces/entities/user.interface';
import communityModel from './communities.model';

const userSchemaFields: Omit<Record<keyof User, any>, '_id'> = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  communityIds: {
    type: [Schema.Types.ObjectId],
    ref: 'Community',
    validate: {
      validator: async (communityIds: string[]) => {
        const communityModelCount = await communityModel.countDocuments({ _id: { $in: communityIds } });
        const uniqueInputCommunityIdsCount = new Set(communityIds).size;
        return communityModelCount === uniqueInputCommunityIdsCount;
      },
      message: 'Input community ids do not exist',
    },
  },
};

const userSchema: Schema = new Schema(userSchemaFields);

const userModel = model<User & Document>('User', userSchema);

export default userModel;
