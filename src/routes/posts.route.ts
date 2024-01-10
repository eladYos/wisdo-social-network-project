import { Router } from 'express';
import PostsController from '@controllers/posts.controller';
import { Routes } from '@interfaces/routes.interface';

import authMiddleware from '@/middlewares/authentication.middleware';

class PostsRoute implements Routes {
  public path = '/posts';
  public router = Router();
  public postsController = new PostsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, this.postsController.createPost);
    this.router.get(`${this.path}/feed`, authMiddleware, this.postsController.getFeed);
    this.router.get(`${this.path}/:postId`, authMiddleware, this.postsController.getPost);
  }
}

export default PostsRoute;
