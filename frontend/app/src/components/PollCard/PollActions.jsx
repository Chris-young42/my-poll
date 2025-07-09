import React, { useState } from 'react'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'

const PollActions = ({
    toggleBookmark,
    isVotedComplete,
    inputCaptured,
    onVoteSubmit,
    isMyPoll,
    pollClosed,
    onClosePoll,
    onDelete,
    isBookmarked
}) => {
    const [loading, setLoading] = useState(false)

    const handleVoteClick = async () => {
        setLoading(true)
        try {
            await onVoteSubmit()
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='flex items-center gap-4'>
            {(isVotedComplete || pollClosed) && (
                <div className='text-[11px] font-medium text-slate-600 bg-sky-700/10 px-3 py-1 rounded-md'>
                    {pollClosed ? "Closed" : "Voted"}
                </div>
            )}
            <button className='icon-btn' onClick={toggleBookmark}>
                {isBookmarked ? (<FaBookmark className="text-primary" />) : (
                    <FaRegBookmark />
                )}
            </button>
            {inputCaptured && !isVotedComplete && (
                <button
                    className='btn-small ml-auto'
                    onClick={handleVoteClick}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            )

            }
        </div>
    )
}

export default PollActions