import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../subComponents/SideBar';
import Wrapper from '../components/Wrapper';
import { getAllVideos } from '../api/videos/videoApi';
import { userById } from '../api/authentication/authApi';
import formatTimeDifference from '../hooks/formateTime';

// Trending categories with emojis for better visual appeal
const categories = [
  { id: 'all', name: 'All', emoji: '🌟' },
  { id: 'trending', name: 'Trending', emoji: '🔥' },
  { id: 'music', name: 'Music', emoji: '🎵' },
  { id: 'gaming', name: 'Gaming', emoji: '🎮' },
  { id: 'education', name: 'Education', emoji: '📚' },
  { id: 'tech', name: 'Tech', emoji: '💻' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' }
];

const VideoCard = ({ video, onVideoClick, onProfileClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isHovered]);

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views;
  };

  return (
    <div 
      className="group relative rounded-xl overflow-hidden bg-[#1a1a1a] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => onVideoClick(e, video)}
    >
      {/* Thumbnail/Video Container */}
      <div className="relative aspect-video bg-black">
        {isHovered && video?.videoFile ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={video.videoFile}
            muted
            loop
          />
        ) : (
          <img 
            loading="lazy" 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            src={video?.thumbnail} 
            alt={video?.title}
          />
        )}
        
        {/* Duration & Quality Badge */}
        <div className="absolute bottom-2 right-2 flex gap-2">
          <span className="bg-black/80 px-2 py-1 rounded text-xs text-white">
            {video?.duration || '00:00'}
          </span>
          {video?.quality && (
            <span className="bg-black/80 px-2 py-1 rounded text-xs text-white">
              {video.quality}
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
          >
            <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
          </button>
          <button 
            className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors transform hover:scale-110"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-2xl">🕒</span>
          </button>
        </div>

        {/* Progress Bar */}
        {video?.progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div 
              className="h-full bg-red-500"
              style={{ width: `${video.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Profile Section */}
          <div 
            className="relative group/profile"
            onClick={(e) => {
              e.stopPropagation();
              onProfileClick(video?.userData?._id);
            }}
          >
            <img 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30 transition-transform hover:scale-110" 
              src={video?.userData?.avatar} 
              alt={video?.userData?.username}
            />
            
            {/* Profile Hover Card */}
            <div className="opacity-0 group-hover/profile:opacity-100 transition-opacity absolute -top-2 left-12 bg-[#2a2a2a] p-4 rounded-lg shadow-xl z-10 w-64">
              <div className="flex items-start gap-3">
                <img 
                  className="w-16 h-16 rounded-full border-2 border-purple-500/30" 
                  src={video?.userData?.avatar} 
                  alt={video?.userData?.username}
                />
                <div>
                  <p className="font-medium text-white text-lg">{video?.userData?.username}</p>
                  <p className="text-sm text-gray-400">{video?.userData?.subscribers || 0} subscribers</p>
                  <p className="text-xs text-gray-500 mt-1">{video?.userData?.description || 'No description'}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700 flex justify-end">
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full text-sm transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="flex-1">
            <h3 className="font-medium text-[#dfdede] line-clamp-2 leading-snug mb-1 hover:text-white">
              {video?.title}
            </h3>
            <div className="flex items-center text-sm text-[#a1a1a1] space-x-2">
              <span>{formatViews(video?.views)} views</span>
              <span>•</span>
              <span>{formatTimeDifference(video?.createdAt)}</span>
            </div>
            {video?.description && (
              <p className="mt-2 text-sm text-[#a1a1a1] line-clamp-2">
                {video.description}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="relative">
            <button 
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-full transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-xl text-white">⋮</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Skeleton = () => (
  <div className="rounded-xl overflow-hidden bg-[#1a1a1a] animate-pulse">
    <div className="aspect-video bg-[#2a2a2a]" />
    <div className="p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-[#2a2a2a]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#2a2a2a] rounded w-3/4" />
          <div className="h-4 bg-[#2a2a2a] rounded w-1/2" />
          <div className="flex gap-2">
            <div className="h-3 bg-[#2a2a2a] rounded w-16" />
            <div className="h-3 bg-[#2a2a2a] rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hasVideo, setHasVideo] = useState(true);
  const [videoArray, setVideoArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getAllVideosFunc() {
      try {
        const response = await getAllVideos();
        if (response) {
          const videoData = response.data.data.allvideos;
          const userDataResponse = await Promise.all(
            videoData.map((val) => userById(val?.owner))
          );

          const enrichedVideos = videoData.map((video, index) => ({
            ...video,
            userData: userDataResponse[index].data.data.userData,
          }));

          setVideoArray(enrichedVideos);
          setHasVideo(enrichedVideos.length > 0);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setHasVideo(false);
      } finally {
        setLoading(false);
      }
    }
    getAllVideosFunc();
  }, []);

  const handleVideoClick = (e, video) => {
    const target = e?.target.id;
    if (target !== "profile") {
      navigate(`video/${video?._id}`);
    }
  };

  const handleProfileClick = (userId) => {
    navigate("userSection");
  };

  if (!hasVideo && !loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-[#45434370] rounded-full flex items-center justify-center">
            <span className="text-4xl">📺</span>
          </div>
          <h2 className="text-xl font-medium text-white">No videos available</h2>
          <p className="text-[#a1a1a1]">Check back later for new content</p>
        </div>
      </div>
    );
  }

  return (
    <Wrapper>
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed sm:hidden md:p-2 p-0 lg:block bottom-0 lg:bottom-auto w-full lg:w-[4rem]">
          <SideBar />
        </div>

        {/* Main content */}
        <div className="flex-1 pt-3 px-4 lg:pl-20">
          {/* Categories */}
          <div className="mb-6 -mx-2">
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full transition-all
                    ${selectedCategory === category.id 
                      ? 'bg-white text-black' 
                      : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'}
                  `}
                >
                  <span>{category.emoji}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Videos grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }, (_, i) => <Skeleton key={i} />)
              : videoArray.map((video) => (
                  <VideoCard
                    key={video._id}
                    video={video}
                    onVideoClick={handleVideoClick}
                    onProfileClick={handleProfileClick}
                  />
                ))
            }
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Home;