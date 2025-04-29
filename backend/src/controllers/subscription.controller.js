import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req.user._id
    // TODO: toggle subscription

    // // console.log(channelId,userId);

    if (!channelId && !userId) {
        throw new ApiError(400, "Channel and user ID is required")
    }

    if (channelId == userId) {
        throw new ApiError(405, "you can't subscribe to your own channel")
    }

    const getSubscribeValue = await Subscription.findOne({ channel: channelId, subscriber: userId })

    if (getSubscribeValue) {
        const SubscriptionToggle = await Subscription.findOneAndDelete({ channel: channelId, subscriber: userId }, {}, { new: true })

        if (!SubscriptionToggle) {
            throw new ApiError(404, "got error while updating the Subscription value")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Channel unSubscribed successfully"))
    } else {
        const newSubscription = await Subscription.create({
            channel: channelId,
            subscriber: userId,
        })


        if (!newSubscription) {
            throw new ApiError(404, "Error while creating the newSubscription")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, [newSubscription], "Channel subscribed successfully"))
    }

})

const getIsSubscribed = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params
        const userId = req.user._id

        const find = await Subscription.find({ channel: channelId, subscriber: userId })

        if (!find) {
            res
                .status(200)
                .json(new ApiResponse(200, {}, "User not subscribed"))
        } else {
            res
                .status(200)
                .json(new ApiResponse(200, { isSubscribed: find }, "User is subscribed"))
        }
    } catch (error) {
        console.log(error)
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!channelId) {
        throw new ApiError(
            400,
            "Channel ID is required"
        )
    }

    // const Subscribers = await Subscription.aggregate([
    //     {
    //         $match: { channel: new mongoose.Types.ObjectId(channelId) }
    //     },
    //     {
    //         $lookup: {
    //             from: "users",
    //             localField: "channel",
    //             foreignField: "_id",
    //             as: "channelDetails"
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "users",
    //             localField: "subscriber",
    //             foreignField: "_id",
    //             as: "subscriberDetails"
    //         }
    //     },
    //     {
    //         $unwind: "$subscriberDetails"
    //     },
    //     {
    //         $project: {
    //             channel: 1,
    //             "subscriberDetails._id": 1,
    //             "subscriberDetails.username": 1,
    //             "subscriberDetails.avatar": 1,
    //         }
    //     }
    // ])

    const Subscribers = await Subscription.countDocuments({ channel: channelId })
    // console.log('Subscribers',Subscribers)

    if (Subscribers == null) {
        throw new ApiError(404,
            "Subscribers not found"
        )
    }


    // const SubscribersCount = Subscribers ? Subscribers : 0

    return res
        .status(200)
        .json(new ApiResponse(200, { Subscribers }, "user subscribers got successfully"))

})

// const getChannelSubscriberCount = asyncHandler(async (req,res)=> {
//     try{

//     }catch(error){
//         console.log(error)
//     }
// })



// controller to return channel list to which user has subscribed

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    console.log("hello", subscriberId)
    //get the subscriberId from req
    //find the channel that user has subscribed
    // // console.log(subscriberId);

    if (!subscriberId) {
        new ApiError(400, "subscriberId is incorrect")
    }

    const returnedSubscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails",
            },

        },
        {
            $lookup: {
                from: 'users',
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails"
            }
        },

        {
            $unwind: "$channelDetails"
        },
        {
            $project: {
                subscriber: 1,
                "channelDetails._id": 1,
                "channelDetails.username": 1,
                "channelDetails.avatar": 1,
            }
        }
    ])

    if (!returnedSubscribedChannels) {
        throw new ApiError(404,
            "Subscribed channel not found"
        )
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { returnedSubscribedChannels }, "user subscribed Channels got successfully"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    getIsSubscribed
}