import { HttpException } from '@exceptions/HttpException';
import postsModel from '@models/posts.model';

import { getFirstWords, getWordsFromString, isEmpty } from '@utils/util';
import { Post } from '@/interfaces/entities/post.interface';
import { CreatePostDto } from '@/dtos/createPost.dto';
import { User } from '@/interfaces/entities/user.interface';
import WatchListService from './watch-list.service';
import { sendEmail } from '@/utils/emailHandler';
import { postStatus } from '@/utils/constants';
import { getAggregateFunction } from './posts.aggregation';
import postsStatsModel from '@/models/posts-stats-model';

class PostsService {
  private watchListService = new WatchListService();

  public async getFeed(userInfo: User): Promise<Post[]> {
    // this should be cached
    const { mostLikedPostCount, longestPostCount } = await postsStatsModel.findOne();
    const aggregationFunction = getAggregateFunction({
      inputUserCountry: userInfo.country,
      inputUserCommunityIds: userInfo.communityIds.map(object => object.toString()),
      maxLikes: mostLikedPostCount,
      maxPostLength: longestPostCount,
    });

    const posts: Post[] = await postsModel.aggregate(aggregationFunction);
    return posts;
  }

  public async getPostById(id: string): Promise<Post> {
    return postsModel.findById(id);
  }

  public async createPost(user: User, postData: CreatePostDto): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'post data is empty');

    // verify the user posts to his community
    if (!user.communityIds.some(communityId => communityId?.toString() === postData.communityId?.toString())) {
      throw new HttpException(403, "User doesn't belong to the selected community");
    }
    let summary = postData.summary;
    if (!summary) {
      summary = getFirstWords(postData.body, 100);
    }

    const createdPost: Post = await postsModel.create({ ...postData, status: postStatus.PENDING, summary, authorId: user._id });
    this.checkForWatchListWords(createdPost);
    return createdPost;
  }

  public async getMostLikedPost(): Promise<Post> {
    const [mostLikedPost] = await postsModel.find().sort({ likes: -1 }).limit(1);
    return mostLikedPost;
  }

  public async getLongestPost(): Promise<Post> {
    const [longestPost] = await postsModel.aggregate([
      {
        $project: {
          body: 1,
          body_length: { $strLenCP: '$body' },
        },
      },
      { $sort: { body_length: -1 } },
      { $limit: 1 },
    ]);
    return longestPost;
  }

  private async checkForWatchListWords(createdPost: Post) {
    const watchListWords = await this.watchListService.getAllWatchWords();
    const watchListWordsLowerCase = watchListWords.map(watchList => watchList.word.toLowerCase());

    const bodyAndSummaryWords = `${createdPost.body} ${createdPost.summary}`;
    const postWordsSet = new Set(getWordsFromString(bodyAndSummaryWords).map(str => str.toLowerCase()));
    if (watchListWordsLowerCase.some(word => postWordsSet.has(word))) {
      sendEmail({
        body: `Forbidden word at new post, url: /posts/${createdPost._id}`,
        subject: 'Forbidden word at new post',
        to: ['admin@wisdo.com'],
      });
    }
  }
}

export default PostsService;
