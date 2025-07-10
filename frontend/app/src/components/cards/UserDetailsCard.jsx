import React from 'react'
import CharAvatar from './CharAvatar'

const StatsInfo = ({ lable, value }) => {
    return (
        <div className='text-center'>
            <p className='font-medium text-gray-950'>{lable}</p>
            <p className='text-xs text-slate-700/80 mt-[2px]'>{value}</p>
        </div>
    )
}
const UserDetailsCard = (
    { profileImageUrl,
        fullName,
        username,
        totalPollsVotes,
        totalPollsCreated,
        totalPollsBookmarked, }
) => {
    return (
        <div className='bg-slate-100/50 rounded-lg mt-16 overflow-hidden '>
            <div className='w-full h-32 bg-auth-bg-img bg-cover flex justify-center bg-sky-500 relative'>
                <div className='absolute -bottom-10 rounded-full overflow-hidden border-2 border-primary'>
                    {profileImageUrl ? <img src={profileImageUrl || ""}
                        alt='profile image'
                        className='w-20 h-20 bg-slate-400 rounded-full'
                    /> : <CharAvatar fullName={fullName} width="w-20" height="h-20" style="text-xl" />
                    }
                </div>
            </div>
            <div className='mt-12 px-5'>
                <div className='text-center pt-1'>
                    <h5 className='text-lg text-gray-950 font-medium leading-6'>
                        {fullName}
                    </h5>
                    <span className='text-[13px] font-medium text-slate-700/60'>
                        @{username}
                    </span>
                </div>
                <div className='flex items-center justify-center gap-5 flex-wrap my-6'>
                    <StatsInfo lable="Polls Created" value={totalPollsCreated || 0} />
                    <StatsInfo lable="Polls Voted" value={totalPollsVotes || 0} />
                    <StatsInfo lable="Polls Bookmarked" value={totalPollsBookmarked || 0} />
                </div>
            </div>
        </div>
    )
}

export default UserDetailsCard