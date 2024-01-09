import { model, Schema, Document } from 'mongoose';
import { Post } from '@/interfaces/entities/post.interface';
import userModel from './users.model';

const postSchemaFields: Omit<Record<keyof Post, any>, '_id'> = {
  title: {
    type: String,
    required: true,
    maxlength: 60,
  },
  summary: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    validate: {
      validator: async (authorId: string) => await userModel.exists({ _id: authorId }),
      message: 'User not found',
    },
  },
  communityId: {
    type: String,
    required: true,
    ref: 'Community',
  },
  likes: {
    type: Number,
    required: false,
    default: 0,
  },
  status: {
    type: String,
    required: false,
  },
};
const postSchema: Schema = new Schema(postSchemaFields);

const postModel = model<Post & Document>('Post', postSchema);

export default postModel;
