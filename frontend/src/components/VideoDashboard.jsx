import { useEffect, useState } from 'react'
import Input from '../subComponents/Input';
import Button from '../subComponents/Button';
import UploadVideo from '../subComponents/UploadVideo'
import useHandleCssStore from '../zustand/useHandleCssStore';

function VideoDashboard() {
  const [hidden, setHidden] = useState("hidden")
  const [toggleDelete, setToggleDelete] = useState("hidden")
  const showUploadVideoCss = useHandleCssStore((state) => state.showUploadVideoCss)
  const showUploadVideo = useHandleCssStore((state) => state.showUploadVideo)
  console.log(showUploadVideoCss)

  useEffect(() => {
    function handleClickOutside(e) {
      if (e.target.closest("#updateVideo") && !e.target.closest(".CloseUpdateVideo")) {
        setHidden("block")
      } else if (!e.target.closest(".pen")) {
        setHidden("hidden")
      }

      if (e.target.closest("#deleteVideoMain") && !e.target.closest(".closeDeleteBtn")) {
        setToggleDelete("block")
      } else if (!e.target.closest(".trashCan")) {
        setToggleDelete("hidden")
      }

    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);

  }, [])

  const arr = [
    "https://th.bing.com/th/id/OIP.NZtfot858OjoU8G0Y5TE9AHaEo?w=242&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    "https://th.bing.com/th/id/OIP.wg4R0mAD1_DQAII9hCM-8AHaDk?w=341&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    "https://th.bing.com/th/id/OIP.IHY4jIGoaywV1CkIYxzsNQHaEo?w=299&h=187&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    "https://th.bing.com/th/id/OIP.YMuauF2NaoHPNikNQyavFAHaEo?w=279&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    "https://th.bing.com/th/id/OIP.t_kb1S2P60S7gaKnEqQOjQHaEK?w=309&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    "https://th.bing.com/th/id/OIP.otQVzr8T480Dyttw-acdjgHaEP?w=312&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    "https://th.bing.com/th/id/OIP.BMXp9yc1JYylds7IvkyDrgHaGT?w=261&h=220&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    "https://th.bing.com/th/id/OIP.amEbZWd9JRcIxkyVtYNODwHaE8?w=272&h=181&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    "https://th.bing.com/th/id/OIP.hyOp4DHwU808lVPQ7qaZJAHaHa?w=194&h=195&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    "https://th.bing.com/th/id/OIP.bPsFZEaqlxRKQ9qrj9O57QHaFl?w=226&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    "https://th.bing.com/th/id/OIP.P_EOEXQab_37lelWDioz9QHaDf?w=330&h=164&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    "https://th.bing.com/th/id/OIP.Yit4ehVET_xvmHYDJvYTpgAAAA?w=267&h=181&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    "https://th.bing.com/th/id/OIP.A4dsv6AkIGssWk1TwfS97gHaEK?w=326&h=183&c=7&r=0&o=5&dpr=1.5&pid=1.7",
  ]

  return (
    <div>
      <div className="flex bg-gray-100 dark:bg-gray-900 mt-12">
        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Total Views</h2>
                  <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16V4H4zm0 0h4v4H4V4zm4 4h4v4H8V8zM8 8h4v4H8V8z" /></svg>
                </div>
                <div className="text-2xl font-bold">1,234,567</div>
                <p className="text-xs text-gray-500">+20.1% from last month</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Watch Time (hours)</h2>
                  <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18M3 12h18M3 21h18" /></svg>
                </div>
                <div className="text-2xl font-bold">45,678</div>
                <p className="text-xs text-gray-500">+15.2% from last month</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Subscribers</h2>
                  <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a8 8 0 00-16 0v2h5M7 10a5 5 0 1110 0 5 5 0 01-10 0z" /></svg>
                </div>
                <div className="text-2xl font-bold">23,456</div>
                <p className="text-xs text-gray-500">+7.3% from last month</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">New Videos</h2>
                  <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16V4H4zm4 0v4H8V4h4zM4 4v4H8V4zm4 8h4v4H8v-4z" /></svg>
                </div>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-500">+2 from last month</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="text-lg font-medium">Recent Uploads</h2>
                <div className="mt-4">
                  <div className="flex gap-4 mb-4 flex-wrap">
                    <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                      All Videos
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                      Published
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                      Drafts
                    </button>
                  </div>
                  <div className="space-y-4">
                    {arr.map((value, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap justify-between w-full">
                          <div>
                            <label className="inline-flex items-center cursor-pointer gap-2">
                              <input type="checkbox" value="" className="sr-only peer" />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Publish</span>
                            </label>
                          </div>

                          <div className='flex'>
                            <img
                              src={value}
                              alt={`Video thumbnail ${index + 1}`}
                              className="rounded-full mr-4 w-12 h-12"
                            />

                            <div>
                              <h3 className="font-semibold">Video Title Lorem, ipsum dolor. {index + 1}</h3>
                              <p className="text-sm text-gray-500">
                                {1000 * (index + 1)} views • 9/23/16
                              </p>
                            </div>
                          </div>

                          <div className='flex gap-2'>
                            <p className='text-green-600'>345 likes</p>
                            <p className='text-red-600'>100 dislikes</p>
                          </div>

                          <div className='flex gap-5'>
                            <div>
                              <img onClick={() => setToggleDelete("block")} className='cursor-pointer trashCan' src="/trash.svg" alt="" />
                            </div>

                            <div>
                              <img onClick={() => setHidden("block")} className='cursor-pointer pen' src="/pencil.svg" alt="" />
                            </div>
                          </div>

                        </div>
                        <hr />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className='text-white'>
        {showUploadVideoCss && <>
          <div className='fixed top-32 left-0 right-0 bg-[#1919197c] h-screen w-screen' onClick={()=> showUploadVideo(false)}></div>
          <UploadVideo />
        </>
        }
      </div>

      <div>
        <form>
          <div id="updateVideo" className={`${hidden} fixed top-40 left-0 right-0 max-w-md sm:m-auto m-4 bg-[#0f141f] text-white p-6 rounded-lg`}>
            <div className="flex flex-col h-full space-y-4">
              {/* Header */}
              <div className="flex justify-between items-center">
                <p className="text-md font-semibold">Edit Video</p>
                <img onClick={() => setHidden("hidden")} className="cursor-pointer w-5 h-5 CloseUpdateVideo" src="/x.svg" alt="Close" />
              </div>

              {/* Form Inputs */}
              <div className="space-y-4 overflow-y-auto">
                <Input className="rounded-md bg-transparent" type="file" label="Thumbnail" />
                <Input className="rounded-md border-2 p-2 w-full bg-transparent outline-none" type="text" placeholder="Title" />
                <textarea className="rounded-md border-2 p-2 w-full h-32 bg-transparent outline-none resize-none" type="text" placeholder="Description" />
              </div>

              {/* Save Button */}
              <Button
                className="w-full bg-purple-700 text-white font-medium rounded-sm text-sm px-4 py-2 hover:bg-purple-600 transition-colors"
                buttonTxt="Update"
              />
            </div>
          </div>
        </form>
      </div>

      <div>
        <form>
          <div id='deleteVideoMain' className={`${toggleDelete} fixed top-48 left-0 right-0 max-w-md sm:m-auto m-4 bg-[#0f141f] text-white p-6 rounded-lg`}>
            <div className="flex flex-col h-full space-y-4">
              {/* Header */}
              <div className="flex justify-between">
                <div className='flex items-baseline gap-2'>
                  <div>
                    <div className="flex items-center gap-2 sm:flex-nowrap flex-wrap">
                      <div className='bg-red-100 p-1 rounded-full'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                      </div>

                      <p className="text-lg font-semibold">Delete Video</p>
                    </div>
                    <p className="text-sm text-gray-400">Are you sure you want to delete this video? once deleted you will not be able to recover it.</p>
                  </div>
                </div>
                <img onClick={() => setHidden("hidden")} className="cursor-pointer w-5 h-5 closeDeleteBtn" src="/x.svg" alt="Close" />
              </div>

              <Button
                className="w-full bg-purple-700 text-white font-medium rounded-sm text-sm px-4 py-2 hover:bg-purple-600 transition-colors"
                buttonTxt="Delete"
              />
            </div>
          </div>
        </form>
      </div>

    </div>
  )
}

export default VideoDashboard
