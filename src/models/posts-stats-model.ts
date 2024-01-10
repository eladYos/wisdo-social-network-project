import { PostsStats } from '@/interfaces/entities/posts-stats.interface';
import { model, Schema, Document } from 'mongoose';

const postsStatsModelField: Omit<Record<keyof PostsStats, any>, '_id'> = {
  longestPostCount: {
    type: Number,
    required: true,
  },
  mostLikedPostCount: {
    type: Number,
    required: true,
  },
};

const postsStatsSchema: Schema = new Schema(postsStatsModelField);

const postsStatsModel = model<PostsStats & Document>('posts-stats', postsStatsSchema);

export default postsStatsModel;
