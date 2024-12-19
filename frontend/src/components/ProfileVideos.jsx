import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useHandleCssStore from '../zustand/useHandleCssStore'
import userData from '../zustand/userData'
import { getAllVideosOfaUser } from '../api/videos/videoApi'
import formatTimeDifference from '../hooks/formateTime'
import { currentUser } from '../api/authentication/authApi'

function ProfileVideos() {
  const [hasVideo, setHasVideo] = useState(false)
  const [videos, setVideos] = useState([])
  // const currentUserData = userData((state) => state.currentUserData)
  const {userId} = useParams()

  const navigate = useNavigate()
  const videoClick = (e) => {
    const target = e?.target.id
    if (target !== "dot") {
      navigate("/video")
    }
  }

  useEffect(() => {
    async function processFetch() {
      const response = await getAllVideosOfaUser(userId)
      console.log('response', response)
      setHasVideo(true)
      setVideos(response?.data?.data?.videos)
    }
    processFetch()
  }, [userId])

  function navigateAndToggle() {
    navigate("/dashboard")
  }

  // console.log(videos)

  if (videos?.length == 0) {
    return videos?.length === 0 && (<div className='flex h-[15rem] justify-center flex-col text-white items-center'>
      <div className='flex flex-col justify-center items-center w-[18rem] gap-2'>
        <p>
          <img className='bg-[#45434370] p-2 rounded-full' src="/play.svg" alt="" />
        </p>

        <p>No videos uploaded</p>
        <p className='text-sm text-center'>{currentUser ? 'click to upload new video. you have yet to upload a video' : 'This page yet to upload a video search another page in order to find more videos'}</p>

        {currentUser &&
          <div>
            <div>
              <button onClick={navigateAndToggle} className='text-[#c6c1c1] bg-[rgb(102,31,189)] font-medium rounded-sm text-sm px-5 py-1.5 focus:outline-none flex gap-3 uploadVideoBtn'>
                <img src="/plus.svg" alt="" />
                New Video
              </button>
            </div>
          </div>
        }
      </div>
    </div>
    )
  }

  return (
    <div>
      <div className='right w-full overflow-hidden'>
        <div className='max-w-full ml-0 items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 cursor-pointer'>
          {videos && videos.map((value, i) => {
            return <div key={i} className=''>
              <div onClick={(e) => {
                videoClick(e)
              }} className="rounded-xl shadow-lg">
                <div className=''>
                  <img className="object-cover w-full h-[13rem] rounded-sm" src={value?.thumbnail} alt="Sunset in the mountains" />
                </div>
                <div className="py-4 h-[120px]">
                  <div className="flex gap-1">
                    <div className="text-base flex flex-col gap-1 text-[#dfdede]">
                      <div className='flex gap-2 items-baseline'>
                        <div className="text-lg">{value?.title.length > 30 ? value.title.substring(0, 30) + '...' : value.title}</div>
                        <div>
                        </div>
                      </div>
                      {/* <p className="leading-none text-[#a1a1a1]">{value?.description.length > 90 ? value.description.substring(0, 90) + "..." : value.description}</p> */}
                      <div className='flex gap-1 text-[#a1a1a1]'>
                        <p>173K views.</p>
                        <p>{formatTimeDifference(value?.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  )
}

export default ProfileVideos
