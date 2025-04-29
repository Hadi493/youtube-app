import { useRef, useState, useEffect } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import Hls from "hls.js";
import { getVideobyId } from "../api/videos/videoApi";

function CustomVideoPlayer({ videoId }) {
  const videoRef = useRef(null);
  const frameIdRef = useRef(null);
  const divRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoRangeValue, setVideoRangeValue] = useState(0);
  const [soundRangeValue, setSoundRangeValue] = useState(10);
  const [volumeUrl, setVolumeUrl] = useState("volume-full.svg");
  const [videoIndex, setVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [toggleFullScreenImg, setToggleFullScreenImg] =
    useState("maximize.svg");
  const [showSetting, setShowSetting] = useState(false);
  const [onHoverShow, setonHoverShow] = useState("absolute");
  const [storedTime, setStoredTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [videoObj, setVideoObj] = useState({
    videoUrls:[],
    videoDuration: 0 
  })
  const [quality, setQuality] = useState(null);

  useEffect(() => {
    async function getvideo() {
      try {
        const res = await getVideobyId(videoId);
        const videoUrls = res.data.data.video.videoUrl
        const videoDuration = res.data.data.video.duration
        setVideoObj({
          videoUrls: videoUrls,
          videoDuration: videoDuration,
        });

        const videoElement = videoRef.current;
        if (Hls.isSupported() && videoElement) {
          const hls = new Hls({
            startLevel: 0,
            maxBufferLength: 10,
            maxBufferSize: 60 * 1000 * 1000,
          });
          hls.loadSource(videoUrls.auto);
          hls.attachMedia(videoElement);
          videoElement.currentTime = storedTime;
          videoElement.play();
        } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
          videoElement.currentTime = storedTime;
          videoElement.src = videoUrls.auto;
          videoElement.play();
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    }
    getvideo();
  }, [videoId]);
  
  

  useEffect(() => {
    try {

    } catch (error) {
      console.log(error);
    }
  }, [quality,videoId]);

  useEffect(() => {
    const handleWaiting = () => setLoading(true);
    const handleCanplay = () => setLoading(false);

    videoRef.current.addEventListener("waiting", handleWaiting);
    videoRef.current.addEventListener("canplay", handleCanplay);

    return () => {
      videoRef.current?.removeEventListener("waiting", handleWaiting);
      videoRef.current?.removeEventListener("canplay", handleCanplay);
    };
  }, []);

  function togglePlayPause() {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }

  function onVideoInputValChange(e) {
    const Value = e?.target?.value;
    setVideoRangeValue(Value);
    videoRef.current.currentTime = (Value / 100) * videoRef.current.duration;
  }

  function onSoundInputChange(e) {
    const value = e.target.value;
    videoRef.current.volume = value / 100;
    setSoundRangeValue(value);
  }

  function toggleMute() {
    if (soundRangeValue !== 0) {
      setSoundRangeValue(0);
    } else {
      setSoundRangeValue(40);
    }
  }

  useEffect(() => {
    videoRef.current.volume = soundRangeValue / 100;
  }, [soundRangeValue]);

  const updateSlider = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration > 0) {
        const newValue = (currentTime / duration) * 100;
        setVideoRangeValue(Math.round(newValue));
        setCurrentTime(currentTime);
      }
      frameIdRef.current = requestAnimationFrame(updateSlider);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      frameIdRef.current = requestAnimationFrame(updateSlider);
    } else {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    }
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (soundRangeValue < 50 && soundRangeValue > 0) {
      setVolumeUrl("volume-low.svg");
    } else {
      setVolumeUrl("volume-full.svg");
    }

    if (soundRangeValue == 0) {
      setVolumeUrl("volume-mute.svg");
    }
  }, [soundRangeValue]);

  function playNextVideo() {
    // console.log(videoObj?.videoUrls.length);
    if (videoIndex < videoObj?.videoUrls.length) {
      setVideoIndex((prev) => prev + 1);
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play();
      if (!video.paused) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }
  }, [videoIndex]);

  function toggleScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setToggleFullScreenImg("maximize.svg");
    } else {
      divRef.current.requestFullscreen();
      setToggleFullScreenImg("minimize.svg");
    }
  }

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    let time = `${hours > 0 ? `${hours}:` : ""}${
      minutes < 10 ? "0" : ""
    }${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    return time;
  }

  function changeQuality(e) {
    try {
      setStoredTime(videoRef.current.currentTime);
      if (e.target.innerText == "auto") {
        setQuality(videoObj?.videoUrls?.auto);
      } else if (e.target.innerText == "1080p") {
        setQuality(videoObj?.videoUrls?.quality1080p);
      } else if (e.target.innerText == "720p") {
        setQuality(videoObj?.videoUrls?.quality720p);
      } else if (e.target.innerText == "480p") {
        setQuality(videoObj?.videoUrls?.quality480p);
      } else if (e.target.innerText == "320p") {
        setQuality(videoObj?.videoUrls?.quality320p);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowSetting(false);
      setIsPlaying(true);
    }
  }

  const override = {
    borderColor: "black",
  };

  const qualitiesArray = ["auto", "1080p", "720p", "480p", "320p"];

  return (
    <>
      <div
        ref={divRef}
        onMouseEnter={() => setonHoverShow("absolute")}
        onMouseLeave={() => setonHoverShow("hidden")}
        className="relative"
      >
        <video
          crossOrigin="anonymous"
          onClick={togglePlayPause}
          ref={videoRef}
          onEnded={() => {
            setIsPlaying(false);
          }}
          preload="auto"
          disablePictureInPicture
          className="w-full aspect-video rounded-md object-contain bg-black cursor-pointer"
          controls={false}
        >
          <source src={videoObj.videoUrls?.quality1080p} type="application/x-mpegURL" />
        </video>

        {/* {loading && <div className="absolute">Loading chunks...</div>} */}
        {loading && (
          <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[#0909093b] text-white text-xl">
            <BounceLoader
              color={"#c90aea"}
              loading={loading}
              cssOverride={override}
              size={60}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}

        {videoObj?.videoDuration && (
          <div
            className={`${onHoverShow} absolute custom-video-controls bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-2`}
          >
            <div className="px-4 pb-[0.33rem]">
              <input
                className="
            transition-all
            w-full
            h-[0.23rem]
            bg-[#30303053]
            accent-red-600
            cursor-pointer
            focus:outline-none
            focus:ring-0
            hover:shadow-none"
                type="range"
                onChange={onVideoInputValChange}
                max={100}
                value={videoRangeValue}
              />
            </div>
            <div className="flex justify-between items-center px-6">
              <div className="flex items-center gap-7">
                <div className="flex items-center top-[-5rem] left-[14rem] sm:static gap-2">
                  <button className="focus:outline-none">
                    <img
                      src="/backward.svg"
                      alt="Backward"
                      className="w-6 h-6"
                    />
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="focus:outline-none"
                  >
                    {!isPlaying ? (
                      <img
                        src="/play.svg"
                        alt="Play"
                        className="w-[1.4rem] h-[1.4rem]"
                      />
                    ) : (
                      <img
                        src="/pause.svg"
                        alt="Pause"
                        className="w-[1.4rem] h-[1.4rem]"
                      />
                    )}
                  </button>
                  <button className="focus:outline-none">
                    <img
                      onClick={playNextVideo}
                      src="/forward.svg"
                      alt="Forward"
                      className="w-6 h-6"
                    />
                  </button>
                </div>
                <div className="flex items-center gap-5">
                  <img
                    onClick={toggleMute}
                    src={`/${volumeUrl}`}
                    alt="Volume"
                    className="w-[1.5rem] hidden sm:block h-[1.5rem] cursor-pointer"
                  />
                  <input
                    onChange={onSoundInputChange}
                    type="range"
                    max={100}
                    value={soundRangeValue}
                    className="w-[4rem] h-1 bg-gray-300 rounded-lg cursor-pointer accent-white focus:outline-none focus:ring-0 hover:shadow-none hidden sm:block"
                  />
                  <p className="text-white text-sm">
                    {formatDuration(currentTime)} / {formatDuration(videoObj?.videoDuration)}
                  </p>
                </div>
              </div>
              <div className="text-white flex gap-4">
                <div className="relative">
                  <img
                    className="cursor-pointer hidden sm:block"
                    onClick={() => setShowSetting(!showSetting)}
                    src="/dots2.svg"
                    alt=""
                  />
                  {showSetting && (
                    <div className="bg-[#211e1e7a] absolute w-[8.75rem] p-2 top-[-13rem] left-[-5rem] rounded-md">
                      <ul className="flex flex-col gap-3">
                        {qualitiesArray.map((value) => (
                          <button className="text-left">
                            <li onClick={changeQuality}>{value}</li>
                          </button>
                        ))}
                        {/* <button className="text-left">
                      <li onClick={changeQuality}>auto</li>
                    </button>
                    <button className="text-left">
                      <li onClick={changeQuality}>1080p</li>
                    </button>
                    <button className="text-left">
                      <li onClick={changeQuality}>720p</li>
                    </button>
                    <button className="text-left">
                      <li onClick={changeQuality}>480p</li>
                    </button>
                    <button className="text-left">
                      <li onClick={changeQuality}>320p</li>
                    </button> */}
                      </ul>
                    </div>
                  )}
                </div>
                <img
                  className="cursor-pointer"
                  onClick={toggleScreen}
                  src={`/${toggleFullScreenImg}`}
                  alt=""
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CustomVideoPlayer;
