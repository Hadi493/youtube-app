import React, { useEffect, useState } from "react";
import { createPlaylist,getPlaylistsOfUser,addVideoToPlaylist } from "../api/playlist/playlist";
import userData from "../zustand/userData";

function AddToPlaylist({ playlistState,videoId }) {
  const { showPlaylist, setShowPlaylist } = playlistState;
  const [playlistName, setPlaylistName] = useState('')
  const [allPlaylist, setAllPlaylist] = useState([])
  const currentUserData = userData((state)=> state.currentUserData)

  async function bakait() {
    const result = await getPlaylistsOfUser(currentUserData.data._id)
    setAllPlaylist(result?.data.data.userPlaylist)
    console.log(result?.data.data.userPlaylist)
  }

  async function createPlaylistFunc() {
    await createPlaylist(playlistName)
    bakait()
  }

  useEffect(() => {
    bakait()
  }, [])
  

  function togglePlaylistCard(e) {
    if (!e.target.closest(".mainContent")) {
      setShowPlaylist(false);
    }
  }

  async function addVideoToPlaylistFunc(playlistId) {
    const result = await addVideoToPlaylist(playlistId,videoId)
    console.log("result",result)
  }

  return (
    <div>
      {showPlaylist && (
        <div
          onClick={togglePlaylistCard}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center"
        >
          <div className="bg-[#1c1f2e] rounded-lg shadow-lg p-6 w-80 mainContent">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-medium text-white">Save to Playlist</p>
              <img
                onClick={() => setShowPlaylist(false)}
                className="cursor-pointer w-5 h-5 opacity-80 hover:opacity-100 transition"
                src="x.svg"
                alt="Close"
              />
            </div>

            {/* Playlist Options */}
            <div className="space-y-2">
              {allPlaylist.map((value) => (
                <label key={value?._id} className="flex items-center gap-3 text-white cursor-pointer">
                  <input
                    onClick={()=>addVideoToPlaylistFunc(value?._id)}
                    type="checkbox"
                    className="accent-[#8a4bff] w-4 h-4"
                    id={`playlist-${value?._id}`}
                  />
                  <p className="text-sm">{value?.name}</p>
                </label>
              ))}
            </div>

            {/* New Playlist Input */}
            <div className="mt-4">
              <label className="text-sm text-gray-300">New Playlist</label>
              <input
                onChange={(e)=> setPlaylistName(e.target.value)}
                type="text"
                className="w-full h-10 rounded-md px-3 mt-1 bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#8a4bff]"
                placeholder="Enter playlist name"
              />
            </div>

            {/* Create Playlist Button */}
            <div className="mt-4">
              <button onClick={createPlaylistFunc} className="w-full bg-[#8a4bff] text-white py-2 rounded-md hover:bg-[#7a3bff] transition">
                Create New Playlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddToPlaylist;
