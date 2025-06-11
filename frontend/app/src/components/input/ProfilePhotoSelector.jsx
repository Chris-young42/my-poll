import React, { useRef, useState } from 'react'
import { LuUser, LuUpload,LuTrash } from 'react-icons/lu'
const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null)
  const [previewUrl, setProfilePic] = useState(null)
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if(file){
      setImage(file)
      const preview= URL.createObjectURL(file)
      setProfilePic(preview)
    }
   }
  const handleRemoveImage = () => {
    setImage(null)
    setProfilePic(null)
   }
  const onChooseFlie = () => {
    inputRef.current.click()
   }


  return (
    <div className='flex justify-center mb-6'>
      <input type='file' accept='image/*' ref={inputRef} onChange={handleImageChange} className='hidden'/>
      {!image?(<div className='w-20 h-20 flex items-center justify-center bg-sky-100 rounded-full relative'>
        <LuUser className="text-4xl text-primary"/>
        <button
        type='button'
        onClick={onChooseFlie}
        className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1'
        >
          <LuUpload/>
        </button>
      </div>):
      (<div className='relative'>
        <img
        src={previewUrl}
        alt='Profile for image'
        className='w-20 h-20 rounded-full object-cover'
        />
        <button
          type='button'
          onClick={handleRemoveImage}
          className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1'
        >
          <LuTrash/>
        </button>
      </div>)}
    </div>
  )
}

export default ProfilePhotoSelector