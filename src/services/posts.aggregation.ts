import { PipelineStage, Types } from 'mongoose';

type aggregateFunctionParams = {
  inputUserCountry: string;
  inputUserCommunityIds: string[];
  maxLikes: number;
  maxPostLength: number;
};

/**
 *
 * return posts sorted by user country as a primary sort
 * and by posts length * 0.2 (normalized by the longest post in the system)
 * and number of likes * 0.8 (normalized by the post with the most likesin the system)
 * as a secondary sort
 *
 * Todo: add pagination abilities
 */
export const getAggregateFunction = ({
  inputUserCountry,
  inputUserCommunityIds,
  maxLikes,
  maxPostLength,
}: aggregateFunctionParams): PipelineStage[] => {
  return [
    {
      $match: {
        $expr: {
          $in: ['$communityId', inputUserCommunityIds],
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $addFields: {
        userCountry: '$user.country',
        bodyLength: {
          $strLenCP: '$body',
        },
        postScore: {
          $add: [
            {
              $divide: [
                {
                  $multiply: [
                    {
                      $strLenCP: '$body',
                    },
                    0.2,
                  ],
                },
                maxPostLength,
              ],
            },
            {
              $divide: [
                {
                  $multiply: ['$likes', 0.8],
                },
                maxLikes,
              ],
            },
          ],
        },
      },
    },
    {
      $project: {
        user: 0,
      },
    },
    {
      $addFields: {
        countrySort: {
          $cond: {
            if: {
              $eq: ['$userCountry', inputUserCountry],
            },
            then: -1,
            else: 1,
          },
        },
      },
    },
    {
      $sort: {
        countrySort: 1,
        postScore: -1,
      },
    },
    {
      $unset: ['countrySort', 'userCountry', 'bodyLength', 'postScore'],
    },
  ];
};
