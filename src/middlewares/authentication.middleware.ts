import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import userModel from '@models/users.model';

/**
 *
 * This is a dummy user authentication which just fetches a random existing user
 * In real life we would have a json web token at the request
 * which would hold data about the user
 * and by that data we can authenticate the user who sends the request
 */
const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.findOne();

    if (user) {
      req.user = user;
      next();
    } else {
      next(new HttpException(401, 'Wrong authentication token'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
