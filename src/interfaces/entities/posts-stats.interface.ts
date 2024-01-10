import { BaseEntity } from './base-entity';

export interface PostsStats extends BaseEntity {
  longestPostCount: number;
  mostLikedPostCount: number;
}
