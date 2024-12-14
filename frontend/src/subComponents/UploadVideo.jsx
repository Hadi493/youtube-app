import { useRef, useEffect, useState } from 'react'
import Button from './Button'
import Input from "./Input"
import { useForm } from 'react-hook-form'
import useHandleCssStore from '../zustand/useHandleCssStore'
import { postVideo } from '../api/videos//videoApi'
import { videoStore } from '../zustand/videoStore'


function UploadVideo() {
  const inputRef = useRef()
  const { handleSubmit, register } = useForm()
  const [uploading, setUploading] = useState(false)
  const [formIndex, setFormIndex] = useState(1)
  const showUploadVideo = useHandleCssStore((state) => state.showUploadVideo)

  async function SubFunc(e) {
    setUploading(true)
    console.log(e?.title, e?.description)
    // const response = await postVideo(e?.title, e?.description, e?.video[0], e?.thumbnail[0])
    setUploading(false)
    // console.log(response);
  }

  function handleClick() {
    inputRef.current.click()
  }

  function closeCardFunc() {
    showUploadVideo(false)
  }

  function helloFunc() {
    setFormIndex(formIndex + 1)
  }

  return (
    <>
      <form onSubmit={handleSubmit(SubFunc)}>
        <div id='uploadVideo' className="fixed top-32 left-0 right-0 max-w-md z-10 sm:mx-auto mx-4 bg-[#0f141f] text-white p-6 rounded-lg">
          <div className="flex flex-col h-full space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Upload Video</p>
              <img onClick={closeCardFunc} className="cursor-pointer w-5 h-5 uploadVideoBtn" src="/x.svg" alt="Close" />
            </div>

            <hr className="border-gray-700" />

            {/* Form Inputs */}
            {formIndex == 1 && <div className="space-y-4 overflow-y-auto">
              <Input
                className="rounded-md border-[1.5px] p-2 w-full bg-transparent border-[#3c3f46]" type="file" label="Video"
                {...register('video')}
              />
              <Input
                className="rounded-md border-[1.5px] p-2 w-full bg-transparent border-[#3c3f46]" type="file" label="Thumbnail"
                {...register('thumbnail')}
              />
            </div>}

            {formIndex == 2 && <div className="space-y-4 overflow-y-auto">
              <Input
                className="rounded-md border-[1.5px] p-2 w-full bg-transparent border-[#3c3f46] outline-none" type="text" placeholder="Title"
                {...register('title')}
              />
              <Input
                className="rounded-md border-[1.5px] p-2 w-full bg-transparent border-[#3c3f46] outline-none" type="text" placeholder="Description"
                {...register('description')}
              />
            </div>}

            {/* Save Button */}
            {formIndex == 2 ?
              <div className='flex gap-5 items-center'>
                <div className='cursor-pointer' onClick={()=> setFormIndex(formIndex - 1)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
                </div>

                <div className='max-w-96 w-full'>
                  <Button
                    onClick={SubFunc}
                    className="w-full bg-purple-700 text-white font-medium rounded-sm text-sm px-4 py-2 hover:bg-purple-600 transition-colors"
                    buttonTxt={uploading ? "Uploading..." : "Upload"}
                  />
                </div>
              </div>
              :
              <Button
                onClick={()=> setFormIndex(formIndex + 1)}
                className="w-full bg-purple-700 text-white font-medium rounded-sm text-sm px-4 py-2 hover:bg-purple-600 transition-colors"
                buttonTxt="next"
              />}
          </div>
        </div>
      </form>
    </>
  )
}

export default UploadVideo
