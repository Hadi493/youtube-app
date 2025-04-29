import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import OutletComp from './outlet/Outlet';
import { Following, Login, PlaylistVideos, Playlists, ProfileVideos, Register, Tweets, UserDashboard, UserSection, Video, VideoDashboard } from "./components/index"
import { Dashboard, Desktop, Home, SearchResult } from './pages/index'

const AppRouter = () => {

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

        <Route path="playlistVideos/:playlistId" element={<PlaylistVideos />} />

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