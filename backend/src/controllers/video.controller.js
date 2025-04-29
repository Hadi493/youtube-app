import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadVideosToBucket, uploadImagesToBucket, listFolderContents, deleteVideoFromBucket } from "../utils/tebi_s3.js"

const getAllVideosOfaUser = asyncHandler(async (req, res) => {
    const { page, limit, query, sortBy, sortType, userId } = req.query

    //TODO: get all videos based on query, sort, pagination

    if (!userId) {
        throw new ApiError(400, "userId is undefined")
    }

    const videos = await Video.find({ owner: userId })
        .sort({ [sortBy]: sortType == "ascending" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

    if (!videos) {
        new ApiError(404, "video does not exists")
    }

    return res.status(200)
        .json(
            new ApiResponse(200, { videos }, "all videos of user fetched succefully")
        )


})

const getAllVideos = asyncHandler(async (req, res) => {
    const { page, limit } = req.query

    const allvideos = await Video.find()
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

    if (!allvideos) {
        throw new ApiError(404, "videos not found")
    }

    res
        .status(200)
        .json(new ApiResponse(200, { allvideos }, 'all videos fetched successfully'))

})

const getSearchedVideos = asyncHandler(async (req, res) => {
    const { page, limit, query, sortBy, sortType, } = req.query

    const searchCondition = query ? { $or: [{ title: { $regex: query, $options: "i" } }, { description: { $regex: query, $options: "i" } }] } : null

    if (searchCondition) {
        const videos = await Video.find(searchCondition)
            .sort({ [sortBy]: sortType == "ascending" ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))

        if (!videos) {
            throw new ApiError(404, "sorry Unable to find video regarding this search for somthing else")
        }

        res
            .status(200)
            .json(new ApiResponse(200, { videos }, 'all videos fetched successfully'))
    } else {
        res
            .status(200)
            .json(new ApiResponse(200, {}, 'please give an input'))
    }

})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video    
    const { title, description } = req.body
    const video = req.files?.videoFile[0]?.path
    const thumbnail = req.files?.thumbnail && req.files.thumbnail[0]?.path;
    const isThumbnail = thumbnail ? true : false

    const { videoUrlId, duration, result, url } = await uploadVideosToBucket(video, isThumbnail)

    let responseImageFromBucket;
    if (isThumbnail === true) {
        responseImageFromBucket = await uploadImagesToBucket(thumbnail)
    }

    if (!videoUrlId) {
        throw new ApiError(404, "video is undefined")
    }

    if (!responseImageFromBucket && !url) {
        throw new ApiError(404, "thumbnail is undefined")
    }

    if (!result) {
        throw new ApiError(404, "got error while uploading Image")
    }

    if (result) {

        const uploadVideo = await Video.create(
            {
                title,
                description,
                thumbnail: url || responseImageFromBucket,
                videoUrlId: videoUrlId,
                isPublished: true,
                duration: duration,
                owner: req.user?._id
            }
        )

        if (!uploadVideo) {
            throw new ApiError(500, "uplodation failed")
        }

        res
            .status(200)
            .json(
                new ApiResponse(200,
                    { uploadVideo },
                    "Video uploaded successfully"
                )
            )
    }

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!videoId) {
        throw new ApiError(404, "videoId not found")
    }

    const video = await Video.findOne(new mongoose.Types.ObjectId(videoId))

    if (!video) {
        throw new ApiError(500, "unable to get video from dataBase")
    }
    const videoUrlId = `${video.videoUrlId}`;

    const url = await listFolderContents({ folderName: videoUrlId })

    if (!url) {
        throw new ApiError(404, 'Unable to retrive video url')
    }

    const newVideoObj = video.toObject()
    newVideoObj['videoUrl'] = url

    res
        .status(200)
        .json(
            new ApiResponse(200,
                {
                    video: newVideoObj
                },
                "video fetched successfully"
            )
        )
})

const updateVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnail = req.file?.path
    //TODO: update video details like title, description, thumbnail
    const uploadedOnCloudinary = await uploadImagesToBucket(thumbnail)

    const previousThumbnail = await Video.findById(videoId)

    const previousThumbnailId = previousThumbnail.thumbnail.split("/").pop().split(".").shift()

    if (!videoId) {
        throw new ApiError(400, "videoId is undefined")
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
        title,
        description,
        thumbnail: uploadedOnCloudinary.url
    }, { new: true })

    const currentThumbnailId = updatedVideo.thumbnail.split("/").pop().split(".").shift()

    if (previousThumbnailId !== currentThumbnailId) {
        // await deletePreviousImage(previousThumbnailId)
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, { updatedVideo }, "video details got updated")
        )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user._id
    //TODO: delete video

    if (!videoId) {
        throw new ApiError(400, "videoId is undefined")
    }

    const video = await Video.findById(videoId)

    if (JSON.stringify(video.owner) !== JSON.stringify(userId)) {
        throw new ApiError(400, "bsdk ye tera Video nhi hai")
    }

    const response = await deleteVideoFromBucket(video?.videoUrlId)

    // if (response) {
    const deleted = await Video.findByIdAndDelete(videoId)
    if (!deleted) {
        throw new ApiError(404, "not able to delete the video")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200,
                {},
                "video deleted successfully"
            )
        )
    // }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // console.log(videoId);
    //TODO: toggle publish status

    if (!videoId) {
        throw new ApiError(400, "video is undefind")
    }

    const videoStatus = await Video.findById(
        videoId
    )

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            isPublished: !videoStatus.isPublished
        },
        { new: true }
    )

    if (!video) {
        throw new ApiError(404, "video not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, { video }, "video status changed succesfully")
        )

})

const addViewsToVideos = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        // // console.log('videoId',videoId.videoId)
        if (!videoId) {
            throw new ApiError(400, 'video ID is not defined')
        }

        const video = await Video.findById(videoId)

        if (!video) {
            throw new ApiError(404, "video not founded based on that Id")
        }

        const added = await Video.findByIdAndUpdate(videoId, { views: video.views + 1 })

        if (!added) {
            throw new ApiError(404, "got error while adding the views")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, { added }, "views added sucessfully"))
    } catch (error) {
        console.log(error)
    }
})

export {
    getAllVideosOfaUser,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getAllVideos,
    getSearchedVideos,
    addViewsToVideos
}
