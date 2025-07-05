import React from 'react'
import CharAvatar from './CharAvatar'
import moment from 'moment'

const UserProfileInfo = ({ imgUrl, fullname, username, createdAt }) => {

  return (
    <div className='flex items-center gap-4'>
      {imgUrl ? (
        <img src={imgUrl} className='w-10 rounded-full border-none' />
      ) : (
        <CharAvatar fullname={fullname} style={'text-[13px]'} />
      )
      }
      <div>
        <p className='text-sm text-black font-medium leading-4'>
          {fullname}<span className='mx-1 text-slate-500'>·</span>
          <span className='text-[10px]  text-slate-500'>
            {""}
            {createdAt && moment(createdAt).fromNow()}
          </span>
        </p>
        <span className='text-[11.5px] text-slate-500 leading-4'>
          @{username}
        </span>
      </div>
    </div>
  )
}

export default UserProfileInfo