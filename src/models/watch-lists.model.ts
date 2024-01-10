import { WatchList } from '@/interfaces/entities/watch-list.interface';
import { model, Schema, Document } from 'mongoose';

const watchListSchemaFields: Omit<Record<keyof WatchList, any>, '_id'> = {
  word: {
    type: String,
    required: true,
  },
};

const watchListSchema: Schema = new Schema(watchListSchemaFields);

const watchListModel = model<WatchList & Document>('watch-list', watchListSchema);

export default watchListModel;
