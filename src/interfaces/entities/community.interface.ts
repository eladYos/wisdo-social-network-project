import { BaseEntity } from './base-entity';

export interface Community extends BaseEntity {
  title: string;
  image?: string;
  memberCount: number;
}
