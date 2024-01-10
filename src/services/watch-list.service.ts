import watchListModel from '@/models/watch-lists.model';
import { WatchList } from '@/interfaces/entities/watch-list.interface';

class WatchListService {
  // Todo add cache layer
  public async getAllWatchWords(): Promise<WatchList[]> {
    const watchListWords = await watchListModel.find({});
    return watchListWords;
  }
}

export default WatchListService;
