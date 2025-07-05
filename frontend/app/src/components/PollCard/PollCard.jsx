import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import { getPollBookmarked } from '../../utils/helper'
import UserProfileInfo from '../cards/UserProfileInfo'
import PollActions from './PollActions'
import PollContent from './PollContent'



const PollCard = ({
    pollId,
    question,
    type,
    options,
    voters,
    response,
    creatorProfileImg,
    creatorName,
    creatorUsername,
    userHasVoted,
    isPollClosed,
    createdAt,
    isMyPoll
}) => {

    const { user } = useContext(UserContext)
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1)
    const [rating, setRating] = useState(0)
    const [userResponse, setUserresponse] = useState("")
    const [isVotedComplete, setIsVotedConplete] = useState(userHasVoted)
    const [pollResult, setPollResult] = useState({
        options,
        voters,
        response
    })
    const isPollBookmarked = getPollBookmarked(
        pollId,
        user.boookmarkedPolls || []
    )
    const [pollBookmarked, setPollBookmarked] = useState(isPollBookmarked)
    const [pollClosed, setPollClosed] = useState(isPollClosed || false)
    const [pollDeleted, setPOllDeleted] = useState(false)
    const handleInput=(value)=>{
        if(type==="rating"){
            setRating(value)
        }else if(type==="open-ended"){
            setUserresponse(value)
        }else{
            setSelectedOptionIndex(value)
        }
    }
    return (
        !pollDeleted && <div className='bg-slate-100/50 my-5 p-5 rounded-lg border border-slate-100 mx-auto'>
            <div className='flex items-start justify-between'>
                <UserProfileInfo
                    imgUrl={creatorProfileImg}
                    fullname={creatorName}
                    username={creatorUsername}
                    createdAt={createdAt}
                />
                <PollActions
                    pollId={pollId}
                    isVotedComplete={isVotedComplete}
                    inputCaptured={!!userResponse || selectedOptionIndex >= 0||rating}
                    onVoteSubmit={() => { }}
                    isBookmarked={pollBookmarked}
                    pollClosed={pollClosed}
                    onClosePoll={() => { }}
                    onDelete={() => { }}
                    isMyPoll={isMyPoll}
                    toggleBookmark={()=>{}}
                />
            </div>
            <div className='ml-14 mt-3'>
                <p className='text-[15px] text-black leading-8'>{question}</p>
                <div className='mt-4'>
                    <PollContent
                        type={type}
                        options={options}
                        selectedOptionIndex={selectedOptionIndex}
                        onOptionSelect={handleInput}
                        rating={rating}
                        onRatingChange={handleInput}
                        userResponse={userResponse}
                        onResponseChange={handleInput}
                    />
                </div>
            </div>
        </div>
    )
}

export default PollCard