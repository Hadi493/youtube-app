import React, { useEffect, useState } from "react";
import Wrapper from "./Wrapper";
import SideBar from "../subComponents/SideBar";
import { useParams } from "react-router-dom";
import { getPlaylistById } from "../api/playlist/playlist";
import { getVideobyId } from "../api/videos/videoApi";
import { userById } from "../api/authentication/authApi";
import formatTimeDifference from "../hooks/formateTime";

function PlaylistVideos() {
  const { playlistId } = useParams();
  const [videos, setVideos] = useState([]);
  const [playlistData, setPlaylistData] = useState(null)

  async function getPlaylist() {
    const result = await getPlaylistById(playlistId);
    setPlaylistData(result?.data.data.playlist)
    const videosData = result.data.data.playlist.videos;

    if (videosData) {

      const videoPromise = videosData.map(async (value) => {
        const res = await getVideobyId(value);
        return res
      });

      const videoData = await Promise.all(videoPromise)

      if (videoData) {
        const awaitResponse = videoData.map((val) =>
          userById(val.data.data.video.owner)
        );
        const userDataResponse = await Promise.all(awaitResponse);

        const enrichedVideos = videoData.map((video, index) => ({
          ...video.data.data.video,
          userData: userDataResponse[index].data.data.userData,
        }));
        setVideos(enrichedVideos);
      }
    }
  }

  useEffect(() => {
    getPlaylist();
  }, [playlistId]);

  console.log("videos", videos);

  return (
    <Wrapper>
      <div className="flex flex-col lg:flex-row max-w-[90rem]">
        <div className="fixed sm:left-[8px] sm:top-20 sm:hidden z-40 sm:z-0 lg:block bottom-[0px] lg:bottom-auto w-full lg:w-[5rem] ">
          <SideBar />
        </div>

        <div className="lg:ml-24 w-full">
          <div className="flex gap-7">
            <div className="w-1/3">
              <div className="rounded-xl shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    className="w-full h-48 sm:h-64 object-cover"
                    src={videos[0]?.thumbnail}
                    alt="Playlist cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5.5px] border border-white/30 text-white p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold">{playlistData?.name}</p>
                        {/* <p className="text-sm">173K views • 3 weeks ago</p> */}
                      </div>
                      <div className="text-sm font-semibold">{playlistData?.videos.length} Videos</div>
                    </div>
                  </div>
                </div>
                {/* <div className="p-4 bg-[#00000000] text-white">
                  <h2 className="text-xl font-bold mb-2">
                    Learn how to use Tailwind CSS card
                  </h2>
                  <p className="">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Aliquam quam perferendis quisquam. Dicta recusandae
                    reiciendis in.
                  </p>
                </div> */}
              </div>
            </div>

            <div className="space-y-4">
              {videos &&
                videos.map((value, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-2 text-white shadow-md overflow-hidden"
                  >
                    <img
                      className="w-full sm:w-48 h-48 sm:h-auto object-cover rounded-lg"
                      src={value?.thumbnail}
                      alt={`Video thumbnail ${i + 1}`}
                    />
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-semibold mb-2">
                          {value?.title}
                        </h3>
                        <div className="text-[13px] text-[#b4b4b4] flex items-center gap-1">
                          <span>{value?.userData.username}</span>
                          <span className="text-[11px]">•</span>
                          <span>{value?.views} views</span>
                          <span className="text-[11px]">•</span>
                          <span>{formatTimeDifference(value?.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default PlaylistVideos;