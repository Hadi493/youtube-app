import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user._id

    // console.log('Line 12 videoId', videoId);
    // console.log('userId', userId);

    //TODO: toggle like on video

    if (!(videoId && userId)) {
        throw new ApiError(
            400,
            "Video and user ID is required",
        )
    }

    const likedVideo = await Like.findOne({ video: videoId, likedBy: userId })

    if (!likedVideo) {
        const likevideo = await Like.create({
            likedBy: userId,
            video: videoId,
        })

        if (!likevideo) {
            throw new ApiError(
                400,
                "Failed to create like",
            )
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                { likevideo },
                "Video liked successfully",
            ))

    } else {
        const UpdateLikeVideo = await Like.deleteOne({ video: videoId, likedBy: userId })

        if (!UpdateLikeVideo) {
            throw new ApiError(
                400,
                "Failed to delete like",
            )
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "Unlike video successfully",
            ))
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user._id

    //todo: There is a reace condition problem that I have to fix

    if (!(commentId && userId)) {
        throw new ApiError(
            400,
            "Comment Id and user Id is required",
        )
    }

    const likedComment = await Like.findOne({ comment: commentId, likedBy: userId })


    if (!likedComment) {

        const LikeComment = await Like.create({
            comment: commentId,
            likedBy: userId,
        })

        if (!LikeComment) {
            throw new ApiError(
                400,
                "Failed to create like",
            )
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                { LikeComment },
                "Comment liked successfully",
            ))

    } else {
        const removeLike = await Like.findOneAndDelete({ comment: commentId, likedBy: userId })

        if (!removeLike) {
            throw new ApiError(
                400,
                "Failed to remove like",
            )
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "Comment unliked successfully",
            ))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user._id
    //TODO: toggle like on tweet

    if (!(tweetId && userId)) {
        throw new ApiError(
            400,
            "tweet id and user id is required"
        )
    }

    const likedTweet = await Like.findOne({ tweet: tweetId, likedBy: userId })

    if (!likedTweet) {
        const likeTweet = await Like.create({
            tweet: tweetId,
            likedBy: userId
        })

        if (!likeTweet) {
            throw new ApiError(
                400,
                "Failed to like tweet",
            )
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                { likeTweet },
                "Tweet liked successfully",
            ))
    } else {
        const unlikeTweet = await Like.findOneAndDelete({ tweet: tweetId, likedBy: userId })

        if (!unlikeTweet) {
            throw new ApiError(
                400,
                "Failed to unlike tweet",
            )
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "Tweet unliked successfully",
            ))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if (!userId) {
        throw new ApiError(
            401,
            "Unauthorized",
        )
    }

    const getAllLikedVideos = await Like.aggregate([
        {
            $match: { likedBy: new mongoose.Types.ObjectId(userId) }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $unwind: "$videos"
        },
        // {
        //     $project: {
        //         _id: 1,
        //         "videos._id": 1,
        //         "videos.thumbnail": 1,
        //         "videos.title": 1,
        //         "videos.duration": 1,
        //         "videos.views": 1,
        //         "videos.createdAt": 1,
        //     }
        // }
    ])

    if (!getAllLikedVideos) {
        throw new ApiError(401,'got some error while fetching videos')
    }

    console.log(getAllLikedVideos);

    res.status(200).json(new ApiResponse(200,getAllLikedVideos,'liked videos of user fetched successfully'))

})

const getLikesOfaVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { userId } = req.query
    const likeCount = await Like.countDocuments({ video: videoId })

    // if (!likeCount) {
    //     new ApiError(404, "no likes founded")
    // }

    if (userId) {
        const isUserLiked = await Like.findOne({ likedBy: userId, video: videoId })
        res
            .status(200)
            .json(new ApiResponse(200,
                {
                    likeCount: likeCount ? likeCount : 0,
                    isUserLiked: userId && isUserLiked ? true : false,
                    // likedBy: isUserLiked
                }
                , "Like of this video")
            )
    } else {
        res
            .status(200)
            .json(new ApiResponse(200,
                {
                    likeCount
                }
                , "Like of this video")
            )
    }


})

const getLikesOfComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.query.userId

    // console.log('commentId',commentId);
    // console.log('userId',userId);

    const likeCount = await Like.countDocuments({ comment: commentId })

    if (userId) {
        const isUserLiked = await Like.findOne({ likedBy: userId, comment: commentId })
        res
            .status(200)
            .json(new ApiResponse(200,
                {
                    likeCount: likeCount ? likeCount : 0,
                    commentId: commentId,
                    isUserLiked: userId && isUserLiked ? true : false,
                }
                , "Like of this Comment")
            )
    } else {
        res
            .status(200)
            .json(new ApiResponse(200,
                {
                    likeCount,
                    commentId: commentId
                }
                , "Like of this comment")
            )
    }


})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikesOfaVideo,
    getLikesOfComment
}