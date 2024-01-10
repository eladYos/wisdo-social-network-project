import { NextFunction, Response } from 'express';
import { User } from '@/interfaces/entities/user.interface';
import { Post } from '@/interfaces/entities/post.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import PostsService from '@/services/posts.service';

import { CreatePostDto } from '@/dtos/createPost.dto';
import { userInfo } from 'os';

class PostsController {
  public postsService = new PostsService();

  public createPost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const postData: CreatePostDto = req.body;
      const newPost: Post = await this.postsService.createPost(userData, postData);

      res.status(201).json({ data: newPost, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getPost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const post: Post = await this.postsService.getPostById(postId);

      res.status(200).json({ data: post });
    } catch (error) {
      next(error);
    }
  };


  public getFeed = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const post: Post = await this.postsService.getFeed(userInfo);

      res.status(200).json({ data: post });
    } catch (error) {
      next(error);
    }
  };
}

export default PostsController;
