import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Input } from "../index"
import useHandleCssStore from '../zustand/useHandleCssStore';
import { SignOut } from '../api/authentication/authApi';
import { videoStore } from '../zustand/videoStore';
import userData from '../zustand/userData';

function Header() {
  const toggleBarCss = useHandleCssStore((state) => state.toggelBarCss)
  const toggleSideBar = useHandleCssStore((state) => state.toggleSideBar)
  const coverAll = useHandleCssStore((state) => state.coverAll)
  const handleClickOutside = useHandleCssStore((state) => state.handleClickOutside)
  const [mobileSearch, setMobileSearch] = useState("hidden")
  const [headerClass, setHeaderClass] = useState("block")
  const navigate = useNavigate()
  const showUploadVideo = useHandleCssStore((state) => state.showUploadVideo)
  const [dropDownCss, setDropDownCss] = useState("hidden")
  const [searchValue, setSearchValue] = useState("")
  const setSearchData = videoStore((state) => state.setSearchData)
  const setCurrentUserData = userData((state) => state.setCurrentUserData)
  const currentUserData = userData((state) => state.currentUserData)
  const storegeResponse = sessionStorage.getItem('isLogin')
  const isLogin = JSON.parse(storegeResponse)

  useEffect(() => {
    handleClickOutside()
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside])

  useEffect(() => {
    function handleClickOutside(e) {
      if (e.target.closest("#userDropdown") && !e.target.closest(".SelectedLinks")) {
        setDropDownCss("block");
      } else if (e.target.closest(".userDropdownBtn")) {
        setDropDownCss(dropDownCss === "hidden" ? "block" : "hidden")
      } else if (e.target.closest(".SelectedLinks")) {
        setDropDownCss("hidden");
      }
      else {
        setDropDownCss("hidden");
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside)

  }, [dropDownCss])

  function toggleSearch() {
    setMobileSearch("block")
    setHeaderClass("hidden")
  }

  function backToHeader() {
    setMobileSearch("hidden")
    setHeaderClass("block")
  }

  const location = useLocation();
  function DashboardFunc() {
    if (location.pathname !== "/dashboard/videoDashboard") {
      navigate("/dashboard/videoDashboard");
    }
    showUploadVideo("block")
  }

  function searchVideo(e) {
    e.preventDefault()
    if (searchValue) {
      const response = setSearchData(searchValue)
      console.log(response);
      navigate('/searchResult')
    }
  }

  function logout(params) {
    SignOut()
    setCurrentUserData(null)
  }

  return (
    <>
      <div className=''>
        <div className={`${headerClass} md:block`}>
          <div onScroll={() => setHeaderBg('fffff')} className={`flex max-w-[2560px] text-white items-center justify-between px-7 pt-2 pb-5 text-[1.11rem] bg-[#0f0f0f]`}>
            <div className='flex items-center gap-7'>
              <button className='hidden sm:block' id='mainMenu' onClick={toggleSideBar}>
                <img src="/menubar.svg" alt="" />
              </button>
              <Link to={""} className='flex items-center gap-1'>
                <img className='w-[2.3rem]' src="/youtube-video.svg" alt="" srcSet="" />
                <span>Watch-here</span>
              </Link>
            </div>

            <div className=''>
              <form onSubmit={searchVideo} className='flex relative'>
                <Input
                  className="max-w-[50rem] lg:w-[35rem] md:w-[15rem] hidden md:block rounded-r-none rounded-full bg-[#121214] text-white h-10 px-5 text-[1.1rem] outline-none border-[#8d8d8d8b] border-[1px] focus:border-[#352692] placeholder:text-[#8d8d8d8b] transition-all duration-300"
                  placeholder="Search"
                  onChange={(e) => setSearchValue(e.target.value)}
                />

                <div onClick={searchVideo} className='bg-[#363e4a] items-center px-4 rounded-l-none rounded-full outline-none border-[#8d8d8d8b] border-[1px] hidden md:flex cursor-pointer'>
                  <button className=''>
                    <img className='' src="/search.svg" alt="" />
                  </button>
                </div>
              </form>
            </div>

            <div className='flex gap-3 sm:gap-5'>
              <button onClick={toggleSearch} className='md:hidden'>
                <img src="/search.svg" alt="" />
              </button>
              <button>
                <img onClick={DashboardFunc} className='uploadVideoBtn' src="/uploadVideo.svg" alt="" />
              </button>
              <div>
                {isLogin ? currentUserData ? <img className='w-[29px] h-[29px] object-cover rounded-full userDropdownBtn cursor-pointer' src={currentUserData?.avatar} alt="" />
                  : <div className='w-[29px] h-[29px] rounded-full bg-slate-700'></div>
                  : <img className='relative cursor-pointer userDropdownBtn' src="/avatar.svg" alt="" />
                }

                <div id="userDropdown" className={`z-10 ${dropDownCss} absolute right-7 bg-white divide-y divide-gray-100 rounded-lg shadow w-52 dark:bg-[#252934] dark:divide-gray-600 top-14`}>
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div className='flex items-center gap-2'>
                      <img src="https://th.bing.com/th/id/OIP.7ITF2gx8_a3s4NbnDOpZzAHaHa?w=238&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7" className='w-9 h-9 rounded-full' alt="" />
                      <div>
                        <div>Bonnie Green</div>
                        <div className="font-medium truncate">name@flowbite.com</div>
                      </div>
                    </div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
                    <li>
                      <button onClick={DashboardFunc} className="block w-full text-left px-4 py-2 SelectedLinks hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</button>
                    </li>
                    <li>
                      <Link to={""} className="block px-4 py-2 SelectedLinks hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</Link>
                    </li>
                    <li>
                      <Link to={""} className="block px-4 py-2 SelectedLinks hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</Link>
                    </li>
                  </ul>
                  <div className="py-1">
                    <Link to={"/login"} onClick={logout} className="block px-4 py-2 SelectedLinks text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className={`${mobileSearch} md:hidden`}>
          <div className='flex relative pt-3 pb-[0.8rem] bg-[#13151a] justify-center'>
            <div className='flex gap-6'>
              <button onClick={backToHeader}>
                <img src="/leftArrow.svg" alt="" />
              </button>
              <form onSubmit={searchVideo}>
                <Input
                  className="w-[80vw] md:block  rounded-full bg-[#13131497] h-11 px-5 text-[1.1rem] outline-none border-[#8d8d8d8b] border-[1px] text-white"
                  placeholder="Search"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </form>
            </div>
            <div>
              {/* <button className={`${mobileSearch == 'hidden' ? 'absolute text-center ml-[-3rem] mt-[0.60rem]' : "hidden text-center ml-[-3rem] mt-[0.60rem]"}`}>
                <img className='' src="/search.svg" alt="" />
              </button> */}
            </div>
          </div>
        </div>

        <div className={`${coverAll}`}>
          <aside id="logo-sidebar" className={`fixed overflow-hidden top-0 ${toggleBarCss} w-64 h-screen transition-all`} aria-label="Sidebar">
            <div className="h-full px-3 py-4 bg-gray-50 dark:bg-[#14071a]">

              <div className='flex items-center pb-5 gap-5 pl-1'>
                <div>
                  <img className='cursor-pointer slideLeft' src="/menubar.svg" alt="" />
                </div>

                <Link to={""} className="flex items-center ps-2.5">
                  <div className='flex items-center gap-1'>
                    <img className='w-[2.5rem]' src="/youtube-video.svg" alt="" srcSet="" />
                    <span className='text-white text-[1.1rem]'>Watch-here</span>
                  </div>
                </Link>
              </div>

              <ul className="space-y-2 h-[88vh] font-medium pb-3 overflow-auto scrollbar">
                <li>
                  <Link to="" className="flex slideLeft items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#100628] group">
                    <img src="/home.svg" alt="" />
                    <span className="ms-3">Home</span>
                  </Link>
                </li>
                <li>
                  <Link to={""} className="flex slideLeft items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#100628] group">
                    <img src="/subscription.svg" alt="" />
                    <span className="flex-1 ms-3 whitespace-nowrap">Subscriptions</span>
                  </Link>
                </li>
                <div className='border-[0.2px] opacity-10'></div>

                <div className='flex text-xl items-center w-[5rem] mt-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#100628] group p-2 cursor-pointer'>
                  <div className=''>
                    You
                  </div>
                  <img src="/chevronRight.svg" alt="" />
                </div>
                <li>
                  <Link to={""} className="flex slideLeft items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#100628] group">
                    <img src="/currentUser.svg" alt="" />
                    <span className="flex-1 ms-3 whitespace-nowrap">Your channel</span>
                  </Link>
                </li>
                <li>
                  <Link to={""} className="flex slideLeft items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#100628] group">
                    <img src="/history.svg" alt="" />
                    <span className="flex-1 ms-3 whitespace-nowrap">History</span>
                  </Link>
                </li>
                <li>
                  <Link to={""} className="flex slideLeft items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#100628] group">
                    <img src="/playlist.svg" alt="" />
                    <span className="flex-1 ms-3 whitespace-nowrap">Playlist</span>
                  </Link>
                </li>
                <li>
                  <Link to={""} className="flex slideLeft items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#100628] group">
                    <img src="/videos.svg" alt="" />
                    <span className="flex-1 ms-3 whitespace-nowrap">Your videos</span>
                  </Link>
                </li>
                <li>
                  <Link to={""} className="flex slideLeft items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#100628] group">
                    <img src="/like.svg" alt="" />
                    <span className="flex-1 ms-3 whitespace-nowrap">Liked videos</span>
                  </Link>
                </li>
                <li>
                  <Link to={""} className="flex slideLeft items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#100628] group">
                    <img src="/download.svg" alt="" />
                    <span className="flex-1 ms-3 whitespace-nowrap">Downloads</span>
                  </Link>
                </li>

                <div className='border-[0.2px] opacity-10'></div>
                <div className='flex text-xl items-center w-[9rem] mt-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#100628] group p-2 cursor-pointer'>
                  <div className=''>
                    Subscriptions
                  </div>
                </div>

                <li>
                  <Link to={""} className="flex slideLeft items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#100628] group">
                    <img src="/like.svg" alt="" />
                    <span className="flex-1 ms-3 whitespace-nowrap">Liked videos</span>
                  </Link>
                </li>
                <li>
                  <Link to={""} className="flex slideLeft items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#100628] group">
                    <img src="/download.svg" alt="" />
                    <span className="flex-1 ms-3 whitespace-nowrap">Downloads</span>
                  </Link>
                </li>

              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>

  )
}

export default Header
