// import CategoryCarousel from '../subComponents/Category'
import { useEffect, useState } from 'react'
import SideBar from '../subComponents/SideBar'
import { useNavigate } from 'react-router-dom'
import Wrapper from '../components/Wrapper'
import { getAllVideos } from '../api/videos/videoApi'
import { userById } from '../api/authentication/authApi'
import formatTimeDifference from '../hooks/formateTime'

function Home() {
  const [hasVideo, setHasVideo] = useState(true)
  const [videoArray, setVideoArray] = useState([])

  useEffect(() => {
    async function getAllVideosFunc() {
      const response = await getAllVideos()
      // setHasVideo(false)
      if (response) {
        // console.log(response)
        const videoData = response?.data.data.allvideos

        const awaitResponse = videoData.map((val) => userById(val?.owner))
        const userDataResponse = await Promise.all(awaitResponse)

        const enrichedVideos = videoData.map((video, index) => (
          {
            ...video,
            userData: userDataResponse[index].data.data.userData,
          }));

        setVideoArray(enrichedVideos)
      }
    }
    getAllVideosFunc()
  }, [])

  const navigate = useNavigate()
  const videoClick = (e, value) => {
    const target = e?.target.id
    if (target !== "profile" && target !== "dot") {
      navigate(`video/${value?._id}`)
    }
    if (target == "profile") {
      console.log(value?.owner)
      navigate(`desktop/${value?.owner}`)
    }
  }

  // const skeletonCount = Math.ceil(window.innerWidth / 300)

  const Skeleton = () => {
    return (
      <div className="cursor-pointer">
        <div className="rounded-xl shadow-lg animate-HomePulse background-pulse">
          <div className="w-full aspect-video rounded-xl bg-[#313131]"></div>
          <div className="py-4">
            <div className="flex gap-4">
              <div className="w-12 h-10 rounded-full bg-[#313131]"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="w-3/4 h-4 bg-[#313131] rounded"></div>
                <div className="w-1/3 h-4 bg-[#313131] rounded"></div>
                <div className="flex gap-2 text-sm text-gray-600">
                  <div className="w-1/4 h-4 bg-[#313131] rounded"></div>
                  <div className="w-1/5 h-4 bg-[#313131] rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return hasVideo ? (
    <Wrapper>
      <div className='flex'>

        <div className='left fixed sm:hidden md:p-2 p-0 lg:block bottom-0 lg:bottom-auto w-full lg:w-[4rem]'>
          <SideBar />
        </div>

        <div className='right w-full pt-3 overflow-hidden p-2 sm:mx-3 pb-16 sm:pb-0'>
          <div className='lg:ml-[4.5rem] ml-0 items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
            {
              videoArray.length > 0 ? videoArray.map((value) => {
                return <div key={value._id} className='cursor-pointer'>
                  <div onClick={(e) => { videoClick(e, value) }} className="rounded-xl shadow-lg">
                    <div className=''>
                      <img loading='lazy' className="w-full object-contain aspect-video rounded-xl bg-black" src={value?.thumbnail} alt="Sunset in the mountains" />
                    </div>
                    <div className="py-4">
                      <div className="flex gap-0">
                        <img id='profile' className="w-10 h-10 object-cover rounded-full mr-4" src={value?.userData?.avatar} alt="Avatar of Jonathan Reinink" />
                        <div className="text-base flex flex-col gap-1 text-[#dfdede]">
                          <div className='flex gap-2'>
                            <div className="text-base font-medium">{value?.title}</div>
                          </div>
                          <p className="leading-none text-sm text-[#a1a1a1]">{value?.userData?.username}</p>
                          <div className='flex gap-1 text-[#a1a1a1]'>
                            <p>{value?.views} views.</p>
                            <p>{formatTimeDifference(value?.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }) : Array.from({ length: 10 }, (_, i) => <Skeleton key={i} />)
            }
          </div>
        </div>
      </div>

      {/* <div className='w-[373px] aspect-video rounded-xl bg-black'></div> */}
    </Wrapper >
  )
    : (<div className='flex h-[57vh] justify-center flex-col text-white items-center'>
      <div className='flex flex-col justify-center items-center w-[18rem] gap-2'>
        <p>
          <img className='bg-[#45434370] p-2 rounded-full' src="/play.svg" alt="" />
        </p>

        <p>No videos available</p>
        <p className='text-sm text-center'>There is no video available here. please try again somtimes</p>
      </div>
    </div>)

  // return (
  //   Array.from({ length: 10 }, (_, i) => <Skeleton key={i} />)
  // )
}

export default Home