import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadImagesToBucket } from "../utils/tebi_s3.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async (userId) => {
    // // console.log('userId',userId)
    try {
        const user = await User.findById(userId)
        // // console.log('userIngen',user)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // // console.log(accessToken,refreshToken)

        // user.refreshToken = refreshToken
        // await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // console.log("avatar",req.files?.avatar)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log('avatarLocalPath', avatarLocalPath);


    const coverImgLocalPath = req.files?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadImagesToBucket(avatarLocalPath, true)
    const coverImage = await uploadImagesToBucket(coverImgLocalPath, { isUser: true })

    if (!avatar) {
        throw new ApiError(400, "Got error while Uploading avatar to storage")
    }


    const user = await User.create({
        fullName,
        avatar: avatar,
        coverImage: coverImage || "",
        email,
        password,
        username: username.toLowerCase(),
        authProvider: "local"
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const { email, password } = req.body
    // // console.log(email,password);

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    // console.log('refreshToken', refreshToken);


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

})

const loginUsingGoogle = asyncHandler(async (req, res) => {
    const { token } = req.body
    const coverImage = req.file?.path
    try {
        const googleToken = token;
        const googleOauthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOauthUrl.searchParams.set("id_token", googleToken);

        const response = await fetch(googleOauthUrl.toString())
        const result = await response.json()
        // // console.log('result data', result)

        const email = result.email
        // // console.log('email',email)
        let coverImageUrl = ''
        if (coverImage) {
            coverImageUrl = await uploadImagesToBucket(coverImage, "true")
        }

        let user = await User.findOne({ email })
        const userNameEnd = result.name.split(' ')
        const userName = userNameEnd[1] + result.email.split('@')[0]
        // console.log('userName',userName);

        if (!user) {
            user = await User.create({ fullName: result.name, username: userName, email: result.email, avatar: result.picture, authProvider: "google", coverImage: coverImageUrl, googleToken: result.sub })
        }

        // console.log('user', user._id)

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: user
                    },
                    "User logged In Successfully"
                ))

    } catch (error) {
        console.log(error)
    }
})

// const loginUsingGoogle = asyncHandler(async (req, res) => {
//     const { token } = req.body;

//     if (!token) {
//       throw new ApiError(400, "Token is required!");
//     }

//     const googleToken = token;
//     const googleOauthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
//     googleOauthUrl.searchParams.set("id_token", googleToken);

//     const { data } = await axios.get(googleOauthUrl.toString(), {
//       responseType: "json",
//     });

//     let user = await User.findOne({ email: data.email });

//     if (!user) {
//       user = await User.create({
//         username: data.name,
//         email: data.email,
//         // isVerified: data.email_verified,
//         authProvider: "google",
//         avatar: data.picture,
//         googleToken: data.sub,
//       });
//     }

//     const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
//     // // console.log(a)

//     const options = {
//       httpOnly: true,
//       secure: true,
//     };

//     return res
//       .status(200)
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", refreshToken, options)
//       .json(
//         new ApiResponse(
//           200,
//           {
//             user,
//             accessToken,
//             refreshToken,
//           },
//           "User logged in successfully"
//         )
//       );
//   });

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: refreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    // // console.log(oldPassword,newPassword);

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    // const User = req.user ? true : false
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw res.json(new ApiError(400, "All fields are required"))
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    // // console.log("whats here avatarLocalPath",avatarLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment
    const previousImgId = req.user?.avatar.split("/").pop().split('.').shift()
    // // console.log(previousImgId);

    const avatar = await uploadImagesToBucket(avatarLocalPath, true)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")

    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    // await deletePreviousImage(previousImgId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar image updated successfully")
        )
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    // // console.log("whats here req.file",req.file);
    const coverImageLocalPath = req.file?.path
    // // console.log("whats here coverImageLocalPath",coverImageLocalPath);
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment
    const previousImgId = req.user?.avatar.split("/").pop().split('.').shift()


    const coverImage = await uploadImagesToBucket(coverImageLocalPath, { isUser: true })

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")

    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    // await deletePreviousImage(previousImgId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Cover image updated successfully")
        )
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "User channel fetched successfully")
        )
})

const getUserById = asyncHandler(async (req, res) => {

    try {
        const { userId } = req.query
        if (!userId) {
            throw new ApiError(400, "user Id is undefined")
        }

        const userData = await User.findById(new mongoose.Types.ObjectId(userId)).select("-password -refreshToken -accessToken")

        if (!userData) {
            throw new ApiError(404, "No user founded")
        }

        res
            .status(200)
            .json(new ApiResponse(200, { userData }, "succesfully fetched userData"))

    } catch (error) {
        console.error(error);
    }
})

const addVideosToWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { videoId } = req.body
    if (!userId) {
        throw new ApiError(401, "unAuthorized request")
    }

    if (!videoId) {
        throw new ApiError(404, "videoId is required")
    }

    const result = await User.findByIdAndUpdate(userId,
        { $addToSet: { watchHistory: videoId } },
        { new: true, useFindAndModify: false }
    )

    if(!result){
       throw new ApiError("got error while updating watch history")
    }

    res
    .status(200)
    .json(new ApiResponse(200,"video added to watche history",result))

})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watch history fetched successfully"
            )
        )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    getUserById,
    loginUsingGoogle,
    addVideosToWatchHistory
}