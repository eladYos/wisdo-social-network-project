import { BaseEntity } from './base-entity';

export interface Community extends BaseEntity {
  title: string;
  image?: string;
  role?: string;
  memberCount: number;
}
