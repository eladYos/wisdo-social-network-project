import { HttpException } from '@exceptions/HttpException';
import postsModel from '@models/posts.model';
import userModel from '@models/users.model';

import { isEmpty } from '@utils/util';
import { Post } from '@/interfaces/entities/post.interface';
import { CreatePostDto } from '@/dtos/createPost.dto';
import { User } from '@/interfaces/entities/user.interface';

class PostService {
  private posts = postsModel;
  private users = userModel;

  public async getFeed(): Promise<Post[]> {
    const posts: Post[] = await this.posts.find();
    return posts;
  }

  // public async findUserById(userId: string): Promise<User> {
  //   if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

  //   const findUser: User = await this.posts.findOne({ _id: userId });
  //   if (!findUser) throw new HttpException(409, "User doesn't exist");

  //   return findUser;
  // }

  public async createPost(postData: CreatePostDto): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'post data is empty');

    const user: User = await this.users.findById(postData.authorId, ['communityIds']);

    // verify the user posts to his community
    if (!user.communityIds.some(communityId => communityId.toString() === postData.communityId.toString())) {
      throw new HttpException(403, "User doesn't belong to the selected community");
    }

    const createPost: Post = await this.posts.create({ ...postData, status: 'pending' });
    return createPost;
  }
}

export default PostService;
