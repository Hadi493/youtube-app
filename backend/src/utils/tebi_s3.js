import { S3Client, ListObjectsCommand, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand, } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import ffmpegCommand from "fluent-ffmpeg"
import fs from "fs"
import path from "path"
import { Queue, QueueEvents } from "bullmq"
import { exec } from "child_process"
import { fileURLToPath } from "url"

const credentials = {
    accessKeyId: process.env.TEBI_ACCESSKEY_ID,
    secretAccessKey: process.env.TEBI_SECRET_ACCESSKEY_ID,
}

const s3client = new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: credentials,
    region: "global"
})

async function uploadImagesToBucket(image, isUser = false) {
    try {
        const imageName = path.basename(image)
        const imageContent = fs.createReadStream(image)

        const storeImageTos3 = await s3client.send(
            new PutObjectCommand({
                Bucket: process.env.TEBI_TEMPORARY_BUCKET_NAME,
                Key: isUser ? imageName : `thumbnails/${imageName}`,
                Body: imageContent,
                ContentDisposition: "inline",
                ContentType: image?.mimetype,
                ACL: "public-read"
            })
        )

        if (storeImageTos3.$metadata.httpStatusCode === 200) {
            const encodedImageName = encodeURIComponent(imageName)
            const url = `https://${process.env.TEBI_TEMPORARY_BUCKET_NAME}.s3.tebi.io/${encodedImageName}`
            console.log(url)
            return url
        }


    } catch (error) {
        console.log(error);
    } finally {
        fs.unlinkSync(image)
    }
}

async function uploadVideosToBucket(video, isThumbnail) {
    // console.log('isThumbnail', isThumbnail);

    try {
        const videoName = path.basename(video)
        const videoContent = fs.createReadStream(video)

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const outputDir = path.resolve(__dirname, "./output")

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true })
        }

        const storeVideoTos3 = await s3client.send(
            new PutObjectCommand({
                Bucket: process.env.TEBI_TEMPORARY_BUCKET_NAME,
                Key: videoName,
                Body: videoContent,
                ContentType: video?.mimetype,
                ContentDisposition: "inline",
            })
        )

        if (storeVideoTos3.$metadata.httpStatusCode === 200) {

            const myQueue = new Queue("comunication", {
                connection: {
                    host: process.env.REDIS_ENDPOINT,
                    port: process.env.REDIS_PORT,
                    password: process.env.REDIS_PASSWORD,
                    tls: {
                        rejectUnauthorized: false
                    }
                }
            })

            // myQueue.disconnect

            const queueEvent = new QueueEvents("comunication", {
                connection: {
                    host: process.env.REDIS_ENDPOINT,
                    port: process.env.REDIS_PORT,
                    password: process.env.REDIS_PASSWORD,
                    tls: {
                        rejectUnauthorized: false
                    }
                }
            })

            await myQueue.add("videoKey", { key: videoName }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000
                }
            })

            const getJobResult = (jobId) => {
                return new Promise((resolve) => {
                    queueEvent.on('completed', ({ completedJobId, returnvalue }) => {
                        resolve(true)
                    });
                });
            };

            const result = await getJobResult(videoName);
            if (result) {
                ffmpegCommand.setFfprobePath("C:/ffmpeg/ffmpeg-2024-10-02-git-358fdf3083-full_build/ffmpeg-2024-10-02-git-358fdf3083-full_build/bin/ffprobe.exe");


                const metaData = await new Promise((resolve, reject) => {
                    ffmpegCommand.ffprobe(video, (err, metaData) => {
                        if (err) {
                            // console.log(err);
                            return reject(err)
                        } else {
                            resolve(metaData)
                        }
                    })
                })

                if (isThumbnail === false) {
                    const videoKey = `${videoName.split('.')[0]}.jpg`
                    const thumbnailPath = path.resolve(outputDir, videoKey)
                    // console.log('thumbnailPath', thumbnailPath)
                    const extractThumbnail = `ffmpeg -i "${video}" -vf "scale=1280:720:force_original_aspect_ratio=decrease" -q:v 2 -frames:v 1 "${thumbnailPath}"`

                    // ffmpeg -i "${video}" -vf "scale=1280:720:force_original_aspect_ratio=decrease" -q:v 2 -frames:v 1 "${thumbnailPath}.jpg"


                    // console.log('extractThumbnail', extractThumbnail)
                    const response = await new Promise((resolve, reject) => {
                        exec(extractThumbnail, (error, stdout, stderr) => {
                            if (error) {
                                console.error("Error during FFmpeg execution:", error.message);
                                return reject(error);
                            }
                            if (stderr) console.error("FFmpeg stderr:");
                            // console.log("Thumbnail generated");
                            resolve(true);
                        })
                    })

                    if (response) {
                        async function readFile() {
                            try {
                                const file = await fs.promises.readFile(thumbnailPath)
                                return file
                            } catch (err) {
                                // console.log(err)
                            }
                        }
                        const file = await readFile()
                        const storeImageTos3 = await s3client.send(
                            new PutObjectCommand({
                                Bucket: process.env.TEBI_TEMPORARY_BUCKET_NAME,
                                Key: `thumbnails/${videoKey}`,
                                Body: file,
                                ContentDisposition: "inline",
                                ContentType: "image/jpeg",
                                ACL: "public-read"
                            })
                        )

                        if (storeImageTos3.$metadata.httpStatusCode === 200) {
                            const encodedVideoName = encodeURIComponent(videoKey)
                            const url = `https://${process.env.TEBI_TEMPORARY_BUCKET_NAME}.s3.tebi.io/thumbnails/${encodedVideoName}`
                            const duration = metaData?.format?.duration
                            const videoUrlId = videoName
                            fs.unlinkSync(thumbnailPath)
                            return { videoUrlId, duration, result, url }
                        } else {
                            fs.unlinkSync(thumbnailPath)
                        }
                    }
                } else {
                    const duration = metaData?.format?.duration
                    const videoUrlId = videoName
                    return { videoUrlId, duration, result }
                }
            }

        }
    }
    catch (error) {
        console.log(error);
        throw error
    } finally {
        fs.unlinkSync(video)
        // fs.unlinkSync(videoKey)
    }
}

async function deleteVideoFromBucket(objectKey) {
    // console.log(objectKey)
    try {
        const listParams = {
            Bucket: process.env.TEBI_HLS_BUCKET_NAME,
            Prefix: `${objectKey}/`,
            Delimiter: '/'
        }
        const command = new ListObjectsV2Command(listParams)
        const response = await s3client.send(command)

        if (response.Contents) {
            const res = new DeleteObjectCommand({
                Bucket: process.env.TEBI_HLS_BUCKET_NAME,
                Key: response.Contents[0].Key
            })

            const forward = await s3client.send(res)
            // console.log('forward')
        }

        if (response.CommonPrefixes) {
            response.CommonPrefixes.forEach((folder) => {
                // console.log('folder', folder.Prefix)
                const listParams = {
                    Bucket: process.env.TEBI_HLS_BUCKET_NAME,
                    Prefix: `${folder.Prefix}`,
                    Delimiter: '/'
                }
                const command = new ListObjectsV2Command(listParams)
                s3client.send(command).then((value) => {
                    if (value.Contents) {
                        value.Contents.forEach((val) => {
                            // console.log(val.Key)
                            const res = new DeleteObjectCommand({
                                Bucket: process.env.TEBI_HLS_BUCKET_NAME,
                                Key: val.Key
                            })

                            s3client.send(res).then((isOk) => {
                                // console.log('isOk')
                            })
                        })
                    }
                })
            })
        }

        const tempRes = new DeleteObjectCommand({
            Bucket: process.env.TEBI_TEMPORARY_BUCKET_NAME,
            Key: objectKey
        })
        await s3client.send(tempRes)

    } catch (error) {
        console.log(error)
    }
}

async function listFolderContents({ folderName }) {

    const bucketName = process.env.TEBI_HLS_BUCKET_NAME;


    // const listParams = {
    //     Bucket: process.env.TEBI_HLS_BUCKET_NAME,
    //     Prefix: `${folderName}/`,
    //     Delimiter: '/'
    // }

    // const dataCommand = new ListObjectsV2Command(listParams)
    // const folders = await s3client.send(dataCommand)
    // // console.log('folders',folders.Contents[0]?.Key); 

    try {
        const incodedFolderName = encodeURIComponent(folderName)
        const url = {
            auto: `https://s3.tebi.io/${bucketName}/${incodedFolderName}/${incodedFolderName}_master.m3u8`,
            quality1080p: `https://s3.tebi.io/${bucketName}/${incodedFolderName}/1080p/1080p_index.m3u8`,
            quality720p: `https://s3.tebi.io/${bucketName}/${incodedFolderName}/720p/720p_index.m3u8`,
            quality480p: `https://s3.tebi.io/${bucketName}/${incodedFolderName}/480p/480p_index.m3u8`,
            quality320p: `https://s3.tebi.io/${bucketName}/${incodedFolderName}/320p/320p_index.m3u8`
        }
        return url
    } catch (err) {
        console.error("Error listing folder contents:", err);
    }
}

export {
    uploadImagesToBucket,
    uploadVideosToBucket,
    listFolderContents,
    deleteVideoFromBucket
}