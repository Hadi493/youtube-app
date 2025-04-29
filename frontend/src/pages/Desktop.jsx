import SideBar from '../subComponents/SideBar'
import { Link, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import userData from '../zustand/userData.js'
import { userById } from '../api/authentication/authApi.js'
import { getSubscribersOfchannel, toggleSubscription } from '../api/subscription/subscription.js'

function Desktop() {
  const currentUserData = userData((state) => state.currentUserData);
  const navigate = useNavigate();
  const { userId } = useParams()
  const [authState, setAuthState] = useState({
    isLoading: true,
    data: null,
    error: null
  })

  useEffect(() => {
    async function getUser() {
      try {
        const response = await userById(userId)
        const result = await getSubscribersOfchannel(userId)
        if (response?.data?.data) {
          response.data.data.userData = {
            ...response.data.data.userData,
            subscribers: result?.data?.data
          }
          setAuthState({
            isLoading: false,
            data: response.data.data.userData,
            error: null
          })
        } else {
          setAuthState({
            isLoading: false,
            data: null,
            error: 'no data found'
          })
        }
      } catch (error) {
        console.log(error);
        setAuthState({
          isLoading: false,
          data: null,
          error: error.message
        })
      }
    }
    getUser()
  }, [userId])

  const deskCategories = [
    {
      "id": 0,
      "name": "Videos",
      "url": "videos"
    },
    {
      "id": 1,
      "name": "Playlist",
      "url": "playlist"
    },
    {
      "id": 2,
      "name": "Tweets",
      "content": <div>Tweets</div>,
      "url": "tweets"
    },
    {
      "id": 3,
      "name": "Following",
      "url": "following"
    },
  ]

  // console.log(authState.data)

  // if (currentUserData.notUser) {
  //   return (
  //     <div className='h-full w-full flex items-center flex-col gap-2 justify-center text-white mt-72'>
  //       <div>Please log in</div>
  //       <button onClick={() => navigate('/login')} className='bg-blue-700 w-28 px-9 py-2 rounded-sm'>Login</button>
  //     </div>
  //   );
  // }
  function subscribe() {
    try {
      const response = toggleSubscription(authState.data?._id)
    } catch (error) {
      console.log(`got error while subscribing the channel ${error}`)
    }
  }

  return (
    <div className='mt-20'>
      <div>
        <div className='sm:left-[8px] sm:top-20 fixed sm:hidden z-40 sm:z-0 lg:block bottom-[0px] lg:bottom-auto w-full lg:w-[5rem]'>
          <SideBar />
        </div>
      </div>


      <div>
        {authState.isLoading == false ?
          <div className='lg:ml-[8rem]'>
            <div className='w-[97%] m-auto max-h-[14rem] rounded-xl overflow-hidden'>
              <img
                className='w-full h-full object-contain object-center'
                src={authState.data?.coverImage || '/images/coverImage.jpg'}
                alt="Cover"
              />
            </div>

            <div className='px-4'>
              <div className='flex justify-between items-center gap-3 flex-col sm:flex-row w-full pr-3  sm:pt-3'>
                <div className='flex gap-3 flex-col sm:flex-row'>
                  <div>
                    <img src={authState.data?.avatar} className='w-20 h-20 rounded-full object-cover' alt="" />
                  </div>

                  <div className='text-white flex flex-col gap-1 top-[-3rem] sm:static pl-2 sm:pl-0'>
                    <div className='flex justify-between items-center'>
                      <p className='text-2xl font-bold'>{authState.data?.username}</p>

                      <Link to={"/"}>
                        <div className='text-white gap-2 flex sm:hidden'>
                          <img src="/leftArrow.svg" alt="" />
                          <p>
                            back
                          </p>
                        </div>
                      </Link>
                    </div>

                    <p className='text-[#c1bfbf]'>@{authState.data?.fullName}</p>
                    <div className='flex gap-1 items-center text-[#b8b8b8] text-sm'>
                      <p>{authState.data?.subscribers?.Subscribers <= 1 ? `${authState.data?.subscribers?.Subscribers} Subscriber` : `${authState.data?.subscribers?.Subscribers} Subscribers`}</p>
                    </div>
                  </div>
                </div>


                {currentUserData.isUser && currentUserData.data?._id !== authState.data?._id && <div>
                  <button type="button" onClick={subscribe} className="text-[#c6c1c1] bg-[#661fbd] font-medium rounded-lg text-sm px-5 py-2.5 me-2 focus:outline-none top-[-3rem]">Subscribe</button>
                </div>}
              </div>
            </div>
            <div className='ml-5 mt-6'>
              <div className='flex justify-normal text-white border-b-[0.5px] mr-4 border-[#4a4a4a] gap-6'>
                {deskCategories && deskCategories.map((value) => (
                  <div key={value.id} className=''>
                    <NavLink
                      to={value.url}
                      className={({ isActive }) => isActive ? "text-white border-b-[1.5px] pb-2 inline-block rounded-sm shadow-md"
                        : "transition-colors inline-block duration-200 rounded-lg"}
                    >
                      {value.name}
                    </NavLink>
                  </div>
                ))}
              </div>
            </div>
          </div>
          : <div>
            {/* Cover Image Skeleton */}
            <div className='lg:ml-[6rem]'>
              <div className='coverImage w-[97%] m-auto max-h-[14rem] relative skeleton-cover'>
                {/* Cover image placeholder */}
              </div>

              {/* Profile Info Skeleton */}
              <div className='px-4'>
                <div className='flex justify-between gap-3 flex-col sm:flex-row w-full pr-3 sm:pt-3'>

                  {/* Avatar and User Info Skeleton */}
                  <div className='flex gap-3 flex-col sm:flex-row'>
                    <div className='skeleton-avatar'></div>

                    <div className='text-white flex flex-col gap-1 top-[-3rem] relative sm:static pl-2 sm:pl-0'>
                      <div className='flex justify-between items-center'>
                        <div className='skeleton-text skeleton-username'></div>
                        {/* <div className='skeleton-text skeleton-back'></div> */}
                      </div>

                      <div className='skeleton-text skeleton-fullname'></div>
                      <div className='flex gap-1 items-center text-[#b8b8b8] text-sm'>
                        <div className='skeleton-text skeleton-subscriber'></div>
                        <div className='skeleton-dot'></div>
                        <div className='skeleton-text skeleton-subscribed'></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button Skeleton */}
                  <div className='skeleton-button'></div>
                </div>
              </div>
            </div>

            {/* Navigation Skeleton */}
            <div className='lg:ml-[6rem]'>
              <div className='flex justify-center'>
                <div className='flex justify-between text-white border-b-2 w-[95%] gap-1 py-2'>
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className='skeleton-nav-item'></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }

        <div className='lg:ml-[7.7rem] mt-7'>
          <div className='text-white pb-20 sm:pb-0 w-[95%] m-auto'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Desktop
