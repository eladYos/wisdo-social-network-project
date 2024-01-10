import PostsService from './posts.service';
import postsStatsModel from '../models/posts-stats-model';
import { PostsStats } from '@/interfaces/entities/posts-stats.interface';
import { postsModel } from '@models/posts.model';

const INTERVAL = 5 * 60 * 60 * 1000;

const postsService = new PostsService();
const updaterServiceInitialized = false;

export function initializePostsScoreUpdater() {
  if (!updaterServiceInitialized) {
    updateScores();
    setInterval(updateScores, INTERVAL);
  }
}

async function updateScores() {
  const { longestPostCount, mostLikedPostCount } = await updateScoreStats();
}
async function updateScoreStats() {
  const [longestPost, mostLikedPost] = await Promise.all([postsService.getLongestPost(), postsService.getMostLikedPost()]);
  const { body: longestPostBody } = longestPost;
  const { likes } = mostLikedPost;

  const statsDocumentExists = await postsStatsModel.exists({});
  if (statsDocumentExists) {
    postsStatsModel.findOneAndUpdate({}, { longestPostCount: longestPostBody.length, mostLikedPostCount: likes }).then(() => {
      console.log('posts stats updated succefully');
    });
  } else {
    const newPostStats = new postsStatsModel({ longestPostCount: longestPostBody.length, mostLikedPostCount: likes });
    postsStatsModel.create(newPostStats).then(() => {
      console.log('posts stats created succefully');
    });
  }
  return { longestPostCount: longestPostBody.length, mostLikedPostCount: likes };
}

// async function updatePostsScores({ longestPostCount, mostLikedPostCount }: PostsStats) {
//   const postsCursor = postsModel.find({}).cursor();

//   let count = 0;
//   let updatedCount = 0;
//   let bulkOps = [];

//   let doc = await postsCursor.next();
//   while (doc != null) {
//     doc = await postsCursor.next();
//   }

// }
