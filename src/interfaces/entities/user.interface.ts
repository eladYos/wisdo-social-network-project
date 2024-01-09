import { Types } from 'mongoose';
import { BaseEntity } from './base-entity';

export interface User extends BaseEntity {
  name: string;
  email?: string;
  role?: string;
  image?: string;
  country?: string;
  communityIds: Types.ObjectId[];
}
