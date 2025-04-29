import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getAllVideosOfaUser,
    getSearchedVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    addViewsToVideos
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();
router.route("/").get(getAllVideos)

router
    .route('/')
    .post(
        verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },

        ]),
        publishAVideo
    );

router.route("/getAllVideosOfaUser").get(getAllVideosOfaUser)
router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

router.route("/searchVideos").get(getSearchedVideos)

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

router.route("/addViews/:videoId").patch(addViewsToVideos)

export default router