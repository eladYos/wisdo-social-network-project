import { Types } from 'mongoose';
import { BaseEntity } from './base-entity';

export interface Post extends BaseEntity {
  title: string;
  summary: string;
  body: string;
  authorId: Types.ObjectId;
  communityId: Types.ObjectId;
  likes: number;
  status: string;
  score: number;
}
