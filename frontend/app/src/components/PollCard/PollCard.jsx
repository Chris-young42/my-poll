import React, { useCallback, useContext, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import { getPollBookmarked } from '../../utils/helper'
import UserProfileInfo from '../cards/UserProfileInfo'
import PollActions from './PollActions'
import PollContent from './PollContent'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'



const PollCard = ({
    pollId,
    question,
    type,
    options,
    voters,
    responses,
    creatorProfileImg,
    creatorName,
    creatorUsername,
    userHasVoted,
    isPollClosed,
    createdAt,
    isMyPoll
}) => {

    const { user, onUserVoted, toggleBookmarkId } = useContext(UserContext)
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1)
    const [rating, setRating] = useState(0)
    const [userResponse, setUserresponse] = useState("")
    const [isVotedComplete, setIsVotedComplete] = useState(userHasVoted)
    const [pollResult, setPollResult] = useState({
        options,
        voters,
        responses
    })
    const isPollBookmarked = getPollBookmarked(
        pollId,
        user.boookmarkedPolls || []
    )
    const [pollBookmarked, setPollBookmarked] = useState(isPollBookmarked)
    const [pollClosed, setPollClosed] = useState(isPollClosed || false)
    const [pollDeleted, setPollDeleted] = useState(false)
    const handleInput = (value) => {
        if (type === "rating") {
            setRating(value)
        } else if (type === "open-ended") {
            setUserresponse(value)
        } else {
            setSelectedOptionIndex(value)
        }
    }
    const getPostData = useCallback(() => {
        if (type === "open-ended") {
            return { responseText: userResponse, voterId: user._id }
        }
        if (type === "rating") {
            return { responseText: rating - 1, voterId: user, _id }
        }
        return { optionIndex: selectedOptionIndex, voterId: user._id, }
    }, [type, userResponse, rating, selectedOptionIndex, user])
    const getPollDetial = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.POLLS.GET_BY_ID(pollId))
            if (response.data) {
                const pollDetails = response.data
                setPollResult({
                    options: pollDetails.option || [],
                    voters: pollDetails.voters.length || 0,
                    responses: pollDetails.responses || [],
                })
            }
        } catch (error) {
            console.error(error.response?.data?.message || "error submiting");

        }
    }

    const handleVoteSubmit = async () => {
        try {
            const response = await axiosInstance.post(
                API_PATHS.POLLS.VOTE(pollId), getPostData()
            )
            getPollDetial()
            setIsVotedComplete(true)
            onUserVoted()
            toast.success("voted success")

        } catch (error) {
            console.error(error.response?.data?.message);

        }
    }

    const toggleBookmark = async () => {
        try {
            const response = await axiosInstance.post(
                API_PATHS.POLLS.BOOKMARK(pollId)
            )
            toggleBookmarkId(pollId)
            setPollBookmarked(prev => !prev)
            toast.success(response.data.message)
        } catch (error) {
            console.error(error.response?.data?.message || "Error bookmarking poll");

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
                    inputCaptured={!!userResponse || selectedOptionIndex >= 0 || rating}
                    onVoteSubmit={handleVoteSubmit}
                    isBookmarked={pollBookmarked}
                    pollClosed={pollClosed}
                    onClosePoll={() => { }}
                    onDelete={() => { }}
                    isMyPoll={isMyPoll}
                    toggleBookmark={toggleBookmark}
                />
            </div>
            <div className='ml-14 mt-3'>
                <p className='text-[15px] text-black leading-8'>{question}</p>
                <div className='mt-4'>
                    {isVotedComplete || isPollClosed ?

                        <>srfhu8</>
                        : (
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
                        )}
                </div>
            </div>
        </div>
    )
}

export default PollCard