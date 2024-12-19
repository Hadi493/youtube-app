import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import OutletComp from './outlet/Outlet';
import Home from './pages/Home';
import Register from "./components/Register";
import Login from "./components/Login";
import Video from "./components/Video";
import UserSection from "./components/UserSection";
import SearchResult from "./pages/SearchResult";
import Desktop from "./pages/Desktop";
import ProfileVideos from "./components/ProfileVideos";
import Playlists from "./components/Playlists";
import PlaylistVideos from "./components/PlaylistVideos";
import Tweets from "./components/Tweets";
import Following from "./components/Following";
import Dashboard from "./pages/Dashboard";
import VideoDashboard from "./components/VideoDashboard";
import UserDashboard from "./components/UserDashboard";
// import ShowLogin from "./subComponents/ShowLogin";

const AppRouter = () => {
  // async function renderComponent() {

  //   // console.log('running');
  //   try {
  //     const response = await currentUser()
  //     return response ? <Desktop /> : <ShowLogin />
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<OutletComp />}>
        <Route path='' element={<Home />} />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
        <Route path='video/:videoId' element={<Video />} />
        <Route path='userSection' element={<UserSection />} />
        <Route path='searchResult' element={<SearchResult />} />

        <Route path='desktop/:userId' element={<Desktop />} >
          <Route index element={<Navigate to="videos" replace />} />
          <Route path="videos" element={<ProfileVideos />} />
          <Route path="playlist" element={<Playlists />} />
          <Route path="tweets" element={<Tweets />} />
          <Route path="following" element={<Following />} />
        </Route>

        <Route path="playlistVideos" element={<PlaylistVideos />} />

        <Route path="dashboard" element={<Dashboard />} >
          <Route index element={<Navigate to="videoDashboard" replace />} />
          <Route path="videoDashboard" element={<VideoDashboard />} />
          <Route path="userDashboard" element={<UserDashboard />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default AppRouter;

/*
<div className='max-w-[1440px] mx-auto'>
      <header className='hidden lg:flex items-center justify-between px-[24px] pt-[9px] bg-[#252B42] text-[#ffffff]'>
        <div className='flex items-center h-[46px]'>

          <div className='flex items-center p-[10px]'>
            <img src="phone.svg" alt="" />
            <h6 className='font-bold text-sm ml-[5px]'>(225) 555-0118</h6>
          </div>

          <div className='flex items-center ml-[10px] p-[10px]'>
            <img src="mail.svg" alt="" />
            <h6 className='font-bold text-sm ml-[5px]'>michelle.reverra@Example.com</h6>
          </div>
        </div>

        <div className='p-[10px] font-bold text-sm'>
          follow us and get chance to win 80% off
        </div>

        <div className='flex items-center p-[10px]'>
          <p className='text-sm font-bold'>Follow us: </p>
          <div className='flex ml-[10px]'>
            <div>
              <img src="instagram.svg" alt="" />
            </div>
            <div className='ml-[6px]'>
              <img src="youtube.svg" alt="" />
            </div>
            <div className='ml-[6px]'>
              <img src="facebook.svg" alt="" />
            </div>
            <div className='ml-[6px]'>
              <img src="twitter.svg" alt="" />
            </div>
          </div>
        </div>
      </header>

      <nav>
        <div className='flex justify-between items-center my-[23px] mx-[32px]'>
          <div className='flex items-center'>
            <p className='w-[187px] text-[24px] font-bold text-[#252B42]'>bandage</p>
            <div className='md:flex hidden'>
              <p className='text-sm font-bold text-[#737373]'>Home</p>
              <div className='ml-[15px] flex items-center'>
                <p className='text-sm font-medium text-[#252B42]'>Shop</p>
                <img src="chevronDown.svg" alt="" />
              </div>
              <p className='ml-[15px] text-sm font-bold text-[#737373]'>About</p>
              <p className='ml-[15px] text-sm font-bold text-[#737373]'>Blog</p>
              <p className='ml-[15px] text-sm font-bold text-[#737373]'>Contact</p>
              <p className='ml-[15px] text-sm font-bold text-[#737373]'>Pages</p>
            </div>
          </div>

          <div className='flex items-center text-[#23A6F0]'>
            <div className='lg:flex hidden items-center p-[15px]'>
              <img src="user.svg" alt="" />
              <div className='flex items-center font-bold text-sm ml-[5] gap-2'>
                <p>Login</p>
                /
                <p>Signup</p>
              </div>
            </div>

            <div className='flex gap-5 lg:gap-0'>
              <img className='lg:p-[15px]' src="search.svg" alt="" />
              <img className='lg:p-[15px]' src="cart.svg" alt="" />
              <img className='lg:p-[15px]' src="menubar.svg" alt="" />

            </div>
          </div>
        </div>
      </nav>

      <main className=''>
        hero
      </main>
    </div>
*/
