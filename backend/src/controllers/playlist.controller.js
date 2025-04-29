import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name } = req.body
    const user = req.user

    //TODO: create playlist    

    if (!(name)) {
        throw new ApiError(
            400,
            "Name a is required"
        )
    }

    const createPlaylist = await Playlist.create({
        name,
        owner: user._id
    })

    if (!createPlaylist) {
        throw new ApiError(
            404,
            "Playlist not found"
        )
    }

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            { createPlaylist },
            "Playlist created successfully",
        ))

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists

    if (!userId) {
        throw new ApiError(
            400,
            "User ID is required"
        )
    }

    const userPlaylist = await Playlist.find({ owner: userId })

    if (!userPlaylist) {
        throw new ApiError(
            404,
            "Playlist not found"
        )
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { userPlaylist },
            "User playlists retrieved successfully",
        ))

    // console.log(userPlaylist);

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id

    if (!playlistId) {
        throw new ApiError(
            400,
            "Playlist ID is required"
        )
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found"
        )
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { playlist },
            "Playlist retrieved successfully",
        ))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!(playlistId && videoId)) {
        throw new ApiError(
            400,
            "Playlist ID and video ID are required"
        )
    }

    const addVideoToPlaylistOp = await Playlist.findByIdAndUpdate(playlistId, {
        $push: { videos: videoId }
    }, { new: true })

    if (!addVideoToPlaylistOp) {
        throw new ApiError(
            404,
            "Playlist not found"
        )
    }

    res
        .status(200)
        .json(new ApiResponse(
            200,
            { addVideoToPlaylistOp },
            "Video added to playlist successfully",
        ))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

    if (!(playlistId && videoId)) {
        throw new ApiError(
            400,
            "Playlist ID and video ID are required"
        )
    }

    const removeVideoFromPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $pull: { videos: videoId }
    }, { new: true })

    // console.log(removeVideoFromPlaylist);


    if (!removeVideoFromPlaylist) {
        throw new ApiError(
            404,
            "Playlist not found"
        )
    }

    res
        .status(200)
        .json(new ApiResponse(
            200,
            { removeVideoFromPlaylist },
            "Video removed from playlist successfully",
        ))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist

    if (!playlistId) {
        throw new ApiError(
            400,
            "Playlist ID is required"
        )
    }

    const deletePlaylistFromDb = await Playlist.findByIdAndDelete(playlistId)

    if (!deletePlaylistFromDb) {
        throw new ApiError(
            404,
            "Playlist not found"
        )
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Playlist deleted successfully",
        ))


})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { nam } = req.body
    //TODO: update playlist

    if (!playlistId) {
        throw new ApiError(
            400,
            "Playlist ID is required"
        )
    }

    if (!(name )) {
        throw new ApiError(
            400,
            "Name a are required"
        )
    }

    const updatePlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        name: name,
    }, { new: true })

    if (!updatePlaylist) {
        throw new ApiError(
            404,
            "Playlist not found"
        )
    }

    res
        .status(200)
        .json(new ApiResponse(
            200,
            { updatePlaylist },
            "Playlist updated successfully",
        ))


})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
