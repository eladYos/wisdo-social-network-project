import UserModel from '@models/users.model';
import CommunityModel from '@models/communities.model';
import PostModel from '@models/posts.model';
import mongoose from 'mongoose';

import { faker } from '@faker-js/faker';

import { dbConnection } from '@databases';
import { User } from '@/interfaces/entities/user.interface';
import { randomInt } from 'crypto';
import { Post } from '@/interfaces/entities/post.interface';
import { postStatus } from '@/utils/constants';

mongoose.connect(dbConnection.url);

async function clearDb() {
  await Promise.all([CommunityModel.deleteMany({}), UserModel.deleteMany({}), PostModel.deleteMany({})]);
}

async function populateDb() {
  const communities = new Array(5).fill(0).map(() => {
    const communityModel = new CommunityModel({
      title: faker.word.sample(10),
      image: faker.internet.url(),
    });
    return communityModel;
  });
  await CommunityModel.bulkSave(communities);

  for (let i = 0; i < 10; i++) {
    const communityIds = [...new Set([communities[randomInt(5)]._id, communities[randomInt(5)]._id])].map(id => new mongoose.Types.ObjectId(id));

    const user: Omit<User, '_id'> = {
      name: faker.person.fullName(),
      communityIds,
      country: faker.location.country(),
    };

    const userModel = new UserModel(user);
    userModel.save().then(async user => {
      const userPosts = new Array(10).fill(0).map(() => {
        const post: Omit<Post, '_id'> = {
          authorId: user._id,
          body: faker.word.words(30),
          communityId: user.communityIds[0],
          likes: faker.number.int(100),
          status: postStatus.APPROVED,
          summary: faker.word.words(10),
          title: faker.string.sample(10),
        };
        return new PostModel(post);
      });
      await PostModel.bulkSave(userPosts);
    });
  }
}
clearDb()
  .then(() => populateDb())
  .then(() => console.log('done'));
