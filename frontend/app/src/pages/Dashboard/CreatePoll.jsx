import React, { useContext, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import useUserAuth from '../../hooks/useUserAuth'
import { UserContext } from '../../context/UserContext'
import { POLL_TYPE } from '../../utils/data'
import OptionInput from '../../components/input/OptionInput'
import OptionImageSeletor from '../../components/input/OptionImageSeletor'
import uploadImage from '../../utils/uploadImage'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'

const CreatePoll = () => {
  useUserAuth()
  const { user, onPollCreateOrDelete } = useContext(UserContext)
  const [pollData, setPollData] = useState({
    question: "",
    type: '',
    options: [],
    imageOptions: [],
    error: ''
  })
  const handleValueChange = (key, value) => {
    setPollData((prev) => ({ ...prev, [key]: value }))
  }
  const clearData = () => {
    setPollData({
      question: "",
      type: '',
      options: [],
      imageOptions: [],
      error: ''
    })
  }
  const updateImageAndGetLink = async (imageOptions) => {
    const optionPromises = imageOptions.map(async (imageOption) => {
      try {
        const imgUploadRes = await uploadImage(imageOption.file)
        return imgUploadRes.imageUrl || ""
      } catch (error) {
        toast.error(`Error upload:${imageOption.file.name}`)
        return ""
      }
    })
    const optionArr = await Promise.all(optionPromises)
    return optionArr
  }

  const getOptions = async () => {
    switch (pollData.type) {
      case "single-choice":
        return pollData.options
      case "image-based":
        const options = await updateImageAndGetLink(pollData.imageOptions)
        return options
      default:
        return []
    }
  }

  const handleCreatePoll = async () => {
    const { question, type, imageOptions, options, error } = pollData


    if (!question || !type) {
      console.log("CREATE", { question, type, options, error })
      handleValueChange('error', 'Please fill all the fields')
      return
    }
    if (type === "single-choice" && options.length < 2) {
      handleValueChange('error', 'Please add at least 2 options')
      return
    }
    if (type === "image-based" && imageOptions.length < 2) {
      handleValueChange('error', 'Please add at least 2 options')
      return
    }

    const optionData = await getOptions()
    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CREATE, {
        question,
        type,
        options: optionData,
        creatorId: user._id
      })
      if (response) {
        toast.success('Poll Created Successfully')
        onPollCreateOrDelete()
        clearData()
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message)
        handleValueChange("error", error.response.data.message)
      } else {
        handleValueChange("error", "Something went wrong ,try again")
      }
    }

  }
  return (
    <DashboardLayout activeMenu={'Create Poll'}>
      <div className='bg-gray-100/80 my-5 p-5 rounded-lg mx-auto'>
        <h2 className='text-lg text-black font-medium'>Create Poll</h2>
        <div className='mt-3'>
          <label className='text-xs font-medium text-slate-600'>QUESTION</label>
          <textarea placeholder='what is in your mind' className='w-full text-[13px] text-black outline-none
          bg-slate-200/80 p-2 rounded-md mt-2'
            rows={4}
            value={pollData.question}
            onChange={({ target }) => handleValueChange('question', target.value)}
          />
        </div>
        <div className='mt-3'>
          <label className='text-xs font-medium text-slate-600'>Poll TYPE</label>
          <div className='flex gap-4 flex-wrap mt-3'>
            {POLL_TYPE.map((item) => (<div
              key={item.value}
              className={`option-chip ${pollData.type === item.value ? 'text-white bg-primary border-primary' : 'border-sky-100'}`}
              onClick={() => handleValueChange('type', item.value)}
            >
              {item.label}
            </div>))}
          </div>
        </div>
        {pollData.type === "single-choice" && (
          <div className='mt-5'>
            <label className='text-xs font-medium text-slate-600'>OPTIONS</label>
            <div className='mt-3'>
              <OptionInput
                optionList={pollData.options}
                setOptionList={(value) => { handleValueChange('options', value) }}
              />
            </div>
          </div>
        )}
        {pollData.type === "image-based" && (<div className='mt-5'>
          <label className='text-xs font-medium text-slate-600'>IMAGE OPTIONS</label>
          <div className='mt-3'>
            <OptionImageSeletor
              imageList={pollData.imageOptions}
              setImageList={(value) => { handleValueChange('imageOptions', value) }}
            />
          </div>
        </div>
        )}
        {pollData.error && (<p className='text-xs font-medium text-red-500'>{pollData.error}</p>)}
        <button className='btn-primary py-2 mt-6' onClick={handleCreatePoll}>create</button>
      </div>
    </DashboardLayout>
  )
}

export default CreatePoll